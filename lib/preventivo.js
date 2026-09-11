// lib/preventivo.js
// Il giro del preventivo: il tecnico propone un prezzo, il cliente lo accetta.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  IL TECNICO SCRIVE IL PREZZO TOTALE, NON IL SALDO                         │
// │                                                                           │
// │  Su un lavoro da 120 € il tecnico scrive 120, non 110,10. Del credito da  │
// │  9,90 € non deve sapere niente: e' un accordo fra Fixi e il cliente, e    │
// │  non cambia di un centesimo quello che lui prende.                        │
// │                                                                           │
// │  Se dovesse tenerne conto lui, prima o poi qualcuno scriverebbe 110,10    │
// │  "per fare prima" e si ritroverebbe 9,90 € in meno in tasca senza capire  │
// │  perche'.                                                                 │
// └───────────────────────────────────────────────────────────────────────────┘
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  I NUMERI SI CONGELANO QUANDO IL CLIENTE ACCETTA                          │
// │                                                                           │
// │  Da quel momento prezzo, credito, saldo, commissione e netto restano      │
// │  scritti sulla riga e non si ricalcolano piu'. Due motivi:                │
// │                                                                           │
// │   - il cliente paga quello che ha visto, non quello che risulterebbe      │
// │     oggi;                                                                 │
// │   - se un domani la commissione passa al 12%, i lavori vecchi devono      │
// │     restare leggibili con quella che avevano addosso quel giorno.         │
// └───────────────────────────────────────────────────────────────────────────┘

import { contiRiparazione, COMMISSIONE, inCentesimi } from "./soldi.js";
import { creditoDisponibile, riservaCredito } from "./credito.js";
import { STATI, verificaPassaggio } from "./stati-riparazione.js";

/** Il minimo sindacale: sotto questa cifra e' un errore di battitura. */
const PREZZO_MINIMO = 500; // 5 €
const PREZZO_MASSIMO = 500000; // 5.000 €

/**
 * Il tecnico propone (o corregge) il prezzo totale.
 * Finche' il cliente non ha accettato si puo' rifare quante volte serve.
 */
export async function proponi(db, { richiestaId, tecnicoId, prezzo }) {
  const centesimi = typeof prezzo === "number" ? prezzo : inCentesimi(prezzo);
  if (centesimi === null) return { ok: false, motivo: "prezzo non leggibile" };
  if (centesimi < PREZZO_MINIMO || centesimi > PREZZO_MASSIMO) {
    return { ok: false, motivo: "prezzo fuori dai limiti (5 € - 5.000 €)" };
  }

  const { data: r } = await db
    .from("richieste_intervento")
    .select("id, stato, tecnico_id")
    .eq("id", richiestaId)
    .maybeSingle();
  if (!r) return { ok: false, motivo: "richiesta non trovata" };

  // Il lavoro e' suo? Un tecnico non tocca i lavori degli altri.
  if (String(r.tecnico_id) !== String(tecnicoId)) {
    return { ok: false, motivo: "questo lavoro non e' tuo" };
  }

  const passaggio = verificaPassaggio(r.stato, STATI.PREVENTIVO);
  if (!passaggio.ok) return { ok: false, motivo: passaggio.perche };

  const { data } = await db
    .from("richieste_intervento")
    .update({
      preventivo_centesimi: centesimi,
      preventivo_at: new Date().toISOString(),
      stato: STATI.PREVENTIVO,
    })
    .eq("id", richiestaId)
    .eq("stato", r.stato)
    .select("id")
    .maybeSingle();

  if (!data) return { ok: false, motivo: "qualcuno ha cambiato il lavoro nel frattempo" };

  // Quello che il tecnico deve vedere PRIMA di confermare: la sua economia,
  // senza sorprese a fine lavoro.
  const conti = contiRiparazione(centesimi);
  return {
    ok: true,
    prezzo: centesimi,
    commissione: conti.commissioneFixi,
    netto: conti.nettoTecnico,
  };
}

/**
 * Cosa vede il cliente: prezzo pieno, credito, quanto resta da pagare.
 * Non scrive niente — e' una lettura.
 */
export async function perIlCliente(db, richiesta) {
  if (!richiesta?.preventivo_centesimi) return null;

  // Se i conti sono gia' congelati si mostrano quelli, non un ricalcolo:
  // il cliente deve vedere gli stessi numeri della schermata precedente.
  if (richiesta.prezzo_finale_centesimi) {
    return {
      prezzo: richiesta.prezzo_finale_centesimi,
      credito: richiesta.credito_applicato_centesimi,
      daPagare: richiesta.saldo_cliente_centesimi,
      congelato: true,
    };
  }

  const credito = await creditoDisponibile(db, richiesta.diagnosi_stripe_session_id, richiesta.id);
  const conti = contiRiparazione(richiesta.preventivo_centesimi, { credito });
  return {
    prezzo: conti.prezzoFinale,
    credito: conti.creditoApplicato,
    daPagare: conti.saldoCliente,
    congelato: false,
  };
}

/**
 * Il cliente accetta: da qui i numeri non si muovono piu'.
 *
 * Tutto si ricalcola QUI, dal database. Il frontend manda solo "accetto":
 * non puo' proporre un prezzo, ne' un credito, ne' un saldo.
 */
export async function accetta(db, richiestaId) {
  const { data: r } = await db
    .from("richieste_intervento")
    .select("id, stato, preventivo_centesimi, diagnosi_stripe_session_id")
    .eq("id", richiestaId)
    .maybeSingle();
  if (!r) return { ok: false, motivo: "richiesta non trovata" };
  if (!r.preventivo_centesimi) return { ok: false, motivo: "non c'e' nessun preventivo da accettare" };

  const passaggio = verificaPassaggio(r.stato, STATI.PREVENTIVO_ACCETTATO);
  if (!passaggio.ok) return { ok: false, motivo: passaggio.perche };

  // Il credito si PRENOTA prima di congelare i conti. Se la prenotazione
  // fallisce — perche' un'altra riparazione della stessa diagnosi se l'e'
  // gia' preso — si va avanti lo stesso, ma a prezzo pieno: meglio far
  // pagare 120 € che scalarne 9,90 due volte.
  const preso = await riservaCredito(db, r.diagnosi_stripe_session_id, r.id);
  const credito = preso ? await creditoDisponibile(db, r.diagnosi_stripe_session_id, r.id) : 0;

  const conti = contiRiparazione(r.preventivo_centesimi, { credito, commissione: COMMISSIONE });

  const { data } = await db
    .from("richieste_intervento")
    .update({
      stato: STATI.PREVENTIVO_ACCETTATO,
      preventivo_accettato_at: new Date().toISOString(),
      prezzo_finale_centesimi: conti.prezzoFinale,
      credito_applicato_centesimi: conti.creditoApplicato,
      saldo_cliente_centesimi: conti.saldoCliente,
      commissione_frazione: conti.commissione,
      commissione_centesimi: conti.commissioneFixi,
      netto_tecnico_centesimi: conti.nettoTecnico,
    })
    .eq("id", richiestaId)
    .eq("stato", r.stato)
    .select("id")
    .maybeSingle();

  if (!data) return { ok: false, motivo: "qualcuno ha gia' accettato o annullato" };
  return { ok: true, ...conti };
}
