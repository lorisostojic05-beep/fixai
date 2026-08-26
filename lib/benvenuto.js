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

export const PER_ELETTRODOMESTICO = {
  Lavatrice: {
    sicurezza: "**spegnila e stacca la spina**, poi chiudi il rubinetto dell'acqua",
    targhetta: "**dentro lo sportello, sul bordo**",
  },
  Lavastoviglie: {
    sicurezza: "**spegnila e stacca la spina**, poi chiudi il rubinetto dell'acqua",
    targhetta: "**dentro lo sportello, sul bordo**",
  },
  Asciugatrice: {
    sicurezza: "**spegnila e stacca la spina**, e svuota la vaschetta della condensa se è piena",
    targhetta: "**dentro lo sportello**, oppure sul retro",
  },
  Frigorifero: {
    sicurezza: "**staccalo dalla presa** prima di guardarci dentro — se resterà staccato a lungo, salva il contenuto del freezer",
    targhetta: "**dentro il vano**, sulla parete laterale",
  },
  Forno: {
    sicurezza:
      "**spegnilo, staccalo dalla presa e lascialo raffreddare**. Se è a gas e senti odore di gas, chiudi il rubinetto, non accendere niente e apri le finestre",
    targhetta: "**sul bordo della porta**, aprendo lo sportello",
  },
  "Piano cottura": {
    // È l'unico dove l'avvertenza può salvare la vita, quindi viene prima di
    // tutto il resto e non si accorcia oltre.
    sicurezza:
      "se senti **odore di gas**, chiudi subito il rubinetto del gas, **non accendere né spegnere nulla** (nemmeno la luce) e apri le finestre. Se non c'è odore di gas, stacca la corrente dal quadro elettrico",
    targhetta: "**sotto il piano**, oppure sul libretto di istruzioni",
  },
  Condizionatore: {
    sicurezza:
      "**spegnilo dall'interruttore dedicato**. Non toccare mai i tubi del gas refrigerante, e non sporgerti dalla finestra per l'unità esterna",
    targhetta: "**sollevando il pannello frontale** dell'unità interna, o sul **fianco dell'unità esterna**",
  },
};

// Se un giorno si aggiunge un elettrodomestico e ci si dimentica di questa
// tabella, il messaggio deve restare sensato invece di sparire a metà.
const PREDEFINITO = {
  sicurezza: "**spegnilo e staccalo dalla presa elettrica**",
  targhetta: "di solito **sul bordo dello sportello** o sul retro",
};

export function messaggioBenvenuto(appliance, brand, problem) {
  const dati = PER_ELETTRODOMESTICO[appliance] || PREDEFINITO;
  const nome = `${brand ? brand + " " : ""}${appliance || "elettrodomestico"}`.trim();

  return [
    `Ciao! Sono Fixi. Vedo che hai un problema con **${nome}**${problem ? `: *"${problem}"*` : ""}.`,
    ``,
    `⚠️ **Prima di toccarlo:** ${dati.sicurezza}.`,
    ``,
    `Ora cerca la **targhetta del modello** — è ${dati.targhetta} — inquadrala e premi **📷 Analizza**, oppure un **tasto del volume** se il telefono è in un punto scomodo.`,
    ``,
    `Se non la trovi, scrivimi pure e cominciamo lo stesso.`,
    ``,
    `*(You can also write in English, Spanish, French or German.)*`,
  ].join("\n");
}
