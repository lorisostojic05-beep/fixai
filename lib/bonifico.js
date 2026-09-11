// lib/bonifico.js
// Il momento in cui i soldi escono da Fixi e arrivano al tecnico.
//
// E' l'unica operazione irreversibile del sistema: un pagamento sbagliato si
// rimborsa, un bonifico partito due volte si recupera solo chiedendolo.
// Per questo qui ci sono piu' controlli che altrove, e sono tutti "prima",
// nessuno "dopo".
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' IL BONIFICO NON E' AGGANCIATO ALL'INCASSO DEL SALDO             │
// │                                                                           │
// │  Stripe permette di legare un bonifico a un incasso preciso              │
// │  (source_transaction), cosi' il denaro segue quella singola transazione.  │
// │  Sembra la scelta ovvia. Non si puo' usare, e il motivo e' un intervento  │
// │  da 60 €:                                                                 │
// │                                                                           │
// │      prezzo totale        60,00 €                                         │
// │      credito diagnosi      9,90 €  (incassato settimane prima)           │
// │      saldo incassato      50,10 €  ← l'unico incasso agganciabile        │
// │      netto al tecnico     54,00 €  ← piu' grande del saldo               │
// │                                                                           │
// │  Il tecnico prende il 90% del TOTALE, e quel totale comprende i 9,90 €    │
// │  incassati in un pagamento diverso, settimane prima. Legare il bonifico   │
// │  al solo saldo lo farebbe fallire ogni volta che la riparazione costa     │
// │  meno di circa 99 €.                                                      │
// │                                                                           │
// │  Quindi il bonifico parte dal saldo generale di Fixi, e i due movimenti   │
// │  restano collegati con transfer_group: nei rendiconti Stripe si vede      │
// │  comunque che appartengono alla stessa riparazione.                       │
// └───────────────────────────────────────────────────────────────────────────┘

import { stripe, chiaveIdempotenza } from "./stripe.js";
import { leggiStatoConto } from "./stripe-connect.js";
import { STATI } from "./stati-riparazione.js";

/** Il nome che tiene insieme incasso e bonifico della stessa riparazione. */
export function gruppo(richiestaId) {
  return `riparazione_${richiestaId}`;
}

/**
 * Esegue il bonifico al tecnico, una volta sola.
 *
 * Torna sempre un oggetto con { ok, motivo, transferId }: non lancia eccezioni
 * per i casi previsti, perche' "il tecnico non ha finito l'iscrizione" non e'
 * un errore del programma ma una situazione normale da mostrare in admin.
 */
export async function eseguiBonifico(db, richiestaId, finti = {}) {
  // I due agganci a Stripe si possono sostituire, e servono SOLO alle prove:
  // in produzione restano quelli veri. Senza, l'unico modo di provare che il
  // bonifico non parte due volte sarebbe farlo partire due volte davvero.
  const creaTrasferimento = finti.creaTrasferimento || stripe.transfers.create.bind(stripe.transfers);
  const statoConto = finti.statoConto || leggiStatoConto;

  const { data: r, error } = await db
    .from("richieste_intervento")
    .select(
      "id, stato, tecnico_id, transfer_id, netto_tecnico_centesimi, prezzo_finale_centesimi, commissione_centesimi"
    )
    .eq("id", richiestaId)
    .maybeSingle();

  if (error) throw error;
  if (!r) return { ok: false, motivo: "riparazione non trovata" };

  // ── 1. Gia' fatto? ────────────────────────────────────────────────────────
  // Prima di tutto il resto: chiamarla due volte deve essere innocuo.
  if (r.transfer_id) {
    return { ok: true, motivo: "bonifico gia' eseguito", transferId: r.transfer_id, gia: true };
  }

  // ── 2. Il lavoro e' finito davvero? ───────────────────────────────────────
  // Non basta che il cliente abbia pagato: i soldi restano fermi su Fixi
  // finche' l'intervento non e' completato. E' tutto il senso di questo
  // schema.
  if (r.stato !== STATI.COMPLETATA) {
    return { ok: false, motivo: `la riparazione e' in stato "${r.stato}", non completata` };
  }

  // ── 3. Quanto, e da dove viene il numero ──────────────────────────────────
  // Dal database, non da chi chiama. Il netto e' stato calcolato e congelato
  // quando il cliente ha accettato il preventivo: nessun endpoint puo'
  // proporne un altro.
  const importo = r.netto_tecnico_centesimi;
  if (!Number.isInteger(importo) || importo <= 0) {
    return { ok: false, motivo: `netto tecnico non valido: ${importo}` };
  }

  // ── 4. Il tecnico puo' ricevere soldi? ────────────────────────────────────
  const { data: tecnico } = await db
    .from("tecnici")
    .select("id, nome, cognome, stripe_account_id")
    .eq("id", r.tecnico_id)
    .maybeSingle();

  if (!tecnico?.stripe_account_id) {
    return { ok: false, motivo: "il tecnico non ha configurato i pagamenti" };
  }

  // Si RILEGGE da Stripe invece di fidarsi della colonna salvata. Stripe puo'
  // aver bloccato il conto ieri per un documento scaduto, e la nostra copia
  // sarebbe vecchia. Su un'operazione irreversibile si paga volentieri una
  // chiamata in piu'.
  const stato = await statoConto(tecnico.stripe_account_id);
  if (!stato.stripe_bonifici_attivi) {
    // Si aggiorna la copia locale: cosi' l'admin e l'area tecnico lo mostrano
    // subito, e il tecnico sa che deve completare qualcosa.
    await db.from("tecnici").update(stato).eq("id", tecnico.id);
    return {
      ok: false,
      motivo: "Stripe non abilita ancora i bonifici su questo conto",
      dettagli: stato.stripe_requisiti,
    };
  }

  // ── 5. Il bonifico ────────────────────────────────────────────────────────
  let trasferimento;
  try {
    trasferimento = await creaTrasferimento(
      {
        amount: importo,
        currency: "eur",
        destination: tecnico.stripe_account_id,
        transfer_group: gruppo(r.id),
        description: `Fixi riparazione #${r.id}`,
        metadata: {
          richiesta_id: String(r.id),
          prezzo_totale: String(r.prezzo_finale_centesimi),
          commissione_fixi: String(r.commissione_centesimi),
        },
      },
      // La chiave e' costruita sull'id della riparazione, non sull'orologio:
      // se questa funzione parte due volte, Stripe restituisce il PRIMO
      // bonifico invece di farne un secondo.
      { idempotencyKey: chiaveIdempotenza("bonifico", r.id) }
    );
  } catch (e) {
    // Il caso piu' probabile e' il saldo di Fixi non ancora disponibile: gli
    // incassi con carta impiegano qualche giorno a diventare trasferibili.
    // Non e' un guasto, e' un "riprova fra un po'".
    const fondi = e?.code === "balance_insufficient";
    return {
      ok: false,
      motivo: fondi ? "saldo Fixi non ancora disponibile: riprovare fra qualche giorno" : e.message,
      riprovabile: fondi,
    };
  }

  // ── 6. Si scrive l'id, e l'indice unico fa da ultimo freno ────────────────
  // Se per qualsiasi motivo due esecuzioni arrivassero fin qui, la seconda
  // scrittura viene rifiutata dal database. Il bonifico su Stripe e' comunque
  // uno solo, grazie alla chiave di idempotenza.
  const { error: erroreScrittura } = await db
    .from("richieste_intervento")
    .update({ transfer_id: trasferimento.id, transfer_at: new Date().toISOString() })
    .eq("id", r.id)
    .is("transfer_id", null);

  if (erroreScrittura) {
    console.error(
      `Bonifico ${trasferimento.id} eseguito ma non registrato sulla richiesta ${r.id}:`,
      erroreScrittura.message
    );
    // Si torna comunque ok: il bonifico esiste. Va sistemato a mano, e questo
    // log e' il modo per accorgersene.
    return { ok: true, transferId: trasferimento.id, motivo: "eseguito, ma da riconciliare a mano" };
  }

  return { ok: true, transferId: trasferimento.id, importo, motivo: "bonifico eseguito" };
}
