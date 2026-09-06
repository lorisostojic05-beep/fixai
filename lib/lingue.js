// lib/lingue.js
// Quali lingue parla Fixi, e come si decide quale mostrare.
//
// Il tetto non lo decide questo file: sta in pages/api/diagnosi.js, dove il
// prompt elenca le lingue in cui l'AI sa condurre una diagnosi. Tradurre
// l'interfaccia in una lingua che non e' in quell'elenco vorrebbe dire vendere
// i pulsanti in lettone e poi far rispondere l'esperto in inglese: chi paga
// 9,90€ scoprirebbe la differenza dopo aver pagato.
//
// Quindi: se un giorno il prompt impara una lingua nuova, si aggiunge QUI.
// Mai il contrario.
//
// L'arabo e' nell'elenco del prompt ma non e' qui: si scrive da destra a
// sinistra e ribalta tutta l'impaginazione — menu, frecce, allineamenti,
// margini. E' un lavoro suo, non una traduzione, e va fatto quando serve
// davvero.

export const LINGUE = [
  { codice: "it", nome: "Italiano", bandiera: "🇮🇹" },
  { codice: "en", nome: "English", bandiera: "🇬🇧" },
  { codice: "es", nome: "Español", bandiera: "🇪🇸" },
  { codice: "fr", nome: "Français", bandiera: "🇫🇷" },
  { codice: "de", nome: "Deutsch", bandiera: "🇩🇪" },
  { codice: "pt", nome: "Português", bandiera: "🇵🇹" },
  { codice: "ro", nome: "Română", bandiera: "🇷🇴" },
];

// La lingua degli indirizzi senza prefisso: fixiai.it/guida resta italiano.
// Non e' una preferenza estetica — e' l'indirizzo che Google ha gia' indicizzato
// per 81 pagine. Cambiarlo butterebbe via il lavoro di settembre.
export const PREDEFINITA = "it";

// Dove finisce chi ha il telefono in una lingua che non abbiamo: in inglese,
// la stessa scelta che fa il prompt dell'AI ("Se l'utente scrive in una lingua
// non supportata, rispondi in inglese"). Cosi' i pulsanti e l'esperto parlano
// almeno la stessa lingua fra loro.
export const RIPIEGO = "en";

export const CHIAVE_LINGUA = "Fixi_lingua";

// ┌───────────────────────────────────────────────────────────────────────────┐
// │  L'INTERRUTTORE DELLE GUIDE                                               │
// └───────────────────────────────────────────────────────────────────────────┘
// L'interfaccia e' tradotta in sette lingue, le 70 guide no: sono ~39.000
// parole a lingua e vanno accese una alla volta, non tutte insieme. Google
// tratta come sospetto un sito che pubblica 1.610 pagine tradotte a macchina
// in un giorno, e il rischio non e' che le nuove non si posizionino: e' che ne
// paghino anche le 81 italiane che oggi funzionano.
//
// Finche' una lingua non e' in questo elenco, per lei le guide non esistono:
// il collegamento sparisce dal menu e /es/guida risponde 404. Meglio una
// sezione assente che una sezione che porta a pagine vuote.
//
// Quando le guide spagnole saranno pronte, si aggiunge "es" QUI e si accende
// tutto insieme — menu, indirizzi, mappa del sito.
export const LINGUE_CON_GUIDE = ["it"];

export function guideDisponibiliIn(lingua) {
  return LINGUE_CON_GUIDE.includes(lingua);
}

const CODICI = LINGUE.map((l) => l.codice);

export function linguaValida(codice) {
  return typeof codice === "string" && CODICI.includes(codice);
}

export function dettagliLingua(codice) {
  return LINGUE.find((l) => l.codice === codice) || null;
}

/**
 * Da quello che dichiara il telefono ("es-ES", "pt-BR", "lv") alla nostra
 * lingua, o null se non l'abbiamo.
 *
 * Si guarda solo la parte prima del trattino: a un messicano e a uno spagnolo
 * mostriamo lo stesso spagnolo. Distinguere le varianti raddoppierebbe i file
 * di traduzione per differenze che su un pulsante "Avvia diagnosi" non
 * esistono.
 *
 * Torna null e non RIPIEGO di proposito: "non ce l'ho" e "usa l'inglese" sono
 * due informazioni diverse, e chi chiama deve poter decidere. Sul sito, per
 * esempio, non si ripiega affatto — vedi il commento in components/SceltaLingua.
 */
export function linguaDelTelefono(dichiarata) {
  if (typeof dichiarata !== "string") return null;
  const base = dichiarata.trim().toLowerCase().split(/[-_]/)[0];
  return linguaValida(base) ? base : null;
}

const magazzino = () => (typeof localStorage === "undefined" ? null : localStorage);

/** La lingua scelta a mano, o null se non ne ha mai scelta una. */
export function linguaRicordata() {
  const m = magazzino();
  if (!m) return null;
  try {
    const c = m.getItem(CHIAVE_LINGUA);
    return linguaValida(c) ? c : null;
  } catch {
    // Modalita' privata o spazio esaurito: si ripiega sul rilevamento
    // automatico. Peggio la scelta dimenticata, non l'app rotta.
    return null;
  }
}

export function ricordaLingua(codice) {
  const m = magazzino();
  if (!m || !linguaValida(codice)) return false;
  try {
    m.setItem(CHIAVE_LINGUA, codice);
    return true;
  } catch {
    return false;
  }
}

/**
 * La lingua da mostrare all'apertura, o null per "lascia com'e'".
 *
 * L'ordine conta: prima quello che l'utente ha scelto a mano, poi il telefono.
 * Una scelta esplicita non va mai scavalcata dal rilevamento automatico —
 * altrimenti il romeno che vive in Italia si ritrova l'app in italiano a ogni
 * apertura, e il tasto della lingua sembra rotto.
 */
export function linguaDaMostrare({ ricordata, telefono }) {
  if (linguaValida(ricordata)) return ricordata;
  const rilevata = linguaDelTelefono(telefono);
  if (rilevata) return rilevata;
  return RIPIEGO;
}
