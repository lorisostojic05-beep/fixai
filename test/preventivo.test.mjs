// test/preventivo.test.mjs
// Il giro del preventivo, dal prezzo del tecnico all'accettazione del cliente.
//
// La prova piu' importante di tutte e' l'ultima: il frontend non puo' decidere
// quanto paga il cliente ne' quanto prende il tecnico.

import test from "node:test";
import assert from "node:assert/strict";
import { fintoDb } from "./finto-db.mjs";
import { proponi, perIlCliente, accetta } from "../lib/preventivo.js";
import { STATI } from "../lib/stati-riparazione.js";
import { CREDITO } from "../lib/credito.js";
import { PREZZO_DIAGNOSI } from "../lib/soldi.js";

const SID = "cs_diagnosi_1";

function scenario({ stato = STATI.ACCETTATA, preventivo = null, creditoStato = CREDITO.DISPONIBILE, creditoDi = null } = {}) {
  return fintoDb({
    richieste_intervento: [
      {
        id: 7,
        stato,
        tecnico_id: "tec-1",
        preventivo_centesimi: preventivo,
        diagnosi_stripe_session_id: SID,
        prezzo_finale_centesimi: null,
      },
    ],
    pagamenti: [{ stripe_session_id: SID, credito_stato: creditoStato, credito_richiesta_id: creditoDi }],
  });
}

// ─── Il tecnico propone ─────────────────────────────────────────────────────

test("il tecnico scrive 120 e vede subito che ne prende 108", async () => {
  const db = scenario();
  const e = await proponi(db, { richiestaId: 7, tecnicoId: "tec-1", prezzo: "120" });
  assert.equal(e.ok, true);
  assert.equal(e.prezzo, 12000);
  assert.equal(e.commissione, 1200);
  assert.equal(e.netto, 10800);
  assert.equal(db.dati.richieste_intervento[0].stato, STATI.PREVENTIVO);
});

test("accetta i prezzi scritti come li scrive una persona", async () => {
  for (const [scritto, atteso] of [["120", 12000], ["120,50", 12050], ["120.50", 12050], [" 89 € ", 8900]]) {
    const e = await proponi(scenario(), { richiestaId: 7, tecnicoId: "tec-1", prezzo: scritto });
    assert.equal(e.prezzo, atteso, `su "${scritto}"`);
  }
});

test("un tecnico non tocca il lavoro di un altro", async () => {
  const db = scenario();
  const e = await proponi(db, { richiestaId: 7, tecnicoId: "tec-DUE", prezzo: "120" });
  assert.equal(e.ok, false);
  assert.match(e.motivo, /non e' tuo/);
  assert.equal(db.dati.richieste_intervento[0].preventivo_centesimi, null);
});

test("prezzi assurdi o illeggibili vengono rifiutati", async () => {
  for (const p of ["", "abc", "0", "2", "9999999", "-50"]) {
    const e = await proponi(scenario(), { richiestaId: 7, tecnicoId: "tec-1", prezzo: p });
    assert.equal(e.ok, false, `ha accettato "${p}"`);
  }
});

test("il preventivo si corregge finche' il cliente non ha accettato", async () => {
  const db = scenario();
  await proponi(db, { richiestaId: 7, tecnicoId: "tec-1", prezzo: "120" });
  const e = await proponi(db, { richiestaId: 7, tecnicoId: "tec-1", prezzo: "95" });
  assert.equal(e.ok, true);
  assert.equal(db.dati.richieste_intervento[0].preventivo_centesimi, 9500);
});

test("non si propone un prezzo su un lavoro gia' pagato", async () => {
  const e = await proponi(scenario({ stato: STATI.PAGATA }), { richiestaId: 7, tecnicoId: "tec-1", prezzo: "120" });
  assert.equal(e.ok, false);
});

// ─── Cosa vede il cliente ───────────────────────────────────────────────────

test("il cliente vede 120, meno 9,90, uguale 110,10", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000 });
  const v = await perIlCliente(db, db.dati.richieste_intervento[0]);
  assert.equal(v.prezzo, 12000);
  assert.equal(v.credito, 990);
  assert.equal(v.daPagare, 11010);
});

test("se il credito e' gia' di un'altra riparazione, paga pieno", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000, creditoStato: CREDITO.RISERVATO, creditoDi: 99 });
  const v = await perIlCliente(db, db.dati.richieste_intervento[0]);
  assert.equal(v.credito, 0);
  assert.equal(v.daPagare, 12000);
});

// ─── Il cliente accetta ─────────────────────────────────────────────────────

test("accettando, i cinque numeri si congelano sulla riga", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000 });
  const e = await accetta(db, 7);
  assert.equal(e.ok, true);

  const r = db.dati.richieste_intervento[0];
  assert.equal(r.stato, STATI.PREVENTIVO_ACCETTATO);
  assert.equal(r.prezzo_finale_centesimi, 12000);
  assert.equal(r.credito_applicato_centesimi, 990);
  assert.equal(r.saldo_cliente_centesimi, 11010);
  assert.equal(r.commissione_centesimi, 1200);
  assert.equal(r.netto_tecnico_centesimi, 10800);
  // La percentuale resta scritta: fra un anno potrebbe essere un'altra.
  assert.equal(r.commissione_frazione, 0.1);
});

test("accettando, il credito passa a riservato", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000 });
  await accetta(db, 7);
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.RISERVATO);
  assert.equal(db.dati.pagamenti[0].credito_richiesta_id, 7);
});

test("accettare due volte non raddoppia niente", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000 });
  await accetta(db, 7);
  const secondo = await accetta(db, 7);
  assert.equal(secondo.ok, false);
  assert.equal(db.dati.richieste_intervento[0].saldo_cliente_centesimi, 11010);
});

test("i conti congelati non si ricalcolano piu'", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000 });
  await accetta(db, 7);
  // Qualcuno cambia il preventivo dopo: il cliente deve vedere ancora i suoi.
  db.dati.richieste_intervento[0].preventivo_centesimi = 30000;
  const v = await perIlCliente(db, db.dati.richieste_intervento[0]);
  assert.equal(v.prezzo, 12000);
  assert.equal(v.daPagare, 11010);
  assert.equal(v.congelato, true);
});

test("intervento da 60 €: commissione 6, netto 54, saldo 50,10", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 6000 });
  await accetta(db, 7);
  const r = db.dati.richieste_intervento[0];
  assert.equal(r.saldo_cliente_centesimi, 5010);
  assert.equal(r.commissione_centesimi, 600);
  assert.equal(r.netto_tecnico_centesimi, 5400);
  // Nessuna regola "Fixi prende almeno 9,90".
  assert.ok(r.commissione_centesimi < PREZZO_DIAGNOSI);
});

test("senza credito disponibile si accetta lo stesso, a prezzo pieno", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000, creditoStato: CREDITO.USATO });
  const e = await accetta(db, 7);
  assert.equal(e.ok, true);
  const r = db.dati.richieste_intervento[0];
  assert.equal(r.credito_applicato_centesimi, 0);
  assert.equal(r.saldo_cliente_centesimi, 12000);
  // Commissione e netto NON cambiano: dipendono solo dal totale.
  assert.equal(r.commissione_centesimi, 1200);
  assert.equal(r.netto_tecnico_centesimi, 10800);
});

test("non si accetta un preventivo che non esiste", async () => {
  const e = await accetta(scenario({ stato: STATI.ACCETTATA }), 7);
  assert.equal(e.ok, false);
  assert.match(e.motivo, /nessun preventivo/);
});

test("IL FRONTEND NON DECIDE NIENTE: i numeri escono dal database", async () => {
  const db = scenario({ stato: STATI.PREVENTIVO, preventivo: 12000 });
  // accetta() prende solo l'id: non c'e' nessun posto dove infilare
  // un prezzo, un credito, un saldo o una commissione.
  assert.equal(accetta.length, 2);
  const e = await accetta(db, 7);
  assert.equal(e.saldoCliente, 11010);
  assert.equal(e.nettoTecnico, 10800);
});
