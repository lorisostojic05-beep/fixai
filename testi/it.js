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
  //  L'EMAIL CON IL REFERTO
  //
  //  E' l'unica cosa di Fixi che arriva a casa dell'utente quando lui non e'
  //  piu' sul sito. Prima era sempre italiana: uno spagnolo faceva tutta la
  //  diagnosi in spagnolo, pagava, e poi si ritrovava nella posta un documento
  //  in una lingua che non legge — proprio il pezzo che deve mostrare al
  //  tecnico.
  // ═══════════════════════════════════════════════════════════════════════════
  email: {
    oggetto: "Il tuo referto Fixi {numero} — {macchina}",
    sottotitolo: "Diagnosi elettrodomestici via videochiamata AI",
    intestazione: "Referto {numero} — {data}",
    problema: "Problema riportato: \"{problema}\"",

    diagnosi: "DIAGNOSI",
    faiDaTe: "SOLUZIONE FAI-DA-TE",
    pezzo: "PEZZO DA SOSTITUIRE",
    codice: "Codice: {codice}",
    prezzo: "Prezzo: {prezzo}",
    stima: "STIMA INTERVENTO TECNICO",
    mostraAlTecnico: "Mostra questo referto al tecnico per un prezzo equo.",

    // "bassa/media/alta" restano in italiano dentro il referto perche' sono
    // etichette, non testo: qui si traduce solo quello che si legge.
    urgenza: "Urgenza: {livello} — {cosaFare}",
    urgenzaBassa: "BASSA",
    urgenzaMedia: "MEDIA",
    urgenzaAlta: "ALTA",
    urgenzaBassaCosaFare: "Nessuna fretta",
    urgenzaMediaCosaFare: "Intervieni entro qualche giorno",
    urgenzaAltaCosaFare: "Intervieni il prima possibile",

    piede: "Referto generato da sistema AI. Consultare sempre un tecnico qualificato.",
  },

  // Le due email che partono DOPO, quando il cliente non e' piu' sul sito: le
  // fa scattare il tecnico, non lui. Per questo la sua lingua va letta dalla
  // colonna "lingua" di richieste_intervento invece che dalla pagina.
  //
  // Attenzione: le email che vanno al TECNICO restano italiane, e non e' una
  // dimenticanza — i tecnici sono italiani. Qui c'e' solo cio' che legge il
  // cliente.
  emailTecnicoTrovato: {
    oggetto: "Abbiamo trovato il tuo tecnico! 🔧 (richiesta {numero})",
    titolo: "Tecnico trovato ✅",
    sottotitolo:
      "Ciao {nome}, un tecnico ha accettato la tua richiesta e ti contatterà a breve. Ecco i suoi riferimenti:",
    campoNome: "Nome",
    campoTelefono: "Telefono",
    campoEmail: "Email",
    campoZona: "Zona",
    accordatevi: "Vi consigliamo di accordarvi telefonicamente su orario e sopralluogo.",
  },

  emailRecensione: {
    oggetto: "Com'è andata la riparazione? Lascia una recensione ({numero})",
    intestazione: "Com'è andata la riparazione?",
    saluto: "Ciao {nome},",
    testo:
      "il tecnico {tecnico} ha segnato il tuo intervento come completato. Ci racconti com'è andata? Bastano 30 secondi e aiuti gli altri clienti a scegliere bene.",
    pulsante: "Lascia una recensione",
  },

  // Il PDF: lo stesso referto, ma e' il foglio che il cliente mette in mano al
  // tecnico. Condivide quasi tutto con l'email; qui c'e' solo quello che
  // cambia, per non tenere due copie delle stesse frasi.
  pdf: {
    dataReferto: "Referto del {data}",
    numeroReferto: "Referto #{numero}",
    nome: "Nome: {nome}",
    codice: "Codice: {codice}",
    prezzoStimato: "Prezzo stimato: {prezzo}",
    risolvibileDaSolo: "Risolvibile in autonomia",
    mostraAlTecnico: "Mostra questo referto al tecnico per ottenere un prezzo equo.",
    piedeSinistra: "Fixi — Diagnosi elettrodomestici via AI",
    piedeCentro: "Questo referto è generato da un sistema AI a scopo diagnostico.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  L'INFORMATIVA PRIVACY
  //
  //  E' un documento legale, non un'interfaccia: si traduce come cortesia
  //  verso chi legge, ma in caso di differenze fa fede l'italiano — e la
  //  pagina lo dice, in alto, in tutte le lingue tranne quella.
  //
  //  Il doppio asterisco intorno a una parte la mette in grassetto. Qui non e'
  //  decorazione: **Non salviamo i video** e' la riga che uno cerca quando gli
  //  importa davvero, e in tondo si perde nel paragrafo.
  // ═══════════════════════════════════════════════════════════════════════════
  privacy: {
    // In italiano diceva "Privacy Policy", cioe' inglese: i traduttori se lo
    // portavano dietro tale e quale, e in tedesco la scheda del browser
    // diceva "Privacy Policy" mentre la pagina diceva "Datenschutzerklarung".
    metaTitolo: "Informativa sulla privacy — Fixi",
    titolo: "Informativa sulla privacy",
    aggiornato: "Ultimo aggiornamento: {data}",
    // Non compare nella versione italiana: e' la versione italiana.
    traduzioneDiCortesia:
      "Questa è una traduzione di cortesia. In caso di differenze fa fede la versione italiana.",

    chiSiamo: {
      titolo: "1. Chi siamo (Titolare del trattamento)",
      cosa: "Fixi è un servizio di diagnosi di elettrodomestici tramite videochiamata con intelligenza artificiale, che mette inoltre in contatto gli utenti con tecnici riparatori.",
      titolare: "Titolare del trattamento: **{nome}**{piva}{sede}.",
      conPiva: " — P.IVA {piva}",
      conSede: ", con sede in {sede}",
      domande: "Per qualsiasi domanda sulla privacy puoi scriverci a {email}.",
    },

    dati: {
      titolo: "2. Quali dati raccogliamo",
      intro: "A seconda di come usi Fixi, trattiamo:",
      voci: [
        "**Dati della diagnosi**: tipo di elettrodomestico, marca, descrizione del problema e i messaggi che scambi con l'assistente AI.",
        "**Immagini dalla camera**: durante la sessione, i fotogrammi che inquadri vengono inviati per l'analisi all'AI. **Non salviamo i video né i fotogrammi**: sono elaborati e poi scartati.",
        "**Email**: se scegli di ricevere il referto via email o di essere ricontattato da un tecnico.",
        "**Dati per la richiesta di un tecnico**: nome, telefono, città e CAP, che condividiamo con i tecnici della tua zona per permettere loro di contattarti.",
        "**Dati di pagamento**: i pagamenti sono gestiti da Stripe. **Non vediamo né conserviamo i dati della tua carta**; registriamo solo l'esito del pagamento.",
        "**Recensioni**: il voto e il commento che lasci su un intervento.",
        "**Se sei un tecnico**: nome, cognome, email, telefono, città, CAP, specializzazioni ed esperienza che inserisci in fase di iscrizione.",
      ],
    },

    perche: {
      titolo: "3. Perché li usiamo",
      voci: [
        "Per fornirti la diagnosi e generare il referto.",
        "Per inviarti il referto via email, se lo richiedi.",
        "Per metterti in contatto con un tecnico della tua zona, se lo richiedi.",
        "Per gestire il pagamento del servizio.",
        "Per migliorare il servizio (statistiche aggregate e feedback).",
      ],
      base: "La base giuridica è l'esecuzione del servizio che ci chiedi e, dove previsto, il tuo consenso.",
    },

    camera: {
      titolo: "4. La camera",
      testo:
        "L'accesso alla camera viene usato **solo durante la sessione di diagnosi** e solo per mostrare all'AI ciò che inquadri. I fotogrammi vengono analizzati in tempo reale e non vengono memorizzati sui nostri sistemi. Puoi disattivare la camera in qualsiasi momento durante la sessione.",
    },

    terzeParti: {
      titolo: "5. Servizi di terze parti",
      intro: "Per funzionare, Fixi si appoggia a fornitori che trattano alcuni dati per nostro conto:",
      voci: [
        "**Anthropic** — l'intelligenza artificiale che analizza le immagini e dialoga con te.",
        "**Stripe** — la gestione dei pagamenti.",
        "**Supabase** — il database dove salviamo le sessioni, le richieste di intervento e i dati dei tecnici.",
        "**Resend** — l'invio delle email (referti, notifiche ai tecnici).",
        "**Vercel** — l'hosting del servizio.",
      ],
      chiusura: "Ciascun fornitore tratta i dati secondo le proprie informative privacy.",
    },

    conservazione: {
      titolo: "6. Per quanto tempo conserviamo i dati",
      testo:
        "Conserviamo i dati delle sessioni, delle richieste di intervento e dei tecnici per il tempo necessario a fornire il servizio e adempiere agli obblighi di legge. Puoi chiederci in qualsiasi momento la cancellazione dei tuoi dati.",
    },

    diritti: {
      titolo: "7. I tuoi diritti",
      testo:
        "Hai il diritto di accedere ai tuoi dati, correggerli, chiederne la cancellazione o limitarne l'uso, e di opporti al trattamento. Per esercitare questi diritti scrivici a {email}.",
      cancellazione:
        "Per la sola cancellazione trovi i passaggi, l'elenco dei dati eliminati e i tempi nella pagina {link}.",
      cancellazioneLink: "richiesta di cancellazione dei dati",
    },

    minori: {
      titolo: "8. Minori",
      testo: "Fixi non è rivolto a minori di 16 anni e non raccogliamo consapevolmente i loro dati.",
    },

    modifiche: {
      titolo: "9. Modifiche a questa informativa",
      testo:
        "Potremmo aggiornare questa informativa. In caso di modifiche rilevanti lo segnaleremo su questa pagina, aggiornando la data in alto.",
    },

    contatti: {
      titolo: "10. Contatti",
      testo: "Per qualsiasi domanda sulla privacy o sui tuoi dati: {email}.",
    },

    torna: "Torna a Fixi",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  LA RICHIESTA DI CANCELLAZIONE DEI DATI
  //
  //  Pagina obbligatoria per Google Play, e il suo indirizzo italiano e' gia'
  //  registrato nella Play Console: /cancellazione-dati deve continuare a
  //  rispondere per sempre. Le versioni tradotte si aggiungono accanto, non al
  //  suo posto.
  // ═══════════════════════════════════════════════════════════════════════════
  cancellazione: {
    metaTitolo: "Richiesta di cancellazione dei dati — Fixi",
    titolo: "Richiesta di cancellazione dei dati",
    aggiornato: "Ultimo aggiornamento: {data}",
    // Come nell'informativa: anche questa pagina prende un impegno (30 giorni),
    // e un impegno non puo' dipendere da come e' venuta una traduzione.
    traduzioneDiCortesia:
      "Questa è una traduzione di cortesia. In caso di differenze fa fede la versione italiana.",
    // Finisce nell'oggetto dell'email che l'utente invia. Si traduce perche'
    // deve capirlo chi scrive; "Fixi" dentro lo rende comunque riconoscibile
    // in mezzo alla posta.
    oggettoEmail: "Cancellazione dati Fixi",

    quale: {
      titolo: "A quale app si riferisce questa pagina",
      app: "Questa pagina riguarda l'applicazione **Fixi — Diagnosi Elettrodomestici**, sviluppata e pubblicata da **{titolare}**, e il sito **Fixi**. Vale sia per chi usa il servizio di diagnosi, sia per i tecnici iscritti alla rete.",
      senzaAccount:
        "Fixi **non ha account né registrazione**: non esiste un profilo da eliminare dall'app. La cancellazione dei dati si richiede scrivendoci, come spiegato qui sotto.",
    },

    come: {
      titolo: "Come richiedere la cancellazione",
      passo1: "Invia un'email a {email} con oggetto **«{oggetto}»**.",
      passo2:
        "Nel messaggio indica i dati che ci hai fornito, così possiamo trovare le tue informazioni: l'**indirizzo email** che hai usato per ricevere il referto e, se hai richiesto l'intervento di un tecnico, anche **nome, numero di telefono e CAP**.",
      passo3:
        "Specifica se vuoi cancellare **tutti i dati** oppure solo una parte (ad esempio la sola richiesta di intervento).",
      passo4: "Riceverai una conferma via email quando la cancellazione è stata eseguita.",
      gratis: "Non serve nessun modulo e la richiesta è gratuita.",
    },

    cosaSiCancella: {
      titolo: "Quali dati vengono cancellati",
      intro: "Su tua richiesta eliminiamo dai nostri sistemi:",
      voci: [
        "la **sessione di diagnosi**: elettrodomestico, marca, descrizione del problema, la conversazione con l'assistente AI e il referto generato;",
        "il tuo **indirizzo email**, se ce l'hai lasciato per ricevere il referto;",
        "la **richiesta di intervento**: nome, telefono, email, città e CAP comunicati per essere ricontattato da un tecnico;",
        "l'eventuale **recensione** (voto e commento) lasciata dopo un intervento;",
        "per i tecnici iscritti: **l'intera scheda**, con nome, cognome, email, telefono, città, CAP, specializzazioni ed esperienza.",
      ],
      camera:
        "Le **immagini della camera** non compaiono in questo elenco perché non vengono mai salvate: i fotogrammi sono analizzati durante la sessione e subito scartati, quindi non c'è nulla da cancellare.",
    },

    cosaResta: {
      titolo: "Quali dati vengono conservati, e per quanto",
      voci: [
        "**Registrazioni dei pagamenti** — sono trattate da Stripe e devono essere conservate per gli obblighi contabili e fiscali previsti dalla legge, anche dopo la cancellazione degli altri dati. Non contengono i dati della tua carta, che non vediamo e non conserviamo mai.",
        "**Statistiche in forma aggregata e anonima** — ad esempio «quante diagnosi hanno riguardato una lavatrice». Non permettono di risalire a te e vengono mantenute a tempo indeterminato.",
        "**Dati già condivisi con un tecnico** — se hai richiesto un intervento e un tecnico ha accettato il lavoro, ha già ricevuto i tuoi contatti per chiamarti. Cancelliamo la richiesta dai nostri sistemi, ma il tecnico è titolare autonomo dei dati ricevuti: per quelli va contattato direttamente. Su richiesta ti indichiamo il suo recapito.",
      ],
      chiusura:
        "Al di fuori di questi casi non applichiamo nessun periodo di conservazione aggiuntivo: i dati vengono eliminati definitivamente.",
    },

    tempi: {
      titolo: "In quanto tempo",
      testo:
        "Rispondiamo e completiamo la cancellazione **entro 30 giorni** dalla ricezione della richiesta, come previsto dal Regolamento europeo sulla protezione dei dati (GDPR).",
    },

    altriDiritti: {
      titolo: "Altri diritti sui tuoi dati",
      testo:
        "Oltre alla cancellazione puoi chiedere di accedere ai tuoi dati, correggerli, limitarne l'uso o opporti al trattamento. Trovi il quadro completo nell'{link}.",
      link: "informativa sulla privacy",
      scrivi: "Per qualsiasi richiesta scrivi a {email}.",
    },

    vaiAllaPrivacy: "Informativa sulla privacy",
    torna: "Torna a Fixi",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  LA PAGINA DELLO STATO TECNICO
  //
  //  Qui si traducono le etichette — quello che legge una persona — ma NON i
  //  valori, i nomi dei plugin e le righe del diario. Quelli restano come sono
  //  di proposito: la pagina serve a fotografarla e mandarla a chi ha fatto
  //  l'app, e un diario tradotto in rumeno diventerebbe illeggibile proprio
  //  per chi deve capirci qualcosa.
  // ═══════════════════════════════════════════════════════════════════════════
  stato: {
    metaTitolo: "Stato tecnico — Fixi",
    titolo: "Stato tecnico",
    aCosaServe:
      "Serve a capire perché qualcosa non funziona. Fai una fotografia di questa schermata e mandala a chi ha fatto l'app.",
    nonLetto: "Non sono riuscito a leggere lo stato: {errore}",
    carico: "Carico… (se resta così, la pagina non si è avviata)",

    dove: "Dove stai girando",
    dentroApp: "Dentro l'app",
    si: "sì",
    noBrowser: "no — sei nel browser",
    piattaforma: "Piattaforma",
    versione: "Versione installata",
    nonDisponibile: "non disponibile",

    funzioni: "Funzioni native",
    troppoVecchia: "Questa versione non sa elencare i plugin: è molto vecchia.",
    presente: "presente",
    assente: "ASSENTE",

    prove: "Prove",
    prova1: "1. I messaggi si vedono?",
    prova2: "2. Scrivi un file nei Download",
    prova3: "3. Controlla il microfono",
    prova4: "4. Genera il PDF del referto",
    prova5: "5. Referto + salvataggio, tutto insieme",

    diario: "Diario di bordo",
    diarioSpiega:
      "Cosa è successo premendo i pulsanti veri. Se qui non compare niente dopo aver premuto il microfono o Scarica, vuol dire che il tocco non arriva nemmeno al codice.",
    diarioVuoto: "Nessuna riga. Usa l'app, poi torna qui.",
    svuota: "Svuota il diario",

    dettagli: "Dettagli",
    torna: "Torna alla home",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  L'ISCRIZIONE DEI TECNICI
  // ═══════════════════════════════════════════════════════════════════════════
  tecnicoIscrizione: {
    metaTitolo: "Iscriviti come tecnico — Fixi",
    metaDescrizione: "Unisciti alla rete Fixi. Ricevi lavori qualificati, zero costi fissi.",

    // I nomi a sinistra finiscono nel database e servono ad abbinare un tecnico
    // a una richiesta: restano italiani in ogni lingua, come gli
    // elettrodomestici della diagnosi. A destra c'e' solo la scritta sul
    // pulsante. Un tecnico iscritto in spagnolo come "Lavadoras" non
    // risponderebbe mai a una richiesta che cerca "Lavatrici".
    specializzazioni: {
      Lavatrici: "Lavatrici",
      Lavastoviglie: "Lavastoviglie",
      Asciugatrici: "Asciugatrici",
      Frigoriferi: "Frigoriferi",
      Forni: "Forni",
      "Piani cottura": "Piani cottura",
      Climatizzatori: "Climatizzatori",
      Caldaie: "Caldaie",
    },

    inviata: "Richiesta inviata!",
    inviataTesto:
      "Abbiamo ricevuto la tua iscrizione. La esamineremo entro 48 ore e ti contatteremo via email.",
    tornaHome: "Torna alla home",

    passo1Titolo1: "Ciao! Iniziamo",
    passo1Titolo2: "con i tuoi dati.",
    passo1Sotto: "Ci vogliono 3 minuti. Nessun costo, nessun obbligo.",
    nome: "Nome",
    nomeEsempio: "Mario",
    cognome: "Cognome",
    cognomeEsempio: "Rossi",
    email: "Email",
    emailEsempio: "mario@email.com",
    telefono: "Telefono",
    telefonoEsempio: "+39 333 1234567",

    passo2Titolo1: "Dove operi",
    passo2Titolo2: "e in cosa sei esperto?",
    citta: "Città",
    cittaEsempio: "Milano",
    cap: "CAP",
    capEsempio: "20100",
    specializzazioniTitolo: "Specializzazioni",
    anni: "Anni di esperienza",
    anniEsempio: "es. 10",

    passo3Titolo1: "Presentati",
    passo3Titolo2: "ai tuoi futuri clienti.",
    passo3Sotto: "Una breve descrizione di chi sei e come lavori.",
    descrizione: "Descrizione (opzionale)",
    descrizioneEsempio:
      "Es. Tecnico specializzato in lavatrici e lavastoviglie con 10 anni di esperienza. Intervengo a Milano e provincia entro 24 ore...",

    promessa1: "Iscrizione gratuita",
    promessa2: "Nessuna commissione sui lavori in questa fase di lancio",
    promessa3: "Attivazione entro 48 ore dalla verifica",
    promessa4: "Puoi disiscriverti in qualsiasi momento",
    seCambia:
      "Se in futuro introdurremo una commissione sui lavori, te lo comunicheremo via email con anticipo: potrai decidere se continuare o disiscriverti.",

    indietro: "Indietro",
    continua: "Continua",
    invio: "Invio...",
    invia: "Invia richiesta",

    erroreInvio: "Errore durante l'invio. Riprova.",
    erroreConnessione: "Errore di connessione. Riprova.",
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
      // "cinque cifre" valeva solo in Italia: ora la forma la dice l'esempio.
      tecnicoCap: "Il codice postale non sembra giusto. Per {paese} si scrive così: {esempio}",

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
