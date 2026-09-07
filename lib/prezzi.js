// lib/prezzi.js
// Il listino che l'AI usa per stimare quanto costa far riparare una cosa.
//
// Stava scritto a mano dentro il prompt di pages/api/diagnosi.js, come tabella
// gia' impaginata, con in fondo la riga "Prezzi indicativi per area nord
// Italia". Andava benissimo finche' i clienti erano italiani. Da quando il sito
// parla sette lingue, quella tabella consegnava a un tedesco dei numeri
// italiani scritti in tedesco — e un referto con i prezzi sbagliati e' peggio
// di un referto senza prezzi, perche' sembra giusto.
//
// ── Come nascono i prezzi degli altri paesi ─────────────────────────────────
// NON sono listini raccolti sul campo: quello vero e' solo l'italiano. Sono
// l'italiano con due mosse:
//
//   1. la MANODOPERA riscalata sul costo del lavoro del paese
//      (vedi i moltiplicatori in lib/mercati.js);
//   2. i RICAMBI lasciati come sono — mercato unico europeo, stessi pezzi,
//      stessi produttori, prezzi che si somigliano molto piu' della manodopera.
//
// E' un'approssimazione dichiarata, non una misura. Per questo fuori
// dall'Italia i numeri si arrotondano alla cinquina: "€120–170" dice quello
// che sappiamo davvero, "€118–166" fingerebbe una precisione che non abbiamo.
//
// Quando arriveranno preventivi veri di un paese, si corregge il suo
// moltiplicatore — o gli si scrive un listino suo e si smette di stimarlo.

import { mercatoDi, MERCATO_PREDEFINITO } from "./mercati";

// null nella manodopera = si fa da soli. null nel pezzo = non serve ricambio.
const LISTINO = [
  { voce: "Pulizia filtro pompa", manodopera: null, pezzo: null },
  { voce: "Sostituzione pompa scarico", manodopera: [60, 90], pezzo: [25, 55] },
  { voce: "Sostituzione guarnizione oblò", manodopera: [50, 80], pezzo: [20, 45] },
  { voce: "Sostituzione resistenza", manodopera: [70, 100], pezzo: [25, 65] },
  { voce: "Sostituzione blocca-porta", manodopera: [40, 65], pezzo: [15, 30] },
  { voce: "Sostituzione valvola ingresso", manodopera: [50, 70], pezzo: [15, 35] },
  { voce: "Sostituzione cuscinetti", manodopera: [120, 180], pezzo: [35, 85] },
  { voce: "Sostituzione scheda elettronica", manodopera: [150, 250], pezzo: [80, 220] },
  { voce: "Sostituzione motore", manodopera: [150, 220], pezzo: [80, 180] },
  { voce: "Sostituzione NTC/termostato", manodopera: [50, 70], pezzo: [10, 25] },
  { voce: "Sostituzione pressostato", manodopera: [55, 75], pezzo: [15, 30] },
  { voce: "Sostituzione ammortizzatori", manodopera: [70, 100], pezzo: [20, 45] },
  { voce: "Sostituzione cinghia", manodopera: [55, 75], pezzo: [10, 20] },
  { voce: "Ricarica gas frigorifero", manodopera: [80, 150], pezzo: [30, 60] },
  { voce: "Sostituzione compressore frigo", manodopera: [150, 250], pezzo: [100, 250] },
  { voce: "Sostituzione pompa lavastoviglie", manodopera: [70, 100], pezzo: [30, 70] },
  { voce: "Pulizia filtri condizionatore", manodopera: null, pezzo: null },
  { voce: "Manutenzione/sanificazione split", manodopera: [70, 130], pezzo: null },
  { voce: "Ricerca perdita + ricarica gas condizionatore", manodopera: [100, 200], pezzo: [40, 90] },
  { voce: "Sostituzione ventola unità interna", manodopera: [90, 150], pezzo: [40, 90] },
  { voce: "Sostituzione scheda elettronica split", manodopera: [120, 200], pezzo: [90, 200] },
  { voce: "Sostituzione compressore condizionatore", manodopera: [200, 350], pezzo: [150, 350] },
  { voce: "Sostituzione telecomando (universale)", manodopera: null, pezzo: [15, 40] },
];

// In Italia i numeri restano quelli rilevati, cifra per cifra. Altrove si
// arrotondano, perche' sono stime e devono sembrarlo.
const arrotonda = (n, esatto) => (esatto ? Math.round(n) : Math.round(n / 5) * 5);

const intervallo = (coppia, fattore, esatto) =>
  coppia ? `€${arrotonda(coppia[0] * fattore, esatto)}–${arrotonda(coppia[1] * fattore, esatto)}` : null;

const somma = (manodopera, pezzo, fattore, esatto) => {
  const min = (manodopera ? manodopera[0] * fattore : 0) + (pezzo ? pezzo[0] : 0);
  const max = (manodopera ? manodopera[1] * fattore : 0) + (pezzo ? pezzo[1] : 0);
  if (!min && !max) return "€0";
  return `€${arrotonda(min, esatto)}–${arrotonda(max, esatto)}`;
};

/**
 * La sezione dei costi da incollare nel prompt, su misura del paese.
 *
 * Torna testo gia' impaginato — e' quello che il prompt si aspettava quando la
 * tabella era scritta a mano li' dentro.
 */
export function sezioneCosti(lingua) {
  const m = mercatoDi(lingua);
  const esatto = lingua === MERCATO_PREDEFINITO;
  const f = m.manodopera;

  const righe = LISTINO.map((r) => {
    const mano = r.manodopera ? intervallo(r.manodopera, f, esatto) : "€0 fai-da-te";
    const pezzo = r.pezzo ? intervallo(r.pezzo, 1, esatto) : "—";
    return `| ${r.voce} | ${mano} | ${pezzo} | ${somma(r.manodopera, r.pezzo, f, esatto)} |`;
  });

  return `## STIMA COSTI — ${m.paese.toUpperCase()}

| Intervento | Manodopera | Pezzo | Totale |
|-----------|------------|-------|--------|
${righe.join("\n")}

${noteDi(lingua, m)}
**Nota condizionatori**: gli interventi sul circuito frigorifero costano di più perché richiedono un tecnico certificato F-Gas con attrezzatura dedicata; in piena estate i tempi di attesa si allungano e alcuni tecnici applicano un supplemento per l'urgenza.`;
}

function noteDi(lingua, m) {
  if (lingua === MERCATO_PREDEFINITO) {
    return "**Nota**: Prezzi indicativi per area nord Italia. Al sud i prezzi manodopera possono essere 10-20% inferiori.";
  }
  // Fuori dall'Italia l'AI deve sapere che sta maneggiando una stima, se no la
  // presenta con la stessa sicurezza dei numeri veri. Sara' lei a girare
  // l'avvertenza all'utente, nella sua lingua.
  return (
    `**Nota**: prezzi indicativi per ${m.paese}, ricavati dal listino italiano riscalando la manodopera ` +
    `sul costo del lavoro locale; i ricambi costano più o meno uguali in tutta l'UE. ` +
    `Sono STIME, non rilevazioni: presentale come tali e invita l'utente a farsi fare un preventivo. ` +
    `Non aggiungere cifre decimali né precisione che questi numeri non hanno.`
  );
}
