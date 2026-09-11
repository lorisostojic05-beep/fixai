// pages/api/stripe-webhook.js
// L'unico posto in cui Fixi crede che un pagamento sia avvenuto.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' NON CI SI PUO' FIDARE DEL BROWSER                                │
// │                                                                           │
// │  Oggi la diagnosi funziona cosi': il cliente torna da Stripe, la pagina   │
// │  chiede "e' pagato?" e il server risponde interrogando Stripe. Per 9,90 € │
// │  regge. Per una riparazione da 120 € no, e per due motivi:                │
// │                                                                           │
// │   - se il cliente chiude il telefono un secondo dopo aver pagato, quella  │
// │     domanda non parte mai e il pagamento resta invisibile a Fixi;         │
// │   - una risposta che arriva dal browser e' una risposta che qualcuno      │
// │     puo' scrivere a mano.                                                 │
// │                                                                           │
// │  Il webhook arriva da Stripe direttamente al server, firmato. Se la firma │
// │  non torna, la richiesta si butta senza nemmeno guardarla.                │
// └───────────────────────────────────────────────────────────────────────────┘
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

import { stripe } from "../../lib/stripe.js";
import { supabaseAdmin as db } from "../../lib/supabase-admin.js";
import { STATI, puoiPassare } from "../../lib/stati-riparazione.js";

// La firma si calcola sui byte esatti che Stripe ha spedito. Se Next.js
// trasforma il corpo in oggetto, quei byte non esistono piu' e la verifica
// fallisce sempre — anche quando l'evento e' autentico.
export const config = { api: { bodyParser: false } };

function corpoGrezzo(req) {
  return new Promise((risolvi, rifiuta) => {
    const pezzi = [];
    req.on("data", (c) => pezzi.push(c));
    req.on("end", () => risolvi(Buffer.concat(pezzi)));
    req.on("error", rifiuta);
  });
}

/** Prenota l'evento. false = gia' visto, non rifarlo. */
async function prenota(evento) {
  const { error } = await db.from("eventi_stripe").insert({ id: evento.id, tipo: evento.type });
  if (!error) return true;
  if (error.code === "23505") return false; // chiave duplicata: e' gia' nostro
  throw error;
}

// Se l'elaborazione fallisce si molla la prenotazione, cosi' Stripe puo'
// riprovare. Senza, un errore temporaneo bloccherebbe l'evento per sempre:
// prenotato ma mai elaborato.
async function mollaPrenotazione(id) {
  await db.from("eventi_stripe").delete().eq("id", id);
}

async function segnaFatto(id, esito) {
  await db.from("eventi_stripe").update({ elaborato_at: new Date().toISOString(), esito }).eq("id", id);
}

// ─── Il saldo della riparazione e' stato pagato ─────────────────────────────
async function saldoPagato(sessione) {
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
async function saldoFallito(intent) {
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
async function rimborsato(charge) {
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
async function contestazione(disputa, chiusa) {
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

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const segreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!segreto) {
    console.error("STRIPE_WEBHOOK_SECRET mancante: rifiuto tutto invece di fidarmi.");
    return res.status(500).json({ error: "webhook non configurato" });
  }

  let evento;
  try {
    const grezzo = await corpoGrezzo(req);
    evento = stripe.webhooks.constructEvent(grezzo, req.headers["stripe-signature"], segreto);
  } catch (e) {
    // Firma sbagliata: non e' Stripe, o e' stato manomesso per strada.
    console.warn("Webhook rifiutato:", e.message);
    return res.status(400).json({ error: "firma non valida" });
  }

  let nuovo;
  try {
    nuovo = await prenota(evento);
  } catch (e) {
    console.error("Non riesco a registrare l'evento:", e.message);
    // 500 → Stripe riprova. Meglio riprovare che perdere un pagamento.
    return res.status(500).json({ error: "registro non disponibile" });
  }
  if (!nuovo) return res.status(200).json({ ricevuto: true, nota: "gia' elaborato" });

  try {
    let esito;
    switch (evento.type) {
      case "checkout.session.completed":
        esito = await saldoPagato(evento.data.object);
        break;
      case "payment_intent.payment_failed":
        esito = await saldoFallito(evento.data.object);
        break;
      case "charge.refunded":
        esito = await rimborsato(evento.data.object);
        break;
      case "charge.dispute.created":
        esito = await contestazione(evento.data.object, false);
        break;
      case "charge.dispute.closed":
        esito = await contestazione(evento.data.object, true);
        break;
      default:
        esito = "tipo non gestito";
    }
    await segnaFatto(evento.id, esito);
    return res.status(200).json({ ricevuto: true, esito });
  } catch (e) {
    console.error(`Evento ${evento.id} (${evento.type}) fallito:`, e.message);
    // Si molla la prenotazione: se no il tentativo successivo di Stripe
    // verrebbe scartato come doppione e l'evento andrebbe perso per sempre.
    await mollaPrenotazione(evento.id).catch(() => {});
    return res.status(500).json({ error: "elaborazione fallita" });
  }
}
