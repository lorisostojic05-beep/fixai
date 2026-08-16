// lib/versione-app.js
// Si accorge se l'app installata è più vecchia del sito.
//
// Fixi è un guscio nativo che carica il sito: le modifiche web arrivano subito
// a tutti, quelle native solo a chi aggiorna dal Play Store. E il Play Store non
// avvisa: bisogna andarci e accorgersi che c'è il pulsante "Aggiorna".
//
// Risultato: uno prova i tasti del volume, non succede niente, e conclude che
// l'app è rotta. Meglio dirglielo.
//
// Il controllo non richiede codice nativo — Capacitor.isPluginAvailable()
// risponde già oggi anche sulle versioni vecchie — quindi l'avviso funziona
// senza dover pubblicare prima l'ennesima release, che sarebbe un cane che si
// morde la coda.

export const PACCHETTO = "casa.fixi.app";
export const LINK_PLAY_STORE = `https://play.google.com/store/apps/details?id=${PACCHETTO}`;

// Plugin nativi e la funzione che l'utente perde se mancano. Aggiungendo un
// plugin nuovo va aggiunto anche qui, se no il suo mancare resta silenzioso.
const FUNZIONI_NATIVE = [
  { plugin: "SalvaFile", da: "1.5", descrizione: "salvare il referto nei Download" },
  { plugin: "TastiVolume", da: "1.6", descrizione: "analizzare con i tasti del volume" },
];

export function dentroApp() {
  return typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.() === true;
}

/**
 * Funzioni native che questa versione dell'app non ha.
 * Vuoto sul sito (dove il concetto non ha senso) e sull'app aggiornata.
 */
export function funzioniNativeMancanti() {
  if (!dentroApp()) return [];
  const disponibile = window.Capacitor?.isPluginAvailable;
  // Capacitor troppo vecchio per rispondere: meglio tacere che dare un falso
  // allarme a chi ha già l'app giusta.
  if (typeof disponibile !== "function") return [];
  return FUNZIONI_NATIVE.filter((f) => !window.Capacitor.isPluginAvailable(f.plugin));
}

/** Frase pronta da mostrare, o null se non c'è niente da dire. */
export function avvisoAggiornamento(mancanti = funzioniNativeMancanti()) {
  if (!mancanti.length) return null;
  const elenco = mancanti.map((f) => f.descrizione);
  const testo =
    elenco.length === 1
      ? elenco[0]
      : `${elenco.slice(0, -1).join(", ")} e ${elenco[elenco.length - 1]}`;
  return `Aggiorna Fixi dal Play Store per ${testo}.`;
}
