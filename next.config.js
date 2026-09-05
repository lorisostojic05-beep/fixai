const { reindirizzamentiVecchiIndirizzi } = require("./lib/guide");

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
  async redirects() {
    return reindirizzamentiVecchiIndirizzi();
  },
};
