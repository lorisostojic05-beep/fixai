// test/metriche.test.mjs
// Che i numeri della dashboard dicano la verita'.
//
// Un conto sbagliato qui non si nota: si nota mesi dopo, quando ci si e' preso
// una decisione sopra.

import test from "node:test";
import assert from "node:assert/strict";
import { metriche } from "../lib/metriche.js";
import { STATI } from "../lib/stati-riparazione.js";

// Scenario: 10 diagnosi pagate. Tre sono diventate riparazioni: due
// completate (120 € e 60 €) e una ancora pagata ma non finita (200 €).
const SCENARIO = {
  pagamenti: [
    ...Array(7).fill({ credito_stato: "disponibile" }),
    { credito_stato: "usato" },
    { credito_stato: "usato" },
    { credito_stato: "riservato" },
  ],
  richieste: [
    {
      stato: STATI.COMPLETATA,
      preventivo_centesimi: 12000,
      prezzo_finale_centesimi: 12000,
      credito_applicato_centesimi: 990,
      saldo_cliente_centesimi: 11010,
      commissione_centesimi: 1200,
      netto_tecnico_centesimi: 10800,
      transfer_id: "tr_1",
    },
    {
      stato: STATI.COMPLETATA,
      preventivo_centesimi: 6000,
      prezzo_finale_centesimi: 6000,
      credito_applicato_centesimi: 990,
      saldo_cliente_centesimi: 5010,
      commissione_centesimi: 600,
      netto_tecnico_centesimi: 5400,
      transfer_id: null, // bonifico non ancora partito
    },
    {
      stato: STATI.PAGATA,
      preventivo_centesimi: 20000,
      prezzo_finale_centesimi: 20000,
      credito_applicato_centesimi: 990,
      saldo_cliente_centesimi: 19010,
      commissione_centesimi: 2000,
      netto_tecnico_centesimi: 18000,
    },
    { stato: STATI.ANNULLATA },
  ],
  tecnici: [
    { approvato: true, stripe_bonifici_attivi: true },
    { approvato: true, stripe_bonifici_attivi: false },
    { approvato: false, stripe_bonifici_attivi: false },
  ],
};

test("le diagnosi si dividono fra convertite e non", () => {
  const m = metriche(SCENARIO);
  assert.equal(m.diagnosiPagate, 10);
  assert.equal(m.diagnosiConvertite, 2);        // credito usato
  assert.equal(m.diagnosiSenzaRiparazione, 8);  // 10 - 2
  assert.equal(m.creditiRiservati, 1);
});

test("I DUE RICAVI NON SI SOMMANO DUE VOLTE", () => {
  const m = metriche(SCENARIO);
  // 8 diagnosi non convertite x 9,90 €
  assert.equal(m.ricavoDiagnosi, 7920);
  // Le commissioni delle sole riparazioni FINITE: 12 € + 6 €
  assert.equal(m.ricavoCommissioni, 1800);
  assert.equal(m.ricavoTotale, 9720);

  // La prova vera: i 9,90 € delle due convertite NON compaiono nel ricavo.
  // Se qualcuno li risommasse, verrebbe 9720 + 1980 = 11700.
  assert.notEqual(m.ricavoTotale, 11700);
});

test("il giro d'affari non e' il ricavo di Fixi", () => {
  const m = metriche(SCENARIO);
  assert.equal(m.gmv, 18000);          // 120 € + 60 €, solo le completate
  assert.equal(m.ricavoTotale, 9720);  // molto piu' piccolo
  assert.ok(m.gmv > m.ricavoTotale);
});

test("commissione piu' netto fa il giro d'affari", () => {
  const m = metriche(SCENARIO);
  const nettoTotale = m.payoutFatti + m.payoutInSospeso;
  assert.equal(m.ricavoCommissioni + nettoTotale, m.gmv);
});

test("i bonifici in sospeso si vedono, con il loro importo", () => {
  const m = metriche(SCENARIO);
  assert.equal(m.payoutFatti, 10800);       // solo quello con transfer_id
  assert.equal(m.payoutInSospeso, 5400);    // il lavoro da 60 €
  assert.equal(m.bonificiInSospeso, 1);
});

test("il saldo incassato comprende anche i lavori non ancora finiti", () => {
  const m = metriche(SCENARIO);
  // 110,10 + 50,10 + 190,10 — anche quello ancora in corso: i soldi ci sono.
  assert.equal(m.saldiIncassati, 11010 + 5010 + 19010);
});

test("l'imbuto misura ogni passo sul precedente, non sul totale", () => {
  const m = metriche(SCENARIO);
  assert.equal(m.conversioni.diagnosiARichiesta, 40);      // 4 su 10
  assert.equal(m.conversioni.richiestaAPreventivo, 75);    // 3 su 4
  assert.equal(m.conversioni.preventivoAPagamento, 100);   // 3 su 3
  assert.equal(m.conversioni.pagamentoACompletata, 66.7);  // 2 su 3
});

test("IL CASO CHE FA MALE: approvati ma non pagabili", () => {
  const m = metriche(SCENARIO);
  assert.equal(m.tecnici.approvati, 2);
  assert.equal(m.tecnici.pagabili, 1);
  // Questo puo' prendere lavori e non puo' essere pagato: ce ne si accorge
  // solo a lavoro finito, ed e' la situazione peggiore.
  assert.equal(m.tecnici.approvatiSenzaPagamenti, 1);
});

test("il valore medio si fa solo sulle riparazioni finite", () => {
  const m = metriche(SCENARIO);
  assert.equal(m.valoreMedioRiparazione, 9000); // (12000 + 6000) / 2
});

test("senza dati non esplode e non inventa percentuali", () => {
  const m = metriche();
  assert.equal(m.diagnosiPagate, 0);
  assert.equal(m.gmv, 0);
  assert.equal(m.ricavoTotale, 0);
  assert.equal(m.valoreMedioRiparazione, 0);
  // Niente "0%" inventati: se non c'e' niente da dividere, la risposta e' null.
  assert.equal(m.conversioni.diagnosiARichiesta, null);
});
