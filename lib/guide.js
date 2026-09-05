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

// I sette elettrodomestici che Fixi sa diagnosticare, nell'ordine in cui
// compaiono nella pagina indice. L'ordine non e' casuale: e' quello del
// volume di ricerca, dal piu' cercato al meno.
//
// `nome` deve combaciare con il campo `elettrodomestico` delle guide, ed e'
// anche il pezzo di indirizzo: per questo "piano-cottura" sta col trattino.
// Quelli senza guide compaiono lo stesso ma spenti, senza collegamento: una
// scheda che porta a una pagina vuota e' peggio di una scheda che dice
// "in arrivo".
export const ELETTRODOMESTICI = [
  { nome: "lavatrice", titolo: "Lavatrice", emoji: "🌀" },
  { nome: "lavastoviglie", titolo: "Lavastoviglie", emoji: "🍽️" },
  { nome: "forno", titolo: "Forno", emoji: "🔥" },
  { nome: "frigorifero", titolo: "Frigorifero", emoji: "❄️" },
  { nome: "asciugatrice", titolo: "Asciugatrice", emoji: "💨" },
  { nome: "piano-cottura", titolo: "Piano cottura", emoji: "🍳" },
  { nome: "condizionatore", titolo: "Condizionatore", emoji: "🌬️" },
];

export const GUIDE = [
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-centrifuga",
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
    slug: "non-scarica",
    ricerca: "lavatrice non scarica l'acqua",
    titolo: "Lavatrice che non scarica l'acqua: cosa fare",
    descrizione:
      "Acqua ferma nel cestello a fine programma? Le cause in ordine di probabilità e quali puoi togliere di mezzo da solo in dieci minuti.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il programma finisce ma nell'oblò resta acqua, e la porta non si apre. Quasi sempre non è la pompa a essere rotta: è qualcosa che le impedisce di lavorare, e nella maggior parte dei casi si toglie con le mani.",
    sicurezza:
      "Stacca la spina prima di aprire lo sportellino del filtro. Metti sotto uno straccio e una bacinella bassa: esce parecchia acqua, e non riesci a fermarla a metà. Se dentro si è rotto un bicchiere, usa guanti spessi.",
    controlli: [
      {
        titolo: "Il filtro della pompa è intasato",
        difficolta: "facile",
        testo:
          "È la causa numero uno, senza rivali. Lo sportellino sta in basso sul frontale, di solito a destra. Svita il tappo lentamente, lascia uscire l'acqua, poi sfila il filtro: dentro trovi monete, bottoni, fermagli, capelli e lanugine compattata. Pulisci sotto l'acqua calda e controlla con un dito che la girante dietro il filtro giri libera. Richiudi bene, senza forzare la filettatura.",
      },
      {
        titolo: "Il tubo di scarico è piegato o messo male",
        difficolta: "facile",
        testo:
          "Guarda dietro la macchina, soprattutto se l'hai spostata di recente. Il tubo non deve essere schiacciato contro il muro né attorcigliato. L'estremità va tenuta tra i 60 e i 100 cm da terra: più in basso l'acqua se ne va da sola durante il lavaggio, più in alto la pompa non ce la fa a spingerla.",
      },
      {
        titolo: "Il sifone del lavello o lo scarico a muro è otturato",
        difficolta: "facile",
        testo:
          "Prova a far scorrere l'acqua nel lavello vicino: se anche quello scarica lentamente, il problema non è la lavatrice ma il tubo che sta a valle. Il grasso di cucina e il detersivo formano un tappo che si accumula per mesi e poi cede tutto insieme.",
      },
      {
        titolo: "C'è un oggetto incastrato nella pompa",
        difficolta: "media",
        testo:
          "Se il filtro è pulito ma la girante non gira o gira a scatti, dentro c'è qualcosa: uno stecchino del reggiseno, una scheggia di plastica, una graffetta. A macchina staccata dalla corrente, togli quello che riesci a raggiungere con le dita o una pinzetta. Se senti la pompa ronzare senza spostare acqua, è quasi sempre questo.",
      },
      {
        titolo: "Il programma prevede l'ammollo finale",
        difficolta: "facile",
        testo:
          "Alcune funzioni — antipiega, stop con acqua in vasca, certi programmi delicati — lasciano il bucato immerso di proposito, per non stropicciarlo. Non è un guasto: basta lanciare il solo scarico o la centrifuga. Sono tasti che restano in memoria da un lavaggio all'altro e si premono per sbaglio.",
      },
      {
        titolo: "Pompa bruciata o pressostato guasto",
        difficolta: "da tecnico",
        testo:
          "Se nel momento dello scarico non senti alcun rumore — nessun ronzio, nessuna vibrazione — la pompa non riceve corrente o è bruciata. In alternativa il pressostato continua a credere che la vasca sia vuota e non comanda lo scarico. Serve un tester per capire quale dei due, e la differenza di prezzo tra i due pezzi è notevole.",
      },
    ],
    quandoTecnico: [
      "Nel momento dello scarico non senti alcun rumore",
      "Hai pulito filtro e sifone e l'acqua resta comunque",
      "Vedi acqua sul pavimento sotto la macchina",
      "L'errore torna subito dopo ogni tentativo",
    ],
    faq: [
      {
        domanda: "Come svuoto la lavatrice piena d'acqua?",
        risposta:
          "Dal filtro in basso, con una bacinella bassa sotto: esce a ondate e va svuotata più volte. In alternativa, appoggiando a terra l'estremità del tubo di scarico l'acqua esce da sola per gravità, ma serve un recipiente capiente.",
      },
      {
        domanda: "Perché non si apre l'oblò?",
        risposta:
          "È una sicurezza: con acqua dentro la porta resta bloccata per non allagare la stanza. Sbloccare l'oblò senza aver prima tolto l'acqua è il modo più veloce per doverla asciugare da terra.",
      },
      {
        domanda: "Ogni quanto va pulito il filtro?",
        risposta:
          "Due o tre volte l'anno bastano per la maggior parte delle famiglie. Se in casa ci sono animali o si lavano spesso tappeti e coperte, conviene ogni due mesi.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "lavatrice non si accende",
    titolo: "Lavatrice che non si accende: le verifiche da fare",
    descrizione:
      "Nessuna spia, nessun segno di vita? Prima di pensare al peggio ci sono quattro controlli che non costano nulla e risolvono la maggior parte dei casi.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Premi il tasto e non succede niente: nessuna luce, nessun rumore. Sembra il guasto più grave e spesso è il più banale — l'ordine qui sotto va dal gratis al costoso, e vale la pena rispettarlo.",
    sicurezza:
      "Puoi controllare presa, spina e quadro elettrico senza rischi. Non aprire il pannello posteriore né il coperchio: dentro ci sono componenti che restano carichi anche a spina staccata.",
    controlli: [
      {
        titolo: "La presa non porta corrente",
        difficolta: "facile",
        testo:
          "Sembra offensivo come suggerimento, ed è la causa più frequente. Attacca alla stessa presa un phon o una lampada: se non funziona nemmeno quello, il problema è la presa, non la lavatrice. Occhio anche alle prolunghe e alle ciabatte con interruttore, che si spengono da sole con un urto.",
      },
      {
        titolo: "È scattato il salvavita o il magnetotermico",
        difficolta: "facile",
        testo:
          "Vai al quadro elettrico e guarda se una levetta è abbassata. Rialzala. Se scatta di nuovo appena accendi la lavatrice, fermati: c'è una dispersione elettrica dentro la macchina, e insistere è pericoloso. Quello è un caso da tecnico, non da tentativi.",
      },
      {
        titolo: "L'oblò non è chiuso davvero",
        difficolta: "facile",
        testo:
          "Le lavatrici non partono con la porta socchiusa, e il blocco scatta con un clic secco. Riapri e richiudi con decisione. Se il gancio è storto o la guarnizione è gonfia di residui, la porta sembra chiusa ma il contatto non si fa: pulisci il bordo e riprova.",
      },
      {
        titolo: "È attiva la sicurezza bambini",
        difficolta: "facile",
        testo:
          "Molti modelli hanno un blocco tasti che si attiva tenendo premuti due pulsanti insieme, e sul display compare un lucchetto o la scritta CL. La macchina sembra morta perché ignora i comandi. Cerca sul pannello i due tasti con il simbolo del lucchetto e tienili premuti qualche secondo.",
      },
      {
        titolo: "Filtro antidisturbo o scheda elettronica",
        difficolta: "da tecnico",
        testo:
          "Se presa e quadro sono a posto e la macchina resta muta, il sospetto cade sul filtro antidisturbo all'ingresso della corrente — un pezzo economico che si guasta più spesso di quanto si creda — oppure sulla scheda elettronica, che costa molto di più. Solo un tester distingue i due casi.",
      },
    ],
    quandoTecnico: [
      "Il salvavita scatta ogni volta che accendi la macchina",
      "Senti odore di bruciato o vedi tracce nere sulla spina",
      "La presa funziona con altri apparecchi ma la lavatrice resta spenta",
      "Il display si accende a intermittenza da solo",
    ],
    faq: [
      {
        domanda: "La lavatrice ha un fusibile che posso cambiare?",
        risposta:
          "Le lavatrici moderne non hanno un fusibile accessibile dall'esterno come i vecchi elettrodomestici. La protezione sta nel quadro elettrico di casa e nel filtro antidisturbo interno, che però va raggiunto smontando il pannello.",
      },
      {
        domanda: "Ho tolto e rimesso la spina e ora funziona. È risolto?",
        risposta:
          "Non necessariamente. Un contatto ossidato o una spina che scalda danno esattamente questo comportamento intermittente, e peggiorano. Guarda se la spina è annerita o se scotta dopo un lavaggio.",
      },
      {
        domanda: "Conviene ripararla o cambiarla?",
        risposta:
          "Dipende dal pezzo e dall'età. Un filtro antidisturbo o un blocco porta hanno senso su qualsiasi macchina; una scheda elettronica su una lavatrice di dieci anni raramente si ripaga.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "perde-acqua",
    ricerca: "lavatrice perde acqua",
    titolo: "Lavatrice che perde acqua: da dove viene e come capirlo",
    descrizione:
      "Una pozza sul pavimento non dice da sola qual è il guasto. Il punto in cui compare l'acqua però sì: ecco come leggerlo prima di chiamare qualcuno.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "L'acqua sul pavimento spaventa, soprattutto in un condominio. La buona notizia è che il punto da cui esce restringe il campo quasi subito: davanti, sotto, o dietro sono tre storie diverse.",
    sicurezza:
      "Prima di tutto chiudi il rubinetto dell'acqua e stacca la spina, in quest'ordine. Acqua e corrente insieme sono l'unica combinazione di questo elenco che può farti male sul serio. Non usare la macchina finché non hai capito da dove esce.",
    controlli: [
      {
        titolo: "Perde da davanti, sotto l'oblò",
        difficolta: "facile",
        testo:
          "Guarda la guarnizione di gomma: apri l'oblò e passa un dito lungo tutta la piega interna. Ci si accumulano capelli, sabbia e residui di detersivo che tengono aperto un canale d'acqua. Pulisci con un panno umido e bicarbonato. Se invece trovi un taglio o un forellino — spesso causato da ferretti di reggiseno — la guarnizione va sostituita.",
      },
      {
        titolo: "Perde dal cassetto del detersivo",
        difficolta: "facile",
        testo:
          "Se l'acqua cola dal cassetto o dai bordi, quasi sempre è troppo detersivo: la schiuma trabocca. Prova a dimezzare la dose. L'altra causa è il cassetto incrostato di calcare e detersivo secco: sfilalo del tutto, lascialo a bagno in acqua calda e pulisci anche l'alloggiamento, dove si formano tappi duri.",
      },
      {
        titolo: "Perde dallo sportellino del filtro",
        difficolta: "facile",
        testo:
          "Tipico dopo una pulizia del filtro: il tappo non è avvitato a fondo, oppure la sua guarnizione si è arrotolata. Riavvita con decisione ma senza forzare, e controlla che l'anello di gomma sia in sede e non piegato.",
      },
      {
        titolo: "Perde da dietro",
        difficolta: "media",
        testo:
          "Controlla i raccordi del tubo di carico, sia al rubinetto sia alla macchina: si allentano con le vibrazioni e basta stringerli a mano. Guarda anche se la guarnizione dentro il raccordo è schiacciata o mancante. Il tubo di carico va sostituito ogni cinque o sei anni comunque: è il pezzo che causa gli allagamenti più seri.",
      },
      {
        titolo: "Perde dal centro, sotto la macchina, durante il lavaggio",
        difficolta: "da tecnico",
        testo:
          "Se l'acqua compare al centro del basamento mentre il cestello gira, il sospetto è la vasca, i cuscinetti o la crociera — spesso accompagnati da un rumore forte in centrifuga. Qui la riparazione è impegnativa, e su una macchina non recente vale la pena farsi fare due conti prima di procedere.",
      },
    ],
    quandoTecnico: [
      "L'acqua esce dal centro del basamento, non dai bordi",
      "La perdita compare solo in centrifuga, con rumore forte",
      "Hai stretto i raccordi e continua a gocciolare",
      "L'acqua è sporca o schiumosa e viene da sotto",
    ],
    faq: [
      {
        domanda: "Posso usare la lavatrice mentre perde poco?",
        risposta:
          "No. Una perdita piccola diventa grande senza preavviso, e in condominio i danni all'appartamento di sotto costano molto più di qualsiasi riparazione. Chiudi il rubinetto tra un lavaggio e l'altro finché non hai risolto.",
      },
      {
        domanda: "Perché perde solo con certi programmi?",
        risposta:
          "Programmi diversi usano quantità d'acqua e velocità diverse. Una perdita che compare solo in centrifuga indica un problema meccanico; una che compare solo al carico punta ai tubi o all'elettrovalvola.",
      },
      {
        domanda: "Il tubo di carico si può riparare con del nastro?",
        risposta:
          "Mai. Quel tubo lavora in pressione anche quando la lavatrice è spenta: una riparazione di fortuna che cede di notte allaga la casa. Costa poco e si cambia in cinque minuti.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-carica-acqua",
    ricerca: "lavatrice non carica acqua",
    titolo: "Lavatrice che non carica acqua: le cause più comuni",
    descrizione:
      "Il programma parte ma l'acqua non entra, o entra lentissima. Nella maggior parte dei casi è un filtrino da pulire, non un pezzo da cambiare.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "La macchina si accende, il programma parte, ma dentro non entra acqua — oppure ci mette un'eternità e a volte va in errore. Il colpevole più frequente è grande come un'unghia e si pulisce in cinque minuti.",
    sicurezza:
      "Chiudi il rubinetto e stacca la spina prima di svitare il tubo di carico. Quando lo stacchi esce l'acqua rimasta dentro: tieni pronto uno straccio.",
    controlli: [
      {
        titolo: "Il rubinetto è chiuso o semiaperto",
        difficolta: "facile",
        testo:
          "Il primo posto da guardare, soprattutto se hai chiuso l'acqua per una vacanza o dopo un lavoro idraulico. Aprilo completamente: mezza apertura fa entrare l'acqua troppo piano e alcune macchine si fermano in errore prima di riempirsi.",
      },
      {
        titolo: "Il filtrino del tubo di carico è intasato",
        difficolta: "facile",
        testo:
          "Dentro il raccordo che si avvita alla lavatrice c'è una retina fine, grande come un'unghia, che ferma sabbia e calcare. Si intasa lentamente per anni e poi blocca tutto. Sfilala con una pinzetta, lasciala a bagno nell'aceto qualche ora, sciacqua e rimettila. È la riparazione più economica che esista.",
      },
      {
        titolo: "Il tubo è piegato o schiacciato",
        difficolta: "facile",
        testo:
          "Se hai spostato la macchina, guarda dietro: il tubo di carico è rigido ma si strozza contro il muro. Una piega netta riduce il flusso quanto un'ostruzione.",
      },
      {
        titolo: "La pressione dell'acqua di casa è bassa",
        difficolta: "facile",
        testo:
          "Apri il rubinetto del lavello: se il getto è debole ovunque, il problema è della rete e non della lavatrice. Capita ai piani alti nelle ore di punta, o dopo un intervento dell'acquedotto. Alcune macchine hanno bisogno di una pressione minima e vanno in errore sotto quella soglia.",
      },
      {
        titolo: "Elettrovalvola o pressostato guasti",
        difficolta: "da tecnico",
        testo:
          "Se rubinetto, filtrino e pressione sono a posto, resta la valvola elettrica che comanda l'ingresso dell'acqua: quando si guasta, la macchina non riceve nulla oppure non smette mai di caricare. L'altro sospetto è il pressostato, che dice alla scheda quanta acqua c'è dentro e, sbagliando, blocca il ciclo.",
      },
    ],
    quandoTecnico: [
      "Il rubinetto è aperto ma non senti alcun ronzio all'avvio",
      "La macchina carica acqua all'infinito e non si ferma",
      "Va in errore anche con il filtrino appena pulito",
      "L'acqua entra da sola a macchina spenta",
    ],
    faq: [
      {
        domanda: "La lavatrice carica pochissima acqua: è normale?",
        risposta:
          "Sì, più di quanto si pensi. Le macchine recenti usano molta meno acqua di quelle di vent'anni fa, e vedere solo un velo sul fondo non significa che ci sia un guasto. Il segnale d'allarme è il ciclo che non avanza, non la quantità visibile.",
      },
      {
        domanda: "Posso pulire il filtrino senza pinzette?",
        risposta:
          "Meglio di no: è incastrato a pressione e forzandolo con un cacciavite si deforma. Una pinzetta da sopracciglia va benissimo, e in mancanza si può provare a farlo uscire facendo scorrere acqua al contrario nel raccordo.",
      },
      {
        domanda: "Ogni quanto va pulito?",
        risposta:
          "In zone con acqua molto calcarea una volta l'anno è ragionevole. Altrove ci si ricorda della sua esistenza solo quando la macchina smette di caricare — che è appunto ora.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-rumore",
    ricerca: "lavatrice fa rumore",
    titolo: "Lavatrice che fa rumore o vibra troppo: come capire cos'è",
    descrizione:
      "Il tipo di rumore dice quasi tutto: sferragliare, rimbombo, cigolio o colpi secchi puntano a cause diverse. Ecco come distinguerle.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Una lavatrice rumorosa non è sempre una lavatrice rotta, ma il rumore va ascoltato: cambia a seconda del guasto, e riconoscerlo evita sia le riparazioni inutili sia quelle rimandate troppo a lungo.",
    sicurezza:
      "Per i controlli qui sotto basta staccare la spina. Non infilare le mani nel cestello mentre gira, nemmeno per rallentarlo: in centrifuga la forza in gioco è molto superiore a quella che immagini.",
    controlli: [
      {
        titolo: "I bulloni di trasporto non sono stati tolti",
        difficolta: "facile",
        testo:
          "Vale solo per le macchine appena installate, ma quando è quello il problema è sempre quello. Sul retro ci sono tre o quattro bulloni che bloccano il cestello durante il trasporto: se restano montati la lavatrice sobbalza e fa un fracasso metallico. Vanno svitati e i fori chiusi con i tappini in dotazione.",
      },
      {
        titolo: "La macchina non è in piano",
        difficolta: "facile",
        testo:
          "Prova a spingere gli angoli con una mano: se dondola, i piedini vanno regolati. Avvitali o svitali finché la macchina non si muove più, e controlla che i controdadi siano stretti. Su un pavimento in legno o su piastrelle scollate il problema si ripresenta: un tappetino antivibrazione aiuta molto.",
      },
      {
        titolo: "C'è qualcosa nel filtro o tra cestello e vasca",
        difficolta: "media",
        testo:
          "Un tintinnio metallico in centrifuga è quasi sempre una moneta o un ferretto di reggiseno. Guarda prima nel filtro della pompa. Se lì non c'è, l'oggetto può essere finito tra cestello e vasca: si sente ruotando il cestello a mano, e per toglierlo di solito bisogna smontare la resistenza.",
      },
      {
        titolo: "Il carico è sbilanciato",
        difficolta: "facile",
        testo:
          "Un solo capo pesante, un piumino o un tappeto si ammassano da un lato e fanno sbattere il cestello contro la struttura, con colpi sordi e ritmici. Non è un guasto: distribuisci il bucato e rilancia la centrifuga.",
      },
      {
        titolo: "Cuscinetti consumati",
        difficolta: "da tecnico",
        testo:
          "Rumore basso e continuo, tipo aereo che decolla, che cresce con i giri della centrifuga. A macchina staccata, muovi il cestello su e giù afferrandolo dal bordo: se ha gioco o senti raschiare, sono i cuscinetti. È la riparazione più costosa fra quelle comuni, e su una lavatrice di dieci anni spesso non conviene.",
      },
      {
        titolo: "Pompa di scarico rumorosa",
        difficolta: "media",
        testo:
          "Se il ronzio forte compare solo nei momenti di scarico e dura pochi secondi, guarda la girante della pompa dietro il filtro: un residuo che la tocca a ogni giro fa un rumore sproporzionato rispetto alla banalità della causa.",
      },
    ],
    quandoTecnico: [
      "Rumore basso e crescente che segue i giri della centrifuga",
      "Il cestello ha gioco quando lo muovi con le mani",
      "Vedi ruggine o acqua sotto il centro della macchina",
      "Il rumore è comparso all'improvviso dopo un colpo forte",
    ],
    faq: [
      {
        domanda: "Quanto è grave se rimando la riparazione dei cuscinetti?",
        risposta:
          "Il rumore peggiora e a un certo punto il cestello può danneggiare la vasca, trasformando una riparazione cara in una macchina da buttare. Se il rumore cresce di settimana in settimana, non conviene aspettare troppo.",
      },
      {
        domanda: "La lavatrice si sposta durante la centrifuga: è pericoloso?",
        risposta:
          "Non è pericoloso di per sé, ma strappa i tubi nel tempo — ed è così che nascono gli allagamenti. Quasi sempre si risolve regolando i piedini.",
      },
      {
        domanda: "Un rumore in centrifuga può essere solo il carico?",
        risposta:
          "Sì, ed è il caso più comune. Il test è semplice: se distribuendo il bucato il rumore sparisce, non c'è nulla da riparare.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "oblo-bloccato",
    ricerca: "oblò lavatrice non si apre",
    titolo: "Oblò della lavatrice bloccato: come aprirlo",
    descrizione:
      "La porta non si apre a fine lavaggio? Nella maggior parte dei casi è una sicurezza che si sblocca da sola, e c'è anche un'apertura di emergenza.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il programma è finito, il bucato è dentro, e la porta non si apre. Prima di tirare con forza — cosa che rompe la maniglia e basta — vale la pena capire quale delle sicurezze è entrata in gioco.",
    sicurezza:
      "Non forzare mai l'oblò con un cacciavite facendo leva sul bordo: si spacca il gancio o il vetro. E se dentro c'è acqua, aprire significa allagare la stanza: quella va tolta prima, dal filtro.",
    controlli: [
      {
        titolo: "Sono passati meno di due minuti dalla fine",
        difficolta: "facile",
        testo:
          "Quasi tutte le lavatrici tengono la porta chiusa per uno o due minuti dopo il termine, per sicurezza. È il caso più frequente in assoluto e si risolve aspettando: se ci provi in continuazione, alcune macchine ricominciano a contare da capo.",
      },
      {
        titolo: "C'è ancora acqua nel cestello",
        difficolta: "facile",
        testo:
          "Con acqua dentro il blocco non si apre, di proposito. Guarda il livello dall'oblò: se ne vedi, il problema vero è lo scarico e vanno controllati filtro e tubo. Solo dopo aver svuotato la macchina la porta si apre.",
      },
      {
        titolo: "Il programma non è davvero finito",
        difficolta: "facile",
        testo:
          "Ammollo, antipiega e partenza ritardata lasciano la macchina in attesa con la porta bloccata, senza che sembri stia facendo qualcosa. Guarda il display: se c'è un tempo residuo o un simbolo di attesa, la lavatrice sta ancora lavorando a modo suo. Annullare il programma tenendo premuto il tasto di avvio di solito sblocca.",
      },
      {
        titolo: "È attiva la sicurezza bambini",
        difficolta: "facile",
        testo:
          "Il blocco tasti impedisce anche l'apertura su diversi modelli, e si riconosce dal lucchetto sul display. Si toglie tenendo premuti insieme i due tasti che hanno il simbolo del lucchetto stampato sopra, di solito per tre o quattro secondi.",
      },
      {
        titolo: "L'apertura di emergenza",
        difficolta: "media",
        testo:
          "Dietro lo sportellino del filtro, in basso, molte lavatrici hanno una linguetta o un cordino di sblocco. Con la macchina staccata dalla corrente e la vasca vuota, tirarlo delicatamente apre il gancio. Se il tuo modello non ce l'ha, non inventare: forzare rompe il blocco porta, che poi va comunque sostituito.",
      },
      {
        titolo: "Blocco porta guasto",
        difficolta: "da tecnico",
        testo:
          "Se la macchina non parte nemmeno e non senti il clic di chiusura, il blocco porta è bruciato: è un pezzo che si guasta spesso e costa poco, ma per sostituirlo bisogna smontare la guarnizione dell'oblò, e rimetterla bene richiede attrezzi e pazienza.",
      },
    ],
    quandoTecnico: [
      "Non senti il clic quando chiudi la porta e la macchina non parte",
      "Hai usato lo sblocco di emergenza e la porta resta ferma",
      "Il gancio della maniglia si è rotto",
      "La porta si apre ma non si richiude più",
    ],
    faq: [
      {
        domanda: "Posso aprire l'oblò con la lavatrice piena d'acqua?",
        risposta:
          "Solo dopo aver svuotato dal filtro. Sbloccare la porta con l'acqua dentro significa vedersela arrivare addosso: sono decine di litri e non c'è modo di fermarla.",
      },
      {
        domanda: "Togliere la corrente per qualche minuto aiuta?",
        risposta:
          "Spesso sì. Staccare la spina per cinque o dieci minuti fa dimenticare alla scheda lo stato in cui era e libera il blocco. È il primo tentativo da fare quando l'attesa non basta.",
      },
      {
        domanda: "Perché si è bloccato proprio a fine lavaggio?",
        risposta:
          "Perché è lì che si sommano le due condizioni: il blocco termico ancora caldo e l'eventuale acqua residua. Un guasto vero di solito si manifesta anche all'inizio, impedendo la partenza.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "puzza",
    ricerca: "lavatrice puzza di muffa",
    titolo: "Lavatrice che puzza di muffa: perché succede e come toglierlo",
    descrizione:
      "Odore di chiuso sul bucato appena lavato? Non è la macchina a essere rotta: è dove si annidano i residui. Si risolve in un pomeriggio, senza pezzi di ricambio.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il bucato esce pulito ma odora di chiuso, e avvicinandosi alla macchina si sente puzza di muffa. Questa è l'unica voce dell'elenco che non richiede quasi mai un tecnico: è manutenzione, e le cause sono sempre le stesse quattro.",
    sicurezza:
      "Niente rischi particolari qui, ma non mescolare mai candeggina e prodotti anticalcare a base di acido: la reazione libera gas irritanti. Usali in lavaggi separati.",
    controlli: [
      {
        titolo: "Si lava sempre a bassa temperatura",
        difficolta: "facile",
        testo:
          "È la causa principale, e nasce da un'abitudine sensata: lavare a 30 gradi consuma meno. Solo che sotto i 40 i grassi non si sciolgono e si depositano nei tubi, dove i batteri prosperano. Rimedio: un lavaggio a vuoto a 90 gradi una volta al mese, con due bicchieri di aceto bianco o un anticalcare al posto del detersivo.",
      },
      {
        titolo: "La guarnizione dell'oblò è sporca",
        difficolta: "facile",
        testo:
          "Apri la porta e ripiega verso di te la gomma nera: nella piega trovi acqua stagnante, capelli e una patina scura. È il posto che puzza di più e quello che quasi nessuno pulisce. Panno umido, bicarbonato o aceto, e asciugare bene. Se la muffa ha macchiato la gomma in profondità il colore resta, ma l'odore va via.",
      },
      {
        titolo: "Il cassetto del detersivo è incrostato",
        difficolta: "facile",
        testo:
          "Sfila il cassetto — quasi tutti escono premendo una linguetta al centro — e guardalo controluce: gli scomparti sono rivestiti di una crosta gelatinosa, e l'alloggiamento dietro anche peggio. Acqua calda, spazzolino, e una passata anche nel vano con una spugna a manico.",
      },
      {
        titolo: "Si usa troppo detersivo o troppo ammorbidente",
        difficolta: "facile",
        testo:
          "Il dosaggio in eccesso non lava meglio: la parte non sciolta resta nei tubi e diventa nutrimento per i batteri. L'ammorbidente è il peggiore, perché è grasso per natura. Prova a dimezzare le dosi per un mese e vedi se l'odore torna.",
      },
      {
        titolo: "Il filtro della pompa non viene mai pulito",
        difficolta: "media",
        testo:
          "Dietro lo sportellino in basso si accumulano lanugine e residui che marciscono nell'acqua ferma. Con la spina staccata e una bacinella sotto, svita e pulisci: spesso l'odore forte viene da lì, e la differenza si sente subito.",
      },
      {
        titolo: "L'oblò resta sempre chiuso",
        difficolta: "facile",
        testo:
          "Dopo il lavaggio dentro resta umidità, e a porta chiusa non evapora mai. Lasciare l'oblò e il cassetto socchiusi tra un lavaggio e l'altro è il rimedio più semplice ed efficace di tutto l'elenco — e l'unico che è gratis e permanente.",
      },
    ],
    quandoTecnico: [
      "L'odore resta dopo aver pulito guarnizione, cassetto e filtro",
      "Senti puzza di fogna e non di muffa: guarda lo scarico, non la macchina",
      "Vedi acqua stagnante che non se ne va nemmeno dopo lo scarico",
      "Il bucato esce con macchie grigie oltre che con l'odore",
    ],
    faq: [
      {
        domanda: "Aceto o candeggina?",
        risposta:
          "L'aceto bianco scioglie calcare e residui grassi ed è sufficiente nella maggior parte dei casi. La candeggina disinfetta ma non rimuove le incrostazioni, e usata spesso rovina le guarnizioni. Mai insieme.",
      },
      {
        domanda: "I prodotti specifici per lavatrice servono davvero?",
        risposta:
          "Fanno il lavoro, ma non fanno molto di più di un lavaggio a vuoto ad alta temperatura con dell'acido citrico o dell'aceto. La differenza vera la fa la frequenza, non il prodotto.",
      },
      {
        domanda: "Perché puzza solo il bucato e non la macchina?",
        risposta:
          "Spesso è il bucato lasciato dentro dopo la fine del ciclo: bastano poche ore in un ambiente caldo e umido perché prenda odore. Se ti capita, un risciacquo lo risolve.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-scalda",
    ricerca: "lavatrice non scalda l'acqua",
    titolo: "Lavatrice che non scalda l'acqua: come accorgersene e cosa fare",
    descrizione:
      "Il bucato non viene pulito come prima e l'oblò resta freddo? Ecco come verificare se la resistenza è davvero il problema, senza strumenti.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "È il guasto più subdolo, perché la lavatrice continua a funzionare: lava, centrifuga, finisce il programma. Solo che lava con acqua fredda, e te ne accorgi dai capi che non tornano puliti come prima o dagli odori che restano.",
    sicurezza:
      "L'unica verifica che puoi fare senza rischi è quella al tatto sul vetro. La resistenza sta sotto il cestello, immersa nell'acqua e collegata alla rete: non è un componente su cui improvvisare, e per raggiungerla bisogna smontare un pannello.",
    controlli: [
      {
        titolo: "Il programma selezionato è a freddo",
        difficolta: "facile",
        testo:
          "Da controllare per primo, e capita più spesso di quanto si ammetta. I programmi rapidi, quelli eco e i cicli per delicati lavano a 20 o 30 gradi, temperature che al tatto sono indistinguibili dal freddo. Imposta un cotone a 60 e rifai la prova.",
      },
      {
        titolo: "La prova del vetro",
        difficolta: "facile",
        testo:
          "Fai partire un cotone a 60 gradi e dopo venti o trenta minuti appoggia la mano sul vetro dell'oblò. Deve essere tiepido, in certi casi caldo. Se è freddo come all'inizio, l'acqua non si sta scaldando davvero: è la verifica più affidabile che puoi fare senza strumenti.",
      },
      {
        titolo: "La resistenza è incrostata di calcare",
        difficolta: "media",
        testo:
          "In zone con acqua dura la resistenza si ricopre di uno strato che la isola: scalda meno, ci mette di più, e alla fine si brucia perché lavora in sofferenza. Se non hai mai fatto un ciclo anticalcare in anni, questa è la strada verso il guasto vero. Un lavaggio a vuoto a 90 gradi con acido citrico, ogni due o tre mesi, la allunga di parecchio.",
      },
      {
        titolo: "La resistenza è bruciata",
        difficolta: "da tecnico",
        testo:
          "È il caso più frequente quando l'acqua resta fredda del tutto. Il pezzo costa poco e su molti modelli si raggiunge dal pannello posteriore, ma va verificato con un tester prima di comprarlo: cambiarla a caso, quando il guasto era la sonda, significa spendere due volte.",
      },
      {
        titolo: "Sonda di temperatura o scheda",
        difficolta: "da tecnico",
        testo:
          "La sonda dice alla scheda quanto è calda l'acqua. Se sbaglia in eccesso, la macchina crede di aver raggiunto i 60 gradi e spegne la resistenza quasi subito: il risultato è identico a una resistenza bruciata, ma il pezzo da cambiare è un altro e costa meno. Solo la misura distingue i due casi.",
      },
    ],
    quandoTecnico: [
      "Il vetro resta freddo dopo mezz'ora a 60 gradi",
      "Il salvavita scatta durante la fase di riscaldamento",
      "I capi bianchi ingrigiscono progressivamente da settimane",
      "Il programma dura molto più del previsto e poi finisce lo stesso",
    ],
    faq: [
      {
        domanda: "Lavare sempre a freddo fa male alla lavatrice?",
        risposta:
          "Non la rompe, ma favorisce depositi grassi e cattivi odori. Un ciclo caldo ogni tanto serve alla macchina più che ai vestiti.",
      },
      {
        domanda: "Conviene cambiare la resistenza da soli?",
        risposta:
          "È una delle riparazioni più abbordabili, ma richiede di misurare prima e di rimontare la guarnizione correttamente: se resta storta, la macchina perde acqua dal retro. Se non hai un tester, il rischio è comprare il pezzo sbagliato.",
      },
      {
        domanda: "Quanto costa la riparazione?",
        risposta:
          "La resistenza è un pezzo economico; quello che pesa è la manodopera. Vale quasi sempre la pena su una macchina in buono stato, molto meno se si somma ad altri guasti.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "si-ferma-a-meta",
    ricerca: "lavatrice si blocca a metà lavaggio",
    titolo: "Lavatrice che si blocca a metà lavaggio: da dove cominciare",
    descrizione:
      "Il ciclo si ferma sempre allo stesso punto, o il tempo residuo non scende mai. Il momento in cui si blocca dice quasi tutto sulla causa.",
    elettrodomestico: "lavatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il programma parte, va avanti un po', e poi si pianta. A volte con un codice di errore, a volte con il timer che resta immobile per mezz'ora. Il punto in cui si ferma è l'indizio più utile che hai: annotalo prima di fare qualsiasi altra cosa.",
    sicurezza:
      "Prima di aprire il filtro o guardare dietro, stacca la spina. Se la macchina si è fermata con acqua dentro, quella va tolta dal filtro prima di provare ad aprire l'oblò.",
    controlli: [
      {
        titolo: "Si blocca all'inizio, mentre carica",
        difficolta: "facile",
        testo:
          "Se il tempo si ferma nei primi minuti, l'acqua non sta entrando abbastanza in fretta. Controlla il rubinetto aperto del tutto, il tubo non piegato e il filtrino nel raccordo, che si intasa di calcare e riduce il flusso finché la macchina non va in errore per tempo scaduto.",
      },
      {
        titolo: "Si blocca prima della centrifuga",
        difficolta: "facile",
        testo:
          "È il caso più comune, e quasi sempre significa che non riesce a scaricare: senza vasca vuota la centrifuga non parte, e il ciclo resta appeso. Filtro della pompa, tubo di scarico e sifone del lavello sono i tre posti da guardare, in quest'ordine.",
      },
      {
        titolo: "Si blocca in centrifuga e ci riprova",
        difficolta: "facile",
        testo:
          "Se senti il cestello accelerare e poi rallentare più volte, è lo sbilanciamento: un capo pesante da un lato. La macchina ci prova due o tre volte e poi si arrende, finendo il programma con il bucato bagnato. Distribuisci e rilancia la sola centrifuga.",
      },
      {
        titolo: "Il cestino è troppo pieno",
        difficolta: "facile",
        testo:
          "Un carico oltre il consentito fa lavorare il motore in sforzo e può far intervenire la protezione termica: la macchina si ferma, aspetta di raffreddarsi e a volte riprende da sola dopo mezz'ora. Se succede solo con i carichi grossi, la causa è questa e non c'è nulla da riparare.",
      },
      {
        titolo: "Si blocca sempre nello stesso identico punto",
        difficolta: "media",
        testo:
          "Un blocco riproducibile al minuto è quasi sempre un componente che viene chiamato in causa in quella fase: la resistenza al riscaldamento, la pompa allo scarico, il motore al cambio di velocità. Annota il minuto e il codice di errore: è l'informazione che fa risparmiare tempo — e denaro — a chiunque metterà le mani nella macchina.",
      },
      {
        titolo: "Motore, scheda o cablaggio",
        difficolta: "da tecnico",
        testo:
          "Se il blocco è casuale, cambia punto ogni volta e a volte la macchina si spegne del tutto, il sospetto va sull'elettronica o su un contatto che scalda. È il caso meno piacevole perché è anche il più difficile da riprodurre davanti a un tecnico: il diario dei blocchi, con data e ora, vale più di mille descrizioni.",
      },
    ],
    quandoTecnico: [
      "Si spegne completamente e si riaccende da sola",
      "Il salvavita scatta nel momento del blocco",
      "Si ferma in punti sempre diversi, in modo imprevedibile",
      "Il codice di errore torna anche dopo aver tolto la corrente",
    ],
    faq: [
      {
        domanda: "Che significa il codice di errore sul display?",
        risposta:
          "Cambia da marca a marca, ma quasi tutti i costruttori usano codici che indicano la famiglia del problema: acqua, scarico, riscaldamento, motore. Annotarlo è utile in ogni caso, anche se non sai interpretarlo.",
      },
      {
        domanda: "Staccare la corrente e ricominciare risolve?",
        risposta:
          "A volte sblocca un ciclo rimasto appeso, e vale come primo tentativo. Ma se il blocco torna sempre allo stesso punto, sotto c'è una causa fisica che il riavvio non tocca.",
      },
      {
        domanda: "Posso lasciare il bucato dentro nel frattempo?",
        risposta:
          "Meglio toglierlo: in poche ore in un ambiente umido prende odore di chiuso e va rilavato. Se l'oblò non si apre, prima va tolta l'acqua dal filtro.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-scalda",
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
    slug: "non-scarica",
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

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-lava-bene",
    ricerca: "lavastoviglie non lava bene",
    titolo: "Lavastoviglie che non lava bene: perché i piatti restano sporchi",
    descrizione:
      "Piatti che escono con residui incrostati? Nella grande maggioranza dei casi non è la macchina: sono i mulinelli, il filtro o il modo in cui è caricata.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "Apri a fine ciclo e i piatti hanno ancora residui secchi, magari solo in certi punti del cestello. È il guasto più frequente delle lavastoviglie ed è anche quello che quasi sempre si risolve senza chiamare nessuno: la macchina lava, ma l'acqua non arriva dove deve.",
    sicurezza:
      "Per tutti i controlli qui sotto basta staccare la spina. Attenzione solo alle schegge: se si è rotto un bicchiere, sul fondo ci sono frammenti che nell'acqua torbida non si vedono. Guanti da cucina spessi, non quelli sottili.",
    controlli: [
      {
        titolo: "I fori dei mulinelli sono otturati",
        difficolta: "facile",
        testo:
          "È la causa numero uno. I bracci rotanti — quello sotto il cestello inferiore e quello sotto il superiore — hanno decine di forellini da cui esce l'acqua in pressione. Si tappano con semi, pezzetti di etichetta e calcare. Sfila i bracci (di solito si sganciano ruotando una ghiera) e libera ogni foro con uno stuzzicadenti, poi sciacqua controluce. Se un'intera zona del cestello resta sporca, il foro che la serve è quasi certamente tappato.",
      },
      {
        titolo: "Il filtro sul fondo è sporco",
        difficolta: "facile",
        testo:
          "Sotto il cestello inferiore c'è un filtro cilindrico che si sfila ruotandolo, e sotto una retina piatta. Se sono intasati, la macchina ricicla acqua sporca e la spruzza sui piatti: il risultato è una patina uniforme, non macchie localizzate. Lava tutto con acqua calda e uno spazzolino.",
      },
      {
        titolo: "I bracci non girano liberi",
        difficolta: "facile",
        testo:
          "Prima di avviare, fai girare i mulinelli con la mano: devono ruotare senza incontrare nulla. Un manico di padella che sporge, un tagliere alto o un piatto messo di traverso bloccano il braccio, e metà del carico non viene lavata affatto. È l'errore più comune con le pentole grandi.",
      },
      {
        titolo: "Manca il sale o il brillantante",
        difficolta: "facile",
        testo:
          "Senza sale l'acqua resta dura, il detersivo lavora peggio e il calcare si deposita anche sui mulinelli. Le spie sul pannello lo segnalano, ma sono piccole e si ignorano per mesi. Riempi il serbatoio del sale fino all'orlo e regola la durezza dell'acqua secondo il valore della tua zona.",
      },
      {
        titolo: "Il carico è troppo fitto o mal disposto",
        difficolta: "facile",
        testo:
          "I piatti non devono toccarsi: dove due superfici si sfiorano, l'acqua non passa e resta lo sporco. Le pentole vanno capovolte ma inclinate, i contenitori di plastica in alto. E non serve sciacquare tutto prima: i detersivi moderni hanno bisogno di un po' di sporco per lavorare, ma i residui solidi grossi vanno tolti perché finiscono nel filtro.",
      },
      {
        titolo: "L'acqua non si scalda abbastanza",
        difficolta: "da tecnico",
        testo:
          "Se hai sistemato tutto il resto e i grassi restano, il sospetto è la resistenza: la macchina completa il ciclo ma con acqua tiepida, e lo sporco unto non si scioglie. Il segnale tipico è il vetro interno freddo a fine programma e le stoviglie che escono bagnate oltre che sporche.",
      },
    ],
    quandoTecnico: [
      "Hai pulito filtro e mulinelli e i piatti restano unti",
      "Le stoviglie escono fredde a fine ciclo",
      "Il programma finisce molto prima del previsto",
      "Senti la pompa lavorare a intermittenza durante il lavaggio",
    ],
    faq: [
      {
        domanda: "Devo sciacquare i piatti prima di metterli dentro?",
        risposta:
          "Basta togliere i residui solidi. Sciacquare tutto è controproducente: gli enzimi dei detersivi moderni hanno bisogno di sporco per attivarsi, e su piatti già puliti tendono a lasciare aloni.",
      },
      {
        domanda: "Le pastiglie tutto-in-uno bastano davvero?",
        risposta:
          "In acqua di durezza media sì. In zone molto calcaree no: sale e brillantante separati fanno una differenza visibile, e proteggono anche la macchina dal calcare.",
      },
      {
        domanda: "Perché solo alcuni piatti escono sporchi?",
        risposta:
          "È l'indizio più utile che hai: significa che l'acqua non arriva in quella zona. Guarda i fori del mulinello che serve quel settore, e controlla che nulla blocchi la rotazione.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-asciuga",
    ricerca: "lavastoviglie non asciuga",
    titolo: "Lavastoviglie che non asciuga: cosa controllare",
    descrizione:
      "Stoviglie bagnate a fine ciclo? Spesso non è un guasto ma il brillantante finito o il programma scelto. Ecco come distinguere i casi.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "Apri a fine programma e trovi tutto bagnato, o goccioline ovunque. Prima di preoccuparti: questa è la voce dell'elenco che più spesso non nasconde nessun guasto, ma un serbatoio vuoto o un programma che l'asciugatura non la fa proprio.",
    sicurezza:
      "Nessun rischio particolare in questi controlli. L'unica accortezza: non aprire la lavastoviglie a fine ciclo appoggiandoci sopra la faccia — esce un getto di vapore bollente.",
    controlli: [
      {
        titolo: "Il brillantante è finito",
        difficolta: "facile",
        testo:
          "È la causa principale, senza confronto. Il brillantante non serve a lucidare: riduce la tensione superficiale dell'acqua, così scivola via invece di restare in gocce. Senza, le stoviglie escono bagnate anche con l'asciugatura perfettamente funzionante. Il serbatoio è nello sportello, accanto a quello del detersivo, e la spia che segnala il livello è minuscola.",
      },
      {
        titolo: "Il programma non prevede asciugatura",
        difficolta: "facile",
        testo:
          "I programmi rapidi e alcuni eco saltano o accorciano molto la fase finale, proprio per consumare meno. Prova lo stesso carico con un programma normale a 60 gradi: se esce asciutto, non c'è nulla da riparare.",
      },
      {
        titolo: "La plastica resta bagnata comunque",
        difficolta: "facile",
        testo:
          "Non è un difetto della tua macchina. Nelle lavastoviglie a condensazione — cioè quasi tutte quelle domestiche — l'asciugatura sfrutta il calore accumulato dalle stoviglie: ceramica e vetro trattengono calore e si asciugano, la plastica no. Contenitori e coperchi bagnati sono normali.",
      },
      {
        titolo: "Lo sportello resta chiuso a fine ciclo",
        difficolta: "facile",
        testo:
          "Il vapore deve poter uscire. Se la macchina finisce di notte e la apri la mattina dopo, l'umidità si è ricondensata su tutto. Socchiudere lo sportello appena finisce il programma cambia il risultato più di qualsiasi prodotto.",
      },
      {
        titolo: "La durezza dell'acqua è impostata male",
        difficolta: "media",
        testo:
          "Se sulle stoviglie oltre all'acqua trovi anche una patina bianca, il problema è il calcare e non l'asciugatura. Controlla il livello del sale e imposta la durezza secondo il valore della tua zona — si trova sul sito del gestore idrico, oppure con le strisce di prova in dotazione a molte macchine.",
      },
      {
        titolo: "Resistenza o ventola dell'asciugatura",
        difficolta: "da tecnico",
        testo:
          "Se il brillantante c'è, il programma è quello giusto e le stoviglie escono comunque fredde e fradice, allora la fase di riscaldamento finale non avviene. Nei modelli con ventola può essere quella bloccata. Va misurato: la resistenza è un pezzo economico, ma cambiarla a caso quando il guasto era altrove significa spendere due volte.",
      },
    ],
    quandoTecnico: [
      "Le stoviglie escono fredde oltre che bagnate",
      "Anche ceramica e vetro restano completamente zuppi",
      "Il brillantante non viene consumato tra un lavaggio e l'altro",
      "Senti odore di bruciato durante la fase finale",
    ],
    faq: [
      {
        domanda: "Quanto brillantante devo mettere?",
        risposta:
          "Il serbatoio va riempito fino al segno e dura in genere un paio di mesi. Molte macchine permettono di regolare il dosaggio: se restano aloni, va abbassato; se resta acqua in gocce, alzato.",
      },
      {
        domanda: "Le pastiglie tutto-in-uno contengono già il brillantante?",
        risposta:
          "Ne contengono una quantità ridotta, che in acqua dura non basta. Se hai il problema dell'asciugatura e usi solo pastiglie, riempire comunque il serbatoio è la prova più veloce da fare.",
      },
      {
        domanda: "Aprire lo sportello a fine ciclo è sicuro?",
        risposta:
          "Sì, ma aspetta un minuto e stai indietro quando lo apri: esce vapore molto caldo. Poi lascialo socchiuso finché non si raffredda.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "lavastoviglie non si accende",
    titolo: "Lavastoviglie che non si accende: le verifiche da fare",
    descrizione:
      "Nessuna spia, nessun segno di vita? Quattro controlli gratuiti risolvono la maggior parte dei casi, e vanno fatti in quest'ordine.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "Premi il tasto e non succede niente. Sembra il guasto più grave e spesso è il più banale: nelle lavastoviglie da incasso, per giunta, la presa è nascosta dietro il mobile e nessuno pensa a controllarla.",
    sicurezza:
      "Presa, quadro elettrico e sportello puoi controllarli senza rischi. Non smontare il pannello frontale né il basamento: lì sotto convivono acqua e collegamenti elettrici, ed è la combinazione peggiore.",
    controlli: [
      {
        titolo: "La presa non porta corrente",
        difficolta: "facile",
        testo:
          "Nelle lavastoviglie da incasso la presa sta dietro il mobile e non si vede mai: basta un urto durante una pulizia perché la spina si sfili di un millimetro. Se riesci ad accedervi, prova la presa con un altro apparecchio. Attenzione anche alle prese comandate da un interruttore a muro, che qualcuno può aver spento senza saperlo.",
      },
      {
        titolo: "È scattato il salvavita",
        difficolta: "facile",
        testo:
          "Guarda il quadro elettrico: se una levetta è abbassata, rialzala. Se scatta di nuovo appena accendi la lavastoviglie, fermati subito: c'è una dispersione, quasi sempre dovuta ad acqua arrivata dove non doveva. Insistere è pericoloso e può danneggiare altro.",
      },
      {
        titolo: "Lo sportello non è chiuso davvero",
        difficolta: "facile",
        testo:
          "Le lavastoviglie non partono con la porta socchiusa, e il gancio deve fare clic. Sulle porte da incasso il pannello del mobile può disallinearsi nel tempo e impedire la chiusura completa: prova a spingere con decisione al centro mentre premi il tasto.",
      },
      {
        titolo: "C'è una partenza ritardata attiva",
        difficolta: "facile",
        testo:
          "La macchina sembra spenta ma sta solo aspettando. Sul display compare un orario o un simbolo di orologio, che di notte o in penombra è facilissimo non notare. Tieni premuto il tasto di annullamento — di solito quello con la scritta reset o start tenuto qualche secondo — per azzerare.",
      },
      {
        titolo: "È attiva la sicurezza bambini",
        difficolta: "facile",
        testo:
          "Il blocco tasti fa ignorare i comandi e si riconosce da un lucchetto sul pannello. Si toglie tenendo premuti insieme i due tasti che hanno il simbolo stampato sopra, per qualche secondo.",
      },
      {
        titolo: "Blocco porta o scheda elettronica",
        difficolta: "da tecnico",
        testo:
          "Se la corrente arriva, lo sportello chiude con il suo clic e la macchina resta muta, i sospetti sono due: il micro-interruttore che segnala la chiusura, che è un pezzo economico e si guasta spesso, oppure la scheda, che costa molto di più. Solo un tester distingue i due casi.",
      },
    ],
    quandoTecnico: [
      "Il salvavita scatta ogni volta che accendi la macchina",
      "Senti odore di bruciato o vedi la spina annerita",
      "La presa funziona con altri apparecchi ma la lavastoviglie resta spenta",
      "Il pannello si accende a intermittenza da solo",
    ],
    faq: [
      {
        domanda: "La lavastoviglie da incasso ha un interruttore nascosto?",
        risposta:
          "Non un interruttore suo, ma spesso è collegata a una presa comandata da un interruttore sotto il piano di lavoro o dentro un pensile. Vale la pena cercarlo prima di chiamare qualcuno.",
      },
      {
        domanda: "Ho tolto e rimesso la corrente e ora funziona. È risolto?",
        risposta:
          "Non necessariamente. Un riavvio sblocca un ciclo rimasto appeso, ma se il problema torna c'è una causa sotto: un contatto che scalda o una scheda che si pianta danno esattamente questo comportamento intermittente.",
      },
      {
        domanda: "Conviene ripararla o cambiarla?",
        risposta:
          "Un blocco porta o un fusibile hanno senso su qualsiasi macchina. Una scheda elettronica su una lavastoviglie di dieci anni raramente si ripaga, soprattutto se già mostra altri acciacchi.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "perde-acqua",
    ricerca: "lavastoviglie perde acqua",
    titolo: "Lavastoviglie che perde acqua: da dove viene",
    descrizione:
      "Una pozza davanti alla macchina non dice da sola qual è il guasto. Il punto da cui esce l'acqua invece sì, e restringe subito il campo.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "L'acqua sul pavimento di una cucina è un problema doppio: c'è il guasto, e c'è il mobile in truciolare che si gonfia in poche ore. La cosa più utile che puoi fare subito è capire da dove esce, perché davanti, sotto e dietro sono tre storie diverse.",
    sicurezza:
      "Chiudi il rubinetto dell'acqua e stacca la spina, in quest'ordine. Se la macchina è da incasso e l'acqua è finita sotto il mobile, asciuga il prima possibile: il truciolare bagnato si gonfia e non torna indietro.",
    controlli: [
      {
        titolo: "Esce troppa schiuma",
        difficolta: "facile",
        testo:
          "Se l'acqua che trovi è schiumosa, quasi sempre è colpa del detersivo: qualcuno ha usato quello per i piatti a mano, oppure una dose eccessiva. La schiuma trabocca dallo sportello anche a macchina perfettamente funzionante. Fai un ciclo a vuoto senza detersivo per eliminarla, e controlla cosa c'è nella vaschetta.",
      },
      {
        titolo: "La guarnizione dello sportello è sporca o rovinata",
        difficolta: "facile",
        testo:
          "Passa un dito lungo tutta la gomma attorno alla porta: ci si accumulano grasso e residui che tengono aperto un passaggio. Pulisci con un panno umido. Se trovi tagli, indurimenti o punti schiacciati, la guarnizione va sostituita: costa poco ed è uno dei pochi ricambi alla portata di tutti.",
      },
      {
        titolo: "Lo sportello non chiude allineato",
        difficolta: "media",
        testo:
          "Nelle macchine da incasso il pannello del mobile pesa, e con gli anni le cerniere cedono: la porta chiude storta e perde da un angolo solo. Se la pozza compare sempre dallo stesso lato, guarda lì. A volte basta registrare le viti del pannello.",
      },
      {
        titolo: "I raccordi dietro sono allentati",
        difficolta: "media",
        testo:
          "Se l'acqua compare dietro o di lato, controlla il raccordo del tubo di carico al rubinetto e alla macchina: le vibrazioni li allentano nel tempo, e spesso basta stringere a mano. Guarda anche il punto in cui il tubo di scarico entra nel sifone del lavello.",
      },
      {
        titolo: "Il carico devia i getti",
        difficolta: "facile",
        testo:
          "Una teglia grande messa contro lo sportello fa rimbalzare l'acqua direttamente sulla guarnizione, e la macchina perde solo con certi carichi. Se la perdita non è sistematica, prova a cambiare disposizione prima di cercare guasti.",
      },
      {
        titolo: "Perdita interna nella vasca o nella pompa",
        difficolta: "da tecnico",
        testo:
          "Se l'acqua compare da sotto il centro della macchina e non dai bordi, il punto è nel basamento: guarnizione della pompa, tubo interno o vasca forata. Su molte macchine questo fa anche scattare la sicurezza antiallagamento, che blocca tutto e mostra un errore.",
      },
    ],
    quandoTecnico: [
      "L'acqua esce da sotto il centro, non dallo sportello",
      "La macchina va in blocco antiallagamento e non riparte",
      "Hai stretto i raccordi e continua a gocciolare",
      "Il mobile attorno è già gonfio o macchiato",
    ],
    faq: [
      {
        domanda: "Posso usarla finché perde poco?",
        risposta:
          "In una cucina no. Il danno vero non è la lavastoviglie ma il mobile e il pavimento, e in condominio l'appartamento di sotto. Chiudi il rubinetto tra un ciclo e l'altro finché non hai risolto.",
      },
      {
        domanda: "Cos'è il sistema antiallagamento?",
        risposta:
          "Un galleggiante nel basamento che, se sente acqua, blocca la macchina e in alcuni modelli avvia lo scarico continuo. Se scatta, non è un capriccio: da qualche parte l'acqua sta uscendo davvero.",
      },
      {
        domanda: "Ho usato il detersivo dei piatti a mano per sbaglio. Che faccio?",
        risposta:
          "Togli le stoviglie, elimina la schiuma con un panno e fai uno o due cicli brevi a vuoto senza detersivo. Non è un danno permanente, ma la schiuma va tolta prima di rimettere in funzione la macchina normalmente.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-carica-acqua",
    ricerca: "lavastoviglie non carica acqua",
    titolo: "Lavastoviglie che non carica acqua: le cause",
    descrizione:
      "Il programma parte ma l'acqua non entra, o la macchina va in errore dopo pochi minuti. Spesso è un filtrino da pulire, non un pezzo da cambiare.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "La macchina si accende, il ciclo parte, e poi si ferma: dentro non è entrata acqua. Il colpevole più frequente è una retina grande come un'unghia dentro il raccordo del tubo, e si pulisce in cinque minuti.",
    sicurezza:
      "Chiudi il rubinetto e stacca la spina prima di svitare il tubo di carico. Quando lo stacchi esce l'acqua rimasta dentro: tieni pronto uno straccio, soprattutto se la macchina è da incasso e il pavimento è in legno.",
    controlli: [
      {
        titolo: "Il rubinetto è chiuso o aperto a metà",
        difficolta: "facile",
        testo:
          "Il rubinetto della lavastoviglie sta sotto il lavello, in mezzo ad altri tubi, e capita di chiuderlo per errore durante un lavoro idraulico o una pulizia. Aprilo completamente: mezza apertura fa entrare l'acqua troppo lentamente e la macchina va in errore per tempo scaduto.",
      },
      {
        titolo: "Il filtrino del tubo di carico è intasato",
        difficolta: "facile",
        testo:
          "Dentro il raccordo che si avvita alla macchina — o al rubinetto — c'è una retina fine che ferma sabbia e calcare. Si intasa in anni e poi blocca tutto. Sfilala con una pinzetta, lasciala a bagno nell'aceto, sciacqua e rimettila. È la riparazione più economica che esista su una lavastoviglie.",
      },
      {
        titolo: "Il tubo è piegato dietro il mobile",
        difficolta: "facile",
        testo:
          "Nelle macchine da incasso il tubo passa in uno spazio stretto e, spingendo dentro la lavastoviglie dopo una pulizia, si strozza contro la parete. Una piega netta riduce il flusso quanto un'ostruzione, e il sintomo è identico.",
      },
      {
        titolo: "È scattata la sicurezza del tubo Aquastop",
        difficolta: "media",
        testo:
          "Molti tubi di carico hanno una valvola di sicurezza nel raccordo al rubinetto, riconoscibile perché è più grosso del normale. Se ha rilevato una perdita — anche una vecchia, ormai asciutta — si chiude e non si riapre da sola. In quel caso il tubo va sostituito: non è riarmabile.",
      },
      {
        titolo: "La pressione dell'acqua è insufficiente",
        difficolta: "facile",
        testo:
          "Apri il rubinetto del lavello: se il getto è debole ovunque in casa, il problema è la rete. Capita ai piani alti nelle ore di punta o dopo un intervento dell'acquedotto. Sotto una certa pressione minima molte lavastoviglie si fermano in errore invece di aspettare.",
      },
      {
        titolo: "Elettrovalvola o pressostato guasti",
        difficolta: "da tecnico",
        testo:
          "Se rubinetto, filtrino e pressione sono a posto, resta la valvola che comanda l'ingresso dell'acqua — quando è bruciata non senti alcun ronzio all'avvio — oppure il pressostato, che dice alla scheda quanta acqua c'è dentro e sbagliando blocca il ciclo.",
      },
    ],
    quandoTecnico: [
      "Non senti alcun ronzio nei primi secondi del ciclo",
      "La macchina carica all'infinito e non si ferma",
      "Va in errore anche col filtrino appena pulito",
      "Il tubo Aquastop è scattato: va sostituito, non riparato",
    ],
    faq: [
      {
        domanda: "Come capisco se ho un tubo Aquastop?",
        risposta:
          "Il raccordo che si avvita al rubinetto è molto più grosso del tubo, spesso di plastica scura, e a volte ha un cavetto elettrico che corre lungo il tubo. Se c'è, è quello.",
      },
      {
        domanda: "Posso pulire il filtrino senza attrezzi?",
        risposta:
          "Serve almeno una pinzetta: è incastrato a pressione e forzandolo con un cacciavite si deforma, e poi non filtra più. Una pinzetta da sopracciglia va benissimo.",
      },
      {
        domanda: "La lavastoviglie carica pochissima acqua: è normale?",
        risposta:
          "Sì. Le macchine recenti usano pochi litri per ciclo e vedere solo un velo sul fondo non indica un guasto. Il segnale d'allarme è il ciclo che non avanza, non la quantità visibile.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "puzza",
    ricerca: "lavastoviglie puzza",
    titolo: "Lavastoviglie che puzza: da dove viene l'odore e come toglierlo",
    descrizione:
      "Odore di fogna o di chiuso appena apri lo sportello? Non è un guasto: è manutenzione, e si risolve in un pomeriggio senza ricambi.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "Apri lo sportello e ti arriva un odore che non dovrebbe esserci. È l'unica voce di questo elenco che quasi mai richiede un tecnico: le cause sono sempre le stesse quattro, e la differenza la fa dove guardi.",
    sicurezza:
      "Nessun rischio particolare, ma non mescolare mai candeggina e prodotti a base di acido: la reazione libera gas irritanti in uno spazio chiuso. Se vuoi usarli entrambi, in cicli separati e distanti.",
    controlli: [
      {
        titolo: "Il filtro non viene pulito da mesi",
        difficolta: "facile",
        testo:
          "È la prima cosa da guardare, sempre. Sotto il cestello inferiore, il filtro cilindrico si sfila ruotandolo di un quarto di giro; sotto c'è una retina piatta. Lì marciscono residui di cibo nell'acqua ferma, ed è da lì che viene l'odore forte. Acqua calda, spazzolino, detersivo per piatti.",
      },
      {
        titolo: "L'odore è di fogna, non di marcio",
        difficolta: "facile",
        testo:
          "Sono due cose diverse e portano a posti diversi. Se sa di fogna, guarda il sifone del lavello e il modo in cui è collegato il tubo di scarico: senza una curva alta, i gas dello scarico risalgono direttamente in macchina. Il tubo deve salire ad arco fino ad almeno 40 cm da terra prima di scendere.",
      },
      {
        titolo: "Si lava sempre con programmi eco a bassa temperatura",
        difficolta: "facile",
        testo:
          "Sotto i 50 gradi i grassi non si sciolgono: si depositano nei tubi e diventano nutrimento per i batteri. Un ciclo a vuoto alla massima temperatura una volta al mese, con acido citrico o aceto al posto del detersivo, cambia la situazione più di qualsiasi profumatore.",
      },
      {
        titolo: "La guarnizione e il bordo dello sportello",
        difficolta: "facile",
        testo:
          "Ripiega la gomma attorno alla porta e guarda: nella piega si accumula una patina scura. Controlla anche il bordo inferiore della vasca, dove l'acqua ristagna, e la zona attorno alla vaschetta del detersivo. Panno umido e bicarbonato.",
      },
      {
        titolo: "Le stoviglie restano dentro giorni prima del ciclo",
        difficolta: "facile",
        testo:
          "In molte case la lavastoviglie si avvia quando è piena, e nel frattempo lo sporco resta lì a marcire al caldo. Se sai che ci vorranno giorni, fai un risciacquo breve nel frattempo — molte macchine hanno un programma apposta che usa pochissima acqua.",
      },
      {
        titolo: "Lo sportello resta sempre chiuso",
        difficolta: "facile",
        testo:
          "Dopo il ciclo dentro resta umidità, e a porta chiusa non evapora mai. Lasciare lo sportello socchiuso tra un lavaggio e l'altro è il rimedio più semplice ed efficace di tutto l'elenco, ed è l'unico gratuito e permanente.",
      },
    ],
    quandoTecnico: [
      "L'odore resta dopo aver pulito filtro, guarnizione e sifone",
      "Vedi acqua stagnante sul fondo che non se ne va",
      "L'odore di fogna arriva anche a macchina spenta da giorni",
      "Compaiono macchie nere che tornano subito dopo la pulizia",
    ],
    faq: [
      {
        domanda: "Aceto o prodotti specifici?",
        risposta:
          "L'aceto bianco o l'acido citrico sciolgono calcare e residui grassi e costano una frazione. I prodotti dedicati fanno lo stesso lavoro con più profumo. La differenza vera la fa la frequenza, non il prodotto.",
      },
      {
        domanda: "Posso mettere il bicarbonato nella vaschetta del sale?",
        risposta:
          "Assolutamente no. Nel serbatoio del sale va solo sale specifico per lavastoviglie: qualsiasi altra cosa danneggia il decalcificatore, che è un pezzo costoso.",
      },
      {
        domanda: "Perché puzza solo dopo le vacanze?",
        risposta:
          "L'acqua residua nel fondo e nel sifone evapora, e i gas dello scarico risalgono liberamente. È normale: un ciclo a vuoto risolve. Se torna ogni volta, controlla la curva del tubo di scarico.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "aloni-bianchi",
    ricerca: "lavastoviglie lascia aloni bianchi",
    titolo: "Aloni bianchi sui bicchieri: calcare o detersivo?",
    descrizione:
      "Patina opaca sui bicchieri e granelli bianchi sulle stoviglie. Sono due problemi diversi con due rimedi diversi: ecco come capire quale hai.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "I piatti escono puliti ma non presentabili: bicchieri opachi, una patina che al tatto sembra sabbia fine. Prima di cambiare detersivo conviene capire di cosa è fatta quella patina, perché le due cause si curano al contrario l'una dell'altra.",
    sicurezza:
      "Nessun rischio in questi controlli. Attenzione solo a non riempire il serbatoio del sale con prodotti diversi dal sale per lavastoviglie: si danneggia il decalcificatore, che è tra i pezzi più cari.",
    controlli: [
      {
        titolo: "La prova dell'aceto",
        difficolta: "facile",
        testo:
          "Prendi un bicchiere opaco e immergilo qualche minuto in aceto bianco caldo. Se torna trasparente, è calcare e si risolve con sale e durezza impostata bene. Se resta opaco, il vetro è corroso in modo permanente — succede lavando cristalli e vetri sottili a temperature alte, e purtroppo non si torna indietro.",
      },
      {
        titolo: "Il sale è finito",
        difficolta: "facile",
        testo:
          "È la causa numero uno degli aloni bianchi. Il serbatoio sta sul fondo della vasca, sotto il cestello inferiore, e va riempito fino all'orlo. La spia che lo segnala è piccola e sul pannello di molti modelli si vede male: controllalo a mano svitando il tappo, ogni due o tre mesi.",
      },
      {
        titolo: "La durezza dell'acqua è impostata male",
        difficolta: "media",
        testo:
          "Non basta mettere il sale: bisogna dire alla macchina quanto è dura l'acqua della tua zona, e quasi nessuno lo fa al momento dell'installazione. Il valore si trova sul sito del gestore idrico oppure con le strisce di prova. La regolazione si fa dal pannello, e il libretto spiega la combinazione di tasti.",
      },
      {
        titolo: "Granelli bianchi che si tolgono col dito",
        difficolta: "facile",
        testo:
          "Se sulle stoviglie trovi granelli e non una patina uniforme, è detersivo non sciolto. Le cause: dose eccessiva, pastiglia messa nel cestello invece che nella vaschetta, vaschetta bloccata da stoviglie che le impediscono di aprirsi, oppure programma troppo breve e freddo per sciogliere la pastiglia.",
      },
      {
        titolo: "Troppo brillantante",
        difficolta: "facile",
        testo:
          "Se gli aloni sono iridescenti e untuosi al tatto, più che bianchi, è il contrario: il brillantante è dosato troppo alto. Quasi tutte le macchine hanno una regolazione a più livelli, di solito nascosta nel tappo del serbatoio o nel menù del pannello.",
      },
      {
        titolo: "Decalcificatore guasto",
        difficolta: "da tecnico",
        testo:
          "Se il sale c'è, la durezza è impostata bene e la patina continua a formarsi, il decalcificatore interno può non funzionare più — spesso perché intasato dopo anni. Il segnale tipico è il sale che non viene consumato: se il serbatoio resta pieno per mesi, qualcosa non va.",
      },
    ],
    quandoTecnico: [
      "Il sale non viene consumato pur essendo nel serbatoio",
      "La patina continua a formarsi con durezza e sale corretti",
      "Vedi incrostazioni bianche anche sulle pareti della vasca",
      "L'acqua di casa lascia calcare ovunque, non solo in lavastoviglie",
    ],
    faq: [
      {
        domanda: "I bicchieri opachi tornano come prima?",
        risposta:
          "Se è calcare sì, con un ciclo all'acido citrico o un bagno nell'aceto. Se è corrosione del vetro no: quella è un'alterazione della superficie e non si recupera. La prova dell'aceto distingue i due casi in cinque minuti.",
      },
      {
        domanda: "Serve il sale anche usando le pastiglie tutto-in-uno?",
        risposta:
          "In acqua dura sì, nonostante quello che promette la confezione. Il sale nel serbatoio protegge anche il decalcificatore della macchina, cosa che la pastiglia non fa.",
      },
      {
        domanda: "Come faccio a sapere la durezza dell'acqua di casa mia?",
        risposta:
          "Il gestore idrico la pubblica sul suo sito per comune o per zona. In alternativa molte lavastoviglie includono una strisciolina di prova, e in ferramenta si trovano per pochi euro.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-rumore",
    ricerca: "lavastoviglie fa rumore",
    titolo: "Lavastoviglie rumorosa: quali rumori sono normali e quali no",
    descrizione:
      "Ronzii, colpi, sferragliare: il tipo di rumore dice quasi tutto sulla causa. Ecco come distinguere quelli innocui da quelli che vanno guardati.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "Una lavastoviglie fa rumore per mestiere, ma alcuni suoni sono normali e altri no. La differenza sta nel momento in cui compaiono e nel tipo: un colpo ritmico, un ronzio continuo e uno sferragliare metallico portano in tre posti diversi.",
    sicurezza:
      "Per i controlli qui sotto basta staccare la spina. Non aprire lo sportello a metà ciclo per ascoltare meglio: esce acqua bollente, e su molti modelli il getto continua per qualche istante.",
    controlli: [
      {
        titolo: "Qualcosa tocca il mulinello",
        difficolta: "facile",
        testo:
          "È la causa più frequente e la più banale: un manico di padella che sporge, un cucchiaio scivolato, un tagliere alto. Il braccio rotante ci sbatte contro a ogni giro producendo un colpo ritmico. Fai girare i mulinelli con la mano prima di avviare: devono ruotare liberi, senza incontrare nulla.",
      },
      {
        titolo: "Le posate vibrano tra loro",
        difficolta: "facile",
        testo:
          "Un tintinnio metallico continuo di solito è il cestello delle posate: coltelli e forchette appoggiati l'uno all'altro vibrano con la pressione dell'acqua. Distribuirle alternando manici in alto e in basso risolve, e lava anche meglio.",
      },
      {
        titolo: "C'è un oggetto nel filtro o nella pompa",
        difficolta: "media",
        testo:
          "Uno sferragliare che compare nei momenti di scarico è quasi sempre un nocciolo d'oliva, una scheggia di vetro o un tappo finito sotto il filtro. A macchina staccata, sfila il filtro e controlla con un dito che la girante della pompa giri libera.",
      },
      {
        titolo: "La macchina non è in piano",
        difficolta: "facile",
        testo:
          "Spingi gli angoli con una mano: se dondola, i piedini vanno regolati. Nelle macchine da incasso il problema si sente meno ma c'è, e nel tempo trasmette le vibrazioni a tutto il mobile — che diventa una cassa di risonanza.",
      },
      {
        titolo: "Il ronzio durante il carico dell'acqua",
        difficolta: "facile",
        testo:
          "Un ronzio breve all'inizio del ciclo è normale: è l'elettrovalvola che apre. Diventa sospetto se dura tutto il programma o se è accompagnato da colpi nei tubi — quello è il colpo d'ariete dell'impianto, non un guasto della macchina.",
      },
      {
        titolo: "Cuscinetti della pompa consumati",
        difficolta: "da tecnico",
        testo:
          "Un ronzio basso e continuo che cresce nel tempo, presente per tutto il lavaggio, indica la pompa di lavaggio in sofferenza. È il caso meno frequente ma anche l'unico che peggiora da solo: se il rumore aumenta di settimana in settimana, conviene farla guardare prima che si fermi del tutto.",
      },
    ],
    quandoTecnico: [
      "Ronzio basso e continuo che cresce di settimana in settimana",
      "Il rumore è comparso insieme a un peggioramento del lavaggio",
      "Senti odore di bruciato durante il ciclo",
      "La macchina vibra forte anche perfettamente in piano e a vuoto",
    ],
    faq: [
      {
        domanda: "Quanto deve essere rumorosa una lavastoviglie?",
        risposta:
          "I modelli recenti stanno tra i 40 e i 50 decibel, cioè il livello di una conversazione a bassa voce. Una macchina di quindici anni fa può essere sensibilmente più rumorosa senza avere nulla di rotto.",
      },
      {
        domanda: "I colpi nei tubi quando finisce di caricare sono normali?",
        risposta:
          "Sono il colpo d'ariete: l'acqua che si ferma di colpo quando la valvola chiude. È un fenomeno dell'impianto idraulico di casa, non della lavastoviglie, e si attenua con un ammortizzatore installato da un idraulico.",
      },
      {
        domanda: "Posso usarla se fa rumore?",
        risposta:
          "Se il rumore viene dal carico o dalle posate sì, senza problemi. Se è un ronzio meccanico crescente, continuare a usarla non la rompe subito ma nemmeno migliora la situazione.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-scalda",
    ricerca: "lavastoviglie non scalda l'acqua",
    titolo: "Lavastoviglie che non scalda l'acqua: come accorgersene",
    descrizione:
      "Stoviglie unte e fredde a fine ciclo? Il guasto è subdolo perché la macchina sembra funzionare. Ecco la verifica da fare senza strumenti.",
    elettrodomestico: "lavastoviglie",
    aggiornata: "2026-09-05",
    introduzione:
      "La lavastoviglie parte, fa il suo rumore, finisce il programma. Solo che lava con acqua tiepida: i grassi non si sciolgono, le stoviglie escono unte al tatto e non si asciugano. È il guasto che ci mette più tempo a essere riconosciuto, perché niente sembra rotto.",
    sicurezza:
      "L'unica verifica che puoi fare senza rischi è quella al tatto sulle stoviglie a fine ciclo. La resistenza sta nel fondo della vasca, a contatto con l'acqua: non è un componente su cui improvvisare, e su molti modelli è integrata nella pompa.",
    controlli: [
      {
        titolo: "Il programma selezionato lava a freddo",
        difficolta: "facile",
        testo:
          "Da controllare per primo. I programmi rapidi e alcuni eco lavorano a 40 o 45 gradi, temperature che al tatto sembrano tiepide. E il programma eco, per risparmiare, allunga i tempi tenendo la temperatura bassa: è normale che le stoviglie escano meno calde. Prova un ciclo intensivo a 65 gradi e confronta.",
      },
      {
        titolo: "La prova delle stoviglie a fine ciclo",
        difficolta: "facile",
        testo:
          "Apri appena finito il programma e tocca un piatto di ceramica al centro del cestello inferiore: deve essere caldo, non tiepido. Se è freddo, l'acqua non si è scaldata davvero. È la verifica più affidabile che puoi fare senza strumenti, e vale più di qualsiasi impressione sul risultato del lavaggio.",
      },
      {
        titolo: "La resistenza è coperta di calcare",
        difficolta: "media",
        testo:
          "In zone con acqua dura la resistenza si ricopre di uno strato che la isola: scalda meno, ci mette di più, e alla fine si brucia perché lavora in sofferenza. Se non hai mai fatto un ciclo anticalcare e il serbatoio del sale è vuoto da mesi, questa è la strada verso il guasto vero.",
      },
      {
        titolo: "Il carico è troppo fitto",
        difficolta: "facile",
        testo:
          "Con la macchina strapiena l'acqua calda non raggiunge tutto, e il risultato somiglia molto a un problema di riscaldamento. Se le stoviglie fredde e unte sono sempre nella stessa zona, è un problema di carico o di mulinelli, non di temperatura.",
      },
      {
        titolo: "Resistenza bruciata",
        difficolta: "da tecnico",
        testo:
          "È il caso più frequente quando l'acqua resta fredda del tutto. Su molte lavastoviglie moderne la resistenza è integrata nella pompa di lavaggio, quindi il ricambio costa più di quanto si immagini: farsi dire il prezzo prima di autorizzare la riparazione, su una macchina non recente, è ragionevole.",
      },
      {
        titolo: "Sonda di temperatura o scheda",
        difficolta: "da tecnico",
        testo:
          "La sonda dice alla scheda quanto è calda l'acqua. Se sbaglia in eccesso, la macchina crede di aver raggiunto la temperatura e spegne la resistenza quasi subito: il risultato è identico a una resistenza bruciata, ma il pezzo da cambiare è un altro e costa molto meno. Solo la misura distingue i due casi.",
      },
    ],
    quandoTecnico: [
      "Le stoviglie sono fredde toccandole appena finito il ciclo",
      "Il salvavita scatta durante la fase di riscaldamento",
      "Il programma dura molto più del previsto e poi termina lo stesso",
      "Il vetro interno non si appanna mai durante il lavaggio",
    ],
    faq: [
      {
        domanda: "Il programma eco è normale che lasci le stoviglie tiepide?",
        risposta:
          "Sì. L'eco risparmia energia scaldando meno e lavando più a lungo: le stoviglie escono meno calde e si asciugano peggio, ma dovrebbero comunque essere pulite. Se sono anche unte, allora il problema c'è.",
      },
      {
        domanda: "Conviene riparare la resistenza?",
        risposta:
          "Dipende dal modello. Dove è un pezzo a sé costa poco; dove è integrata nella pompa il conto sale parecchio, e su una macchina di dieci anni va confrontato con il prezzo di una nuova, che consuma anche meno.",
      },
      {
        domanda: "Posso collegare la lavastoviglie all'acqua calda?",
        risposta:
          "Alcuni modelli lo prevedono e il libretto lo dice esplicitamente. Farlo su una macchina non predisposta può falsare i sensori e rovinare i programmi: non è una scorciatoia da improvvisare.",
      },
    ],
  },
];

// ── Funzioni di appoggio ────────────────────────────────────────────

export function tutteLeGuide() {
  return GUIDE;
}

// `slug` identifica il sintomo DENTRO un elettrodomestico, non nel sito
// intero: "non-scarica" esiste sia per la lavatrice sia per la
// lavastoviglie. Per trovare una guida servono sempre tutti e due.
export function guidaPer(elettrodomestico, slug) {
  return GUIDE.find((g) => g.elettrodomestico === elettrodomestico && g.slug === slug) || null;
}

export function guidePerElettrodomestico(elettrodomestico) {
  return GUIDE.filter((g) => g.elettrodomestico === elettrodomestico);
}

// I sette riquadri della pagina indice, ognuno col numero di guide che ha.
export function elettrodomesticiConGuide() {
  return ELETTRODOMESTICI.map((e) => ({
    ...e,
    quante: guidePerElettrodomestico(e.nome).length,
  }));
}

// Le altre guide dello STESSO elettrodomestico, per il blocco in fondo alla
// pagina. Servono a due cose: al lettore, che spesso ha più di un sintomo
// sulla stessa macchina, e a Google, che scopre le pagine nuove seguendo i
// collegamenti tra le vecchie. Restano nella stessa famiglia perché a chi ha
// la lavatrice rotta non interessa il condizionatore.
export function guideCollegate(elettrodomestico, slug) {
  return GUIDE.filter((g) => g.elettrodomestico === elettrodomestico && g.slug !== slug);
}

export function urlGuida(elettrodomestico, slug) {
  return `${SITO}/guida/${elettrodomestico}/${slug}`;
}

export function urlElettrodomestico(elettrodomestico) {
  return `${SITO}/guida/${elettrodomestico}`;
}

// Gli indirizzi vecchi, piatti: /guida/lavatrice-non-centrifuga.
// Sono stati pubblicati e mandati a Google il 03/09/2026, quindi non possono
// semplicemente sparire — vanno rimandati ai nuovi con un reindirizzamento
// permanente, che passa a Google anche il poco valore già accumulato.
// Si generano da soli dai dati: aggiungere una guida non richiede di
// aggiungere una riga a mano da nessuna parte.
export function reindirizzamentiVecchiIndirizzi() {
  return GUIDE.map((g) => ({
    source: `/guida/${g.elettrodomestico}-${g.slug}`,
    destination: `/guida/${g.elettrodomestico}/${g.slug}`,
    permanent: true,
  }));
}
