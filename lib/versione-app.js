// lib/versione-app.js
// Si accorge se l'app installata è più vecchia di quella pubblicata.
//
// Fixi è un guscio nativo che carica il sito: le modifiche web arrivano subito
// a tutti, quelle native solo a chi aggiorna dal Play Store. E il Play Store non
// avvisa: bisogna andarci e accorgersi che c'è il pulsante "Aggiorna".
//
// Risultato: uno prova i tasti del volume, non succede niente, e conclude che
// l'app è rotta. Meglio dirglielo.

export const PACCHETTO = "casa.fixi.app";
export const LINK_PLAY_STORE = `https://play.google.com/store/apps/details?id=${PACCHETTO}`;

// ┌───────────────────────────────────────────────────────────────────────────┐
// │  DA CAMBIARE A OGNI PUBBLICAZIONE                                         │
// │  Metti qui il versionCode dell'ultima versione DAVVERO disponibile sul    │
// │  Play Store — non quella che stai preparando. Se lo alzi prima, tutti si  │
// │  vedono chiedere un aggiornamento che non esiste ancora.                  │
// └───────────────────────────────────────────────────────────────────────────┘
export const VERSIONE_PUBBLICATA = 9;

// Dalla 11 il tasto indietro nativo torna indietro di UN passo per volta.
//
// La 10 invece calcolava di quanti passi tornare leggendo la cronologia
// della WebView — che però NON conta le tappe aggiunte da history.pushState.
// Il conto usciva giusto per la cronologia nativa e sbagliato per quella
// vera: chi aveva appena pagato finiva sulla cassa di Stripe. Verificato sul
// tablet il 05/09/2026 con il diario di bordo.
//
// Serve a decidere se la pagina può mettere la sua tappa di protezione: con
// la 10 installata la tappa peggiora le cose, dalla 11 le risolve.
export const VERSIONE_INDIETRO_A_PASSI = 11;

// Plugin nativi e la funzione che l'utente perde se mancano. Serve per le app
// anteriori alla 9, che non sanno dire la propria versione: lì l'unico modo di
// capire quanto sono vecchie è guardare cosa gli manca.
const FUNZIONI_NATIVE = [
  { plugin: "SalvaFile", descrizione: "salvare il referto nei Download" },
  { plugin: "TastiVolume", descrizione: "analizzare con i tasti del volume" },
];

export function dentroApp() {
  return typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.() === true;
}

function pluginC(nome) {
  const f = typeof window !== "undefined" && window.Capacitor?.isPluginAvailable;
  return typeof f === "function" ? window.Capacitor.isPluginAvailable(nome) : null;
}

/** true/false se si può sapere, null se non c'è modo di chiederlo. */
export function pluginDisponibile(nome) {
  return pluginC(nome);
}

export function funzioniNativeMancanti() {
  if (!dentroApp()) return [];
  return FUNZIONI_NATIVE.filter((f) => pluginC(f.plugin) === false);
}

/** versionCode dell'app installata, o null se non è in grado di dirlo. */
export async function versioneInstallata(chiediAlPlugin = chiediVersioneNativa) {
  if (!dentroApp() || pluginC("VersioneApp") !== true) return null;
  try {
    const { codice } = (await chiediAlPlugin()) || {};
    return typeof codice === "number" ? codice : null;
  } catch {
    return null;
  }
}

// Isolata in una funzione sua perché è l'unico punto che tocca Capacitor:
// così avvisoAggiornamento si può provare fuori dal telefono passandogli
// una versione finta.
//
// Passa dal ponte nativo e non da import("@capacitor/core"): quell'import
// scarica un file dal server e può restare appeso, e un avviso di
// aggiornamento non vale il rischio di bloccare l'apertura dell'app.
async function chiediVersioneNativa() {
  const { prendiPluginSubito } = await import("./plugin-nativo");
  const p = prendiPluginSubito("VersioneApp");
  if (!p) throw new Error("Plugin VersioneApp non raggiungibile");
  return p.leggi();
}

function elenca(voci) {
  if (voci.length === 1) return voci[0];
  return `${voci.slice(0, -1).join(", ")} e ${voci[voci.length - 1]}`;
}

// Il plugin che sa dire la versione nasce con la 9: un'app che non risponde è
// per forza anteriore alla 9. È un'informazione, non un vicolo cieco.
const PRIMA_CHE_SI_PRESENTA = 9;

const AVVISO_GENERICO = "È disponibile una versione più recente di Fixi, con correzioni e funzioni nuove.";

/**
 * Frase da mostrare all'apertura, o null se non c'è niente da dire.
 *
 * Tre strade, perché le app in giro sono di tre tipi:
 *  - dalla 9 in poi sanno dire la propria versione: si confronta il numero, e
 *    l'avviso funziona per QUALSIASI aggiornamento futuro;
 *  - prima della 9 non sanno dirlo, ma proprio questo le tradisce: se la
 *    versione pubblicata è la 9 o successiva, sono indietro per definizione.
 *    Senza questo passaggio chi ha la 8 non riceveva NESSUN avviso, perché ha
 *    tutte le funzioni che sappiamo cercare — cioè proprio il caso di oggi;
 *  - se mancano anche delle funzioni, si dice quali: è più utile di un
 *    generico "aggiorna", e raggiunge chi è fermo alla 6 o alla 7.
 */
export async function avvisoAggiornamento(chiediAlPlugin) {
  if (!dentroApp()) return null;

  // Va distinto "il plugin non c'è" da "c'è ma non ha risposto": nel primo
  // caso l'app è vecchia, nel secondo è aggiornata e ha solo avuto un
  // problema. Confonderli manderebbe al Play Store chi è già a posto.
  const sapraDirlo = pluginC("VersioneApp") === true;

  const installata = await versioneInstallata(chiediAlPlugin);
  if (installata !== null) {
    return installata >= VERSIONE_PUBBLICATA ? null : AVVISO_GENERICO;
  }

  const mancanti = funzioniNativeMancanti();
  if (mancanti.length) {
    return `Aggiorna Fixi dal Play Store per ${elenca(mancanti.map((f) => f.descrizione))}.`;
  }

  // Il plugin c'era ma non ha risposto: non sappiamo la versione e non è colpa
  // dell'utente. Meglio tacere che spedirlo a cercare un aggiornamento che
  // probabilmente ha già.
  if (sapraDirlo) return null;

  // Il plugin non c'è affatto: l'app è per forza anteriore alla 9.
  return VERSIONE_PUBBLICATA >= PRIMA_CHE_SI_PRESENTA ? AVVISO_GENERICO : null;
}
