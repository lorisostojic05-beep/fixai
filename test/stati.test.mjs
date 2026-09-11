// test/stati.test.mjs
// Che dallo stato X si possa andare solo dove ha senso.
//
// Non e' pignoleria: senza questa tabella basta una chiamata sbagliata — o un
// tecnico che tocca due volte un pulsante — per far partire un bonifico su un
// lavoro che nessuno ha pagato.

import test from "node:test";
import assert from "node:assert/strict";
import { STATI, puoiPassare, verificaPassaggio, statoValido, CON_SOLDI_INCASSATI } from "../lib/stati-riparazione.js";

test("il percorso normale, dall'inizio alla fine", () => {
  const strada = [
    STATI.NUOVA, STATI.INVIATA, STATI.ACCETTATA, STATI.PREVENTIVO,
    STATI.PREVENTIVO_ACCETTATO, STATI.PAGATA, STATI.IN_CORSO, STATI.COMPLETATA,
  ];
  for (let i = 0; i < strada.length - 1; i++) {
    assert.ok(puoiPassare(strada[i], strada[i + 1]), `bloccato fra ${strada[i]} e ${strada[i + 1]}`);
  }
});

test("non si salta al completato senza passare dal pagamento", () => {
  assert.equal(puoiPassare(STATI.NUOVA, STATI.COMPLETATA), false);
  assert.equal(puoiPassare(STATI.ACCETTATA, STATI.COMPLETATA), false);
  assert.equal(puoiPassare(STATI.PREVENTIVO, STATI.COMPLETATA), false);
  assert.equal(puoiPassare(STATI.PREVENTIVO_ACCETTATO, STATI.COMPLETATA), false);
  // Nemmeno da "pagata": il lavoro va almeno iniziato.
  assert.equal(puoiPassare(STATI.PAGATA, STATI.COMPLETATA), false);
});

test("non si torna indietro da completata", () => {
  assert.equal(puoiPassare(STATI.COMPLETATA, STATI.IN_CORSO), false);
  assert.equal(puoiPassare(STATI.COMPLETATA, STATI.PAGATA), false);
  assert.equal(puoiPassare(STATI.COMPLETATA, STATI.ANNULLATA), false);
  // Si puo' solo contestare: il bonifico e' gia' partito.
  assert.ok(puoiPassare(STATI.COMPLETATA, STATI.CONTESTATA));
});

test("un annullato resta annullato", () => {
  for (const s of Object.values(STATI)) {
    assert.equal(puoiPassare(STATI.ANNULLATA, s), false, `annullata non deve andare a ${s}`);
  }
});

test("il preventivo si puo' correggere finche' nessuno l'ha accettato", () => {
  assert.ok(puoiPassare(STATI.PREVENTIVO, STATI.PREVENTIVO));
  // Ma non dopo che il cliente ha detto si': li' si annulla e si rifa'.
  assert.equal(puoiPassare(STATI.PAGATA, STATI.PREVENTIVO), false);
});

test("se il pagamento fallisce si torna al preventivo, non in un limbo", () => {
  assert.ok(puoiPassare(STATI.PREVENTIVO_ACCETTATO, STATI.PREVENTIVO));
});

test("si puo' annullare finche' il lavoro non e' finito", () => {
  for (const s of [STATI.NUOVA, STATI.INVIATA, STATI.ACCETTATA, STATI.PREVENTIVO,
                   STATI.PREVENTIVO_ACCETTATO, STATI.PAGATA, STATI.IN_CORSO]) {
    assert.ok(puoiPassare(s, STATI.ANNULLATA), `da ${s} si deve poter annullare`);
  }
});

test("gli stati con i soldi gia' incassati sono quelli giusti", () => {
  assert.deepEqual(CON_SOLDI_INCASSATI, [STATI.PAGATA, STATI.IN_CORSO, STATI.COMPLETATA, STATI.CONTESTATA]);
  // Prima del pagamento non c'e' niente da rimborsare ne' da trasferire.
  assert.ok(!CON_SOLDI_INCASSATI.includes(STATI.PREVENTIVO_ACCETTATO));
});

test("gli stati inventati non passano", () => {
  assert.equal(statoValido("COMPLETED"), false);
  assert.equal(statoValido("pagato"), false);   // il nostro e' "pagata"
  assert.equal(puoiPassare("pagata", "finita"), false);
});

test("verificaPassaggio spiega perche' ha detto di no", () => {
  const no = verificaPassaggio(STATI.ACCETTATA, STATI.COMPLETATA);
  assert.equal(no.ok, false);
  assert.match(no.perche, /accettata/);
  assert.match(no.perche, /completata/);
  assert.ok(verificaPassaggio(STATI.ACCETTATA, STATI.PREVENTIVO).ok);
});
