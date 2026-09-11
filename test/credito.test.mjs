// test/credito.test.mjs
// Che i 9,90 € si possano spendere una volta sola.

import test from "node:test";
import assert from "node:assert/strict";
import { fintoDb } from "./finto-db.mjs";
import { CREDITO, creditoDisponibile, riservaCredito, liberaCredito, usaCredito } from "../lib/credito.js";
import { PREZZO_DIAGNOSI } from "../lib/soldi.js";

const SID = "cs_test_diagnosi_1";
const nuovo = (stato = CREDITO.DISPONIBILE, richiestaId = null) =>
  fintoDb({ pagamenti: [{ stripe_session_id: SID, credito_stato: stato, credito_richiesta_id: richiestaId }] });

test("una diagnosi pagata porta 9,90 € di credito", async () => {
  assert.equal(await creditoDisponibile(nuovo(), SID), PREZZO_DIAGNOSI);
});

test("una diagnosi senza pagamento tracciato non porta credito, ma non rompe", async () => {
  assert.equal(await creditoDisponibile(nuovo(), "cs_sconosciuta"), 0);
  assert.equal(await creditoDisponibile(nuovo(), null), 0);
});

test("il credito si riserva, e da li' e' di quella riparazione", async () => {
  const db = nuovo();
  assert.equal(await riservaCredito(db, SID, 42), true);
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.RISERVATO);
  assert.equal(db.dati.pagamenti[0].credito_richiesta_id, 42);
});

test("riservarlo due volte dalla stessa riparazione non e' un errore", async () => {
  const db = nuovo();
  assert.equal(await riservaCredito(db, SID, 42), true);
  assert.equal(await riservaCredito(db, SID, 42), true); // doppio click
});

test("UNA SOLA VOLTA: una seconda riparazione non se lo prende", async () => {
  const db = nuovo();
  assert.equal(await riservaCredito(db, SID, 42), true);
  assert.equal(await riservaCredito(db, SID, 99), false);
  assert.equal(db.dati.pagamenti[0].credito_richiesta_id, 42);
  // E per la 99 il credito risulta zero: paghera' il prezzo pieno.
  assert.equal(await creditoDisponibile(db, SID, 99), 0);
  assert.equal(await creditoDisponibile(db, SID, 42), PREZZO_DIAGNOSI);
});

test("se la riparazione salta, il credito torna libero per un altro tecnico", async () => {
  const db = nuovo();
  await riservaCredito(db, SID, 42);
  assert.equal(await liberaCredito(db, 42), true);
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.DISPONIBILE);
  // E adesso un'altra riparazione se lo puo' prendere.
  assert.equal(await riservaCredito(db, SID, 99), true);
});

test("una cancellazione vecchia non sfila il credito a una riparazione nuova", async () => {
  const db = nuovo();
  await riservaCredito(db, SID, 42);
  await liberaCredito(db, 42);
  await riservaCredito(db, SID, 99);
  // Arriva in ritardo la cancellazione della 42: non deve toccare la 99.
  assert.equal(await liberaCredito(db, 42), false);
  assert.equal(db.dati.pagamenti[0].credito_richiesta_id, 99);
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.RISERVATO);
});

test("a lavoro finito il credito diventa usato, e non torna piu' indietro", async () => {
  const db = nuovo();
  await riservaCredito(db, SID, 42);
  assert.equal(await usaCredito(db, 42), true);
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.USATO);
  assert.ok(db.dati.pagamenti[0].credito_usato_at);
  // Non si libera piu'.
  assert.equal(await liberaCredito(db, 42), false);
  // E non vale per nessun'altra riparazione.
  assert.equal(await creditoDisponibile(db, SID), 0);
});

test("usarlo due volte non raddoppia niente", async () => {
  const db = nuovo();
  await riservaCredito(db, SID, 42);
  const primo = db.dati.pagamenti[0].credito_usato_at;
  assert.equal(await usaCredito(db, 42), true);
  assert.equal(await usaCredito(db, 42), true);  // webhook ripetuto
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.USATO);
});

test("non si puo' usare un credito mai riservato", async () => {
  const db = nuovo();
  assert.equal(await usaCredito(db, 42), false);
  assert.equal(db.dati.pagamenti[0].credito_stato, CREDITO.DISPONIBILE);
});
