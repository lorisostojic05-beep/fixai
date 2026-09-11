// lib/eventi-stripe.js
// Cosa succede dentro Fixi quando Stripe racconta qualcosa.
//
// Sta qui e non dentro pages/api/stripe-webhook.js perche' quel file ha un
// lavoro solo: verificare la firma. Tutto il resto — cosa diventa una
// riparazione quando il saldo e' pagato, cosa si fa con un rimborso, cosa si
// fa (cioe' niente) con una contestazione — e' logica sui soldi, e la logica
// sui soldi deve poter essere provata senza rete e senza database vero.
//
// Ogni funzione riceve il db come primo argomento apposta: nelle prove ne
// arriva uno finto, in produzione quello vero.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  STRIPE MANDA LO STESSO EVENTO PIU' VOLTE, DI PROPOSITO                   │
// │                                                                           │
// │  Se non rispondiamo in fretta, o rispondiamo male, riprova. Puo' anche    │
// │  mandarlo due volte senza motivo. Senza difese, "pagamento riuscito"      │
// │  ricevuto tre volte diventa tre bonifici.                                 │
// │                                                                           │
// │  La difesa e' in tre strati, dal piu' esterno al piu' interno:            │
// │                                                                           │
// │   1. si PRENOTA l'id dell'evento in eventi_stripe. La chiave primaria     │
// │      rifiuta il secondo inserimento: quel rifiuto e' il primo filtro.     │
// │   2. ogni operazione sui soldi e' scritta come "aggiorna solo se lo       │
// │      stato e' ancora quello atteso" — vedi lib/credito.js.                │
// │   3. due indici unici sul database, su transfer_id e                      │
// │      saldo_payment_intent_id: anche col codice sbagliato, il secondo      │
// │      bonifico non entra.                                                  │
// └───────────────────────────────────────────────────────────────────────────┘

import { STATI, puoiPassare } from "./stati-riparazione.js";

/** Prenota l'evento. false = gia' visto, non rifarlo. */
export async function prenota(db, evento) {
  const { error } = await db.from("eventi_stripe").insert({ id: evento.id, tipo: evento.type });
  if (!error) return true;
  if (error.code === "23505") return false; // chiave duplicata: e' gia' nostro
  throw error;
}

// Se l'elaborazione fallisce si molla la prenotazione, cosi' Stripe puo'
// riprovare. Senza, un errore temporaneo bloccherebbe l'evento per sempre:
// prenotato ma mai elaborato.
export async function mollaPrenotazione(db, id) {
  await db.from("eventi_stripe").delete().eq("id", id);
}

export async function segnaFatto(db, id, esito) {
  await db.from("eventi_stripe").update({ elaborato_at: new Date().toISOString(), esito }).eq("id", id);
}

// ─── Il saldo della riparazione e' stato pagato ─────────────────────────────
export async function saldoPagato(db, sessione) {
  const richiestaId = sessione.metadata?.richiesta_id;
  if (!richiestaId) return "sessione senza richiesta_id: non e' un saldo riparazione";

  const { data: r } = await db
    .from("richieste_intervento")
    .select("id, stato, saldo_cliente_centesimi")
    .eq("id", richiestaId)
    .maybeSingle();
  if (!r) return `richiesta ${richiestaId} non trovata`;

  if ([STATI.PAGATA, STATI.IN_CORSO, STATI.COMPLETATA].includes(r.stato)) {
    return "gia' registrato";
  }
  if (!puoiPassare(r.stato, STATI.PAGATA)) {
    return `stato "${r.stato}": non puo' diventare pagata`;
  }

  // Quanto e' arrivato davvero, non quanto ci aspettavamo. Se non combacia e'
  // meglio saperlo adesso che a bonifico fatto.
  if (sessione.amount_total !== r.saldo_cliente_centesimi) {
    console.error(
      `Richiesta ${richiestaId}: incassati ${sessione.amount_total}, attesi ${r.saldo_cliente_centesimi}`
    );
    return "importo diverso da quello atteso: non tocco niente";
  }

  // L'aggiornamento e' condizionato sullo stato: se due webhook arrivano
  // insieme, solo il primo trova lo stato di partenza e passa.
  const { data } = await db
    .from("richieste_intervento")
    .update({
      stato: STATI.PAGATA,
      saldo_stripe_session_id: sessione.id,
      saldo_payment_intent_id: sessione.payment_intent,
      saldo_pagato_at: new Date().toISOString(),
    })
    .eq("id", richiestaId)
    .eq("stato", r.stato)
    .select("id")
    .maybeSingle();

  return data ? "riparazione segnata come pagata" : "l'ha gia' fatto un altro invio";
}

// ─── Il pagamento del saldo non e' andato a buon fine ───────────────────────
export async function saldoFallito(db, intent) {
  const richiestaId = intent.metadata?.richiesta_id;
  if (!richiestaId) return "non e' un saldo riparazione";

  // Si torna al preventivo: il cliente ha ancora un prezzo valido da pagare e
  // non resta in un limbo. Il credito NON si consuma: non e' successo niente.
  const { data } = await db
    .from("richieste_intervento")
    .update({ stato: STATI.PREVENTIVO })
    .eq("id", richiestaId)
    .eq("stato", STATI.PREVENTIVO_ACCETTATO)
    .select("id")
    .maybeSingle();

  return data ? "tornata al preventivo, credito intatto" : "nessun cambio di stato";
}

// ─── Rimborso ───────────────────────────────────────────────────────────────
export async function rimborsato(db, charge) {
  const pi = charge.payment_intent;
  if (!pi) return "senza payment intent";
  const { data } = await db
    .from("richieste_intervento")
    .update({
      rimborso_id: charge.refunds?.data?.[0]?.id || "rimborsato",
      rimborsato_at: new Date().toISOString(),
    })
    .eq("saldo_payment_intent_id", pi)
    .select("id")
    .maybeSingle();
  return data ? `rimborso segnato sulla richiesta ${data.id}` : "nessuna riparazione con questo pagamento";
}

// ─── Contestazione ──────────────────────────────────────────────────────────
// Non si fa NIENTE in automatico. Una contestazione va guardata da una
// persona: chiuderla da soli, in un senso o nell'altro, e' il modo piu' rapido
// per perdere i soldi due volte.
export async function contestazione(db, disputa, chiusa) {
  const pi = typeof disputa.payment_intent === "string" ? disputa.payment_intent : disputa.payment_intent?.id;

  const { data: r } = await db
    .from("richieste_intervento")
    .select("id")
    .eq("saldo_payment_intent_id", pi || "")
    .maybeSingle();

  await db.from("contestazioni").upsert({
    id: disputa.id,
    aggiornata_at: new Date().toISOString(),
    stripe_payment_intent_id: pi || null,
    stripe_charge_id: typeof disputa.charge === "string" ? disputa.charge : disputa.charge?.id || null,
    importo_centesimi: disputa.amount ?? null,
    motivo: disputa.reason || null,
    stato: disputa.status || null,
    richiesta_id: r?.id ?? null,
    chiusa_at: chiusa ? new Date().toISOString() : null,
  });

  // La riparazione si marca contestata, cosi' il bonifico non parte.
  if (r?.id && !chiusa) {
    await db
      .from("richieste_intervento")
      .update({ stato: STATI.CONTESTATA, contestata_at: new Date().toISOString() })
      .eq("id", r.id)
      .in("stato", [STATI.PAGATA, STATI.IN_CORSO, STATI.COMPLETATA]);
  }

  return r?.id ? `contestazione legata alla richiesta ${r.id}` : "contestazione su un pagamento diagnosi";
}

/**
 * Smista l'evento gia' verificato.
 * Torna una frase che finisce in eventi_stripe.esito: serve a capire, mesi
 * dopo, perche' un evento non ha fatto quello che ci si aspettava.
 */
export async function gestisciEvento(db, evento) {
  switch (evento.type) {
    case "checkout.session.completed":
      return saldoPagato(db, evento.data.object);
    case "payment_intent.payment_failed":
      return saldoFallito(db, evento.data.object);
    case "charge.refunded":
      return rimborsato(db, evento.data.object);
    case "charge.dispute.created":
      return contestazione(db, evento.data.object, false);
    case "charge.dispute.closed":
      return contestazione(db, evento.data.object, true);
    default:
      // Non e' un errore: su Stripe si possono attivare eventi in piu' senza
      // che qui debba cambiare niente.
      return "tipo non gestito";
  }
}
