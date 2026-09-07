// lib/mercati.js
// Le cose che cambiano da paese a paese, e che nessuna traduzione puo' sistemare.
//
// Tradurre un referto non lo rende giusto: un tedesco che legge "sostituzione
// pompa €85–145" legge un numero italiano scritto in tedesco. E un portoghese
// che scrive il suo codice postale "1000-001" si vedeva rifiutare il modulo,
// perche' il controllo chiedeva cinque cifre secche — che e' la forma italiana.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  ONESTA' DI QUESTI NUMERI                                                 │
// │                                                                           │
// │  Il listino italiano e' l'unico raccolto sul mercato vero. Gli altri NON  │
// │  sono listini: sono lo stesso listino con la manodopera riscalata sul     │
// │  costo del lavoro del paese, e i ricambi lasciati com'erano — un mercato  │
// │  unico, gli stessi pezzi, gli stessi produttori.                          │
// │                                                                           │
// │  I moltiplicatori sono approssimazioni, non rilevazioni. Vanno corretti   │
// │  appena si hanno preventivi veri di quel paese. Proprio perche' sono      │
// │  stime, fuori dall'Italia i prezzi si arrotondano alla decina: "€120–170" │
// │  dice quello che sappiamo, "€118–166" fingerebbe una precisione che non   │
// │  abbiamo.                                                                 │
// └───────────────────────────────────────────────────────────────────────────┘

export const MERCATI = {
  it: {
    paese: "Italia",
    manodopera: 1.0, // il listino di partenza: dati veri, non stimati
    // Cinque cifre. E' anche il formato su cui era scritto tutto il codice
    // prima del 06/09/2026, quando l'unico paese era questo.
    cap: /^\d{5}$/,
    capEsempio: "20100",
    capCifre: true, // si puo' togliere tutto quello che non e' una cifra
    capLunghezza: 5,
  },
  de: {
    paese: "Germania",
    manodopera: 1.4,
    cap: /^\d{5}$/,
    capEsempio: "10115",
    capCifre: true,
    capLunghezza: 5,
  },
  fr: {
    paese: "Francia",
    manodopera: 1.35,
    cap: /^\d{5}$/,
    capEsempio: "75001",
    capCifre: true,
    capLunghezza: 5,
  },
  es: {
    paese: "Spagna",
    manodopera: 0.85,
    cap: /^\d{5}$/,
    capEsempio: "28001",
    capCifre: true,
    capLunghezza: 5,
  },
  pt: {
    paese: "Portogallo",
    manodopera: 0.65,
    // Quattro cifre, poi un trattino e altre tre: 1000-001. Il trattino fa
    // parte del codice, quindi qui NON si puo' buttare via tutto cio' che non
    // e' una cifra come si faceva per l'Italia.
    cap: /^\d{4}(-\d{3})?$/,
    capEsempio: "1000-001",
    capCifre: false,
    capLunghezza: 8,
  },
  ro: {
    paese: "Romania",
    manodopera: 0.45,
    cap: /^\d{6}$/,
    capEsempio: "010011",
    capCifre: true,
    capLunghezza: 6,
  },
  // L'inglese non e' un paese. Chi arriva di qui puo' essere ovunque, quindi
  // si usa una via di mezzo europea e il referto lo dice chiaramente.
  en: {
    paese: "Europa",
    manodopera: 1.1,
    // Permissivo di proposito: deve accettare "SW1A 1AA", "1012 AB", "00-001".
    cap: /^[A-Za-z0-9][A-Za-z0-9 \-]{1,9}$/,
    capEsempio: "1012 AB",
    capCifre: false,
    capLunghezza: 10,
  },
};

export const MERCATO_PREDEFINITO = "it";

export function mercatoDi(lingua) {
  return MERCATI[lingua] || MERCATI[MERCATO_PREDEFINITO];
}

/** true se il codice postale ha la forma giusta per quel paese. */
export function capValido(cap, lingua) {
  return mercatoDi(lingua).cap.test(String(cap || "").trim());
}

/**
 * Ripulisce quello che l'utente sta scrivendo, secondo il paese.
 *
 * In Italia si buttava via tutto cio' che non e' una cifra, ed era giusto
 * finche' l'Italia era l'unico paese. In Portogallo quella stessa riga
 * cancellava il trattino di "1000-001" mentre lo si scriveva.
 */
export function ripulisciCap(testo, lingua) {
  const m = mercatoDi(lingua);
  const grezzo = String(testo || "");
  const pulito = m.capCifre ? grezzo.replace(/\D/g, "") : grezzo.replace(/[^A-Za-z0-9 \-]/g, "");
  return pulito.slice(0, m.capLunghezza);
}
