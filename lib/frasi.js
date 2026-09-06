// lib/frasi.js
// Due funzioncine per maneggiare una frase gia' scelta: riempire i buchi e
// leggere il grassetto.
//
// ── Perche' non stanno in lib/testi.js ──────────────────────────────────────
// Quel file importa tutte e sette le lingue, ed e' fatto apposta per essere
// usato SOLO dentro getStaticProps: Next.js si accorge che serve al server e
// non lo manda al browser.
//
// Ma queste due servono mentre la pagina si disegna, cioe' anche nel browser.
// Prendendole da lib/testi.js si trascinerebbe dentro l'intero magazzino
// delle lingue: ogni visitatore scaricherebbe sette traduzioni per vederne
// una. Stanno qui, dove non c'e' niente da trascinare.

/**
 * Riempie i buchi di una frase: riempi("Inviato a {email}", { email: "..." }).
 *
 * Serve perche' l'ordine delle parole cambia da lingua a lingua e non si puo'
 * costruire una frase incollando pezzi: "Salvato come X" in tedesco mette il
 * verbo in fondo. Con il segnaposto, chi traduce sposta {file} dove serve e
 * la frase resta giusta.
 *
 * Un buco senza valore resta scritto com'e' invece di diventare "undefined":
 * "{email}" sullo schermo si nota e si corregge, "undefined" spaventa e basta.
 */
export function riempi(frase, valori = {}) {
  return String(frase).replace(/\{(\w+)\}/g, (intero, chiave) =>
    chiave in valori ? valori[chiave] : intero
  );
}

/**
 * Spezza **cosi** in pezzi da mettere in grassetto, e basta.
 *
 * Serve per l'informativa privacy, dove il grassetto non e' decorazione: e'
 * quello che distingue "non salviamo i video" dal resto del paragrafo, cioe'
 * la riga che uno cerca quando gli importa davvero.
 *
 * Perche' non si mette <strong> direttamente nel file delle frasi: quel file
 * viene dato da tradurre, e ogni tag che ci sta dentro e' un tag che puo'
 * tornare indietro storto o non chiuso. Due asterischi no — e se anche
 * sparissero, resterebbe una frase giusta scritta in tondo.
 *
 * Torna dei pezzi, mai HTML da iniettare: se un giorno in una traduzione
 * finisse del codice, verrebbe stampato come testo invece che eseguito.
 */
/**
 * Una data scritta nella lingua di chi legge: "31 agosto 2026" per un
 * italiano, "31. August 2026" per un tedesco, "August 31, 2026" per un inglese.
 *
 * Le date si tengono in forma "2026-08-31" e non gia' scritte a parole, se no
 * il mese resta nella lingua di chi le ha battute: nelle informative si
 * leggeva "Letzte Aktualisierung: 25 luglio 2026", tedesco tranne il mese.
 *
 * I pezzi si passano separati a new Date invece della stringa intera: scritta
 * cosi' verrebbe letta come mezzanotte a Greenwich, e a ovest di Londra la
 * data mostrata sarebbe il giorno prima.
 */
export function dataLeggibile(iso, lingua) {
  const [anno, mese, giorno] = String(iso).split("-").map(Number);
  if (!anno || !mese || !giorno) return String(iso);
  return new Date(anno, mese - 1, giorno).toLocaleDateString(lingua || "it", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Spezza una frase attorno a un buco, per infilarci dentro un collegamento:
 *
 *   spezzaSu("Scrivici a {email} quando vuoi.", "email")
 *   → { prima: "Scrivici a ", dopo: " quando vuoi." }
 *
 * Serve a non spezzare la frase a mano in "prima del link" e "dopo il link":
 * fatta cosi', chi traduce puo' spostare il collegamento dove lo vuole la
 * sintassi della sua lingua, invece di doverlo tenere in mezzo per forza.
 */
export function spezzaSu(frase, nome) {
  const [prima, ...resto] = String(frase).split(`{${nome}}`);
  return { prima, dopo: resto.join(`{${nome}}`) };
}

export function grassetto(frase) {
  return String(frase)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((pezzo, i) =>
      pezzo.startsWith("**") && pezzo.endsWith("**")
        ? { forte: true, testo: pezzo.slice(2, -2), chiave: i }
        : { forte: false, testo: pezzo, chiave: i }
    );
}
