// lib/testi.js
// Sceglie il file di parole giusto per la lingua della pagina.
//
// ── Perche' si usa da getStaticProps e non dentro il componente ─────────────
// Se una pagina importasse questo file per usarlo mentre disegna, il browser
// si scaricherebbe TUTTE e sette le lingue per mostrarne una: oggi sono 60 KB
// invece di 8, e cresceranno insieme alle pagine tradotte.
//
// Usandolo solo dentro getStaticProps, Next.js si accorge che serve soltanto
// al server e lo toglie da quello che manda al browser. La pagina riceve le
// parole gia' scelte, come una proprieta' qualsiasi:
//
//   export async function getStaticProps({ locale }) {
//     return { props: { testi: testiPer(locale) } };
//   }
//
// ── Aggiungere una lingua ───────────────────────────────────────────────────
// Sono due righe qui (l'import e la voce in TESTI), dopo aver lanciato
// scripts/traduci.mjs. Non si puo' evitare: gli import vanno scritti per
// nome, altrimenti chi mette insieme il sito non sa quali file includere.

import it from "../testi/it";
import en from "../testi/en";
import es from "../testi/es";
import fr from "../testi/fr";
import de from "../testi/de";
import pt from "../testi/pt";
import ro from "../testi/ro";

import { PREDEFINITA } from "./lingue";

const TESTI = { it, en, es, fr, de, pt, ro };

/**
 * Le parole per una lingua, completate con l'italiano dove mancano.
 *
 * Serve per il caso piu' probabile di tutti: si aggiunge una frase a
 * testi/it.js e ci si dimentica di rilanciare scripts/traduci.mjs. Senza
 * questa rete la pagina spagnola andrebbe in errore su una frase che non c'e'
 * — ed e' successo davvero il 06/09/2026, quando la sezione della diagnosi e'
 * nata in italiano e le altre sei lingue si sono fermate in fase di build.
 *
 * Il ripiego mostra la frase in italiano: brutto, ma leggibile e circoscritto
 * a quella riga. Il messaggio in console dice cosa lanciare per sistemarlo.
 */
export function testiPer(lingua) {
  const scelto = TESTI[lingua];
  if (!scelto) return TESTI[PREDEFINITA];
  if (lingua === PREDEFINITA) return scelto;
  return completa(scelto, TESTI[PREDEFINITA], lingua);
}

function completa(tradotto, originale, lingua, percorso = "") {
  if (Array.isArray(originale)) {
    return Array.isArray(tradotto) && tradotto.length === originale.length ? tradotto : originale;
  }
  if (originale && typeof originale === "object") {
    if (!tradotto || typeof tradotto !== "object") return originale;
    const unito = {};
    for (const chiave of Object.keys(originale)) {
      const dove = percorso ? `${percorso}.${chiave}` : chiave;
      if (!(chiave in tradotto)) {
        console.warn(
          `[testi] manca "${dove}" in ${lingua}: mostro l'italiano. ` +
            `Per sistemarlo: node scripts/traduci.mjs ${lingua}`
        );
        unito[chiave] = originale[chiave];
      } else {
        unito[chiave] = completa(tradotto[chiave], originale[chiave], lingua, dove);
      }
    }
    return unito;
  }
  return typeof tradotto === "string" && tradotto.trim() ? tradotto : originale;
}

/** Le lingue per cui i testi esistono davvero. */
export function lingueTradotte() {
  return Object.keys(TESTI);
}

// riempi() e grassetto() stavano qui, ma servono anche mentre la pagina si
// disegna nel browser — e prenderle da questo file ci trascinerebbe dietro
// tutte e sette le lingue. Sono in lib/frasi.js, che non importa niente.
export { riempi, grassetto } from "./frasi";
