// test/versione-app.test.mjs
// Che l'avviso "aggiorna dal Play Store" arrivi solo a chi ha Android.
//
// Su iPhone i plugin SalvaFile e TastiVolume non ci sono per scelta, e il
// controllo li contava come "mancanti": avrebbe detto a ogni utente iPhone
// di aggiornare un'app dal Play Store. Trovato preparando il progetto iOS.

import test from "node:test";
import assert from "node:assert/strict";
import {
  avvisoAggiornamento,
  funzioniNativeMancanti,
  piattaforma,
  VERSIONE_PUBBLICATA,
} from "../lib/versione-app.js";
import { svuotaCachePlugin } from "../lib/plugin-nativo.js";

// Un telefono finto: quale sistema, e quali plugin nativi ha.
function telefono(sistema, plugin = []) {
  svuotaCachePlugin();
  globalThis.window = {
    Capacitor: {
      isNativePlatform: () => sistema !== "web",
      getPlatform: () => sistema,
      isPluginAvailable: (nome) => plugin.includes(nome),
    },
  };
}

test.afterEach(() => {
  delete globalThis.window;
});

test("riconosce il sistema", () => {
  telefono("ios");
  assert.equal(piattaforma(), "ios");
  telefono("android");
  assert.equal(piattaforma(), "android");
  delete globalThis.window;
  assert.equal(piattaforma(), "web");
});

test("IPHONE: nessun avviso, anche senza nessun plugin di Android", async () => {
  telefono("ios", []);
  assert.deepEqual(funzioniNativeMancanti(), []);
  assert.equal(await avvisoAggiornamento(async () => ({ codice: 1 })), null);
});

test("iPhone: nessun avviso nemmeno se qualcuno chiede la versione", async () => {
  // Anche con una risposta che su Android vorrebbe dire "app vecchia"
  telefono("ios", ["VersioneApp"]);
  assert.equal(await avvisoAggiornamento(async () => ({ codice: 1 })), null);
});

test("Android vecchio: l'avviso c'e' ancora", async () => {
  telefono("android", ["VersioneApp", "SalvaFile", "TastiVolume"]);
  const avviso = await avvisoAggiornamento(async () => ({ codice: VERSIONE_PUBBLICATA - 1 }));
  assert.ok(avviso, "su Android un'app vecchia deve ricevere l'avviso");
});

test("Android aggiornato: nessun avviso", async () => {
  telefono("android", ["VersioneApp", "SalvaFile", "TastiVolume"]);
  assert.equal(await avvisoAggiornamento(async () => ({ codice: VERSIONE_PUBBLICATA })), null);
});

test("Android senza i plugin nuovi: dice quali funzioni mancano", async () => {
  telefono("android", []);
  const mancanti = funzioniNativeMancanti().map((f) => f.plugin);
  assert.deepEqual(mancanti, ["SalvaFile", "TastiVolume"]);
  assert.match(await avvisoAggiornamento(), /Play Store/);
});

test("nel browser nessun avviso", async () => {
  telefono("web");
  assert.equal(await avvisoAggiornamento(), null);
});
