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
 * Le parole per una lingua. Se manca, si ripiega sull'italiano invece di
 * rompere la pagina: meglio una schermata nella lingua sbagliata che una
 * schermata bianca — ed e' esattamente quello che succederebbe se qualcuno
 * aggiungesse una lingua a lib/lingue.js senza generarne i testi.
 */
export function testiPer(lingua) {
  return TESTI[lingua] || TESTI[PREDEFINITA];
}

/** Le lingue per cui i testi esistono davvero. */
export function lingueTradotte() {
  return Object.keys(TESTI);
}
