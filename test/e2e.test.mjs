// test/e2e.test.mjs
// Il giro completo, dall'inizio alla fine, senza saltare un passaggio.
//
// Le altre prove guardano un pezzo per volta: i conti, gli stati, il credito,
// il bonifico. Ognuna puo' essere verde mentre il giro intero e' rotto — basta
// che due pezzi giusti non si parlino. Questa prova fa parlare i pezzi veri
// fra loro:
//
//   diagnosi pagata → preventivo → il cliente accetta → il webhook di Stripe
//   → il tecnico inizia e finisce → il credito si consuma → il bonifico parte
//
// Di finto ci sono solo le due cose che non si possono avere in una prova: il
// database e Stripe. Tutto il resto e' il codice che gira in produzione.

import test from "node:test";
import assert from "node:assert/strict";
import { fintoDb } from "./finto-db.mjs";
import { proponi, perIlCliente, accetta } from "../lib/preventivo.js";
import { prenota, gestisciEvento } from "../lib/eventi-stripe.js";
import { usaCredito, CREDITO } from "../lib/credito.js";
import { eseguiBonifico } from "../lib/bonifico.js";
import { STATI, verificaPassaggio } from "../lib/stati-riparazione.js";
import { metriche } from "../lib/metriche.js";
import { PREZZO_DIAGNOSI } from "../lib/soldi.js";

const SESSIONE_DIAGNOSI = "cs_diagnosi_1";

// Il punto di partenza: una videodiagnosi pagata 9,90 € e un tecnico che ha
// preso il lavoro. E' esattamente la riga che esiste oggi in produzione.
function mondo() {
  return fintoDb({
    pagamenti: [
      {
        stripe_session_id: SESSIONE_DIAGNOSI,
        credito_stato: CREDITO.DISPONIBILE,
        credito_richiesta_id: null,
      },
    ],
    richieste_intervento: [
      {
        id: 1,
        stato: STATI.ACCETTATA,
        tecnico_id: "tec-1",
        appliance: "Lavatrice",
        brand: "Bosch",
        diagnosi_stripe_session_id: SESSIONE_DIAGNOSI,
        transfer_id: null,
      },
    ],
    tecnici: [
      { id: "tec-1", nome: "Mario", cognome: "Rossi", stripe_account_id: "acct_tec", approvato: true },
    ],
    eventi_stripe: [],
    contestazioni: [],
  });
}

// Stripe finto: registra le chiamate invece di spostare soldi.
function stripeFinto({ attivo = true } = {}) {
  const bonifici = [];
  return {
    bonifici,
    statoConto: async () => ({
      stripe_bonifici_attivi: attivo,
      stripe_incassi_attivi: attivo,
      stripe_requisiti: { trasferimenti: attivo ? "active" : "restricted", mancanti: [] },
      stripe_aggiornato_at: new Date().toISOString(),
    }),
    creaTrasferimento: async (corpo, opzioni) => {
      bonifici.push({ corpo, opzioni });
      return { id: "tr_" + bonifici.length };
    },
  };
}

// L'evento che Stripe manda quando il cliente ha pagato il saldo.
const eventoPagamento = (id, richiestaId, importo) => ({
  id,
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_saldo_" + richiestaId,
      amount_total: importo,
      payment_intent: "pi_saldo_" + richiestaId,
      metadata: { richiesta_id: String(richiestaId) },
    },
  },
});

// Il webhook vero, meno la firma: prenota l'evento e poi lo elabora. Se la
// prenotazione dice "gia' visto", non si elabora — ed e' il primo dei tre
// strati contro i doppioni.
async function webhook(db, evento) {
  const nuovo = await prenota(db, evento);
  if (!nuovo) return "gia' elaborato";
  return gestisciEvento(db, evento);
}

// Le due tappe del tecnico, come le fa pages/api/avanza-lavoro.js.
async function avanza(db, richiestaId, nuovo) {
  const { data: r } = await db
    .from("richieste_intervento")
    .select("id, stato")
    .eq("id", richiestaId)
    .maybeSingle();
  const passaggio = verificaPassaggio(r.stato, nuovo);
  if (!passaggio.ok) return { ok: false, motivo: passaggio.perche };
  await db
    .from("richieste_intervento")
    .update({ stato: nuovo })
    .eq("id", richiestaId)
    .eq("stato", r.stato)
    .select("id")
    .maybeSingle();
  return { ok: true };
}

const riga = async (db, id = 1) =>
  (await db.from("richieste_intervento").select("*").eq("id", id).maybeSingle()).data;

const pagamento = async (db) =>
  (await db.from("pagamenti").select("*").eq("stripe_session_id", SESSIONE_DIAGNOSI).maybeSingle()).data;

// ───────────────────────────────────────────────────────────────────────────
// Il giro intero
// ───────────────────────────────────────────────────────────────────────────

test("UN LAVORO DA 120 €, DALL'INIZIO ALLA FINE", async () => {
  const db = mondo();
  const s = stripeFinto();

  // ── 1. Il tecnico propone 120 € ────────────────────────────────────────
  const proposta = await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: "120,00" });
  assert.equal(proposta.ok, true);
  assert.equal(proposta.prezzo, 12000);
  assert.equal(proposta.commissione, 1200); // il 10% del TOTALE
  assert.equal(proposta.netto, 10800);
  assert.equal((await riga(db)).stato, STATI.PREVENTIVO);

  // ── 2. Quello che vede il cliente ──────────────────────────────────────
  const visto = await perIlCliente(db, await riga(db));
  assert.deepEqual(
    { prezzo: visto.prezzo, credito: visto.credito, daPagare: visto.daPagare },
    { prezzo: 12000, credito: 990, daPagare: 11010 }
  );
  assert.equal(visto.congelato, false);

  // ── 3. Il cliente accetta: i numeri si congelano ───────────────────────
  const accettato = await accetta(db, 1);
  assert.equal(accettato.ok, true);
  const dopoAccettazione = await riga(db);
  assert.equal(dopoAccettazione.stato, STATI.PREVENTIVO_ACCETTATO);
  assert.equal(dopoAccettazione.prezzo_finale_centesimi, 12000);
  assert.equal(dopoAccettazione.credito_applicato_centesimi, 990);
  assert.equal(dopoAccettazione.saldo_cliente_centesimi, 11010);
  assert.equal(dopoAccettazione.commissione_centesimi, 1200);
  assert.equal(dopoAccettazione.netto_tecnico_centesimi, 10800);
  // Il credito e' messo da parte, non ancora speso.
  assert.equal((await pagamento(db)).credito_stato, CREDITO.RISERVATO);

  // Quello che il cliente rivede adesso sono gli stessi numeri, non un
  // ricalcolo: paga quello che ha visto.
  const rivisto = await perIlCliente(db, await riga(db));
  assert.equal(rivisto.congelato, true);
  assert.equal(rivisto.daPagare, 11010);

  // ── 4. Stripe dice che il saldo e' arrivato ────────────────────────────
  assert.equal(await webhook(db, eventoPagamento("evt_1", 1, 11010)), "riparazione segnata come pagata");
  const dopoPagamento = await riga(db);
  assert.equal(dopoPagamento.stato, STATI.PAGATA);
  assert.equal(dopoPagamento.saldo_payment_intent_id, "pi_saldo_1");

  // Stripe rimanda lo stesso evento: non deve succedere niente.
  assert.equal(await webhook(db, eventoPagamento("evt_1", 1, 11010)), "gia' elaborato");
  assert.equal((await riga(db)).stato, STATI.PAGATA);

  // ── 5. Il tecnico lavora ───────────────────────────────────────────────
  assert.equal((await avanza(db, 1, STATI.IN_CORSO)).ok, true);
  assert.equal((await avanza(db, 1, STATI.COMPLETATA)).ok, true);
  assert.equal((await riga(db)).stato, STATI.COMPLETATA);

  // ── 6. Il credito si consuma e il bonifico parte ───────────────────────
  assert.equal(await usaCredito(db, 1), true);
  assert.equal((await pagamento(db)).credito_stato, CREDITO.USATO);

  const bonifico = await eseguiBonifico(db, 1, s);
  assert.equal(bonifico.ok, true);
  assert.equal(bonifico.importo, 10800);
  assert.equal(s.bonifici.length, 1);
  assert.equal(s.bonifici[0].corpo.destination, "acct_tec");
  assert.equal((await riga(db)).transfer_id, "tr_1");

  // ── 7. I conti tornano ─────────────────────────────────────────────────
  // Il cliente ha tirato fuori 9,90 + 110,10 = 120. Il tecnico ne ha 108,
  // Fixi 12. Non manca e non avanza un centesimo.
  const f = await riga(db);
  assert.equal(f.credito_applicato_centesimi + f.saldo_cliente_centesimi, 12000);
  assert.equal(f.commissione_centesimi + f.netto_tecnico_centesimi, f.prezzo_finale_centesimi);
});

test("il bonifico non parte due volte, nemmeno chiamandolo due volte", async () => {
  const db = mondo();
  const s = stripeFinto();
  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: 12000 });
  await accetta(db, 1);
  await webhook(db, eventoPagamento("evt_1", 1, 11010));
  await avanza(db, 1, STATI.IN_CORSO);
  await avanza(db, 1, STATI.COMPLETATA);
  await usaCredito(db, 1);

  await eseguiBonifico(db, 1, s);
  const secondo = await eseguiBonifico(db, 1, s);

  assert.equal(secondo.gia, true);
  assert.equal(s.bonifici.length, 1); // Stripe e' stato chiamato una volta sola
});

test("IL LAVORO DA 60 €: il tecnico prende piu' di quanto e' stato incassato", async () => {
  // Il caso che rompe l'idea "bonifica quello che hai incassato":
  //   totale 60 € → al tecnico 54 €, ma il saldo incassato e' 50,10 €.
  // I 9,90 € mancanti erano arrivati settimane prima, con la diagnosi.
  const db = mondo();
  const s = stripeFinto();

  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: "60,00" });
  await accetta(db, 1);
  const r = await riga(db);
  assert.equal(r.saldo_cliente_centesimi, 5010);
  assert.equal(r.netto_tecnico_centesimi, 5400);
  assert.ok(r.netto_tecnico_centesimi > r.saldo_cliente_centesimi);

  await webhook(db, eventoPagamento("evt_60", 1, 5010));
  await avanza(db, 1, STATI.IN_CORSO);
  await avanza(db, 1, STATI.COMPLETATA);
  await usaCredito(db, 1);

  const bonifico = await eseguiBonifico(db, 1, s);
  assert.equal(bonifico.ok, true);
  assert.equal(s.bonifici[0].corpo.amount, 5400);
  // Il bonifico non e' agganciato all'incasso del saldo: se lo fosse,
  // fallirebbe qui e fallirebbe su ogni riparazione sotto i ~99 €.
  assert.equal(s.bonifici[0].corpo.source_transaction, undefined);
});

test("un importo diverso da quello atteso non fa passare niente", async () => {
  const db = mondo();
  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: 12000 });
  await accetta(db, 1);

  // Arriva un pagamento da 10 € su un saldo da 110,10.
  const esito = await webhook(db, eventoPagamento("evt_furbo", 1, 1000));
  assert.match(esito, /importo diverso/);
  assert.equal((await riga(db)).stato, STATI.PREVENTIVO_ACCETTATO);
});

test("se il pagamento fallisce si torna al preventivo e il credito resta", async () => {
  const db = mondo();
  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: 12000 });
  await accetta(db, 1);

  await webhook(db, {
    id: "evt_ko",
    type: "payment_intent.payment_failed",
    data: { object: { id: "pi_ko", metadata: { richiesta_id: "1" } } },
  });

  assert.equal((await riga(db)).stato, STATI.PREVENTIVO);
  // Non e' successo niente di irreversibile: il credito e' ancora prenotato
  // per questa riparazione, e il cliente puo' ritentare.
  assert.equal((await pagamento(db)).credito_stato, CREDITO.RISERVATO);
});

test("UNA CONTESTAZIONE BLOCCA IL BONIFICO", async () => {
  const db = mondo();
  const s = stripeFinto();
  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: 12000 });
  await accetta(db, 1);
  await webhook(db, eventoPagamento("evt_1", 1, 11010));
  await avanza(db, 1, STATI.IN_CORSO);
  await avanza(db, 1, STATI.COMPLETATA);

  await webhook(db, {
    id: "evt_disputa",
    type: "charge.dispute.created",
    data: {
      object: {
        id: "dp_1",
        payment_intent: "pi_saldo_1",
        charge: "ch_1",
        amount: 11010,
        reason: "product_not_received",
        status: "needs_response",
      },
    },
  });

  assert.equal((await riga(db)).stato, STATI.CONTESTATA);

  const bonifico = await eseguiBonifico(db, 1, s);
  assert.equal(bonifico.ok, false);
  assert.equal(s.bonifici.length, 0);

  // La contestazione e' registrata, ma nessuno l'ha chiusa da solo: va
  // guardata da una persona.
  const d = db.dati.contestazioni[0];
  assert.equal(d.richiesta_id, 1);
  assert.equal(d.chiusa_at, null);
});

test("un rimborso si attacca alla riparazione giusta", async () => {
  const db = mondo();
  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: 12000 });
  await accetta(db, 1);
  await webhook(db, eventoPagamento("evt_1", 1, 11010));

  const esito = await webhook(db, {
    id: "evt_rimborso",
    type: "charge.refunded",
    data: { object: { payment_intent: "pi_saldo_1", refunds: { data: [{ id: "re_1" }] } } },
  });

  assert.match(esito, /richiesta 1/);
  assert.equal((await riga(db)).rimborso_id, "re_1");
});

test("i numeri dell'admin raccontano lo stesso lavoro", async () => {
  const db = mondo();
  const s = stripeFinto();
  await proponi(db, { richiestaId: 1, tecnicoId: "tec-1", prezzo: 12000 });
  await accetta(db, 1);
  await webhook(db, eventoPagamento("evt_1", 1, 11010));
  await avanza(db, 1, STATI.IN_CORSO);
  await avanza(db, 1, STATI.COMPLETATA);
  await usaCredito(db, 1);
  await eseguiBonifico(db, 1, s);

  const m = metriche({
    pagamenti: db.dati.pagamenti,
    richieste: db.dati.richieste_intervento,
    tecnici: db.dati.tecnici.map((t) => ({ ...t, stripe_bonifici_attivi: true })),
  });

  assert.equal(m.gmv, 12000);
  assert.equal(m.ricavoCommissioni, 1200);
  // La diagnosi si e' trasformata in riparazione: i suoi 9,90 € non sono
  // piu' ricavo a se'. Il ricavo di Fixi su questo lavoro e' 12 €, non 21,90.
  assert.equal(m.diagnosiConvertite, 1);
  assert.equal(m.ricavoDiagnosi, 0);
  assert.equal(m.ricavoTotale, 1200);
  assert.notEqual(m.ricavoTotale, 1200 + PREZZO_DIAGNOSI);
  assert.equal(m.payoutFatti, 10800);
  assert.equal(m.bonificiInSospeso, 0);
});
