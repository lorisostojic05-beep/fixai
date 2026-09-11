// lib/metriche.js
// I numeri del marketplace, calcolati da righe gia' lette.
//
// Nessuna query qui dentro: si passano gli array e tornano i totali. Cosi' si
// possono provare senza database — ed e' quello che serve, perche' un conto
// sbagliato in una dashboard non si nota finche' non ci si prende una
// decisione sopra.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  I 9,90 € CAMBIANO NATURA A META' STRADA                                  │
// │                                                                           │
// │  Diagnosi che NON diventa riparazione:                                    │
// │      9,90 € = ricavo della videodiagnosi. Punto.                          │
// │                                                                           │
// │  Diagnosi che diventa riparazione completata:                             │
// │      quei 9,90 € NON sono piu' ricavo: sono parte di quanto ha pagato il  │
// │      cliente per l'intervento. Il ricavo li' e' la commissione.           │
// │                                                                           │
// │  Sommarli come se fossero due cose dello stesso tipo gonfierebbe il       │
// │  fatturato. Per questo stanno in due voci separate, e c'e' una prova che  │
// │  verifica che non si contino due volte.                                   │
// └───────────────────────────────────────────────────────────────────────────┘

import { PREZZO_DIAGNOSI } from "./soldi.js";
import { STATI, CON_SOLDI_INCASSATI } from "./stati-riparazione.js";

const somma = (righe, campo) => righe.reduce((t, r) => t + (r[campo] || 0), 0);
const percento = (parte, tutto) => (tutto > 0 ? Math.round((parte / tutto) * 1000) / 10 : null);

/**
 * @param pagamenti  righe di "pagamenti" (una per diagnosi pagata)
 * @param richieste  righe di "richieste_intervento"
 * @param tecnici    righe di "tecnici"
 */
export function metriche({ pagamenti = [], richieste = [], tecnici = [] } = {}) {
  const diagnosiPagate = pagamenti.length;
  const creditiUsati = pagamenti.filter((p) => p.credito_stato === "usato").length;
  const creditiRiservati = pagamenti.filter((p) => p.credito_stato === "riservato").length;

  // Le riparazioni finite sono l'unico posto in cui i conti sono definitivi.
  const completate = richieste.filter((r) => r.stato === STATI.COMPLETATA);
  const pagate = richieste.filter((r) => CON_SOLDI_INCASSATI.includes(r.stato));

  // Il giro d'affari: quanto vale il lavoro passato per Fixi, non quanto
  // incassa Fixi. Sono due numeri diversi e confonderli e' il modo classico
  // per raccontarsi un fatturato che non esiste.
  const gmv = somma(completate, "prezzo_finale_centesimi");
  const commissioni = somma(completate, "commissione_centesimi");
  const saldiIncassati = somma(pagate, "saldo_cliente_centesimi");
  const creditiScalati = somma(completate, "credito_applicato_centesimi");

  const bonificati = completate.filter((r) => r.transfer_id);
  const payoutFatti = somma(bonificati, "netto_tecnico_centesimi");
  const payoutInSospeso = somma(
    completate.filter((r) => !r.transfer_id),
    "netto_tecnico_centesimi"
  );

  // Le diagnosi che non hanno generato nessuna riparazione: li' i 9,90 €
  // restano ricavo puro.
  const diagnosiSenzaRiparazione = diagnosiPagate - creditiUsati;

  return {
    // ── Diagnosi ──
    diagnosiPagate,
    diagnosiSenzaRiparazione,
    diagnosiConvertite: creditiUsati,
    creditiRiservati,
    // I due ricavi, tenuti separati apposta.
    ricavoDiagnosi: diagnosiSenzaRiparazione * PREZZO_DIAGNOSI,
    ricavoCommissioni: commissioni,
    ricavoTotale: diagnosiSenzaRiparazione * PREZZO_DIAGNOSI + commissioni,

    // ── Riparazioni ──
    richiesteTotali: richieste.length,
    conPreventivo: richieste.filter((r) => r.preventivo_centesimi).length,
    pagate: pagate.length,
    completate: completate.length,
    annullate: richieste.filter((r) => r.stato === STATI.ANNULLATA).length,
    contestate: richieste.filter((r) => r.stato === STATI.CONTESTATA).length,

    // ── Soldi ──
    gmv,
    saldiIncassati,
    creditiScalati,
    payoutFatti,
    payoutInSospeso,
    bonificiInSospeso: completate.filter((r) => !r.transfer_id).length,
    valoreMedioRiparazione: completate.length ? Math.round(gmv / completate.length) : 0,

    // ── Imbuto ──
    // Ogni passo rispetto al precedente, non rispetto al totale: cosi' si vede
    // DOVE si perdono le persone, che e' l'unica cosa su cui si puo' agire.
    conversioni: {
      diagnosiARichiesta: percento(richieste.length, diagnosiPagate),
      richiestaAPreventivo: percento(richieste.filter((r) => r.preventivo_centesimi).length, richieste.length),
      preventivoAPagamento: percento(pagate.length, richieste.filter((r) => r.preventivo_centesimi).length),
      pagamentoACompletata: percento(completate.length, pagate.length),
    },

    // ── Tecnici ──
    tecnici: {
      totali: tecnici.length,
      approvati: tecnici.filter((t) => t.approvato).length,
      pagabili: tecnici.filter((t) => t.stripe_bonifici_attivi).length,
      // Quelli che possono prendere lavori ma non possono essere pagati:
      // e' la situazione peggiore, perche' si accorge solo a lavoro finito.
      approvatiSenzaPagamenti: tecnici.filter((t) => t.approvato && !t.stripe_bonifici_attivi).length,
    },
  };
}
