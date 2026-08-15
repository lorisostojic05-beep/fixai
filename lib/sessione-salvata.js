// lib/sessione-salvata.js
// Tiene in vita una diagnosi anche se l'app viene chiusa.
//
// Android distrugge le app in secondo piano quando ha bisogno di memoria: al
// ritorno la WebView ricarica il sito da zero. La conversazione vive solo nella
// memoria della pagina, quindi spariva — e con lei i 9,90€ appena pagati.
// Misurato sui dati veri di agosto 2026: 2 sessioni pagate su 6 non arrivavano
// mai al referto.
//
// sessionStorage non basta perché muore insieme alla WebView. localStorage no.
//
// Sta in un modulo suo, e non dentro pages/diagnosi.jsx, perché così si può
// provare davvero: la pagina della diagnosi non è testabile fuori dal telefono.

export const CHIAVE_SESSIONE = "Fixi_sessione";

// Deve restare allineata a FINESTRA_PAGAMENTO_MS in pages/api/diagnosi.js:
// riproporre una sessione che il server considera già scaduta darebbe solo un
// errore incomprensibile a chi ha pagato.
export const DURATA_SESSIONE_MS = 2 * 60 * 60 * 1000;

// Numero minimo di messaggi perché valga la pena riprendere: sotto questa
// soglia c'è solo il benvenuto, e riproporlo confonderebbe invece di aiutare.
const MINIMO_MESSAGGI = 2;

const magazzino = () => (typeof localStorage === "undefined" ? null : localStorage);

export function salvaSessione(sessione) {
  const m = magazzino();
  if (!m) return false;
  try {
    m.setItem(CHIAVE_SESSIONE, JSON.stringify(sessione));
    return true;
  } catch (e) {
    // Spazio esaurito o modalità privata: la diagnosi continua lo stesso,
    // semplicemente non sarà recuperabile.
    console.warn("Sessione non salvata:", e?.message);
    return false;
  }
}

export function leggiSessioneSalvata(adesso = Date.now()) {
  const m = magazzino();
  if (!m) return null;
  let s;
  try {
    const grezzo = m.getItem(CHIAVE_SESSIONE);
    if (!grezzo) return null;
    s = JSON.parse(grezzo);
  } catch {
    // Dato illeggibile: si butta, altrimenti resta lì a fallire per sempre
    dimenticaSessione();
    return null;
  }
  if (!s || typeof s !== "object") return null;
  if (typeof s.iniziata !== "number" || adesso - s.iniziata > DURATA_SESSIONE_MS) {
    dimenticaSessione();
    return null;
  }
  if (!Array.isArray(s.messages) || s.messages.length < MINIMO_MESSAGGI) return null;
  return s;
}

export function dimenticaSessione() {
  const m = magazzino();
  if (!m) return;
  try {
    m.removeItem(CHIAVE_SESSIONE);
  } catch {}
}
