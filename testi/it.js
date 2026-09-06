// testi/it.js
// Tutte le parole dell'interfaccia in italiano. Nient'altro.
//
// Questo file e' l'originale: le altre lingue nascono da qui, generate da
// scripts/traduci.js. E' anche l'unico che si scrive a mano — se una frase
// va cambiata, si cambia QUI e si rigenerano le traduzioni.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  REGOLE DI QUESTO FILE                                                  │
// │                                                                         │
// │  1. Solo testo. Niente <br>, niente <strong>, niente className,        │
// │     niente href. Se una frase va spezzata su due righe o ha una parte   │
// │     in grassetto, si divide in due chiavi.                              │
// │                                                                         │
// │  2. I nomi a sinistra (meta, nav, hero...) non si traducono mai:        │
// │     sono l'aggancio che il codice usa per ritrovare la frase.           │
// │                                                                         │
// │  3. Le emoji e i numeri d'ordine (01, 02...) restano nelle pagine,      │
// │     non qui: non sono lingua, e ogni cosa che non passa di qui e' una   │
// │     cosa che la traduzione non puo' rompere.                            │
// └─────────────────────────────────────────────────────────────────────────┘
//
// I prezzi stanno qui e non nel codice perche' cambiano forma da lingua a
// lingua: "€9,90" in italiano, "€9.90" in inglese, "9,90 €" in francese.

export default {
  meta: {
    titolo: "Fixi — Diagnosi elettrodomestici via AI",
    descrizione:
      "Risparmia sulla visita del tecnico. Diagnosi AI via videochiamata in 10 minuti.",
  },

  nav: {
    comeFunziona: "Come funziona",
    guide: "Guide",
    prezzi: "Prezzi",
    tecnici: "Sei un tecnico?",
    avvia: "Avvia diagnosi",
  },

  lingua: {
    scegli: "Scegli la lingua",
    // Mostrato sul sito (mai nell'app) a chi arriva con il browser in un'altra
    // lingua: un invito, non un rinvio automatico. Il perche' sta nel commento
    // di next.config.js.
    disponibileIn: "Questa pagina è disponibile in italiano",
  },

  hero: {
    badge: "Diagnosi AI in 10 minuti",
    titolo1: "La lavatrice è rotta.",
    titolo2: "Niente panico.",
    sottotitolo:
      "Un'AI ti guida via videochiamata, identifica il problema e ti consegna un referto preciso. Senza aspettare il tecnico. Senza pagare €80 solo per farlo venire.",
    avvia: "Avvia diagnosi",
    comeFunziona: "Come funziona",
  },

  // Il finto telefono nella prima schermata: si vede da subito, e in una lingua
  // sbagliata e' la prima cosa che tradisce una traduzione fatta a meta'.
  telefono: {
    sessione: "Sessione attiva",
    analizza: "AI analizza",
    bolla1:
      "Ho visto il pannellino. Prova a svitare il tappo con un panno — potrebbe uscire acqua residua.",
    bolla2: "Ok fatto, c'era del pelo",
    bolla3: "Perfetto! Questo è il problema. Rimonta il filtro e testa un ciclo breve.",
    risparmioEtichetta: "Risparmio stimato",
    risparmioValore: "€70,10",
    problemaEtichetta: "Problema risolto",
    problemaValore: "Filtro pompa",
  },

  numeri: [
    { valore: "€9,90", etichetta: "Diagnosi completa" },
    { valore: "10 min", etichetta: "Tempo medio sessione" },
    { valore: "80%", etichetta: "Risolti in autonomia" },
    { valore: "€70", etichetta: "Risparmio medio" },
  ],

  passi: {
    tag: "Come funziona",
    titolo1: "Quattro passi.",
    titolo2: "Problema risolto.",
    sottotitolo:
      "Niente attese, niente sorprese. In meno di 15 minuti sai esattamente cosa c'è che non va.",
    elenco: [
      {
        titolo: "Descrivi il problema",
        testo:
          "Seleziona l'elettrodomestico, inserisci la marca e descrivi il guasto in poche parole.",
      },
      {
        titolo: "Paga €9,90",
        testo: "Pagamento sicuro con carta. Molto meno di una visita del tecnico.",
      },
      {
        titolo: "Videochiamata con l'AI",
        testo:
          "Punta la camera verso l'elettrodomestico. L'AI analizza e ti guida passo passo.",
      },
      {
        titolo: "Ricevi il referto",
        testo:
          "Diagnosi, soluzione fai-da-te e stima dei costi se serve il tecnico. In PDF.",
      },
    ],
  },

  perche: {
    tag: "Perché Fixi",
    titolo1: "Diagnosi precisa.",
    titolo2: "Referto in mano.",
    elenco: [
      {
        titolo: "AI con visione",
        testo:
          "Il modello vede la tua macchina in tempo reale e analizza codici errore, perdite, componenti.",
      },
      {
        titolo: "Guida passo passo",
        testo:
          "Non ti lascia solo. Ti dice esattamente cosa fare, come farlo e in quale ordine.",
      },
      {
        titolo: "Referto per il tecnico",
        testo:
          "Se non riesci da solo, hai un documento con diagnosi e prezzi equi da mostrare al tecnico.",
      },
      {
        // I nomi delle marche non vanno tradotti in nessuna lingua.
        titolo: "Tutti i brand",
        testo: "Bosch, Samsung, Indesit, Whirlpool, Miele, LG, Candy e molti altri.",
      },
    ],
    esempioTitolo: "Esempio referto",
    referto: {
      diagnosiEtichetta: "Diagnosi",
      diagnosiValore: "Filtro pompa scarico intasato. Codice E18 confermato.",
      soluzioneEtichetta: "Soluzione fai-da-te",
      soluzioneValore: "Pulizia filtro in basso a destra. Guida inclusa nel PDF.",
      tecnicoEtichetta: "Se serve il tecnico",
      tecnicoValore: "Sostituzione pompa scarico",
      costoEtichetta: "Stima costo",
      costoValore: "€85–145",
    },
  },

  prezzi: {
    tag: "Prezzi",
    titolo: "Semplice e trasparente.",
    sottotitolo: "Nessun abbonamento: paghi solo quando hai bisogno.",
    nome: "Diagnosi singola",
    // Spezzato perche' nella pagina i centesimi sono scritti piu' piccoli,
    // in alto. Chi traduce deve poter cambiare la valuta di posto.
    importoValuta: "€",
    importoIntero: "9",
    importoCentesimi: ",90",
    periodo: "a sessione · nessun abbonamento",
    caratteristiche: [
      "30 min videochiamata AI",
      "Referto PDF scaricabile",
      "Guida fai-da-te inclusa",
      "Stima costo tecnico",
    ],
    avvia: "Avvia diagnosi",
  },

  tecnici: {
    tag: "Per i professionisti",
    titolo1: "Sei un tecnico?",
    titolo2: "Unisciti a Fixi.",
    sottotitolo:
      "Ricevi lavori qualificati con diagnosi già fatta. Nessun costo di iscrizione, nessun credito da acquistare: in questa fase di lancio i contatti non ti costano nulla.",
    vantaggi: [
      {
        titolo: "Clienti già qualificati",
        testo:
          "Arrivano con diagnosi e referto — sai già cosa c'è da fare prima di uscire.",
      },
      {
        titolo: "Costo zero",
        testo:
          "Iscrizione gratuita e nessuna commissione: in fase di lancio i contatti sono gratis.",
      },
      {
        titolo: "Costruisci la tua reputazione",
        testo: "Recensioni verificate, badge qualità, più visibilità con il tempo.",
      },
    ],
    iscriviti: "Iscriviti gratis",
    scopri: "Scopri di più",
    numeri: [
      { valore: "€0", etichetta: "Costo iscrizione" },
      { valore: "0%", etichetta: "Commissione sui lavori" },
      { valore: "48h", etichetta: "Tempo medio attivazione" },
      { valore: "∞", etichetta: "Lavori disponibili" },
    ],
  },

  finale: {
    tag: "Inizia ora",
    titolo1: "La lavatrice non aspetta.",
    titolo2: "Tu neanche.",
    sottotitolo: "Diagnosi completa in 10 minuti. €9,90. Senza appuntamento.",
    avvia: "Avvia diagnosi",
    garanziaTitolo: "Soddisfatto o rimborsato.",
    garanziaTesto:
      "Se la diagnosi non ti è stata utile ti restituiamo i €9,90, entro 14 giorni e senza discussioni.",
  },

  footer: {
    descrizione: "Diagnosi elettrodomestici via AI",
    guide: "Guide",
    privacy: "Privacy",
    stato: "Stato tecnico",
  },
};
