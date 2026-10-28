// lib/verifica-apple.js
// Chiedere ad Apple se un acquisto fatto sull'iPhone esiste davvero.
//
// SOLO SERVER: usa node:crypto. Nelle pagine si importa lib/pagamento-apple.js.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  IL TELEFONO NON VIENE CREDUTO                                            │
// │                                                                           │
// │  Dall'app arriva solo un numero: l'identificativo della transazione. Che  │
// │  sia un pagamento vero, di quale prodotto, per quale app, e se nel        │
// │  frattempo e' stato rimborsato, lo dice Apple — interrogata qui dal       │
// │  server, con una chiave che il telefono non vede mai.                     │
// │                                                                           │
// │  E' lo stesso principio di Stripe: verifica-pagamento.js non crede alla   │
// │  pagina che dice "ho pagato", chiede a Stripe.                            │
// │                                                                           │
// │  Perche' basta fidarsi della risposta senza verificare la firma del       │
// │  documento firmato che Apple restituisce: arriva da                       │
// │  api.storekit.itunes.apple.com su HTTPS, in risposta a una richiesta      │
// │  autenticata con la nostra chiave. Nessuno in mezzo puo' averlo scritto.  │
// └───────────────────────────────────────────────────────────────────────────┘

import { createPrivateKey, sign } from "node:crypto";
import { BUNDLE_ID, PRODOTTO_DIAGNOSI } from "./pagamento-apple.js";

const SERVER = {
  Production: "https://api.storekit.itunes.apple.com",
  Sandbox: "https://api.storekit-sandbox.itunes.apple.com",
};

const base64url = (dati) => Buffer.from(dati).toString("base64url");

/**
 * Le tre credenziali della chiave "Acquisti in-app" di App Store Connect, o
 * null se ne manca una. La chiave privata e' il contenuto del file .p8.
 */
export function credenzialiDaAmbiente(env = process.env) {
  const idChiave = env.APPLE_IAP_KEY_ID;
  const emittente = env.APPLE_IAP_ISSUER_ID;
  const chiavePrivata = env.APPLE_IAP_PRIVATE_KEY;
  if (!idChiave || !emittente || !chiavePrivata) return null;
  // Incollata in Vercel, una chiave su piu' righe a volte arriva con i "\n"
  // scritti come testo. Senza questa riga la firma fallisce con un errore che
  // non dice niente di utile.
  return { idChiave, emittente, chiavePrivata: chiavePrivata.replace(/\\n/g, "\n") };
}

/**
 * Il lasciapassare per le API di Apple: un JWT firmato ES256, valido cinque
 * minuti. Scritto a mano con node:crypto invece che con una libreria: sono
 * dieci righe, e il progetto non aggiunge dipendenze.
 */
export function jwtAppStore({ idChiave, emittente, chiavePrivata }, adesso = Date.now()) {
  const iat = Math.floor(adesso / 1000);
  const intestazione = { alg: "ES256", kid: idChiave, typ: "JWT" };
  const contenuto = { iss: emittente, iat, exp: iat + 300, aud: "appstoreconnect-v1", bid: BUNDLE_ID };
  const daFirmare = `${base64url(JSON.stringify(intestazione))}.${base64url(JSON.stringify(contenuto))}`;
  // Le due cose che possono andare storte con la chiave sono molto diverse —
  // incollata male in Vercel, oppure valida ma non riconosciuta da Apple — e
  // dal di fuori si vedono uguali: "App Store non risponde". Il messaggio qui
  // le separa, cosi' il registro di Vercel dice subito quale delle due.
  let chiave;
  try {
    chiave = createPrivateKey(chiavePrivata);
  } catch (e) {
    throw new Error(
      `APPLE_IAP_PRIVATE_KEY illeggibile (va incollato tutto il file .p8, righe BEGIN ed END comprese): ${e.message}`
    );
  }
  // ieee-p1363: la firma come la vuole JWT (r e s affiancati). Il formato
  // predefinito di Node e' DER, e Apple lo rifiuterebbe con un 401.
  const firma = sign("sha256", Buffer.from(daFirmare), { key: chiave, dsaEncoding: "ieee-p1363" });
  return `${daFirmare}.${base64url(firma)}`;
}

/** Il contenuto di un documento firmato da Apple (JWS), senza la firma. */
export function decodificaJWS(jws) {
  const pezzi = String(jws || "").split(".");
  if (pezzi.length !== 3) throw new Error("Documento Apple non leggibile");
  return JSON.parse(Buffer.from(pezzi[1], "base64url").toString("utf8"));
}

/**
 * Chiede ad Apple la transazione. Prima all'ambiente vero, poi a quello di
 * prova: e' l'ordine che Apple raccomanda, perche' anche la versione
 * pubblicata riceve acquisti di prova — sono quelli fatti dai revisori.
 *
 * Torna il contenuto della transazione, oppure null se Apple non la conosce
 * in nessuno dei due ambienti.
 */
export async function chiediTransazione(transactionId, { credenziali, chiama = fetch, adesso } = {}) {
  const lasciapassare = jwtAppStore(credenziali, adesso);
  for (const ambiente of ["Production", "Sandbox"]) {
    const risposta = await chiama(`${SERVER[ambiente]}/inApps/v1/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${lasciapassare}` },
    });
    if (risposta.status === 404) continue; // non esiste qui: si prova l'altro
    if (risposta.status === 401) {
      // La chiave e' leggibile e la firma e' partita, ma Apple non riconosce
      // la combinazione: di solito ID chiave o ID emittente sbagliati, o
      // scambiati fra loro.
      throw new Error(
        `App Store ha rifiutato le credenziali (401, ${ambiente}): controllare APPLE_IAP_KEY_ID (10 caratteri) e APPLE_IAP_ISSUER_ID (quello lungo con i trattini)`
      );
    }
    if (!risposta.ok) throw new Error(`App Store ha risposto ${risposta.status} (${ambiente})`);
    const { signedTransactionInfo } = await risposta.json();
    return decodificaJWS(signedTransactionInfo);
  }
  return null;
}

/**
 * Le regole perche' un acquisto apra una diagnosi. Ognuna chiude una strada:
 * l'identificativo di un acquisto fatto in un'altra app, di un altro
 * prodotto, o rimborsato da Apple dopo che l'app l'aveva visto passare.
 */
export function controllaTransazione(t, transactionIdChiesto) {
  if (!t) return { ok: false, motivo: "Apple non conosce questa transazione" };
  if (String(t.transactionId) !== String(transactionIdChiesto)) {
    return { ok: false, motivo: "Apple ha risposto con un'altra transazione" };
  }
  if (t.bundleId !== BUNDLE_ID) return { ok: false, motivo: `acquisto di un'altra app (${t.bundleId})` };
  if (t.productId !== PRODOTTO_DIAGNOSI) return { ok: false, motivo: `prodotto sbagliato (${t.productId})` };
  if (t.type !== "Consumable") return { ok: false, motivo: `tipo di acquisto inatteso (${t.type})` };
  if (t.revocationDate) return { ok: false, motivo: "acquisto rimborsato o revocato da Apple" };
  if (!(t.environment in SERVER)) return { ok: false, motivo: `ambiente sconosciuto (${t.environment})` };
  return { ok: true };
}
