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

  // ═══════════════════════════════════════════════════════════════════════════
  //  LA PAGINA DELLA DIAGNOSI
  //
  //  E' quella che usa chi ha pagato, quindi e' la meta' che conta davvero:
  //  sulla home uno decide se fidarsi, qui ha gia' dato i soldi.
  //
  //  Le parti fra graffe — {nome}, {email}, {quanti} — sono buchi che il
  //  programma riempie mentre disegna la pagina. Vanno lasciate INTATTE, con
  //  la stessa parola dentro: tradurre {email} in {correo} lascerebbe scritto
  //  "{correo}" sullo schermo al posto dell'indirizzo.
  // ═══════════════════════════════════════════════════════════════════════════
  diagnosi: {
    // I nomi a sinistra sono anche il valore che viaggia verso l'AI e verso
    // lib/benvenuto.js: restano in italiano SEMPRE, in ogni lingua. A destra
    // c'e' solo l'etichetta scritta sul pulsante.
    elettrodomestici: {
      Lavatrice: "Lavatrice",
      Lavastoviglie: "Lavastoviglie",
      Asciugatrice: "Asciugatrice",
      Frigorifero: "Frigorifero",
      Forno: "Forno",
      "Piano cottura": "Piano cottura",
      Condizionatore: "Condizionatore",
    },

    pagato: {
      titolo: "Pagamento confermato!",
      sottotitolo: "Ottimo! Tra pochi secondi inizia la tua sessione di videodiagnosi.",
      preparati: "Preparati:",
      spina: "Stacca la spina dell'elettrodomestico",
      luce: "Assicurati di avere buona illuminazione",
      telefono: "Tieni il telefono pronto per inquadrare",
      attesa: "La sessione inizia automaticamente...",
    },

    aggiorna: {
      titolo: "Aggiorna Fixi",
      apri: "Apri il Play Store",
      dopo: "Più tardi",
    },

    setup: {
      titolo: "Diagnosi elettrodomestico",
      sottotitolo:
        "Risparmia fino a €70 sulla visita del tecnico. La nostra AI diagnostica il problema via videochiamata.",

      ripresaTitoloReferto: "Hai un referto non ancora salvato",
      ripresaTitoloMeta: "Hai una diagnosi lasciata a metà",
      ripresaSenzaNome: "Diagnosi in corso",
      ripresaTestoReferto: "Puoi riaprirlo e salvarlo, senza pagare di nuovo.",
      ripresaTestoMeta: "Puoi riprenderla da dove eri, senza pagare di nuovo.",
      ripresaApriReferto: "Riapri il referto",
      ripresaRiprendi: "Riprendi la diagnosi",
      ripresaRicomincia: "Ricomincia",

      domanda: "Che elettrodomestico?",
      marca: "Marca",
      marcaEsempio: "es. Bosch, Samsung, Indesit...",
      problema: "Descrivi il problema",
      problemaEsempio: "es. Non scarica l'acqua, codice errore E18, fa rumore strano...",

      verifica: "Verifica pagamento...",
      avvia: "Avvia videodiagnosi",
      paga: "Paga €9,90 e avvia diagnosi",
      pagamentoSicuro: "Pagamento sicuro con Stripe. Riceverai il referto PDF al termine.",

      tornaHome: "Torna alla home",
      camera: "La camera viene usata solo durante la sessione. Nessun video viene salvato.",
      statoTecnico: "Stato tecnico",
    },

    referto: {
      titolo: "Referto diagnosi",
      diagnosi: "Diagnosi",
      faiDaTe: "Soluzione fai-da-te",
      pezzo: "Pezzo da sostituire",
      codice: "Codice:",
      prezzoStimato: "Prezzo stimato:",
      stimaIntervento: "Stima intervento tecnico",
      mostraAlTecnico: "Mostra questo referto al tecnico per ottenere un prezzo equo.",

      scarica: "Scarica",
      condividi: "Condividi",
      nuova: "Nuova diagnosi",

      emailSegnaposto: "Invia referto via email...",
      invio: "Invio...",
      invia: "Invia",
      inviato: "Referto inviato a {email}!",

      utile: "La diagnosi era utile?",
      risoltoDaSolo: "Risolto da solo",
      serveTecnico: "Serve il tecnico",
      grazieFeedback: "Grazie per il feedback! 🙏",

      tornaHome: "Torna alla home",
    },

    tecnico: {
      inviata: "Richiesta inviata!",
      // Due frasi e non una con il numero incastrato dentro: in italiano
      // cambia "tecnico/tecnici", ma in altre lingue cambia molto di piu' —
      // e il rumeno ha una forma apposta per i numeri fino a 19.
      avvisatoUno: "Abbiamo avvisato {quanti} tecnico della tua zona con il referto già pronto. Il primo disponibile ti chiamerà al numero che hai lasciato.",
      avvisatiTanti: "Abbiamo avvisato {quanti} tecnici della tua zona con il referto già pronto. Il primo disponibile ti chiamerà al numero che hai lasciato.",
      nessuno:
        "Al momento non ci sono tecnici attivi nella tua zona: abbiamo registrato la richiesta e ti contatteremo appena ne troviamo uno.",

      preferisci: "Preferisci un tecnico?",
      spiegazione:
        "Inviamo il referto ai tecnici della tua zona: il primo disponibile ti contatta. Gratis e senza impegno.",
      nome: "Nome *",
      telefono: "Telefono *",
      citta: "Città",
      cap: "CAP *",
      invioInCorso: "Invio in corso...",
      trova: "Trova un tecnico nella mia zona",
    },

    rimborso: {
      ricevuta: "Richiesta ricevuta. Ti rispondiamo per email entro pochi giorni.",
      racconta:
        "Raccontaci cosa non ha funzionato. Se la diagnosi non ti è stata utile ti restituiamo i €9,90.",
      email: "Email usata per il pagamento",
      motivo: "Perché non ti è servita?",
      invio: "Invio...",
      invia: "Invia la richiesta",
      annulla: "Annulla",
      chiedi: "La diagnosi non ti è stata utile? Chiedi il rimborso",
    },

    sessione: {
      silenzia: "Silenzia voce",
      attivaVoce: "Attiva voce",
      spegniCamera: "Disattiva camera",
      accendiCamera: "Attiva camera",
      cameraSpenta: "Off",
      analizza: "Analizza",
      analizzaSpiega: "Analizza quello che inquadri ora (o premi un tasto del volume)",
      generaReferto: "Genera referto",
      // Non e' solo un'istruzione per l'AI: finisce anche nella chat come
      // messaggio dell'utente, quindi si legge. L'AI la capisce in qualsiasi
      // lingua, percio' conviene tradurla invece di lasciare una riga italiana
      // in mezzo a una conversazione spagnola.
      chiediReferto: "Genera ora il referto finale con diagnosi, soluzione e stima costi.",
      parlaOScrivi: "Parla o scrivi...",
      toccaPerSmettere: "Tocca per smettere",
      toccaEParla: "Tocca e parla",
      cameraSpentaRiquadro: "Camera non attiva",
      staAnalizzando: "AI sta analizzando...",
      inAttesa: "In attesa...",
      staAnalizzandoBolla: "📷 Sto analizzando quello che inquadri...",
      preparoReferto: "📋 Sto preparando il referto…",
    },

    // Compaiono nella chat come se le dicesse Fixi: sono la cosa che uno legge
    // quando qualcosa non va, e in italiano dentro una sessione spagnola
    // sembrerebbero un pezzo di app rimasto indietro.
    errori: {
      pagamentoNonValido: "Pagamento non valido.",
      servizio: "Errore del servizio.",
      generico:
        "⚠️ Qualcosa è andato storto. Riprova, oppure clicca 📋 Genera referto per salvare la diagnosi raccolta finora.",
      troppoLento: "⚠️ La risposta ci sta mettendo troppo. Controlla la connessione e riprova tra un momento.",
      rete: "⚠️ Problema di rete. Controlla la connessione a internet e riprova.",
      sovraccarico: "⚠️ Servizio AI momentaneamente sovraccarico. Riprova tra qualche secondo.",
    },

    // Le finestrelle di sistema. "\n" manda a capo: va lasciato dov'e'.
    avvisi: {
      pdfNonRiuscito:
        "Non sono riuscito a preparare il PDF. Fattelo mandare per email qui sotto: il referto è identico.",
      salvatoNeiDownload: "✅ Salvato nei Download del telefono come {file}",
      salvataggioVecchiaApp:
        "Per salvare direttamente nei Download serve l'ultima versione di Fixi: aggiornala dal Play Store. Intanto apro la condivisione: scegli «Salva su file».",
      salvataggioAndroidVecchio:
        "Questo telefono ha una versione di Android che non permette il salvataggio diretto nei Download. Apro la condivisione: scegli «Salva su file».",
      // Il dettaglio tecnico finisce a schermo di proposito: dentro l'app non
      // c'e' una console da guardare, e cosi' chi prova puo' fotografarlo.
      salvataggioAltro:
        "Salvataggio nei Download non riuscito. Apro la condivisione: scegli «Salva su file».\n\nSe puoi, manda questo dettaglio a chi ha fatto l'app: {dettaglio}",
      condivisioneNonRiuscita:
        "Non sono riuscito a condividere il PDF. Fattelo mandare per email qui sotto: il referto è identico.",

      cameraNonAttiva: "Camera non attiva.",
      cameraNegata:
        "⚠️ Hai negato l'accesso alla camera. Per usare Fixi devi consentire l'accesso alla camera nelle impostazioni del browser.",
      cameraAssente:
        "⚠️ Nessuna camera trovata. Assicurati che il dispositivo abbia una camera funzionante.",
      cameraOccupata:
        "⚠️ La camera è già in uso da un'altra applicazione. Chiudi Teams, Zoom o altre app e riprova.",
      cameraGenerico:
        "⚠️ Impossibile accedere alla camera. Controlla i permessi del browser e riprova.",

      // Questi due sono le uscite di sicurezza: chi li legge ha pagato e sta
      // per perdere qualcosa. Il senso non puo' cambiare in nessuna lingua.
      refertoNonSalvato:
        "Non hai ancora salvato il referto né te lo sei fatto mandare per email: uscendo da qui lo perdi.\n\nVuoi uscire lo stesso?",
      diagnosiInCorso:
        "Sei nel mezzo di una diagnosi che hai pagato.\n\nSe esci ora la ritrovi da dove l'hai lasciata, per le prossime 2 ore.\n\nVuoi uscire?",

      pagamentoNonConfermato: "Pagamento non confermato. Riprova.",
      pagamentoAnnullato: "Pagamento annullato. Puoi riprovare quando vuoi.",
      compilaTutto: "Compila tutti i campi prima di procedere.",
      selezionaElettrodomestico: "Seleziona l'elettrodomestico e descrivi il problema.",

      emailNonValida: "Inserisci un indirizzo email valido.",
      emailNonInviata: "Non è stato possibile inviare l'email. Riprova, oppure scarica il PDF.",
      reteEmail: "⚠️ Problema di rete: email non inviata. Controlla la connessione e riprova.",
      rete: "⚠️ Problema di rete. Riprova.",

      rimborsoEmail: "Inserisci l'indirizzo email che hai usato per il pagamento.",
      rimborsoMotivo:
        "Scrivi in due righe cosa non ha funzionato: serve a noi per decidere, e per non ripetere l'errore.",
      rimborsoNonInviato: "Non sono riuscito a inviare la richiesta. Riprova.",

      tecnicoDati: "Inserisci nome e telefono: servono al tecnico per contattarti.",
      tecnicoCap: "Inserisci un CAP valido di 5 cifre.",

      vocaleNonDisponibile:
        "Il riconoscimento vocale non è disponibile su questo telefono. Puoi scrivere il messaggio.",
      vocalePermesso:
        "Per dettare serve il permesso del microfono: puoi attivarlo dalle impostazioni del telefono.",
      vocaleNonCapito:
        "Non ho capito quello che hai detto. Riprova parlando vicino al telefono, oppure scrivi il messaggio nella casella.",
      vocaleNonAvviata:
        "Non sono riuscito ad avviare la dettatura. Puoi scrivere il messaggio nella casella.\n\nDettaglio: {dettaglio}",
      vocaleAltro:
        "Dettatura non riuscita ({motivo}). Puoi scrivere il messaggio.",
      vocaleBrowser: "Il tuo browser non supporta il riconoscimento vocale. Usa Chrome.",
      vocaleNegatoBrowser:
        "Il permesso del microfono è stato negato: puoi darlo dalle impostazioni del browser.",
    },

    // ┌───────────────────────────────────────────────────────────────────────┐
    // │  IL PRIMO MESSAGGIO — LE RIGHE DA CONTROLLARE A MANO                  │
    // └───────────────────────────────────────────────────────────────────────┘
    // Le voci di "sicurezza" qui sotto sono le uniche del progetto dove una
    // traduzione storta puo' fare male a qualcuno: parlano di corrente, acqua
    // e gas, e chi legge ha l'elettrodomestico davanti e le mani libere.
    //
    // Sono sette per lingua. Si controllano rifacendole tradurre all'indietro
    // in italiano: se tornano a dire la stessa cosa, sono passate.
    benvenuto: {
      saluto: "Ciao! Sono Fixi. Vedo che hai un problema con **{nome}**.",
      salutoConProblema: 'Ciao! Sono Fixi. Vedo che hai un problema con **{nome}**: *"{problema}"*.',
      generico: "elettrodomestico",
      primaDiToccarlo: "⚠️ **Prima di toccarlo:** {sicurezza}.",
      targhetta:
        "Ora cerca la **targhetta del modello** — è {dove} — inquadrala e premi **📷 Analizza**, oppure un **tasto del volume** se il telefono è in un punto scomodo.",
      seNonLaTrovi: "Se non la trovi, scrivimi pure e cominciamo lo stesso.",
      altreLingue: "*(You can also write in English, Spanish, French or German.)*",

      sicurezza: {
        Lavatrice: "**spegnila e stacca la spina**, poi chiudi il rubinetto dell'acqua",
        Lavastoviglie: "**spegnila e stacca la spina**, poi chiudi il rubinetto dell'acqua",
        Asciugatrice:
          "**spegnila e stacca la spina**, e svuota la vaschetta della condensa se è piena",
        Frigorifero:
          "**staccalo dalla presa** prima di guardarci dentro — se resterà staccato a lungo, salva il contenuto del freezer",
        Forno:
          "**spegnilo, staccalo dalla presa e lascialo raffreddare**. Se è a gas e senti odore di gas, chiudi il rubinetto, non accendere niente e apri le finestre",
        "Piano cottura":
          "se senti **odore di gas**, chiudi subito il rubinetto del gas, **non accendere né spegnere nulla** (nemmeno la luce) e apri le finestre. Se non c'è odore di gas, stacca la corrente dal quadro elettrico",
        Condizionatore:
          "**spegnilo dall'interruttore dedicato**. Non toccare mai i tubi del gas refrigerante, e non sporgerti dalla finestra per l'unità esterna",
        // Serve se un giorno si aggiunge un elettrodomestico e ci si dimentica
        // di questa tabella: il messaggio resta sensato invece di sparire a meta'.
        predefinito: "**spegnilo e staccalo dalla presa elettrica**",
      },

      targhette: {
        Lavatrice: "**dentro lo sportello, sul bordo**",
        Lavastoviglie: "**dentro lo sportello, sul bordo**",
        Asciugatrice: "**dentro lo sportello**, oppure sul retro",
        Frigorifero: "**dentro il vano**, sulla parete laterale",
        Forno: "**sul bordo della porta**, aprendo lo sportello",
        "Piano cottura": "**sotto il piano**, oppure sul libretto di istruzioni",
        Condizionatore:
          "**sollevando il pannello frontale** dell'unità interna, o sul **fianco dell'unità esterna**",
        predefinito: "di solito **sul bordo dello sportello** o sul retro",
      },
    },
  },
};
