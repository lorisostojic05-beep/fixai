// scripts/ricontrolla-sicurezza.mjs
// Ritraduce all'indietro, in italiano, le sole frasi che possono fare male.
//
//   node scripts/ricontrolla-sicurezza.mjs
//
// ── A cosa serve ────────────────────────────────────────────────────────────
// Delle 266 frasi dell'interfaccia, sette per lingua parlano di corrente,
// acqua e gas a qualcuno che ha l'elettrodomestico davanti e le mani libere.
// Se una di quelle viene tradotta storta, il danno non e' una brutta figura.
//
// Nessuno qui dentro sa leggere il rumeno. Ma tutti sanno leggere l'italiano:
// si prende la frase tradotta, si fa ritradurre in italiano da zero — senza
// mostrare l'originale, se no lo ricopia — e si guarda se torna a dire la
// stessa cosa. E' un controllo che si fa a occhio, in cinque minuti, e non
// richiede di conoscere nessuna delle sei lingue.
//
// Non da' un voto e non promuove niente da solo: stampa le coppie e le fa
// leggere a te. E' voluto — su questa roba non ci si fida di un automatismo.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const RADICE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELLO = "claude-sonnet-5";

function caricaChiave() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const f = path.join(RADICE, ".env.local");
  if (!fs.existsSync(f)) return null;
  for (const riga of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = riga.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.*)\s*$/);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  }
  return null;
}

async function leggi(file) {
  const t = fs.readFileSync(file, "utf8");
  return (await import("data:text/javascript;base64," + Buffer.from(t).toString("base64"))).default;
}

const chiave = caricaChiave();
if (!chiave) {
  console.error("ANTHROPIC_API_KEY non trovata.");
  process.exit(1);
}

const { LINGUE, PREDEFINITA } = await import(
  "data:text/javascript;base64," +
    Buffer.from(fs.readFileSync(path.join(RADICE, "lib", "lingue.js"), "utf8")).toString("base64")
);

const it = await leggi(path.join(RADICE, "testi", `${PREDEFINITA}.js`));
const originali = it.diagnosi.benvenuto.sicurezza;
const cliente = new Anthropic({ apiKey: chiave, timeout: 180000, maxRetries: 2 });

for (const lingua of LINGUE.filter((l) => l.codice !== PREDEFINITA)) {
  const testi = await leggi(path.join(RADICE, "testi", `${lingua.codice}.js`));
  const sue = testi.diagnosi.benvenuto.sicurezza;
  const nomi = Object.keys(originali);

  const risposta = await cliente.messages.create({
    model: MODELLO,
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content:
          `Traduci in italiano queste avvertenze di sicurezza per elettrodomestici, scritte in ${lingua.nome}.\n` +
          `Traduci alla lettera, senza migliorare e senza accorciare: serve a controllare che non abbiano perso pezzi.\n` +
          `Rispondi con un elenco JSON di stringhe, stessa lunghezza e stesso ordine. Solo il JSON.\n\n` +
          JSON.stringify(nomi.map((n) => sue[n]), null, 2),
      },
    ],
  });

  const testo = risposta.content.map((b) => b.text || "").join("").trim();
  const indietro = JSON.parse(testo.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));

  console.log(`\n${"═".repeat(74)}`);
  console.log(`  ${lingua.nome.toUpperCase()}`);
  console.log("═".repeat(74));
  nomi.forEach((n, i) => {
    const pulita = (s) => String(s).replace(/\*\*/g, "");
    console.log(`\n${n}`);
    console.log(`  partenza : ${pulita(originali[n])}`);
    console.log(`  ritorno  : ${pulita(indietro[i])}`);
  });
}

console.log(`\n${"═".repeat(74)}`);
console.log("Leggi le coppie: se \"ritorno\" dice la stessa cosa di \"partenza\",");
console.log("quella lingua e' a posto. Le differenze di stile non contano —");
console.log("contano le azioni, il loro ordine e le cose da NON fare.");
