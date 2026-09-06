// scripts/traduci.mjs
// Genera i file delle lingue a partire da testi/it.js.
//
//   node scripts/traduci.mjs es        una lingua
//   node scripts/traduci.mjs           tutte quelle che mancano
//   node scripts/traduci.mjs --tutte   tutte, anche riscrivendo quelle che ci sono
//
// L'italiano e' l'originale e non si tocca mai.
//
// ── Perche' questo script esiste ────────────────────────────────────────────
// Dare in pasto pages/index.jsx a un traduttore significa dargli codice: si
// ritroverebbe a tradurre href, className, <br />, e la pagina tornerebbe
// indietro rotta in una lingua che non sappiamo leggere per capire dove.
//
// Qui invece parte solo testi/it.js, che di codice non ne contiene: nessun
// indirizzo da rompere, nessun tag da chiudere male. Il peggio che puo'
// succedere e' una frase brutta.
//
// ── La rete di sicurezza ────────────────────────────────────────────────────
// Prima di scrivere qualsiasi file, la traduzione viene confrontata con
// l'originale: stesse chiavi, stessa profondita', stessa lunghezza degli
// elenchi. Se manca anche una sola voce il file NON viene scritto. Senza questo
// controllo, un elenco tornato con tre voci invece di quattro farebbe sparire
// un passo dalla home, e ce ne accorgeremmo dal traffico.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.join(QUI, "..");
const CARTELLA = path.join(RADICE, "testi");

// Sonnet basta e avanza: sono poche centinaia di frasi corte, ed e' un lavoro
// di traduzione, non di ragionamento. Per le guide — dove c'e' di mezzo la
// sicurezza — serve un modello piu' forte e un altro script.
const MODELLO = "claude-sonnet-5";

// ─── Chiave API ──────────────────────────────────────────────────────────────
// Next.js legge .env.local da solo, Node no. La chiave resta nel file: non
// viene mai stampata, nemmeno in caso di errore.
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

// ─── Lettura di testi/it.js ─────────────────────────────────────────────────
// Il progetto non e' un modulo ESM (next.config.js usa require), quindi Node
// non importerebbe un file con "export default". Passandolo come data: URL lo
// legge come modulo a se' stante — e funziona proprio perche' testi/it.js non
// importa nient'altro: e' solo dati.
async function leggiTutto(file) {
  const testo = fs.readFileSync(file, "utf8");
  return import("data:text/javascript;base64," + Buffer.from(testo).toString("base64"));
}

/** Come leggiTutto, ma per i file che espongono un "export default" solo. */
async function leggiModulo(file) {
  return (await leggiTutto(file)).default;
}

// ─── Il controllo che decide se il file si scrive ───────────────────────────
function confronta(originale, tradotto, percorso = "") {
  const problemi = [];
  const dove = percorso || "(radice)";

  if (Array.isArray(originale)) {
    if (!Array.isArray(tradotto)) return [`${dove}: doveva essere un elenco`];
    if (originale.length !== tradotto.length) {
      return [`${dove}: elenco di ${tradotto.length} voci invece di ${originale.length}`];
    }
    originale.forEach((v, i) => problemi.push(...confronta(v, tradotto[i], `${percorso}[${i}]`)));
    return problemi;
  }

  if (originale && typeof originale === "object") {
    if (!tradotto || typeof tradotto !== "object" || Array.isArray(tradotto)) {
      return [`${dove}: doveva essere un blocco di voci`];
    }
    for (const chiave of Object.keys(originale)) {
      if (!(chiave in tradotto)) {
        problemi.push(`${percorso ? percorso + "." : ""}${chiave}: manca`);
        continue;
      }
      problemi.push(
        ...confronta(originale[chiave], tradotto[chiave], `${percorso ? percorso + "." : ""}${chiave}`)
      );
    }
    for (const chiave of Object.keys(tradotto)) {
      if (!(chiave in originale)) problemi.push(`${percorso ? percorso + "." : ""}${chiave}: in piu'`);
    }
    return problemi;
  }

  if (typeof tradotto !== "string" || !tradotto.trim()) {
    problemi.push(`${dove}: frase vuota`);
  }
  return problemi;
}

// ─── Le istruzioni per il traduttore ────────────────────────────────────────
function istruzioni(nome) {
  return `Traduci in ${nome} i valori di questo oggetto JSON, che contiene i testi dell'interfaccia di Fixi — un servizio che diagnostica guasti agli elettrodomestici tramite una videochiamata con un'intelligenza artificiale.

REGOLE
1. Traduci SOLO i valori. Le chiavi (meta, nav, hero, titolo1, elenco...) restano identiche, in italiano.
2. Non aggiungere, non togliere e non riordinare nulla: stesse chiavi, elenchi della stessa lunghezza.
3. Non tradurre i nomi delle marche: Bosch, Samsung, Indesit, Whirlpool, Miele, LG, Candy, Fixi.
4. Le emoji e i simboli restano come sono.
5. Adatta gli importi alla convenzione della lingua d'arrivo: "€9,90" diventa "€9.90" in inglese, "9,90 €" in francese e spagnolo. L'importo NON cambia mai valore, e la valuta resta l'euro.
6. I testi brevi (voci di menu, pulsanti, etichette) devono restare brevi: finiscono dentro pulsanti di larghezza fissa. Se la traduzione fedele e' molto piu' lunga, scegline una piu' corta con lo stesso significato.
7. Usa il registro che userebbe un'app per consumatori in quel mercato: tono diretto e amichevole, dando del tu dove e' naturale nella lingua.
8. Alcune frasi sono spezzate in titolo1/titolo2 perche' nella pagina vanno su due righe: traducile come due meta' della stessa frase.

Rispondi SOLO con il JSON tradotto. Niente spiegazioni, niente blocchi di codice, niente testo prima o dopo.`;
}

function estraiJSON(testo) {
  const pulito = testo.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(pulito);
}

function scrivi(codice, nome, dati) {
  const intestazione = `// testi/${codice}.js — ${nome}
//
// GENERATO DA scripts/traduci.mjs. Non modificare a mano: alla prossima
// rigenerazione le modifiche andrebbero perse.
//
// Per cambiare una frase si modifica testi/it.js e si rilancia:
//   node scripts/traduci.mjs ${codice}

export default `;
  fs.writeFileSync(
    path.join(CARTELLA, `${codice}.js`),
    intestazione + JSON.stringify(dati, null, 2) + ";\n",
    "utf8"
  );
}

// ─── Programma ──────────────────────────────────────────────────────────────
const chiave = caricaChiave();
if (!chiave) {
  console.error("ANTHROPIC_API_KEY non trovata (ne' fra le variabili d'ambiente, ne' in .env.local).");
  process.exit(1);
}

// lib/lingue.js e' l'elenco ufficiale: se una lingua non e' li', questo script
// si rifiuta di generarla. Cosi' non nascono file di traduzione per lingue che
// il sito non sa servire.
const { LINGUE, PREDEFINITA } = await leggiTutto(path.join(RADICE, "lib", "lingue.js"));

const originale = await leggiModulo(path.join(CARTELLA, `${PREDEFINITA}.js`));

const argomenti = process.argv.slice(2);
const forza = argomenti.includes("--tutte");
const richieste = argomenti.filter((a) => !a.startsWith("--"));

let daFare = LINGUE.filter((l) => l.codice !== PREDEFINITA);
if (richieste.length) {
  daFare = daFare.filter((l) => richieste.includes(l.codice));
  const sconosciute = richieste.filter((c) => !LINGUE.some((l) => l.codice === c));
  if (sconosciute.length) {
    console.error(`Lingua non prevista in lib/lingue.js: ${sconosciute.join(", ")}`);
    process.exit(1);
  }
} else if (!forza) {
  daFare = daFare.filter((l) => !fs.existsSync(path.join(CARTELLA, `${l.codice}.js`)));
}

if (!daFare.length) {
  console.log("Niente da fare: ci sono gia' tutte. Usa --tutte per rigenerarle.");
  process.exit(0);
}

const cliente = new Anthropic({ apiKey: chiave });
let falliti = 0;

for (const lingua of daFare) {
  process.stdout.write(`${lingua.bandiera} ${lingua.nome.padEnd(12)} `);
  try {
    const risposta = await cliente.messages.create({
      model: MODELLO,
      max_tokens: 16000,
      messages: [
        {
          role: "user",
          content: `${istruzioni(lingua.nome)}\n\n${JSON.stringify(originale, null, 2)}`,
        },
      ],
    });

    const tradotto = estraiJSON(risposta.content.map((b) => b.text || "").join(""));
    const problemi = confronta(originale, tradotto);

    if (problemi.length) {
      falliti++;
      console.log("NON scritto — la traduzione non combacia con l'originale:");
      problemi.slice(0, 8).forEach((p) => console.log(`    ${p}`));
      if (problemi.length > 8) console.log(`    ...e altri ${problemi.length - 8}`);
      continue;
    }

    scrivi(lingua.codice, lingua.nome, tradotto);
    console.log("fatto");
  } catch (e) {
    falliti++;
    console.log(`errore: ${e?.message || e}`);
  }
}

console.log(`\n${daFare.length - falliti} su ${daFare.length}.`);
process.exit(falliti ? 1 : 0);
