// scripts/traduzioni-incrementali.mjs
// Quali frasi vanno ritradotte, e come rimontare il file dopo.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' ESISTE                                                           │
// │                                                                           │
// │  Il 25/09/2026 sono cambiate cinque frasi della sezione tecnici, e per    │
// │  sistemarle lo script ha ritradotto tutte le 503 frasi in sei lingue:     │
// │  circa 300 mila token. Quasi meta' erano le istruzioni, rimandate uguali  │
// │  in ognuna delle 33 richieste per lingua.                                 │
// │                                                                           │
// │  Da qui si capisce quali frasi sono davvero cambiate: si ricorda          │
// │  un'impronta di ogni frase italiana cosi' com'era quando la lingua e'     │
// │  stata tradotta, e si ritraduce solo cio' la cui impronta non torna. Le   │
// │  cinque frasi diventano una richiesta per lingua.                         │
// └───────────────────────────────────────────────────────────────────────────┘
//
// Qui dentro niente rete e niente file: solo funzioni, provate in
// test/traduci.test.mjs.

import { createHash } from "node:crypto";

// ─── L'unita' di traduzione ─────────────────────────────────────────────────
// Una frase singola, oppure un elenco intero. Gli elenchi non si spezzano:
// il controllo che decide se il file si scrive vuole la stessa lunghezza
// dell'italiano, e un elenco che ha perso o guadagnato una voce va rifatto
// tutto. Ritradurne solo un pezzo lascerebbe le voci fuori posto.

/** Le unita' di un oggetto di testi, nell'ordine in cui compaiono. */
export function unita(oggetto, percorso = []) {
  if (Array.isArray(oggetto) || !oggetto || typeof oggetto !== "object") {
    return [{ percorso, valore: oggetto }];
  }
  return Object.entries(oggetto).flatMap(([k, v]) => unita(v, [...percorso, k]));
}

export const chiaveDi = (percorso) => percorso.join(".");

/** L'impronta di una frase (o di un elenco): cambia se cambia anche una virgola. */
export function impronta(valore) {
  return createHash("sha1").update(JSON.stringify(valore)).digest("hex").slice(0, 12);
}

/** Le impronte di tutto l'italiano: e' quello che si ricorda dopo una traduzione. */
export function impronte(originale) {
  return Object.fromEntries(unita(originale).map((u) => [chiaveDi(u.percorso), impronta(u.valore)]));
}

export function leggi(oggetto, percorso) {
  let nodo = oggetto;
  for (const c of percorso) {
    if (!nodo || typeof nodo !== "object" || !(c in nodo)) return undefined;
    nodo = nodo[c];
  }
  return nodo;
}

/**
 * Le unita' da ritradurre per una lingua.
 *
 * @param originale  testi/it.js di adesso
 * @param tradotto   il file della lingua cosi' com'e' (null se non esiste)
 * @param ricordate  le impronte dell'italiano al momento dell'ultima
 *                   traduzione di questa lingua (null se non si sanno)
 *
 * Senza impronte si puo' vedere solo cio' che MANCA, non cio' che e'
 * cambiato: per questo il chiamante lo segnala.
 */
export function daRifare(originale, tradotto, ricordate) {
  if (!tradotto) return unita(originale);
  return unita(originale).filter((u) => {
    const attuale = leggi(tradotto, u.percorso);
    if (attuale === undefined) return true;
    if (Array.isArray(u.valore)) {
      if (!Array.isArray(attuale) || attuale.length !== u.valore.length) return true;
    }
    if (ricordate && ricordate[chiaveDi(u.percorso)] !== impronta(u.valore)) return true;
    return false;
  });
}

/** Un oggetto che contiene solo le unita' indicate, nella forma dell'originale. */
export function parziale(elenco) {
  const fuori = {};
  for (const { percorso, valore } of elenco) {
    let nodo = fuori;
    percorso.slice(0, -1).forEach((c) => {
      if (!nodo[c] || typeof nodo[c] !== "object") nodo[c] = {};
      nodo = nodo[c];
    });
    nodo[percorso[percorso.length - 1]] = valore;
  }
  return fuori;
}

/**
 * Il file nuovo: si cammina sull'italiano, e per ogni unita' si prende la
 * traduzione nuova se c'e', altrimenti quella di prima.
 *
 * Camminare sull'italiano e non sul file vecchio fa due cose da sola: tiene
 * l'ordine delle voci identico all'originale, e lascia fuori le frasi che
 * nell'italiano non esistono piu'.
 */
export function componi(originale, vecchio, nuovo) {
  const prendi = (percorso) => {
    const n = leggi(nuovo, percorso);
    return n !== undefined ? n : leggi(vecchio, percorso);
  };
  const giro = (nodo, percorso) => {
    if (Array.isArray(nodo) || !nodo || typeof nodo !== "object") return prendi(percorso);
    return Object.fromEntries(Object.entries(nodo).map(([k, v]) => [k, giro(v, [...percorso, k])]));
  };
  return giro(originale, []);
}
