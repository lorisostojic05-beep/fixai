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
    return problemi;
  }

  // I buchi devono restare gli stessi, altrimenti sullo schermo compare
  // "{email}" al posto dell'indirizzo — oppure, peggio, la frase perde il dato
  // e resta un'istruzione monca: "Salvato nei Download come".
  const buchi = (s) => (String(s).match(/\{(\w+)\}/g) || []).sort().join(",");
  if (buchi(originale) !== buchi(tradotto)) {
    problemi.push(
      `${dove}: i segnaposto non combaciano (originale ${buchi(originale) || "nessuno"}, tradotto ${buchi(tradotto) || "nessuno"})`
    );
  }
  return problemi;
}

// ─── Le istruzioni per il traduttore ────────────────────────────────────────
function istruzioni(nome) {
  return `Traduci in ${nome} le frasi di questo elenco JSON, che contiene i testi dell'interfaccia di Fixi — un servizio che diagnostica guasti agli elettrodomestici tramite una videochiamata con un'intelligenza artificiale.

REGOLE
1. Rispondi con un elenco JSON di stringhe della STESSA lunghezza e nello STESSO ordine: la frase numero 3 tradotta deve stare al posto numero 3.
2. Non aggiungere, non togliere e non riordinare nulla, nemmeno se una frase ti sembra fuori posto o ripetuta. Le ripetizioni sono volute.
3. Non tradurre i nomi delle marche: Bosch, Samsung, Indesit, Whirlpool, Miele, LG, Candy, Fixi.
4. Le emoji e i simboli restano come sono.
5. Adatta gli importi alla convenzione della lingua d'arrivo: "€9,90" diventa "€9.90" in inglese, "9,90 €" in francese e spagnolo. L'importo NON cambia mai valore, e la valuta resta l'euro.
6. I testi brevi (voci di menu, pulsanti, etichette) devono restare brevi: finiscono dentro pulsanti di larghezza fissa. Se la traduzione fedele e' molto piu' lunga, scegline una piu' corta con lo stesso significato.
7. Usa il registro che userebbe un'app per consumatori in quel mercato: tono diretto e amichevole, dando del tu dove e' naturale nella lingua.
8. Alcune frasi arrivano spezzate a meta' perche' nella pagina vanno su due righe: traducile come due meta' della stessa frase.
9. Le parti fra graffe — {nome}, {email}, {quanti}, {file}, {problema}, {sicurezza}, {dove} — sono buchi che il programma riempie: lascia la graffa e la parola dentro ESATTAMENTE come sono, senza tradurle. Spostale pure dove le vuole la sintassi della lingua d'arrivo.
10. Gli asterischi doppi (**cosi**) mettono in grassetto e gli asterischi singoli (*cosi*) il corsivo: vanno mantenuti attorno alla parte corrispondente della frase tradotta. La sequenza \\n manda a capo: lasciala dov'e'.
11. ATTENZIONE alle frasi che parlano di corrente, acqua e gas: le legge qualcuno che ha l'elettrodomestico davanti e le mani libere. Traducile alla lettera, senza abbreviare, senza addolcire e senza cambiare l'ordine delle azioni.

Rispondi SOLO con il JSON tradotto. Niente spiegazioni, niente blocchi di codice, niente testo prima o dopo.`;
}

// ─── Perche' si mandano solo le frasi, senza i nomi ─────────────────────────
// I nomi delle chiavi sono parole italiane, e questo invita a tradurle anche
// quando la regola dice di non farlo. Il portoghese restituiva "pdfNonRiuscido"
// al posto di "pdfNonRiuscito" e "inviada" al posto di "inviata": ogni volta,
// anche elencando le chiavi una per una nella richiesta. Non e' distrazione,
// e' lo scivolamento naturale fra due lingue vicine.
//
// La soluzione non e' insistere: e' non mandarglieli affatto. Parte un elenco
// di frasi e basta, e i nomi glieli rimettiamo noi qui, dove non possono
// sbagliarsi. Un'intera categoria di errori sparisce invece di essere
// intercettata dopo.

/** Le frasi di un pezzo, nell'ordine in cui compaiono. */
function raccogli(valore) {
  if (Array.isArray(valore)) return valore.flatMap(raccogli);
  if (valore && typeof valore === "object") return Object.values(valore).flatMap(raccogli);
  return [valore];
}

/** Rimette le frasi tradotte nella forma dell'originale, nello stesso ordine. */
function ricostruisci(originale, tradotte, stato = { i: 0 }) {
  if (Array.isArray(originale)) return originale.map((v) => ricostruisci(v, tradotte, stato));
  if (originale && typeof originale === "object") {
    const fuori = {};
    for (const [chiave, valore] of Object.entries(originale)) {
      fuori[chiave] = ricostruisci(valore, tradotte, stato);
    }
    return fuori;
  }
  return tradotte[stato.i++];
}

function estraiJSON(testo) {
  const pulito = testo.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(pulito);
}

// ─── Spezzare il lavoro ─────────────────────────────────────────────────────
// Il primo giro chiedeva tutto il file in una richiesta sola. Ha funzionato
// finche' c'era solo la home; con la pagina della diagnosi il file e' passato
// da 8 a 23 KB e il tedesco — che occupa circa un terzo in piu' dell'italiano —
// ha cominciato a tornare TRONCATO. L'errore che si vedeva era
// "Unterminated string in JSON": la risposta finiva a meta' parola.
//
// Alzare il tetto delle parole avrebbe rimandato il problema alla prossima
// pagina tradotta. Spezzare no: ogni pezzo e' piccolo, e se uno fallisce si
// rifa' solo quello invece di buttare via l'intera lingua.
const LIMITE_PEZZO = 5000;

function pezzi(oggetto, percorso = []) {
  const misura = JSON.stringify(oggetto).length;
  const divisibile =
    oggetto && typeof oggetto === "object" && !Array.isArray(oggetto) && Object.keys(oggetto).length > 1;

  if (misura <= LIMITE_PEZZO || !divisibile) return [{ percorso, valore: oggetto }];

  return Object.entries(oggetto).flatMap(([chiave, valore]) => pezzi(valore, [...percorso, chiave]));
}

function innesta(radice, percorso, valore) {
  if (!percorso.length) return valore;
  let nodo = radice;
  percorso.slice(0, -1).forEach((c) => {
    if (!nodo[c]) nodo[c] = {};
    nodo = nodo[c];
  });
  nodo[percorso[percorso.length - 1]] = valore;
  return radice;
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

// Un limite di tempo esplicito, imparato alla prima prova vera: il tedesco e'
// rimasto appeso venti minuti senza dire niente, e con lui il resto del giro.
// Meglio una lingua che fallisce e viene ritentata da sola che sei ferme.
const cliente = new Anthropic({ apiKey: chiave, timeout: 180000, maxRetries: 2 });
let falliti = 0;

const daTradurre = pezzi(originale);
console.log(`${daFare.length} lingue x ${daTradurre.length} pezzi\n`);

// Quanti pezzi chiedere insieme. In fila i 23 pezzi di una lingua ci mettevano
// piu' di mezz'ora: sono richieste piccole, e quasi tutto il tempo se ne va ad
// aspettare la risposta, non a calcolare. Cinque alla volta e' un compromesso:
// abbastanza per non stare fermi, abbastanza poco da non farsi rallentare
// dal servizio per troppe richieste insieme.
const INSIEME = 5;

async function aGruppi(elenco, quanti, lavora) {
  const esiti = [];
  for (let i = 0; i < elenco.length; i += quanti) {
    esiti.push(...(await Promise.all(elenco.slice(i, i + quanti).map(lavora))));
  }
  return esiti;
}

for (const lingua of daFare) {
  process.stdout.write(`${lingua.bandiera} ${lingua.nome.padEnd(12)} `);
  const guai = [];
  const fatti = [];

  await aGruppi(daTradurre, INSIEME, async (pezzo) => {
    const nome = pezzo.percorso.join(".") || "(tutto)";
    try {
      const risposta = await cliente.messages.create({
        model: MODELLO,
        max_tokens: 8000,
        messages: [
          {
            role: "user",
            content: `${istruzioni(lingua.nome)}\n\n${JSON.stringify(raccogli(pezzo.valore), null, 2)}`,
          },
        ],
      });

      // Se la risposta e' stata tagliata il JSON non si chiude, e l'errore che
      // ne esce ("Unterminated string") non dice cos'e' successo davvero.
      if (risposta.stop_reason === "max_tokens") {
        guai.push(`${nome}: risposta troppo lunga, abbassa LIMITE_PEZZO`);
        return;
      }

      const frasi = estraiJSON(risposta.content.map((b) => b.text || "").join(""));
      const attese = raccogli(pezzo.valore);
      if (!Array.isArray(frasi) || frasi.length !== attese.length) {
        guai.push(
          `${nome}: tornate ${Array.isArray(frasi) ? frasi.length : "?"} frasi invece di ${attese.length}`
        );
        return;
      }

      // Rimessi i nomi, si ricontrolla lo stesso: qui restano da verificare le
      // frasi vuote e i segnaposto persi, che l'ordine giusto non garantisce.
      const tradotto = ricostruisci(pezzo.valore, frasi);
      const problemi = confronta(pezzo.valore, tradotto, nome);
      if (problemi.length) {
        guai.push(...problemi);
        return;
      }
      fatti.push({ percorso: pezzo.percorso, tradotto });
      process.stdout.write(".");
    } catch (e) {
      guai.push(`${nome}: ${e?.message || e}`);
    }
  });

  // Si assembla solo dopo, e nell'ordine dell'originale: i pezzi tornano
  // quando vogliono, e montarli man mano rimescolerebbe le voci del file.
  const assemblato = {};
  const perPercorso = new Map(fatti.map((f) => [f.percorso.join("."), f.tradotto]));
  for (const pezzo of daTradurre) {
    const trovato = perPercorso.get(pezzo.percorso.join("."));
    if (trovato !== undefined) innesta(assemblato, pezzo.percorso, trovato);
  }

  if (guai.length) {
    falliti++;
    console.log(" NON scritto:");
    guai.slice(0, 8).forEach((p) => console.log(`    ${p}`));
    if (guai.length > 8) console.log(`    ...e altri ${guai.length - 8}`);
    continue;
  }

  scrivi(lingua.codice, lingua.nome, assemblato);
  console.log(" fatto");
}

console.log(`\n${daFare.length - falliti} su ${daFare.length}.`);
process.exit(falliti ? 1 : 0);
