// lib/registro.js
// Un diario di bordo che sopravvive ai cambi di schermata.
//
// Serve perché nell'app non c'è una console da guardare: quando un tester dice
// "non va", l'unico modo di sapere cosa è successo è che l'app se lo sia
// scritto. Le righe finiscono in localStorage e si rileggono da /stato.
//
// Non è per l'utente: è per capire i guasti che sul telefono non si riproducono.

const CHIAVE = "Fixi_registro";
const MAX_RIGHE = 60; // basta per una sessione, e non gonfia lo spazio

const magazzino = () => (typeof localStorage === "undefined" ? null : localStorage);

export function registra(messaggio, dettaglio) {
  const m = magazzino();
  if (!m) return;
  try {
    const righe = leggiRegistro();
    const ora = new Date().toLocaleTimeString("it-IT", { hour12: false });
    const testo = dettaglio === undefined ? messaggio : `${messaggio} — ${sintetizza(dettaglio)}`;
    righe.push(`${ora}  ${testo}`);
    m.setItem(CHIAVE, JSON.stringify(righe.slice(-MAX_RIGHE)));
  } catch {
    // Il registro non deve mai far fallire ciò che sta registrando
  }
}

function sintetizza(v) {
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (typeof v === "object" && v !== null) {
    // Gli errori dei plugin Capacitor non sono Error: hanno code e message
    if (v.message || v.code) return `${v.code || ""} ${v.message || ""}`.trim();
    try {
      return JSON.stringify(v).slice(0, 200);
    } catch {
      return "(oggetto illeggibile)";
    }
  }
  return String(v);
}

export function leggiRegistro() {
  const m = magazzino();
  if (!m) return [];
  try {
    const g = m.getItem(CHIAVE);
    const r = g ? JSON.parse(g) : [];
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}

export function svuotaRegistro() {
  const m = magazzino();
  if (!m) return;
  try {
    m.removeItem(CHIAVE);
  } catch {}
}
