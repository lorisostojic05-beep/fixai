// Le guide ai sintomi: il canale con cui Fixi si fa trovare su Google.
//
// L'idea in una riga: nessuno cerca "app diagnosi elettrodomestici", ma
// migliaia di persone al giorno cercano "lavatrice non centrifuga" mentre
// hanno il problema in casa. Ogni guida punta a UNA di quelle frasi.
//
// Regola di scrittura, da non tradire: la guida deve essere utile anche a
// chi non pagherà mai. Se il lettore risolve da solo grazie a noi, abbiamo
// vinto lo stesso — si ricorderà di Fixi la prossima volta, e soprattutto
// Google mette in alto le pagine che risolvono, non quelle che vendono.
// Contenuto sottile avvolto attorno a un pulsante non si posiziona più.
//
// Per aggiungerne una: copia un oggetto di GUIDE, cambia i campi, e basta.
// La pagina, la mappa del sito e i collegamenti interni si aggiornano da soli.

// Indirizzo pubblico del sito, usato per i link canonici e la sitemap.
//
// Dal 3 settembre 2026 è fixiai.it: il dominio vero, collegato a Vercel.
//
// Attenzione a non cambiarlo con l'indirizzo .vercel.app "per provare":
// lo stesso identico sito risponde su due indirizzi, e senza un canonical
// che ne indichi uno solo Google li tratta come due copie in concorrenza.
//
// L'indirizzo fixai-svq7.vercel.app deve restare vivo comunque, ma per un
// motivo diverso: è quello che l'app Android pubblicata sul Play Store usa
// per caricare il sito (capacitor.config.json). Se muore, Fixi si spegne su
// tutti i telefoni e serve un nuovo AAB per rimediare.
export const SITO = "https://fixiai.it";

export const GUIDE = [
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "lavatrice-non-centrifuga",
    ricerca: "lavatrice non centrifuga",
    titolo: "Lavatrice che non centrifuga: le 6 cause più comuni",
    descrizione:
      "Il bucato esce fradicio e la lavatrice non centrifuga? Le cause vere, quali puoi risolvere da solo in 10 minuti e quando serve davvero un tecnico.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-03",
    introduzione:
      "Il programma finisce, apri l'oblò e il bucato è ancora zuppo. Nella maggior parte dei casi la lavatrice non è rotta: si è fermata apposta, perché qualcosa le impedisce di raggiungere i giri della centrifuga. Ecco cosa controllare, dal più probabile al meno probabile.",
    sicurezza:
      "Prima di aprire il filtro o toccare qualsiasi cosa dietro il pannello: stacca la spina. Non basta spegnere con il tasto. Tieni pronti uno straccio e una bacinella bassa, perché dal filtro esce acqua.",
    controlli: [
      {
        titolo: "Il carico è sbilanciato",
        difficolta: "facile",
        testo:
          "È di gran lunga la causa numero uno. Quando il peso si concentra da un lato — un accappatoio, un piumino, un solo paio di jeans — il cestello oscillerebbe troppo ad alta velocità, e la macchina si rifiuta di salire di giri per non danneggiarsi. Molte lavatrici ci riprovano due o tre volte, poi si arrendono e finiscono il programma lasciando il bucato bagnato. Apri, distribuisci i capi a mano lungo tutto il cestello e fai partire il solo programma di centrifuga. Se parte, era questo.",
      },
      {
        titolo: "C'è ancora acqua nel cestello",
        difficolta: "facile",
        testo:
          "Nessuna lavatrice centrifuga con l'acqua dentro: prima deve scaricare. Se vedi acqua sul fondo dell'oblò, il problema non è la centrifuga ma lo scarico, e va risolto quello. Il colpevole più frequente è il filtro della pompa, dietro lo sportellino in basso a destra sul frontale. Svitalo lentamente (esce acqua), togli monete, bottoni, capelli e lanugine, controlla che la girante dietro il filtro giri libera con un dito, richiudi bene.",
      },
      {
        titolo: "Il tubo di scarico è piegato o troppo in alto",
        difficolta: "facile",
        testo:
          "Se hai spostato la lavatrice di recente, guardale dietro. Un tubo schiacciato contro il muro, attorcigliato o infilato nel sifone troppo in profondità impedisce all'acqua di uscire. L'estremità deve stare tra i 60 e i 100 cm da terra: più in basso l'acqua se ne va da sola per gravità mentre la macchina lava, più in alto la pompa non ce la fa.",
      },
      {
        titolo: "Il programma non prevede la centrifuga",
        difficolta: "facile",
        testo:
          "Sembra banale e capita continuamente. I programmi lana, seta e delicati centrifugano a pochi giri o per nulla, di proposito. Controlla anche che non sia attivo il tasto di esclusione centrifuga o la funzione antipiega, che lascia il bucato in ammollo alla fine per non stropicciarlo. Sono tasti che si premono per sbaglio e restano in memoria da un lavaggio all'altro.",
      },
      {
        titolo: "La cinghia è rotta o allentata",
        difficolta: "da tecnico",
        testo:
          "Sintomo tipico: senti il motore che parte e ronza, ma il cestello non gira. Con la macchina staccata dalla corrente, gira il cestello con la mano: se ruota liberissimo, quasi senza attrito, e magari senti un fruscio, la cinghia è saltata o si è spezzata. Il pezzo costa poco, ma bisogna smontare il pannello posteriore.",
      },
      {
        titolo: "Spazzole del motore consumate o guasto elettronico",
        difficolta: "da tecnico",
        testo:
          "Se la lavatrice lava normalmente ma non arriva mai ai giri alti, e magari senti un odore di bruciato leggero o vedi scintille dal retro, le spazzole del motore possono essere a fine corsa. In alternativa il pressostato continua a credere che ci sia acqua dentro, e blocca la centrifuga per sicurezza. Qui si entra nella parte elettrica: non è un lavoro da fare con un cacciavite e un video.",
      },
    ],
    quandoTecnico: [
      "Senti odore di bruciato, vedi scintille o l'interruttore salta",
      "Il cestello non gira per niente nemmeno durante il lavaggio",
      "Hai pulito il filtro e l'acqua resta comunque nel cestello",
      "La macchina mostra un codice di errore che si ripresenta dopo lo spegnimento",
    ],
    faq: [
      {
        domanda: "Posso usare la lavatrice se non centrifuga?",
        risposta:
          "Lavare sì, e il bucato esce pulito. Il rischio non è il lavaggio ma quello che c'è dietro: se la causa è lo scarico ostruito, continuare a usarla significa forzare la pompa a ogni ciclo e rischiare una perdita d'acqua sul pavimento.",
      },
      {
        domanda: "Quanto costa far riparare una lavatrice che non centrifuga?",
        risposta:
          "Dipende tutto dalla causa. Cinghia o filtro sono interventi economici; il motore o la scheda elettronica possono costare quanto una lavatrice usata. Il problema è che l'uscita del tecnico si paga comunque, anche quando scopre che era solo il carico sbilanciato.",
      },
      {
        domanda: "Perché centrifuga a metà e poi si ferma?",
        risposta:
          "Classico dello sbilanciamento: la macchina sale di giri, sente che il cestello oscilla troppo, rallenta e riprova. Dopo qualche tentativo rinuncia. Distribuisci il bucato e rilancia solo la centrifuga.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "forno-non-scalda",
    ricerca: "forno non scalda",
    titolo: "Forno che non scalda: cosa controllare prima di chiamare il tecnico",
    descrizione:
      "Il forno si accende ma resta freddo? Dalla causa più banale — e gratis — fino alla resistenza bruciata: come capire qual è il tuo caso.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-03",
    introduzione:
      "La luce si accende, la ventola gira, ma dentro resta freddo. Prima di preoccuparti: una parte consistente dei forni «che non scaldano» non ha nulla di rotto, ed è il primo punto qui sotto. Vale la pena escluderlo, ci vogliono due minuti.",
    sicurezza:
      "Il forno è l'elettrodomestico più energivoro della cucina e spesso ha una linea elettrica dedicata. Se devi guardarci dentro davvero, non basta staccare la spina: togli corrente dal quadro, abbassando l'interruttore giusto. E lascialo raffreddare: le resistenze restano incandescenti a lungo.",
    controlli: [
      {
        titolo: "Il programmatore è in modalità automatica",
        difficolta: "facile",
        testo:
          "È la causa più frequente in assoluto tra quelle che non sono guasti. Se sul display lampeggia l'orario, compare il simbolo di una pentola, una A o una manina, il forno è in attesa di un programma di cottura impostato — e finché aspetta, non scalda. Cerca il tasto con la pentolina o l'orologio e tienilo premuto finché non torna la modalità manuale. Capita spessissimo dopo un blackout, perché il programmatore si resetta da solo.",
      },
      {
        titolo: "Scalda solo sopra o solo sotto",
        difficolta: "facile",
        testo:
          "Questo è un indizio prezioso, non un problema a sé. Prova il grill e poi la cottura statica: se una funziona e l'altra no, hai già individuato la resistenza guasta, ed è quella che non riscalda. Se invece nessuna delle due funziona, il guasto è più a monte — selettore, termostato o alimentazione — e il pezzo da cambiare è un altro.",
      },
      {
        titolo: "La resistenza è visibilmente bruciata",
        difficolta: "media",
        testo:
          "A forno freddo e senza corrente, guarda la resistenza superiore: se noti un punto gonfio, annerito, spaccato o una spira deformata, è andata. Quella inferiore spesso è nascosta sotto la base e non si vede: in quel caso ci si arriva solo per esclusione, o con un tester.",
      },
      {
        titolo: "Manca una fase o è saltato il magnetotermico",
        difficolta: "media",
        testo:
          "Se il forno si accende ma non scalda affatto, e in casa hai altri apparecchi che fanno le bizze, controlla il quadro elettrico. Un forno collegato con una sola fase attiva fa esattamente questo: luce sì, calore no. Vale la pena guardare il quadro prima di chiamare qualcuno per il forno.",
      },
      {
        titolo: "Il termostato non regge la temperatura",
        difficolta: "da tecnico",
        testo:
          "Se il forno parte, scalda un po' e poi si spegne, oppure resta tiepido qualunque temperatura imposti, il sospetto è il termostato o la sonda. Un forno che scalda troppo — brucia tutto a 180° — ha lo stesso pezzo guasto, al contrario. Non è un componente su cui improvvisare: se sbaglia in eccesso diventa pericoloso.",
      },
      {
        titolo: "Nel ventilato, la ventola non gira",
        difficolta: "da tecnico",
        testo:
          "Nei forni ventilati la resistenza circolare sta dietro la parete di fondo, attorno alla ventola. Se la ventola è bloccata, molti modelli spengono la resistenza per sicurezza dopo pochi minuti. Sintomo: parte, scalda pochissimo, poi si ferma. Il rumore, se c'è, è un ronzio senza aria che si muove.",
      },
    ],
    quandoTecnico: [
      "Senti odore di plastica bruciata o vedi fumo",
      "Il forno fa saltare la corrente ogni volta che lo accendi",
      "La resistenza è integra ma non scalda nemmeno una funzione",
      "Il forno scalda molto più di quanto imposti e brucia i cibi",
    ],
    faq: [
      {
        domanda: "Perché il forno si accende ma resta freddo?",
        risposta:
          "Perché la luce e la ventola sono su un circuito diverso da quello delle resistenze. Vedere il forno «vivo» non dice nulla sul riscaldamento: le due cose sono indipendenti, ed è il motivo per cui questo guasto spaventa più di quanto meriti.",
      },
      {
        domanda: "Conviene riparare un forno o comprarne uno nuovo?",
        risposta:
          "Una resistenza è un pezzo economico, e su un forno da incasso in buono stato la riparazione ha senso. Se invece si sommano termostato, scheda e vent'anni di età, il conto si avvicina a quello di un forno nuovo, che consuma anche meno.",
      },
      {
        domanda: "Come capire se la resistenza del forno è bruciata?",
        risposta:
          "Il modo senza strumenti è il confronto tra funzioni: prova grill, statico e ventilato. Se almeno una scalda, la resistenza usata da quella funzione è sana, e il guasto è nella parte che non risponde. Se non scalda nessuna, difficilmente sono bruciate tutte insieme: guarda più a monte.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "lavastoviglie-non-scarica",
    ricerca: "lavastoviglie non scarica l'acqua",
    titolo: "Lavastoviglie che non scarica l'acqua: come risolvere",
    descrizione:
      "Acqua ferma sul fondo della lavastoviglie a fine ciclo? Le cause in ordine di probabilità e cosa puoi sbloccare da solo, senza attrezzi.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-03",
    introduzione:
      "Apri a fine programma e trovi un dito d'acqua sul fondo, magari torbida. Nella grande maggioranza dei casi non è la pompa a essere rotta: è qualcosa che le impedisce di fare il suo lavoro, e spesso si toglie con le mani in cinque minuti.",
    sicurezza:
      "Stacca la spina prima di infilare le mani nel fondo della vasca. Occhio ai frammenti: se si è rotto un bicchiere, sul fondo ci sono schegge che non vedi nell'acqua torbida. Usa guanti da cucina spessi, non quelli sottili.",
    controlli: [
      {
        titolo: "Il filtro sul fondo è intasato",
        difficolta: "facile",
        testo:
          "Primo posto senza gara. Togli il cestello inferiore: sul fondo c'è un filtro cilindrico che si sfila ruotandolo di un quarto di giro, e sotto una retina piatta. Lì si accumulano semi, chicchi di riso, pezzetti di etichetta e grasso rappreso. Lava tutto sotto l'acqua calda con una spazzola e uno spruzzo di detersivo per piatti. Se non lo pulisci da mesi, questa è quasi certamente la causa.",
      },
      {
        titolo: "Qualcosa blocca la pompa di scarico",
        difficolta: "media",
        testo:
          "Sotto il filtro c'è la bocca della pompa, spesso con un coperchietto che si sgancia. Un nocciolo d'oliva, una scheggia di vetro o un tappo di plastica finiti lì dentro bloccano la girante: la pompa ronza ma non sposta acqua. A macchina staccata dalla corrente, togli quello che trovi e verifica con un dito che la girante ruoti.",
      },
      {
        titolo: "Il sifone del lavello è otturato",
        difficolta: "facile",
        testo:
          "Prova interessante: se anche il lavello accanto scarica lentamente, il problema non è la lavastoviglie. Il tubo di scarico è quasi sempre collegato al sifone del lavello, e se quello è intasato di grasso l'acqua non ha dove andare. Pulisci il sifone e spesso si risolvono tutti e due i problemi insieme.",
      },
      {
        titolo: "Il tubo di scarico è piegato o senza curva alta",
        difficolta: "facile",
        testo:
          "Guarda dietro la macchina. Il tubo deve salire in un arco fino ad almeno 40 cm da terra prima di scendere allo scarico: senza quella curva l'acqua rifluisce dentro per gravità e la trovi sul fondo anche a ciclo finito. Un tubo schiacciato dalla macchina spinta contro il muro dà lo stesso sintomo — capita spesso dopo aver rimesso a posto la cucina.",
      },
      {
        titolo: "È scattata la sicurezza antiallagamento",
        difficolta: "media",
        testo:
          "Se nel basamento della lavastoviglie è finita dell'acqua, un galleggiante blocca tutto e la macchina va in errore, a volte lampeggiando in continuazione. In molti modelli si sblocca inclinando delicatamente la macchina all'indietro per far uscire l'acqua dal fondo, poi lasciandola sgocciolare. Se torna subito, c'è una perdita interna da cercare.",
      },
      {
        titolo: "Pompa o scheda elettronica guaste",
        difficolta: "da tecnico",
        testo:
          "Se il filtro è pulito, la girante gira libera, il tubo è a posto e nel momento dello scarico non senti nessun rumore, allora la pompa non riceve corrente o è bruciata. Qui serve un tester per capire se il pezzo morto è la pompa o la scheda che dovrebbe comandarla, e la differenza di prezzo tra i due è notevole.",
      },
    ],
    quandoTecnico: [
      "Non senti alcun rumore nel momento dello scarico",
      "L'acqua torna nella vasca anche a macchina spenta",
      "C'è acqua sotto la lavastoviglie, sul pavimento",
      "L'errore si ripresenta subito dopo ogni sblocco",
    ],
    faq: [
      {
        domanda: "È normale un po' d'acqua sul fondo della lavastoviglie?",
        risposta:
          "Un velo d'acqua pulita nella conca attorno al filtro è normale e serve a mantenere umide le guarnizioni. Non è normale l'acqua che copre il fondo, o l'acqua sporca e maleodorante.",
      },
      {
        domanda: "Posso usarla lo stesso finché non la riparo?",
        risposta:
          "Meglio di no. L'acqua ferma con residui di cibo diventa maleodorante in un giorno o due, e se la causa è un'ostruzione ogni ciclo la spinge più a fondo. Svuota il fondo con una spugna o un bicchiere e non farla ripartire finché non hai controllato il filtro.",
      },
      {
        domanda: "Perché è successo all'improvviso?",
        risposta:
          "Quasi mai è improvviso davvero: il filtro si sporca poco alla volta per mesi, la macchina compensa, e a un certo punto supera la soglia. Per questo la stessa lavastoviglie riparte spesso dopo una pulizia e poi regge per anni.",
      },
    ],
  },
];

// ── Funzioni di appoggio ────────────────────────────────────────────

export function tutteLeGuide() {
  return GUIDE;
}

export function guidaPerSlug(slug) {
  return GUIDE.find((g) => g.slug === slug) || null;
}

// Le altre guide, per il blocco di collegamenti in fondo alla pagina.
// Servono a due cose: al lettore, che spesso ha più di un problema in casa,
// e a Google, che scopre le pagine nuove seguendo i link tra le vecchie.
export function guideCollegate(slug) {
  return GUIDE.filter((g) => g.slug !== slug);
}

export function urlGuida(slug) {
  return `${SITO}/guida/${slug}`;
}
