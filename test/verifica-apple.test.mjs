// test/verifica-apple.test.mjs
// Che un acquisto App Store apra una diagnosi solo se Apple lo conferma.
//
// Apple qui e' finta: si genera una chiave nostra, e le risposte del server
// sono scritte a mano. Si prova quello che decidiamo noi — la firma della
// richiesta, l'ordine dei due ambienti, le regole — non Apple.

import test from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, verify } from "node:crypto";
import {
  jwtAppStore,
  decodificaJWS,
  chiediTransazione,
  controllaTransazione,
  credenzialiDaAmbiente,
} from "../lib/verifica-apple.js";
import {
  idPagamentoApple,
  ePagamentoApple,
  ePagamentoDiProva,
  PRODOTTO_DIAGNOSI,
  BUNDLE_ID,
} from "../lib/pagamento-apple.js";

// Una chiave dello stesso tipo di quella che si scarica da App Store Connect
const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const CREDENZIALI = {
  idChiave: "ABC123DEFG",
  emittente: "57246542-96fe-1a63-e053-0824d011072a",
  chiavePrivata: privateKey.export({ type: "pkcs8", format: "pem" }),
};

// Un documento firmato "da Apple": per il contenuto basta la parte centrale
const firmato = (contenuto) =>
  `${Buffer.from('{"alg":"ES256"}').toString("base64url")}.${Buffer.from(JSON.stringify(contenuto)).toString(
    "base64url"
  )}.firma`;

const TRANSAZIONE = {
  transactionId: "2000000123456789",
  bundleId: BUNDLE_ID,
  productId: PRODOTTO_DIAGNOSI,
  type: "Consumable",
  environment: "Production",
  price: 9900,
  currency: "EUR",
};

// Un server Apple finto: per ogni ambiente, cosa risponde. Registra le chiamate.
function appleFinta(perAmbiente) {
  const chiamate = [];
  const chiama = async (url, opzioni) => {
    chiamate.push({ url, opzioni });
    const ambiente = url.includes("sandbox") ? "Sandbox" : "Production";
    const r = perAmbiente[ambiente] || { status: 404 };
    return {
      status: r.status,
      ok: r.status >= 200 && r.status < 300,
      json: async () => r.corpo,
    };
  };
  return { chiama, chiamate };
}

// ─── Il lasciapassare ──────────────────────────────────────────────────────

test("il JWT ha quello che Apple chiede, ed e' firmato con la nostra chiave", () => {
  const adesso = Date.UTC(2026, 9, 27, 12, 0, 0);
  const jwt = jwtAppStore(CREDENZIALI, adesso);
  const [testa, corpo, firma] = jwt.split(".");

  const h = JSON.parse(Buffer.from(testa, "base64url"));
  const c = JSON.parse(Buffer.from(corpo, "base64url"));
  assert.deepEqual(h, { alg: "ES256", kid: "ABC123DEFG", typ: "JWT" });
  assert.equal(c.iss, CREDENZIALI.emittente);
  assert.equal(c.aud, "appstoreconnect-v1");
  assert.equal(c.bid, "casa.fixi.app");
  assert.equal(c.exp - c.iat, 300); // cinque minuti: Apple rifiuta oltre l'ora

  // La firma deve tornare con la chiave pubblica, nel formato di JWT
  const valida = verify("sha256", Buffer.from(`${testa}.${corpo}`), { key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(firma, "base64url"));
  assert.equal(valida, true);
});

test("le credenziali: tutte e tre o niente, e i \\n scritti come testo diventano a capo", () => {
  assert.equal(credenzialiDaAmbiente({}), null);
  assert.equal(credenzialiDaAmbiente({ APPLE_IAP_KEY_ID: "x", APPLE_IAP_ISSUER_ID: "y" }), null);
  const c = credenzialiDaAmbiente({
    APPLE_IAP_KEY_ID: "x",
    APPLE_IAP_ISSUER_ID: "y",
    APPLE_IAP_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----",
  });
  assert.equal(c.chiavePrivata, "-----BEGIN PRIVATE KEY-----\nABC\n-----END PRIVATE KEY-----");
});

// ─── La domanda ad Apple ───────────────────────────────────────────────────

test("acquisto vero: risponde l'ambiente vero, e quello di prova non si chiama", async () => {
  const a = appleFinta({ Production: { status: 200, corpo: { signedTransactionInfo: firmato(TRANSAZIONE) } } });
  const t = await chiediTransazione("2000000123456789", { credenziali: CREDENZIALI, chiama: a.chiama });
  assert.equal(t.transactionId, "2000000123456789");
  assert.equal(a.chiamate.length, 1);
  assert.match(a.chiamate[0].url, /^https:\/\/api\.storekit\.itunes\.apple\.com\/inApps\/v1\/transactions\/2000000123456789$/);
  assert.match(a.chiamate[0].opzioni.headers.Authorization, /^Bearer ey/);
});

test("ACQUISTO DEI REVISORI: non c'e' fra i veri, si trova fra quelli di prova", async () => {
  const diProva = { ...TRANSAZIONE, environment: "Sandbox" };
  const a = appleFinta({
    Production: { status: 404 },
    Sandbox: { status: 200, corpo: { signedTransactionInfo: firmato(diProva) } },
  });
  const t = await chiediTransazione("2000000123456789", { credenziali: CREDENZIALI, chiama: a.chiama });
  assert.equal(t.environment, "Sandbox");
  assert.equal(a.chiamate.length, 2);
});

test("una transazione che Apple non conosce torna null", async () => {
  const a = appleFinta({});
  assert.equal(await chiediTransazione("1", { credenziali: CREDENZIALI, chiama: a.chiama }), null);
});

test("se Apple risponde con un errore vero, non si finge che la transazione non esista", async () => {
  // Un 401 (chiave sbagliata) o un 500 non sono "acquisto inesistente": se
  // diventassero null, il cliente si sentirebbe dire che non ha pagato.
  const a = appleFinta({ Production: { status: 401 } });
  await assert.rejects(() => chiediTransazione("1", { credenziali: CREDENZIALI, chiama: a.chiama }), /401/);
});

// ─── Le regole ─────────────────────────────────────────────────────────────

test("l'acquisto giusto passa", () => {
  assert.deepEqual(controllaTransazione(TRANSAZIONE, "2000000123456789"), { ok: true });
});

test("non passa: un'altra app, un altro prodotto, un rimborso, un altro numero", () => {
  const casi = [
    [{ ...TRANSAZIONE, bundleId: "com.altra.app" }, /altra app/],
    [{ ...TRANSAZIONE, productId: "casa.fixi.app.altro" }, /prodotto/],
    [{ ...TRANSAZIONE, type: "Auto-Renewable Subscription" }, /tipo/],
    [{ ...TRANSAZIONE, revocationDate: 1761000000000 }, /rimborsato/],
    [{ ...TRANSAZIONE, environment: "Xcode" }, /ambiente/],
  ];
  for (const [t, motivo] of casi) {
    const esito = controllaTransazione(t, "2000000123456789");
    assert.equal(esito.ok, false);
    assert.match(esito.motivo, motivo);
  }
  assert.equal(controllaTransazione(TRANSAZIONE, "999").ok, false);
  assert.equal(controllaTransazione(null, "1").ok, false);
});

// ─── I nomi dei pagamenti ──────────────────────────────────────────────────

test("un acquisto vero e uno di prova hanno nomi diversi, e nessuno somiglia a Stripe", () => {
  const vero = idPagamentoApple(TRANSAZIONE);
  const prova = idPagamentoApple({ ...TRANSAZIONE, environment: "Sandbox" });
  assert.equal(vero, "apple:2000000123456789");
  assert.equal(prova, "apple-sandbox:2000000123456789");

  assert.equal(ePagamentoApple(vero), true);
  assert.equal(ePagamentoApple(prova), true);
  assert.equal(ePagamentoApple("cs_test_b1nXg72GPrXJOp7JF1uKOQDB"), false);
  assert.equal(ePagamentoApple("apple:12; drop table"), false);
  assert.equal(ePagamentoApple(null), false);

  assert.equal(ePagamentoDiProva(prova), true);
  assert.equal(ePagamentoDiProva(vero), false);
});

test("il documento di Apple si legge, e uno rovinato non passa in silenzio", () => {
  assert.deepEqual(decodificaJWS(firmato({ a: 1 })), { a: 1 });
  assert.throws(() => decodificaJWS("non-e-un-jws"), /non leggibile/);
});
