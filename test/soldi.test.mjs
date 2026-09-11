// test/soldi.test.mjs
//   node --test test/
//
// Prove sui conti del marketplace. Niente database, niente Stripe, niente
// browser: sono numeri, e i numeri si controllano in mezzo secondo.
//
// Gli esempi sono quelli concordati con Loris, scritti con i suoi valori:
// se un giorno un conto cambia, deve rompersi qui e non sull'estratto conto
// di un tecnico.

import test from "node:test";
import assert from "node:assert/strict";
import {
  PREZZO_DIAGNOSI,
  COMMISSIONE,
  contiRiparazione,
  inCentesimi,
  inEuro,
} from "../lib/soldi.js";

test("la diagnosi costa 9,90 € e la commissione parte dal 10%", () => {
  assert.equal(PREZZO_DIAGNOSI, 990);
  assert.equal(COMMISSIONE, 0.1);
});

test("intervento da 120 €: l'esempio principale, numero per numero", () => {
  const c = contiRiparazione(12000);
  assert.equal(c.creditoApplicato, 990);   //   9,90 € gia' pagati
  assert.equal(c.saldoCliente, 11010);     // 110,10 € da pagare adesso
  assert.equal(c.commissioneFixi, 1200);   //  12,00 € a Fixi
  assert.equal(c.nettoTecnico, 10800);     // 108,00 € al tecnico
});

test("il cliente paga 120 € in tutto, contando la diagnosi", () => {
  const c = contiRiparazione(12000);
  assert.equal(PREZZO_DIAGNOSI + c.saldoCliente, 12000);
});

test("commissione e netto tecnico fanno sempre il prezzo totale", () => {
  for (const p of [500, 990, 1000, 6000, 12000, 34567, 100000]) {
    const c = contiRiparazione(p);
    assert.equal(c.commissioneFixi + c.nettoTecnico, p, `non torna su ${p}`);
  }
});

test("LA TRAPPOLA: la commissione sta sul totale, non sul saldo", () => {
  const c = contiRiparazione(12000);
  assert.equal(c.commissioneFixi, 1200);
  // Se qualcuno la calcolasse sul saldo verrebbe 1101, e il tecnico
  // prenderebbe 9 € in meno per uno sconto che non ha fatto lui.
  assert.notEqual(c.commissioneFixi, Math.round(c.saldoCliente * COMMISSIONE));
});

test("intervento da 60 €: la commissione resta 6 €, non sale a 9,90", () => {
  const c = contiRiparazione(6000);
  assert.equal(c.creditoApplicato, 990);
  assert.equal(c.saldoCliente, 5010);
  assert.equal(c.commissioneFixi, 600);    // 10% di 60 €, non il prezzo diagnosi
  assert.equal(c.nettoTecnico, 5400);
  // Nessuna regola "Fixi prende almeno 9,90": qui incassa 6 € e va bene cosi'.
  assert.ok(c.commissioneFixi < PREZZO_DIAGNOSI);
});

test("il credito non supera mai il prezzo dell'intervento", () => {
  const c = contiRiparazione(500); // 5 €, meno del credito
  assert.equal(c.creditoApplicato, 500);
  assert.equal(c.saldoCliente, 0);
  // E il tecnico prende comunque il 90% dei 5 €, non del credito.
  assert.equal(c.commissioneFixi, 50);
  assert.equal(c.nettoTecnico, 450);
});

test("senza credito disponibile il cliente paga tutto il prezzo", () => {
  const c = contiRiparazione(12000, { credito: 0 });
  assert.equal(c.creditoApplicato, 0);
  assert.equal(c.saldoCliente, 12000);
  // Ma commissione e netto NON cambiano: dipendono solo dal totale.
  assert.equal(c.commissioneFixi, 1200);
  assert.equal(c.nettoTecnico, 10800);
});

test("un credito gonfiato dall'esterno resta comunque al tetto di 9,90", () => {
  const c = contiRiparazione(12000, { credito: 50000 });
  assert.equal(c.creditoApplicato, 990);
  assert.equal(c.saldoCliente, 11010);
});

test("la percentuale si puo' cambiare, e cambia solo la spartizione", () => {
  const c = contiRiparazione(12000, { commissione: 0.15 });
  assert.equal(c.commissioneFixi, 1800);
  assert.equal(c.nettoTecnico, 10200);
  assert.equal(c.saldoCliente, 11010); // il cliente paga sempre lo stesso
  assert.equal(c.commissione, 0.15);   // e resta scritta sul lavoro
});

test("i prezzi storti vengono rifiutati invece di produrre conti storti", () => {
  assert.throws(() => contiRiparazione(0));
  assert.throws(() => contiRiparazione(-100));
  assert.throws(() => contiRiparazione(120.5));      // centesimi con la virgola
  assert.throws(() => contiRiparazione("12000"));    // stringa
  assert.throws(() => contiRiparazione(12000, { commissione: 1 }));
  assert.throws(() => contiRiparazione(12000, { credito: -1 }));
});

test("da quello che scrive il tecnico ai centesimi", () => {
  assert.equal(inCentesimi("120"), 12000);
  assert.equal(inCentesimi("120,50"), 12050);
  assert.equal(inCentesimi("120.50"), 12050);
  assert.equal(inCentesimi(" 120,50 € "), 12050);
  assert.equal(inCentesimi("0,99"), 99);
  assert.equal(inCentesimi("abc"), null);
  assert.equal(inCentesimi(""), null);
  assert.equal(inCentesimi("120,555"), null);  // tre decimali: non e' un prezzo
  assert.equal(inCentesimi("-120"), null);
});

test("gli importi si scrivono con la valuta della lingua giusta", () => {
  assert.match(inEuro(11010, "it"), /110,10/);
  assert.match(inEuro(11010, "de"), /110,10/);
  assert.match(inEuro(11010, "en"), /110\.10/);
});
