const { reindirizzamentiVecchiIndirizzi } = require("./lib/guide");
const { LINGUE, PREDEFINITA } = require("./lib/lingue");

// Le guide sono nate piatte — /guida/lavatrice-non-centrifuga — e il
// 03/09/2026 quegli indirizzi sono finiti nella sitemap mandata a Google.
// Due giorni dopo sono passate a due livelli, /guida/lavatrice/non-centrifuga,
// perche' con dieci pagine sulla sola lavatrice l'elenco piatto non si
// reggeva piu'.
//
// Cambiare indirizzo senza dirlo significa lasciare a Google (e a chiunque
// abbia salvato un link) delle pagine che rispondono 404. Il
// reindirizzamento permanente evita il buco e passa alla pagina nuova il
// valore gia' accumulato dalla vecchia.
//
// L'elenco si genera dai dati, non e' scritto a mano: aggiungere una guida
// non richiede di ricordarsi di aggiungere una riga qui.
module.exports = {
  // Un indirizzo per lingua: /guida/lavatrice resta italiano, /es/guida/...
  // e' spagnolo. Servono indirizzi veri e distinti perche' Google possa
  // scaricarli e indicizzarli come pagine separate — e' tutto il senso di
  // tradurre le guide. Con la traduzione automatica del browser, Google
  // continuerebbe a vedere solo le 81 pagine italiane.
  i18n: {
    locales: LINGUE.map((l) => l.codice),
    defaultLocale: PREDEFINITA,

    // ┌───────────────────────────────────────────────────────────────────────┐
    // │  NON METTERE MAI QUESTO A true.                                       │
    // └───────────────────────────────────────────────────────────────────────┘
    // Acceso, Next.js legge l'intestazione Accept-Language e rimanda ognuno
    // alla "sua" versione. Sembra un servizio, ed e' una trappola: Googlebot
    // scansiona dagli Stati Uniti dichiarando inglese, quindi verrebbe
    // spedito su /en ogni volta che chiede una pagina italiana. Le 81 pagine
    // che oggi si posizionano sparirebbero dall'indice.
    //
    // Il rilevamento automatico esiste lo stesso, ma sta in
    // components/SceltaLingua.jsx e si accende SOLO dentro l'app, dove
    // Googlebot non entra e non c'e' niente da indicizzare.
    localeDetection: false,
  },

  async redirects() {
    return reindirizzamentiVecchiIndirizzi();
  },
};
