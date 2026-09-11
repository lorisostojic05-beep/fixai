// test/bonifico.test.mjs
// Che i soldi escano una volta sola, e solo quando devono.
//
// E' l'unica operazione irreversibile del sistema: un pagamento sbagliato si
// rimborsa, un bonifico partito due volte si recupera solo chiedendolo.

import test from "node:test";
import assert from "node:assert/strict";
import { fintoDb } from "./finto-db.mjs";
import { eseguiBonifico, gruppo } from "../lib/bonifico.js";
import { STATI } from "../lib/stati-riparazione.js";

// Un tecnico in regola e una riparazione da 120 € gia' completata.
function scenario({ stato = STATI.COMPLETATA, transferId = null, contoTecnico = "acct_tec", netto = 10800 } = {}) {
  return fintoDb({
    richieste_intervento: [
      {
        id: 7,
        stato,
        tecnico_id: "tec-1",
        transfer_id: transferId,
        netto_tecnico_centesimi: netto,
        prezzo_finale_centesimi: 12000,
        commissione_centesimi: 1200,
      },
    ],
    tecnici: [{ id: "tec-1", nome: "Mario", cognome: "Bianchi", stripe_account_id: contoTecnico }],
  });
}

// Stripe finto: registra le chiamate invece di spostare soldi.
function stripeFinto({ attivo = true, errore = null } = {}) {
  const chiamate = [];
  return {
    chiamate,
    statoConto: async () => ({
      stripe_bonifici_attivi: attivo,
      stripe_incassi_attivi: attivo,
      stripe_requisiti: { trasferimenti: attivo ? "active" : "restricted", mancanti: [] },
      stripe_aggiornato_at: new Date().toISOString(),
    }),
    creaTrasferimento: async (corpo, opzioni) => {
      if (errore) throw errore;
      chiamate.push({ corpo, opzioni });
      return { id: "tr_" + chiamate.length };
    },
  };
}

test("il caso normale: 108 € al tecnico su un lavoro da 120", async () => {
  const db = scenario();
  const s = stripeFinto();
  const esito = await eseguiBonifico(db, 7, s);

  assert.equal(esito.ok, true);
  assert.equal(esito.transferId, "tr_1");
  assert.equal(s.chiamate.length, 1);
  assert.equal(s.chiamate[0].corpo.amount, 10800);
  assert.equal(s.chiamate[0].corpo.currency, "eur");
  assert.equal(s.chiamate[0].corpo.destination, "acct_tec");
  assert.equal(s.chiamate[0].corpo.transfer_group, gruppo(7));
  // L'id si scrive sulla riparazione.
  assert.equal(db.dati.richieste_intervento[0].transfer_id, "tr_1");
  assert.ok(db.dati.richieste_intervento[0].transfer_at);
});

test("DUE VOLTE NO: la seconda chiamata non tocca Stripe", async () => {
  const db = scenario();
  const s = stripeFinto();
  await eseguiBonifico(db, 7, s);
  const secondo = await eseguiBonifico(db, 7, s);

  assert.equal(secondo.ok, true);
  assert.equal(secondo.gia, true);
  assert.equal(secondo.transferId, "tr_1");
  // La prova vera: Stripe e' stato chiamato UNA volta sola.
  assert.equal(s.chiamate.length, 1);
});

test("la chiave di idempotenza nasce dalla riparazione, non dall'orologio", async () => {
  const s = stripeFinto();
  await eseguiBonifico(scenario(), 7, s);
  await eseguiBonifico(scenario(), 7, s); // database nuovo, stessa riparazione
  assert.equal(s.chiamate[0].opzioni.idempotencyKey, s.chiamate[1].opzioni.idempotencyKey);
  assert.match(s.chiamate[0].opzioni.idempotencyKey, /7$/);
});

test("niente bonifico se il lavoro non e' completato", async () => {
  for (const stato of [STATI.PAGATA, STATI.IN_CORSO, STATI.PREVENTIVO_ACCETTATO, STATI.ACCETTATA]) {
    const s = stripeFinto();
    const esito = await eseguiBonifico(scenario({ stato }), 7, s);
    assert.equal(esito.ok, false, `non doveva pagare da "${stato}"`);
    assert.equal(s.chiamate.length, 0);
    assert.match(esito.motivo, /non completata/);
  }
});

test("niente bonifico se il cliente ha contestato", async () => {
  const s = stripeFinto();
  const esito = await eseguiBonifico(scenario({ stato: STATI.CONTESTATA }), 7, s);
  assert.equal(esito.ok, false);
  assert.equal(s.chiamate.length, 0);
});

test("niente bonifico a un tecnico senza conto Stripe", async () => {
  const s = stripeFinto();
  const esito = await eseguiBonifico(scenario({ contoTecnico: null }), 7, s);
  assert.equal(esito.ok, false);
  assert.match(esito.motivo, /non ha configurato/);
  assert.equal(s.chiamate.length, 0);
});

test("niente bonifico se Stripe non abilita ancora i bonifici", async () => {
  const db = scenario();
  const s = stripeFinto({ attivo: false });
  const esito = await eseguiBonifico(db, 7, s);

  assert.equal(esito.ok, false);
  assert.match(esito.motivo, /non abilita/);
  assert.equal(s.chiamate.length, 0);
  // E la copia locale si aggiorna, cosi' l'admin lo mostra subito.
  assert.equal(db.dati.tecnici[0].stripe_bonifici_attivi, false);
});

test("lo stato del conto si RILEGGE da Stripe, non dalla colonna salvata", async () => {
  // Nel database il tecnico risulta a posto, ma Stripe dice di no.
  const db = scenario();
  db.dati.tecnici[0].stripe_bonifici_attivi = true;
  const s = stripeFinto({ attivo: false });
  const esito = await eseguiBonifico(db, 7, s);
  assert.equal(esito.ok, false, "si era fidato della colonna vecchia");
});

test("saldo Fixi non ancora disponibile: si puo' riprovare, non e' un guasto", async () => {
  const errore = Object.assign(new Error("Insufficient funds"), { code: "balance_insufficient" });
  const esito = await eseguiBonifico(scenario(), 7, stripeFinto({ errore }));
  assert.equal(esito.ok, false);
  assert.equal(esito.riprovabile, true);
  assert.match(esito.motivo, /qualche giorno/);
});

test("un netto storto non diventa un bonifico storto", async () => {
  for (const netto of [0, -100, null, 108.5]) {
    const s = stripeFinto();
    const esito = await eseguiBonifico(scenario({ netto }), 7, s);
    assert.equal(esito.ok, false, `ha accettato ${netto}`);
    assert.equal(s.chiamate.length, 0);
  }
});

test("una riparazione che non esiste non fa partire niente", async () => {
  const s = stripeFinto();
  const esito = await eseguiBonifico(scenario(), 999, s);
  assert.equal(esito.ok, false);
  assert.equal(s.chiamate.length, 0);
});

test("l'importo viene dal database, non da chi chiama la funzione", async () => {
  const db = scenario({ netto: 5400 }); // lavoro da 60 €
  const s = stripeFinto();
  await eseguiBonifico(db, 7, s);
  assert.equal(s.chiamate[0].corpo.amount, 5400);
});
