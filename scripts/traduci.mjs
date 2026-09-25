// scripts/traduci.mjs
// Genera i file delle lingue a partire da testi/it.js.
//
//   node scripts/traduci.mjs --prova   dice cosa tradurrebbe e quanto costa, senza chiamare nessuno
//   node scripts/traduci.mjs           solo le frasi cambiate o nuove, in tutte le lingue
//   node scripts/traduci.mjs es        solo le frasi cambiate o nuove, in una lingua
//   node scripts/traduci.mjs --tutte   tutto da capo, in tutte le lingue (circa 300 mila token)
//   node scripts/traduci.mjs --segna   segna le traduzioni attuali come aggiornate (vedi sotto)
//
// L'italiano e' l'originale e non si tocca mai.
//
// ── Come sa cosa e' cambiato ────────────────────────────────────────────────
// Dopo ogni traduzione riuscita si salva in testi/.impronte.json un'impronta
// di ogni frase italiana, per ogni lingua. Al giro dopo si ritraduce solo cio'
// la cui impronta non torna, piu' cio' che nel file della lingua manca. I
// dettagli, e il perche', stanno in scripts/traduzioni-incrementali.mjs.
//
// --segna scrive le impronte SENZA tradurre niente. Va usato solo quando si e'
// sicuri che i file delle lingue corrispondono gia' all'italiano di adesso —
// per esempio subito dopo un --tutte fatto con una versione vecchia dello
// script. Usato a sproposito, una frase cambiata resterebbe vecchia nelle altre
// lingue finche' qualcuno non la tocca di nuovo.
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
import { daRifare, parziale, componi, impronte, chiaveDi } from "./traduzioni-incrementali.mjs";

const QUI = path.dirname(fileURLToPath(import.meta.url));
const RADICE = path.join(QUI, "..");
const CARTELLA = path.join(RADICE, "testi");
const FILE_IMPRONTE = path.join(CARTELLA, ".impronte.json");

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
9. Le parti fra graffe con un numero dentro — {0}, {1}, {2} — sono buchi che il programma riempie con dei dati. Riportale IDENTICHE, numero compreso, e non aggiungerne né toglierne. Spostale pure dove le vuole la sintassi della lingua d'arrivo.
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

// ─── Anche i buchi si mascherano ────────────────────────────────────────────
// Stessa storia dei nomi delle chiavi: {codice} sembra una parola italiana, e
// il portoghese la restituiva come {codigo} — sempre, anche con la regola
// scritta nella richiesta. Un buco rinominato non viene piu' riempito da
// nessuno, e a schermo resta scritto "{codigo}" al posto del codice del pezzo.
//
// Quindi non gliene mandiamo il nome: parte {0}, torna {0}, e il nome glielo
// rimettiamo noi. Un numero non somiglia a niente in nessuna lingua.
function maschera(frase) {
  const nomi = [];
  const testo = String(frase).replace(/\{(\w+)\}/g, (intero, nome) => {
    const gia = nomi.indexOf(nome);
    if (gia >= 0) return `{${gia}}`;
    nomi.push(nome);
    return `{${nomi.length - 1}}`;
  });
  return { testo, nomi };
}

function smaschera(frase, nomi) {
  return String(frase).replace(/\{(\d+)\}/g, (intero, i) =>
    nomi[Number(i)] !== undefined ? `{${nomi[Number(i)]}}` : intero
  );
}

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

// ─── Le impronte ────────────────────────────────────────────────────────────
function leggiImpronte() {
  if (!fs.existsSync(FILE_IMPRONTE)) return {};
  try {
    return JSON.parse(fs.readFileSync(FILE_IMPRONTE, "utf8"));
  } catch {
    // Un file rovinato vale come nessun file: si vede solo cio' che manca, e
    // il messaggio in fondo dice cosa fare. Meglio che fermarsi.
    return {};
  }
}

function salvaImpronte(tutte) {
  fs.writeFileSync(FILE_IMPRONTE, JSON.stringify(tutte, null, 1) + "\n", "utf8");
}

// ─── Quanto costa, a occhio ─────────────────────────────────────────────────
// Tarato sul giro completo del 25/09/2026: 198 richieste e 135 mila caratteri
// sono stati circa 330 mila token. Buona parte e' il testo delle istruzioni,
// che parte identico in ogni richiesta: per questo pesa il numero di richieste
// piu' del numero di frasi. E' una stima; il conto vero lo stampa la fine.
const stimaToken = (richieste, caratteri) => Math.round(richieste * 800 + caratteri * 1.2);
const caratteriDi = (valore) => raccogli(valore).join("").length;

// ─── Programma ──────────────────────────────────────────────────────────────
// lib/lingue.js e' l'elenco ufficiale: se una lingua non e' li', questo script
// si rifiuta di generarla. Cosi' non nascono file di traduzione per lingue che
// il sito non sa servire.
const { LINGUE, PREDEFINITA } = await leggiTutto(path.join(RADICE, "lib", "lingue.js"));

const originale = await leggiModulo(path.join(CARTELLA, `${PREDEFINITA}.js`));

const argomenti = process.argv.slice(2);
const forza = argomenti.includes("--tutte");
const prova = argomenti.includes("--prova");
const segna = argomenti.includes("--segna");
const richieste = argomenti.filter((a) => !a.startsWith("--"));

let lingue = LINGUE.filter((l) => l.codice !== PREDEFINITA);
if (richieste.length) {
  const sconosciute = richieste.filter((c) => !LINGUE.some((l) => l.codice === c));
  if (sconosciute.length) {
    console.error(`Lingua non prevista in lib/lingue.js: ${sconosciute.join(", ")}`);
    process.exit(1);
  }
  lingue = lingue.filter((l) => richieste.includes(l.codice));
}

const tutteImpronte = leggiImpronte();
const improntaOra = impronte(originale);

// ─── --segna: dichiarare aggiornato cio' che c'e' ───────────────────────────
// Nessuna traduzione, nessuna chiave: si guarda solo che il file abbia la
// stessa forma dell'italiano, e se si' se ne ricordano le impronte.
if (segna) {
  for (const l of lingue) {
    const f = path.join(CARTELLA, `${l.codice}.js`);
    if (!fs.existsSync(f)) {
      console.log(`${l.bandiera} ${l.nome.padEnd(12)} manca il file: non segno niente`);
      continue;
    }
    const problemi = confronta(originale, await leggiModulo(f));
    if (problemi.length) {
      console.log(`${l.bandiera} ${l.nome.padEnd(12)} non combacia con l'italiano (${problemi[0]}): non segno`);
      continue;
    }
    tutteImpronte[l.codice] = improntaOra;
    console.log(`${l.bandiera} ${l.nome.padEnd(12)} segnata come aggiornata`);
  }
  salvaImpronte(tutteImpronte);
  process.exit(0);
}

// ─── Il piano: per ogni lingua, cosa c'e' da fare ───────────────────────────
const piano = [];
for (const l of lingue) {
  const f = path.join(CARTELLA, `${l.codice}.js`);
  const vecchio = fs.existsSync(f) ? await leggiModulo(f) : null;

  if (forza || !vecchio) {
    piano.push({ lingua: l, intero: true, vecchio: null, pezzi: pezzi(originale), elenco: null });
    continue;
  }

  const ricordate = tutteImpronte[l.codice] || null;
  const elenco = daRifare(originale, vecchio, ricordate);
  const voce = { lingua: l, intero: false, vecchio, elenco, senzaImpronte: !ricordate };
  // Le frasi da rifare si mandano tutte insieme: di solito sono poche e
  // stanno in un pezzo solo, quindi in una richiesta sola per lingua.
  voce.pezzi = elenco.length ? pezzi(parziale(elenco)) : [];
  piano.push(voce);
}

const conLavoro = piano.filter((v) => v.pezzi.length);
const totRichieste = conLavoro.reduce((t, v) => t + v.pezzi.length, 0);
const totCaratteri = conLavoro.reduce((t, v) => t + v.pezzi.reduce((s, p) => s + caratteriDi(p.valore), 0), 0);

for (const v of piano) {
  const testa = `${v.lingua.bandiera} ${v.lingua.nome.padEnd(12)}`;
  if (!v.pezzi.length) {
    console.log(`${testa} gia' aggiornata`);
    continue;
  }
  const quante = v.intero ? raccogli(originale).length : v.elenco.length;
  console.log(
    `${testa} ${v.intero ? "tutto da capo" : "da rifare"}: ${quante} ${quante === 1 ? "voce" : "voci"}, ` +
      `${v.pezzi.length} ${v.pezzi.length === 1 ? "richiesta" : "richieste"}`
  );
  if (prova && !v.intero) v.elenco.slice(0, 8).forEach((u) => console.log(`      ${chiaveDi(u.percorso)}`));
  if (prova && !v.intero && v.elenco.length > 8) console.log(`      ...e altre ${v.elenco.length - 8}`);
}

// Senza impronte si vede solo cio' che MANCA. Una frase modificata in
// italiano resterebbe vecchia in quella lingua senza che nessuno lo dica:
// qui invece lo si dice, ogni volta.
const cieche = piano.filter((v) => v.senzaImpronte).map((v) => v.lingua.nome);
if (cieche.length) {
  console.log(
    `\nATTENZIONE: per ${cieche.join(", ")} non so com'era l'italiano all'ultima traduzione.\n` +
      `Vedo le frasi che mancano, non quelle modificate. Se i file sono aggiornati:\n` +
      `  node scripts/traduci.mjs --segna\n` +
      `altrimenti, una volta:\n` +
      `  node scripts/traduci.mjs --tutte`
  );
}

if (!totRichieste) {
  console.log("\nNiente da tradurre.");
  process.exit(0);
}

console.log(`\nIn tutto: ${totRichieste} ${totRichieste === 1 ? "richiesta" : "richieste"}, circa ${Math.round(stimaToken(totRichieste, totCaratteri) / 1000)} mila token.`);

if (prova) {
  console.log("(--prova: non ho chiamato nessuno e non ho scritto niente)");
  process.exit(0);
}

const chiave = caricaChiave();
if (!chiave) {
  console.error("ANTHROPIC_API_KEY non trovata (ne' fra le variabili d'ambiente, ne' in .env.local).");
  process.exit(1);
}

// Un limite di tempo esplicito, imparato alla prima prova vera: il tedesco e'
// rimasto appeso venti minuti senza dire niente, e con lui il resto del giro.
// Meglio una lingua che fallisce e viene ritentata da sola che sei ferme.
const cliente = new Anthropic({ apiKey: chiave, timeout: 180000, maxRetries: 2 });
const consumo = { entrata: 0, uscita: 0 };
let falliti = 0;

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

/** Traduce un pezzo. Torna { tradotto } oppure { guai: [...] }. */
async function traduciPezzo(lingua, pezzo) {
  const nome = pezzo.percorso.join(".") || "(tutto)";
  // I nomi dei buchi restano qui: fuori esce {0}, {1}, e al ritorno li
  // rimettiamo a posto noi.
  const originali = raccogli(pezzo.valore);
  const coperte = originali.map(maschera);
  const mascherate = coperte.map((c) => c.testo);
  try {
    const risposta = await cliente.messages.create({
      model: MODELLO,
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `${istruzioni(lingua.nome)}\n\n${JSON.stringify(mascherate, null, 2)}`,
        },
      ],
    });
    consumo.entrata += risposta.usage?.input_tokens || 0;
    consumo.uscita += risposta.usage?.output_tokens || 0;

    // Se la risposta e' stata tagliata il JSON non si chiude, e l'errore che
    // ne esce ("Unterminated string") non dice cos'e' successo davvero.
    if (risposta.stop_reason === "max_tokens") {
      return { guai: [`${nome}: risposta troppo lunga, abbassa LIMITE_PEZZO`] };
    }

    const grezze = estraiJSON(risposta.content.map((b) => b.text || "").join(""));
    if (!Array.isArray(grezze) || grezze.length !== originali.length) {
      return {
        guai: [`${nome}: tornate ${Array.isArray(grezze) ? grezze.length : "?"} frasi invece di ${originali.length}`],
      };
    }
    const frasi = grezze.map((f, i) => smaschera(f, coperte[i].nomi));

    // Rimessi i nomi, si ricontrolla lo stesso: qui restano da verificare le
    // frasi vuote e i segnaposto persi, che l'ordine giusto non garantisce.
    const tradotto = ricostruisci(pezzo.valore, frasi);
    const problemi = confronta(pezzo.valore, tradotto, nome);
    return problemi.length ? { guai: problemi } : { tradotto };
  } catch (e) {
    return { guai: [`${nome}: ${e?.message || e}`] };
  }
}

console.log("");
for (const v of conLavoro) {
  process.stdout.write(`${v.lingua.bandiera} ${v.lingua.nome.padEnd(12)} `);
  const guai = [];
  const fatti = new Map();

  await aGruppi(v.pezzi, INSIEME, async (pezzo) => {
    const esito = await traduciPezzo(v.lingua, pezzo);
    if (esito.guai) return guai.push(...esito.guai);
    fatti.set(pezzo.percorso.join("."), esito.tradotto);
    process.stdout.write(".");
  });

  if (guai.length) {
    falliti++;
    console.log(" NON scritto:");
    guai.slice(0, 8).forEach((p) => console.log(`    ${p}`));
    if (guai.length > 8) console.log(`    ...e altri ${guai.length - 8}`);
    continue;
  }

  // Si assembla solo dopo, e nell'ordine dell'originale: i pezzi tornano
  // quando vogliono, e montarli man mano rimescolerebbe le voci del file.
  // Il valore di ritorno di innesta() va tenuto: quando il pezzo e' uno solo
  // e copre tutto (succede spesso con poche frasi da rifare) innesta non
  // riempie la radice, la sostituisce.
  let nuovo = {};
  for (const pezzo of v.pezzi) nuovo = innesta(nuovo, pezzo.percorso, fatti.get(pezzo.percorso.join(".")));

  const file = v.intero ? nuovo : componi(originale, v.vecchio, nuovo);

  // L'ultimo controllo e' sul file INTERO, non solo sulle frasi appena
  // tradotte: e' qui che si vedrebbe una voce persa nel rimontarlo.
  const problemi = confronta(originale, file);
  if (problemi.length) {
    falliti++;
    console.log(" NON scritto, il file rimontato non combacia:");
    problemi.slice(0, 8).forEach((p) => console.log(`    ${p}`));
    continue;
  }

  scrivi(v.lingua.codice, v.lingua.nome, file);
  // Le impronte si salvano subito, lingua per lingua: se la prossima fallisce
  // questa resta comunque segnata come aggiornata.
  tutteImpronte[v.lingua.codice] = improntaOra;
  salvaImpronte(tutteImpronte);
  console.log(" fatto");
}

console.log(`\n${conLavoro.length - falliti} su ${conLavoro.length}.`);
console.log(
  `Token usati: ${consumo.entrata.toLocaleString("it-IT")} in entrata + ` +
    `${consumo.uscita.toLocaleString("it-IT")} in uscita = ` +
    `${(consumo.entrata + consumo.uscita).toLocaleString("it-IT")}`
);
process.exit(falliti ? 1 : 0);
