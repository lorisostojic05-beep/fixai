// lib/benvenuto.js
// Il primo messaggio di Fixi, costruito su misura dell'elettrodomestico.
//
// Prima era uno solo per tutti: elencava dov'è la targhetta di TUTTI e sette
// gli elettrodomestici e avvertiva su acqua e gas anche a chi aveva un
// frigorifero. Un tester ha segnalato che era troppo lungo — ed è il primo
// messaggio che uno legge, quello che decide se ha voglia di continuare.
//
// Accorciarlo non toglie sicurezza: le regole complete restano nel
// SYSTEM_PROMPT, che l'AI applica per tutta la conversazione. Qui serve solo
// l'avvertenza da leggere PRIMA di mettere le mani sull'apparecchio, e per
// quella è meglio una riga giusta che cinque generiche saltate a piè pari.
//
// ── Dove sono finite le frasi ───────────────────────────────────────────────
// Dal 06/09/2026 non stanno più qui ma in testi/<lingua>.js, sotto
// diagnosi.benvenuto: questo messaggio è l'unico testo dell'AI che l'utente
// legge parola per parola invece di riceverlo generato, quindi va tradotto
// come il resto dell'interfaccia.
//
// Qui resta solo il montaggio. La tabella con le sette avvertenze di sicurezza
// è la parte del progetto dove una traduzione storta può fare male a qualcuno:
// il commento sopra a quella tabella spiega come si controlla.

/**
 * @param testi     t.diagnosi.benvenuto della lingua in corso.
 * @param etichetta il nome dell'elettrodomestico nella lingua dell'utente.
 *                  Senza, il messaggio tedesco direbbe "Miele Lavatrice".
 */
export function messaggioBenvenuto(appliance, brand, problem, testi, etichetta) {
  // Si cerca con "appliance", che resta italiano in tutte le lingue perche' e'
  // la chiave della tabella. Si MOSTRA "etichetta", che e' tradotta: sono due
  // cose diverse e confonderle si vede subito, in mezzo alla prima frase.
  //
  // "predefinito" e' la voce di scorta: se un giorno si aggiunge un
  // elettrodomestico e ci si dimentica della tabella, il messaggio resta
  // sensato invece di parlare di "undefined".
  const sicurezza = testi.sicurezza[appliance] || testi.sicurezza.predefinito;
  const dove = testi.targhette[appliance] || testi.targhette.predefinito;

  const visibile = etichetta || appliance || testi.generico;
  const nome = `${brand ? brand + " " : ""}${visibile}`.trim();

  const saluto = problem
    ? riempi(testi.salutoConProblema, { nome, problema: problem })
    : riempi(testi.saluto, { nome });

  return [
    saluto,
    ``,
    riempi(testi.primaDiToccarlo, { sicurezza }),
    ``,
    riempi(testi.targhetta, { dove }),
    ``,
    testi.seNonLaTrovi,
    ``,
    // Restava utile anche adesso che c'e' il tasto della lingua: il tasto
    // cambia l'interfaccia, questa riga dice un'altra cosa — che l'AI segue
    // la lingua in cui SCRIVI, anche se non e' quella dei pulsanti. Serve a
    // chi ha una lingua che non abbiamo e sta usando l'inglese di ripiego.
    testi.altreLingue,
  ].join("\n");
}

// Copia locale di lib/testi.js#riempi: questo modulo si prova da riga di
// comando, e importare da li' trascinerebbe dentro tutte e sette le lingue.
function riempi(frase, valori) {
  return String(frase).replace(/\{(\w+)\}/g, (intero, chiave) =>
    chiave in valori ? valori[chiave] : intero
  );
}
