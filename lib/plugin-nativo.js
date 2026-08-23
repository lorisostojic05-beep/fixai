// lib/plugin-nativo.js
// Prende un plugin nativo SENZA passare dalla rete.
//
// Perché esiste: `await import("@capacitor/core")` sembra innocuo, ma non usa il
// codice già presente nell'app — scarica un pezzo di JavaScript dal server. Se
// quel pezzo non arriva (rete ballerina, oppure un deploy nuovo che ha
// cambiato i nomi dei file mentre l'app teneva in memoria la pagina vecchia)
// l'attesa non finisce mai, e il pulsante resta muto per sempre.
//
// Misurato sul telefono il 23/08/2026: "chiedo il plugin" alle 21:08:32,
// nessuna risposta fino alla scadenza dei 15 secondi. La condivisione, che usa
// plugin gia' caricati, ci metteva un secondo.
//
// Dentro l'app il ponte nativo e' gia' in memoria e offre tutto il necessario:
// si usa quello, e l'import dal server resta solo come ultima spiaggia.

const cache = new Map();

export function prendiPluginSubito(nome) {
  if (cache.has(nome)) return cache.get(nome);
  const C = typeof window !== "undefined" ? window.Capacitor : undefined;
  if (!C) return null;

  // 1. Il plugin e' gia' pronto nel ponte: risposta immediata, zero rete.
  const gia = C.Plugins?.[nome];
  if (gia) {
    cache.set(nome, gia);
    return gia;
  }
  // 2. Il ponte sa costruirlo da se': anche qui nessuna rete.
  if (typeof C.registerPlugin === "function") {
    const p = C.registerPlugin(nome);
    if (p) {
      cache.set(nome, p);
      return p;
    }
  }
  return null;
}

/**
 * Come sopra, ma se il ponte non basta ripiega sul pacchetto npm.
 * Quel ripiego puo' richiedere la rete: chi la chiama dovrebbe metterle
 * una scadenza, se no si torna al pulsante che tace.
 */
export async function prendiPlugin(nome) {
  const subito = prendiPluginSubito(nome);
  if (subito) return subito;
  const { registerPlugin } = await import("@capacitor/core");
  const p = registerPlugin(nome);
  cache.set(nome, p);
  return p;
}

// Solo per i test: la cache e' globale e sopravviverebbe fra un caso e l'altro.
export function svuotaCachePlugin() {
  cache.clear();
}
