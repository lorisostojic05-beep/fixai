// test/traduci.test.mjs
// Che si ritraduca solo cio' che e' cambiato — e che il file rimontato non
// perda niente per strada.
//
// Sbagliare in un senso costa soldi (si ritraduce tutto per niente). Nell'altro
// e' peggio e non si vede: una frase cambiata in italiano resta vecchia in
// tedesco, e nessuno se ne accorge finche' un tecnico non legge "0%".

import test from "node:test";
import assert from "node:assert/strict";
import {
  unita,
  impronte,
  daRifare,
  parziale,
  componi,
  chiaveDi,
} from "../scripts/traduzioni-incrementali.mjs";

const ITALIANO = {
  hero: { titolo: "Ciao", sotto: "Diagnosi a {prezzo}" },
  tecnici: {
    sottotitolo: "Nessuna commissione",
    numeri: [
      { valore: "€0", etichetta: "Iscrizione" },
      { valore: "0%", etichetta: "Commissione" },
    ],
  },
};

const INGLESE = {
  hero: { titolo: "Hi", sotto: "Diagnosis for {prezzo}" },
  tecnici: {
    sottotitolo: "No commission",
    numeri: [
      { valore: "€0", etichetta: "Sign-up" },
      { valore: "0%", etichetta: "Commission" },
    ],
  },
};

const copia = (x) => JSON.parse(JSON.stringify(x));

test("gli elenchi sono un'unita' sola, le frasi una ciascuna", () => {
  const u = unita(ITALIANO).map((x) => chiaveDi(x.percorso));
  assert.deepEqual(u, ["hero.titolo", "hero.sotto", "tecnici.sottotitolo", "tecnici.numeri"]);
});

test("se niente e' cambiato, non si ritraduce niente", () => {
  const ricordate = impronte(ITALIANO);
  assert.deepEqual(daRifare(ITALIANO, INGLESE, ricordate), []);
});

test("IL CASO DI OGGI: cambia una frase, si rifa' solo quella", () => {
  const ricordate = impronte(ITALIANO);
  const nuovo = copia(ITALIANO);
  nuovo.tecnici.sottotitolo = "Paghi solo il 10% sui lavori completati";

  const rifare = daRifare(nuovo, INGLESE, ricordate).map((u) => chiaveDi(u.percorso));
  assert.deepEqual(rifare, ["tecnici.sottotitolo"]);
});

test("cambia una voce di un elenco: si rifa' l'elenco intero", () => {
  const ricordate = impronte(ITALIANO);
  const nuovo = copia(ITALIANO);
  nuovo.tecnici.numeri[1].valore = "10%";

  const rifare = daRifare(nuovo, INGLESE, ricordate).map((u) => chiaveDi(u.percorso));
  assert.deepEqual(rifare, ["tecnici.numeri"]);
});

test("un elenco che cambia lunghezza si rifa' anche senza impronte", () => {
  const nuovo = copia(ITALIANO);
  nuovo.tecnici.numeri.push({ valore: "48h", etichetta: "Attivazione" });
  const rifare = daRifare(nuovo, INGLESE, null).map((u) => chiaveDi(u.percorso));
  assert.deepEqual(rifare, ["tecnici.numeri"]);
});

test("una frase nuova si traduce, anche senza impronte", () => {
  const nuovo = copia(ITALIANO);
  nuovo.hero.bottone = "Inizia";
  const rifare = daRifare(nuovo, INGLESE, null).map((u) => chiaveDi(u.percorso));
  assert.deepEqual(rifare, ["hero.bottone"]);
});

test("SENZA IMPRONTE una frase modificata NON si vede: per questo va segnalato", () => {
  // E' il limite del metodo, scritto qui perche' nessuno lo dimentichi: senza
  // sapere com'era l'italiano quando si e' tradotto, "cambiata" e "uguale"
  // sono indistinguibili.
  const nuovo = copia(ITALIANO);
  nuovo.tecnici.sottotitolo = "Paghi solo il 10%";
  assert.deepEqual(daRifare(nuovo, INGLESE, null), []);
});

test("senza file della lingua si traduce tutto", () => {
  assert.equal(daRifare(ITALIANO, null, null).length, unita(ITALIANO).length);
});

test("il parziale contiene solo le unita' scelte, al loro posto", () => {
  const p = parziale([
    { percorso: ["tecnici", "sottotitolo"], valore: "X" },
    { percorso: ["hero", "titolo"], valore: "Y" },
  ]);
  assert.deepEqual(p, { tecnici: { sottotitolo: "X" }, hero: { titolo: "Y" } });
});

test("il file rimontato prende il nuovo dove c'e' e il vecchio dove no", () => {
  const nuovoIt = copia(ITALIANO);
  nuovoIt.tecnici.sottotitolo = "Paghi solo il 10%";
  const tradottoOra = { tecnici: { sottotitolo: "You only pay 10%" } };

  const file = componi(nuovoIt, INGLESE, tradottoOra);
  assert.equal(file.tecnici.sottotitolo, "You only pay 10%");
  assert.equal(file.hero.titolo, "Hi"); // intatto
  assert.deepEqual(file.tecnici.numeri, INGLESE.tecnici.numeri); // intatto
});

test("una frase tolta dall'italiano sparisce anche dalla traduzione", () => {
  const nuovoIt = copia(ITALIANO);
  delete nuovoIt.hero.sotto;
  const file = componi(nuovoIt, INGLESE, {});
  assert.equal("sotto" in file.hero, false);
});

test("l'ordine delle voci segue l'italiano, non il file vecchio", () => {
  const disordinato = { tecnici: INGLESE.tecnici, hero: INGLESE.hero };
  const file = componi(ITALIANO, disordinato, {});
  assert.deepEqual(Object.keys(file), ["hero", "tecnici"]);
});
