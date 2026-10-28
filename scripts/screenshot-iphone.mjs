// Screenshot della pagina vera di Fixi come la mostra l'app iPhone.
//
// L'app iPhone carica il sito: la schermata e' la stessa, cambiano solo le
// righe che il codice decide guardando window.Capacitor (pulsante col prezzo
// dell'App Store, "Paghi con il tuo account Apple"). Qui si apre Edge senza
// finestra, gli si fa credere di essere dentro l'app iPhone prima che la
// pagina parta, e si fotografa a 1290x2796 (iPhone 6,7").
//
// Uso:
//   node scripts/screenshot-iphone.mjs https://fixiai.it/diagnosi store/ios/x.png compila
//   PREZZO="9,99 €" node scripts/...   se il prezzo su App Store e' diverso
//
// Non chiama nessuna API a pagamento: apre solo la pagina pubblica. Edge e'
// quello installato con Windows; il percorso e' in EDGE qui sotto.
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const [url, uscita, azione] = process.argv.slice(2);
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORTA = 9333;
const PREZZO = process.env.PREZZO || "9,90 €";

const profilo = mkdtempSync(path.join(tmpdir(), "fixi-shot-"));
const edge = spawn(EDGE, [
  "--headless=new",
  `--remote-debugging-port=${PORTA}`,
  `--user-data-dir=${profilo}`,
  "--hide-scrollbars",
  "about:blank",
]);

const aspetta = (ms) => new Promise((r) => setTimeout(r, ms));
let pagine = [];
for (let i = 0; i < 40 && !pagine.length; i++) {
  await aspetta(250);
  try {
    pagine = (await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json()).filter((p) => p.type === "page");
  } catch {}
}
if (!pagine.length) throw new Error("Edge non risponde");

const ws = new WebSocket(pagine[0].webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let n = 0;
const attese = new Map();
const eventi = [];
ws.addEventListener("message", (m) => {
  const d = JSON.parse(m.data);
  if (d.id && attese.has(d.id)) {
    const { risolvi, rifiuta } = attese.get(d.id);
    attese.delete(d.id);
    d.error ? rifiuta(new Error(d.error.message)) : risolvi(d.result);
  } else if (d.method) eventi.push(d.method);
});
const cdp = (method, params = {}) =>
  new Promise((risolvi, rifiuta) => {
    const id = ++n;
    attese.set(id, { risolvi, rifiuta });
    ws.send(JSON.stringify({ id, method, params }));
  });

// Un iPhone finto: quello che il codice di Fixi guarda per decidere.
const finto = `
  try { localStorage.setItem("Fixi_lingua", "it"); } catch (e) {}
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => "ios",
    isPluginAvailable: (n) => n === "Acquisti",
    Plugins: {
      Acquisti: {
        prodotto: async () => ({ id: "casa.fixi.app.diagnosi", prezzo: ${JSON.stringify(PREZZO)} }),
        inSospeso: async () => ({ transazioni: [] }),
      },
    },
  };
`;

await cdp("Page.enable");
await cdp("Runtime.enable");
await cdp("Emulation.setDeviceMetricsOverride", { width: 430, height: 932, deviceScaleFactor: 3, mobile: true });
await cdp("Emulation.setUserAgentOverride", {
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
});
await cdp("Page.addScriptToEvaluateOnNewDocument", { source: finto });
await cdp("Page.navigate", { url });
for (let i = 0; i < 60 && !eventi.includes("Page.loadEventFired"); i++) await aspetta(250);
await aspetta(2500);

if (azione === "compila") {
  // Il modulo compilato: e' cosi' che il pulsante di pagamento si accende.
  const r = await cdp("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const scrivi = (el, v) => {
        const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, "value").set.call(el, v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      const lavatrice = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Lavatrice"));
      lavatrice && lavatrice.click();
      const marca = document.querySelector('input[type="text"]');
      marca && scrivi(marca, "Bosch");
      const problema = document.querySelector("textarea");
      problema && scrivi(problema, "Non scarica l'acqua, resta ferma con il cestello pieno");
      return { lavatrice: !!lavatrice, marca: !!marca, problema: !!problema };
    })()`,
  });
  console.log("modulo:", JSON.stringify(r.result.value));
  await aspetta(800);
  await cdp("Runtime.evaluate", {
    expression: `(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("Paga")); b && b.scrollIntoView({ block: "center" }); })()`,
  });
  await aspetta(600);
}

const testo = await cdp("Runtime.evaluate", {
  returnByValue: true,
  expression: `[...document.querySelectorAll("button, p")].map((e) => e.textContent.trim()).filter((t) => /Paga|Apple|Stripe/.test(t)).slice(0, 6)`,
});
console.log("testi visibili:", JSON.stringify(testo.result.value));

const foto = await cdp("Page.captureScreenshot", { format: "png" });
writeFileSync(uscita, Buffer.from(foto.data, "base64"));
const b = Buffer.from(foto.data, "base64");
console.log(`salvato ${uscita}: ${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`);

ws.close();
edge.kill();
process.exit(0);
