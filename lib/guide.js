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

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "forno non si accende",
    titolo: "Forno che non si accende: cosa controllare",
    descrizione:
      "Display spento e nessuna spia? Nei forni la causa più frequente non è nel forno ma nel quadro elettrico, perché quasi sempre hanno una linea tutta loro.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Nessuna luce, nessun display, il forno completamente morto. A differenza degli altri elettrodomestici, qui la prima cosa da guardare non è la spina: i forni da incasso spesso non ce l'hanno nemmeno, e sono collegati direttamente a una linea dedicata.",
    sicurezza:
      "Puoi controllare il quadro elettrico e il pannello comandi senza rischi. Non aprire la parte posteriore né la scatola di derivazione dietro il mobile: nei forni passa una corrente molto alta, e i collegamenti restano in tensione anche a forno spento se non hai staccato l'interruttore giusto.",
    controlli: [
      {
        titolo: "È scattato l'interruttore dedicato",
        difficolta: "facile",
        testo:
          "Vai al quadro elettrico e guarda le levette una per una: i forni hanno quasi sempre una linea propria, e un interruttore abbassato non toglie corrente al resto della cucina — quindi tutto il resto funziona e tu non sospetti nulla. Rialzalo. Se scatta di nuovo appena accendi il forno, fermati: c'è una dispersione, ed è un caso da tecnico.",
      },
      {
        titolo: "Il forno è collegato ma il suo interruttore a muro è spento",
        difficolta: "facile",
        testo:
          "Molte cucine hanno un interruttore dedicato al forno, dentro un pensile, sotto il piano o accanto alla presa del piano cottura. Basta che qualcuno lo abbia urtato pulendo. Cerca un interruttore che non sai a cosa serve: quasi sempre serve al forno.",
      },
      {
        titolo: "Il pannello è bloccato dalla sicurezza bambini",
        difficolta: "facile",
        testo:
          "Se il display è acceso ma nessun tasto risponde, cerca il simbolo di un lucchetto o di una chiave. Il blocco si toglie tenendo premuto il tasto con quel simbolo per qualche secondo, o una combinazione di due tasti indicata nel libretto. È molto più comune di quanto sembri, soprattutto nei modelli a sfioramento.",
      },
      {
        titolo: "Il display mostra l'ora che lampeggia",
        difficolta: "facile",
        testo:
          "Dopo un blackout il programmatore si resetta e resta in attesa: l'ora lampeggia e il forno rifiuta di partire finché non gliela imposti. Non è un guasto ed è probabilmente la causa più frequente in assoluto dopo un temporale o un distacco di corrente.",
      },
      {
        titolo: "La spina o il morsetto scaldano",
        difficolta: "media",
        testo:
          "Se il tuo forno ha la spina, guardala: annerimenti, plastica deformata o un odore di caldo indicano un contatto che non tiene. È una situazione da risolvere subito, perché è la causa più comune di principi d'incendio negli elettrodomestici ad alto assorbimento — e il forno è il più affamato della cucina.",
      },
      {
        titolo: "Scheda elettronica o alimentazione interna",
        difficolta: "da tecnico",
        testo:
          "Se la corrente arriva davvero al forno e lui resta muto, restano il trasformatore interno e la scheda comandi. Su alcuni modelli c'è un fusibile termico che si apre dopo un surriscaldamento: è un pezzo economico, ma sta dietro il pannello posteriore e va sostituito da chi sa cosa sta toccando.",
      },
    ],
    quandoTecnico: [
      "L'interruttore scatta ogni volta che accendi il forno",
      "La spina o il cavo sono anneriti o scaldano",
      "Senti odore di bruciato o di plastica calda",
      "Arriva corrente ma il forno resta completamente spento",
    ],
    faq: [
      {
        domanda: "Il forno ha un fusibile che posso cambiare?",
        risposta:
          "Alcuni modelli hanno un fusibile termico interno, ma non è accessibile dall'esterno: sta dietro il pannello posteriore, in una zona con collegamenti ad alta corrente. La protezione che puoi controllare tu è quella del quadro elettrico.",
      },
      {
        domanda: "Perché il piano cottura funziona e il forno no?",
        risposta:
          "Perché sono su due linee elettriche diverse, anche quando sembrano un blocco unico. È esattamente il motivo per cui conviene guardare tutte le levette del quadro e non solo quella che salta di solito.",
      },
      {
        domanda: "Ho tolto e rimesso corrente e ora va. È risolto?",
        risposta:
          "Un riavvio sblocca una scheda rimasta appesa, e come primo tentativo va benissimo. Ma se succede di nuovo, sotto c'è una causa che il riavvio non tocca: spesso un contatto che scalda o un surriscaldamento ricorrente.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "brucia-i-cibi",
    ricerca: "forno brucia i cibi",
    titolo: "Forno che brucia i cibi: come capire se sbaglia la temperatura",
    descrizione:
      "Fuori bruciato e dentro crudo, o tutto scuro a temperature che prima andavano bene? C'è un modo semplice per verificare se il termostato sta mentendo.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Le ricette che facevi da anni non vengono più: a 180 gradi il dolce si brucia sopra, l'arrosto annerisce. Prima di dare la colpa al forno vale la pena escludere le cause di cottura, ma se il problema è comparso all'improvviso il sospetto principale è uno solo.",
    sicurezza:
      "Un forno che scalda più del dovuto non è solo una scocciatura: se il termostato ha smesso di regolare, la temperatura può salire oltre i limiti previsti. Se sospetti che sia questo, evita cotture lunghe e non lasciarlo acceso incustodito finché non è stato controllato.",
    controlli: [
      {
        titolo: "La prova del termometro",
        difficolta: "facile",
        testo:
          "È l'unica verifica che dà una risposta vera. Compra un termometro da forno — costa pochi euro in qualsiasi negozio di casalinghi — mettilo al centro, imposta 180 gradi e aspetta venti minuti dopo che la spia si è spenta. Se segna 220, il termostato sbaglia di 40 gradi e hai la conferma. Se segna 180, il problema è nella cottura, non nel forno.",
      },
      {
        titolo: "Il ripiano è troppo alto",
        difficolta: "facile",
        testo:
          "Nei forni statici il calore dall'alto è molto più aggressivo. Se la superficie brucia e l'interno resta crudo, prova lo stesso piatto due ripiani più in basso. Sembra banale, ma dopo aver cambiato forno le posizioni di riferimento cambiano tutte e le vecchie abitudini ingannano.",
      },
      {
        titolo: "Stai usando il ventilato con temperature da statico",
        difficolta: "facile",
        testo:
          "La ventola distribuisce il calore e cuoce più in fretta: la regola pratica è abbassare di 20 gradi rispetto alla ricetta pensata per il forno statico, oppure accorciare i tempi. Se hai cambiato forno di recente o hai iniziato a usare il ventilato per abitudine, questa è la spiegazione più probabile di tutte.",
      },
      {
        titolo: "La resistenza del grill resta accesa",
        difficolta: "media",
        testo:
          "Guarda dentro durante la cottura, a luce accesa: nella cottura statica la resistenza superiore deve accendersi e spegnersi a intervalli. Se resta sempre rosso vivo, il selettore o il termostato non la stanno più comandando, e il risultato è esattamente la superficie bruciata con l'interno crudo.",
      },
      {
        titolo: "La guarnizione della porta è rovinata",
        difficolta: "media",
        testo:
          "Una guarnizione indurita o staccata fa uscire calore da un lato, e il forno compensa scaldando di più: il risultato sono cotture sbilanciate e consumi più alti. Passa la mano attorno alla porta durante la cottura — con prudenza — e senti se in un punto esce aria molto calda.",
      },
      {
        titolo: "Termostato o sonda da sostituire",
        difficolta: "da tecnico",
        testo:
          "Se il termometro conferma uno scarto importante, il pezzo è quello: il termostato non spegne la resistenza al momento giusto. È una riparazione sensata su un forno in buono stato, e va fatta — un forno che scalda oltre il previsto non è un difetto estetico.",
      },
    ],
    quandoTecnico: [
      "Il termometro segna 30 gradi o più sopra l'impostato",
      "La resistenza resta accesa fissa senza mai spegnersi",
      "Il forno continua a scaldare anche dopo averlo spento",
      "La manopola non ha più effetto sulla temperatura",
    ],
    faq: [
      {
        domanda: "Quanto scarto è normale?",
        risposta:
          "Dieci o quindici gradi di oscillazione sono fisiologici in un forno domestico, e le ricette lo tollerano. Da trenta gradi in su non è più una tolleranza: è un termostato che sbaglia.",
      },
      {
        domanda: "Posso compensare abbassando la temperatura impostata?",
        risposta:
          "Come rimedio provvisorio funziona, e molti lo fanno per anni. Ma se il termostato sta cedendo, lo scarto cambia nel tempo e le cotture tornano imprevedibili: è una toppa, non una riparazione.",
      },
      {
        domanda: "Il forno nuovo cuoce diversamente dal vecchio. È rotto?",
        risposta:
          "Quasi certamente no. Ogni forno ha la sua personalità, e i modelli recenti sono spesso più efficienti: le stesse ricette richiedono qualche grado in meno o qualche minuto in meno. La prova del termometro toglie ogni dubbio.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-cuoce-uniforme",
    ricerca: "forno non cuoce in modo uniforme",
    titolo: "Forno che cuoce solo da un lato: le cause",
    descrizione:
      "La torta si alza da una parte sola, la pizza brucia sul fondo. Il punto in cui la cottura sbaglia dice quale resistenza guardare.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Il cibo non è bruciato né crudo: è tutte e due le cose, in punti diversi dello stesso piatto. È il sintomo che dà più informazioni di tutti, perché ogni zona del forno è servita da un elemento preciso.",
    sicurezza:
      "Le verifiche visive vanno fatte a forno acceso e sportello chiuso, guardando dal vetro con la luce interna. Se devi toccare qualcosa dentro, prima togli corrente dal quadro e aspetta che si raffreddi: le resistenze restano incandescenti a lungo dopo lo spegnimento.",
    controlli: [
      {
        titolo: "La prova delle funzioni",
        difficolta: "facile",
        testo:
          "Accendi la luce interna e prova le funzioni una alla volta: solo grill, solo statico, solo ventilato. Guarda quali resistenze diventano rosse. Se la superiore si accende e l'inferiore mai, hai già individuato il pezzo guasto — e sai anche perché il cibo brucia sopra e resta pallido sotto.",
      },
      {
        titolo: "La ventola non gira",
        difficolta: "media",
        testo:
          "Nel forno ventilato è la ventola a rendere uniforme la temperatura. Se non gira, il calore resta dove nasce e le cotture diventano sbilanciate. Guarda dal vetro con la luce accesa: la ventola sul fondo deve girare non appena selezioni una funzione ventilata.",
      },
      {
        titolo: "La teglia è troppo grande o il forno troppo pieno",
        difficolta: "facile",
        testo:
          "Una teglia che arriva quasi alle pareti blocca la circolazione dell'aria, e il risultato somiglia moltissimo a un guasto. Vale anche per due teglie su due ripiani: nei forni statici la cottura contemporanea non funziona bene, e va invertita la posizione a metà tempo.",
      },
      {
        titolo: "La guarnizione della porta perde calore",
        difficolta: "media",
        testo:
          "Se la guarnizione è staccata, indurita o schiacciata in un punto, da lì esce aria calda e quella zona del forno resta più fredda. Passa il dito lungo tutta la gomma a forno freddo: deve essere morbida ed elastica ovunque, senza tratti appiattiti.",
      },
      {
        titolo: "Il forno non è mai stato tarato al posto giusto",
        difficolta: "facile",
        testo:
          "Ogni forno ha zone leggermente più calde, e nei modelli statici la differenza tra alto e basso è notevole per costruzione. Non è un guasto: è il motivo per cui i libretti indicano ripiani diversi per arrosti, dolci e pizze. Se il problema c'è da sempre e non è comparso all'improvviso, quasi certamente è questo.",
      },
      {
        titolo: "Resistenza parzialmente interrotta",
        difficolta: "da tecnico",
        testo:
          "Una resistenza può cedere in un punto solo: scalda ma non su tutta la lunghezza, e la zona corrispondente resta fredda. A forno acceso si vede — un tratto resta scuro mentre il resto è rosso. Il pezzo va sostituito, e su molti modelli è una riparazione abbordabile.",
      },
    ],
    quandoTecnico: [
      "Una resistenza resta scura mentre le altre diventano rosse",
      "La ventola non gira in nessuna funzione ventilata",
      "Vedi una spira deformata, gonfia o annerita",
      "Il problema è comparso all'improvviso da una cottura all'altra",
    ],
    faq: [
      {
        domanda: "È normale che il forno cuocia più da un lato?",
        risposta:
          "Una piccola differenza sì, ed è il motivo per cui si gira la teglia a metà cottura. Una differenza netta e sempre nello stesso punto, comparsa all'improvviso, indica un elemento che non lavora più.",
      },
      {
        domanda: "Meglio statico o ventilato?",
        risposta:
          "Il ventilato distribuisce meglio ed è più adatto a cotture su più livelli; lo statico è preferibile per lievitati e dolci delicati, che con l'aria in movimento si asciugano. Non è un problema del forno: sono strumenti diversi.",
      },
      {
        domanda: "Le teglie scure cuociono diversamente?",
        risposta:
          "Sì, e parecchio. Il metallo scuro assorbe più calore e brunisce di più il fondo; quello chiaro riflette. Se hai cambiato teglie di recente, prova con quelle vecchie prima di cercare guasti.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-saltare-la-corrente",
    ricerca: "forno fa saltare la corrente",
    titolo: "Forno che fa saltare la corrente: cosa significa e cosa non fare",
    descrizione:
      "L'interruttore scatta appena accendi il forno. È l'unico guasto di questo elenco in cui insistere è pericoloso: ecco perché e cosa puoi verificare.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Accendi il forno e va via la luce in tutta la casa, o solo in cucina. Questo sintomo merita un discorso a parte: non è un fastidio da aggirare, è una protezione che sta facendo esattamente il suo mestiere.",
    sicurezza:
      "Non riarmare l'interruttore ripetutamente per far finire la cottura. Quello scatto segnala che una parte di corrente sta andando dove non dovrebbe — spesso verso la carcassa metallica del forno. Finché non è chiarito, il forno va lasciato spento e possibilmente scollegato dal quadro.",
    controlli: [
      {
        titolo: "Scatta solo dopo una pulizia o con l'umidità",
        difficolta: "facile",
        testo:
          "È il caso più fortunato e anche piuttosto comune. Se hai appena lavato l'interno o usato molto vapore, l'umidità può essersi infiltrata nell'isolante della resistenza. Lascia il forno aperto ad asciugare per un giorno intero, poi riprova. Se non salta più, era quello.",
      },
      {
        titolo: "Distingui quale interruttore scatta",
        difficolta: "facile",
        testo:
          "Guarda il quadro: se scatta il differenziale — il salvavita, quello con il tastino di prova — c'è una dispersione verso terra. Se scatta il magnetotermico, il problema è un assorbimento eccessivo o un corto. Sono due informazioni diverse e a chi verrà a guardarlo servono entrambe.",
      },
      {
        titolo: "Scatta subito o dopo qualche minuto?",
        difficolta: "facile",
        testo:
          "Annota anche questo. Se salta immediatamente all'accensione, il difetto è franco. Se salta dopo dieci o venti minuti, quando tutto si è scaldato, si tratta di una dispersione che si manifesta solo a caldo: tipica di una resistenza incrinata che si dilata. Sono due diagnosi diverse.",
      },
      {
        titolo: "Prova quale funzione lo fa scattare",
        difficolta: "media",
        testo:
          "Se il forno regge il grill ma salta con lo statico, la resistenza colpevole è quella inferiore, e viceversa. È un'informazione che riduce di molto il tempo di ricerca, ma va raccolta con una prova sola per funzione — non insistendo dieci volte.",
      },
      {
        titolo: "La lampadina interna",
        difficolta: "media",
        testo:
          "Capita più spesso di quanto si creda: un portalampada rovinato dal calore o una lampadina esplosa fanno scattare il differenziale. A corrente staccata dal quadro e forno freddo, svita il coprilampada di vetro e guarda com'è messo lì dentro.",
      },
      {
        titolo: "Resistenza incrinata o collegamento verso massa",
        difficolta: "da tecnico",
        testo:
          "È la causa più frequente in assoluto. La guaina della resistenza si crepa, l'umidità entra e parte della corrente passa alla carcassa metallica: il salvavita se ne accorge e stacca. La verifica si fa con uno strumento che misura l'isolamento, e la riparazione consiste nel sostituire il pezzo. Fino ad allora, il forno non va usato.",
      },
    ],
    quandoTecnico: [
      "Sempre, se scatta più di una volta",
      "Se scatta solo quando il forno è caldo",
      "Se hai sentito una scarica toccando la carcassa",
      "Se il forno funziona ma l'interruttore scatta a intermittenza",
    ],
    faq: [
      {
        domanda: "Posso usare il forno finché regge?",
        risposta:
          "No, ed è l'unica risposta netta di tutte queste guide. Il differenziale scatta per proteggere le persone: aggirarlo o continuare a riarmarlo significa togliere quella protezione mentre il difetto è ancora lì.",
      },
      {
        domanda: "Può essere colpa dell'impianto e non del forno?",
        risposta:
          "Può, e la prova è semplice: se scollegando il forno l'interruttore non scatta più per giorni, il problema è il forno. Se scatta lo stesso, è l'impianto o un altro apparecchio.",
      },
      {
        domanda: "Un differenziale più tollerante risolve?",
        risposta:
          "Non risolve niente: nasconde il difetto e riduce la protezione. È esattamente la strada che porta agli incidenti domestici più gravi, e nessun tecnico serio la propone.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "luce-non-funziona",
    ricerca: "lampadina forno non funziona",
    titolo: "Luce del forno che non funziona: come cambiare la lampadina",
    descrizione:
      "Non serve un tecnico e non serve una lampadina speciale introvabile. Ma va tolta la corrente, e il tipo giusto conta più di quanto sembri.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Il forno funziona ma dentro non si vede niente, e cucinare a occhio è scomodo. È una delle poche riparazioni di questo elenco che chiunque può fare in dieci minuti, a patto di rispettare due regole.",
    sicurezza:
      "Togli corrente dal quadro elettrico, non solo dal pannello del forno: il portalampada resta in tensione anche a forno spento. E aspetta che sia completamente freddo — le lampadine da forno lavorano a temperature altissime e restano scottanti a lungo.",
    controlli: [
      {
        titolo: "La lampadina è semplicemente bruciata",
        difficolta: "facile",
        testo:
          "È la causa nel novanta per cento dei casi. A corrente staccata e forno freddo, svita il coprilampada di vetro — gira in senso antiorario, a volte è duro perché il grasso di cottura lo incolla — e sfila o svita la lampadina. Se il filamento è visibilmente spezzato o il vetro è annerito, hai finito la diagnosi.",
      },
      {
        titolo: "Serve una lampadina da forno, non una qualsiasi",
        difficolta: "facile",
        testo:
          "Deve resistere a 300 gradi, e una comune si spacca al primo utilizzo. Il tipo più diffuso è E14 da 15 o 25 watt resistente al calore; in alcuni modelli è a innesto G9. Porta la vecchia in negozio o cerca il ricambio col modello del forno: costa pochi euro e si trova ovunque.",
      },
      {
        titolo: "Il coprilampada non si svita",
        difficolta: "facile",
        testo:
          "Il grasso cotto lo blocca. Un guanto di gomma dà molta più presa, oppure un elastico largo attorno al vetro. Non usare pinze metalliche: il vetro si crepa e a quel punto la riparazione si complica parecchio.",
      },
      {
        titolo: "La lampadina nuova non si accende",
        difficolta: "media",
        testo:
          "Prima di pensare al peggio, controlla che sia avvitata bene: quelle da forno hanno spesso una filettatura sporca di residui e il contatto non si fa. Se ancora niente, guarda dentro il portalampada con una torcia: se è annerito o deformato dal calore, va sostituito.",
      },
      {
        titolo: "Il forno funziona ma la luce non si accende mai",
        difficolta: "media",
        testo:
          "In molti modelli la lampadina si accende solo con certe funzioni o premendo un tasto dedicato. Se non l'hai mai vista funzionare da quando hai il forno, prima di cambiare pezzi vale la pena guardare il libretto: potrebbe non essere guasta affatto.",
      },
      {
        titolo: "Portalampada o cablaggio",
        difficolta: "da tecnico",
        testo:
          "Se la lampadina è nuova, avvitata bene, e resta spenta, il problema sta nel portalampada o nel filo che lo alimenta — spesso indurito dal calore. Non è un pezzo caro, ma per raggiungerlo bisogna smontare parti del forno, e i cavi lavorano in una zona molto calda.",
      },
    ],
    quandoTecnico: [
      "La lampadina nuova non si accende e il portalampada è annerito",
      "Cambiando la lampadina è scattato il salvavita",
      "La lampadina si brucia ogni poche settimane",
      "Il vetro del coprilampada si è rotto dentro il forno",
    ],
    faq: [
      {
        domanda: "Posso usare una lampadina LED?",
        risposta:
          "Solo se è dichiarata per forno: i LED comuni non reggono le alte temperature e si guastano in fretta. Esistono LED specifici, ma costano più delle alogene tradizionali e durano poco di più in quell'ambiente.",
      },
      {
        domanda: "Devo per forza staccare la corrente dal quadro?",
        risposta:
          "Sì. Spegnere il forno dal pannello non toglie tensione al portalampada, e infilare le dita in un portalampada in tensione dentro una carcassa metallica è il modo classico di prendere una scossa seria.",
      },
      {
        domanda: "La lampadina si brucia spesso: perché?",
        risposta:
          "Di solito è il tipo sbagliato — una lampadina non adatta alle alte temperature — oppure un portalampada che fa contatto male e scalda. Nel secondo caso conviene farlo guardare, perché è anche un punto di calore anomalo.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ventola-non-gira",
    ricerca: "ventola forno non funziona",
    titolo: "Ventola del forno che non gira: quale delle due?",
    descrizione:
      "Nei forni ci sono due ventole diverse con due mestieri diversi. Capire quale delle due non funziona cambia sia la diagnosi sia l'urgenza.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Prima di cercare il guasto va chiarito un equivoco che confonde quasi tutti: i forni hanno due ventole. Una dentro, che distribuisce il calore nelle cotture ventilate; una fuori, che raffredda l'elettronica e continua a girare anche dopo lo spegnimento. Sono guasti diversi con conseguenze diverse.",
    sicurezza:
      "Le verifiche si fanno guardando, non toccando. Se devi rimuovere la piastra che copre la ventola interna, prima togli corrente dal quadro e aspetta che il forno sia freddo: le pale hanno bordi affilati e la zona resta calda a lungo.",
    controlli: [
      {
        titolo: "Capisci quale ventola manca",
        difficolta: "facile",
        testo:
          "Quella interna la vedi dal vetro con la luce accesa, sul fondo del forno, e deve girare appena selezioni una funzione ventilata. Quella di raffreddamento la senti come un soffio d'aria dalla fessura sopra la porta, e continua anche a forno spento finché non si è raffreddato. Verifica quale delle due manca prima di proseguire.",
      },
      {
        titolo: "La ventola interna non parte in tutte le funzioni",
        difficolta: "facile",
        testo:
          "È il falso allarme più comune: in statico non deve girare, e giustamente. Prova la funzione ventilata esplicita — di solito il simbolo con la ventola dentro un cerchio — prima di concludere che sia rotta.",
      },
      {
        titolo: "Qualcosa blocca le pale",
        difficolta: "media",
        testo:
          "Un pezzo di carta forno risucchiato, una crosta di cibo indurita o un residuo caduto dietro la piastra posteriore possono bloccare la ventola. A forno freddo e senza corrente, prova a farla ruotare con un dito: deve girare libera, senza attriti né rumore di raschiamento.",
      },
      {
        titolo: "La ventola di raffreddamento non si ferma mai",
        difficolta: "facile",
        testo:
          "Anche il contrario è un sintomo. È normale che continui per venti o trenta minuti dopo lo spegnimento; se va avanti per ore o parte da sola a forno freddo, di solito è il sensore di temperatura che legge male, non la ventola.",
      },
      {
        titolo: "Il forno si spegne da solo dopo pochi minuti",
        difficolta: "media",
        testo:
          "È la conseguenza tipica della ventola di raffreddamento ferma: senza aria, l'elettronica scalda e interviene una protezione termica che spegne tutto. Se il forno parte, scalda e si ferma sempre dopo lo stesso tempo, guarda lì prima che altrove.",
      },
      {
        titolo: "Motore della ventola o condensatore",
        difficolta: "da tecnico",
        testo:
          "Se le pale girano libere ma il motore non parte — a volte si sente un ronzio senza movimento — il pezzo è quello. Su molti forni la ventola interna si raggiunge smontando la piastra sul fondo, ma il collegamento elettrico sta in una zona ad alta temperatura e va rifatto a regola d'arte.",
      },
    ],
    quandoTecnico: [
      "La ventola di raffreddamento non parte mai",
      "Il forno si spegne da solo dopo pochi minuti di funzionamento",
      "Senti un ronzio dalla ventola ma le pale restano ferme",
      "Le pale girano libere a mano ma non partono con la funzione ventilata",
    ],
    faq: [
      {
        domanda: "Posso usare il forno se la ventola interna non gira?",
        risposta:
          "In statico sì, e cuoce normalmente. Le funzioni ventilate però non vanno usate: molti modelli spengono la resistenza circolare per sicurezza quando l'aria non circola, e il risultato sarebbe comunque una cottura sbagliata.",
      },
      {
        domanda: "È normale che la ventola vada avanti a forno spento?",
        risposta:
          "Sì, ed è un bene: sta raffreddando l'elettronica e la porta del mobile. Venti o trenta minuti sono nella norma; ore no.",
      },
      {
        domanda: "La ventola è diventata rumorosa: devo preoccuparmi?",
        risposta:
          "Un rumore nuovo di solito significa pale sporche, un residuo che le tocca o un cuscinetto che si sta consumando. Non è urgente, ma peggiora: conviene guardarci prima che si fermi del tutto.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-fumo",
    ricerca: "forno fa fumo",
    titolo: "Forno che fa fumo: quando è normale e quando spegnere tutto",
    descrizione:
      "Fumo bianco, grigio o con odore di plastica: sono tre cose diverse. La prima è quasi sempre innocua, l'ultima richiede di staccare la corrente.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Il fumo dal forno mette in allarme, giustamente. Ma il colore e soprattutto l'odore distinguono una situazione banale — grasso vecchio che brucia — da una che va fermata subito.",
    sicurezza:
      "Se il fumo ha odore di plastica, di gomma o di componente elettrico, spegni e togli corrente dal quadro immediatamente, e non riaccendere. Apri le finestre. Il fumo di cibo o grasso è fastidioso; quello elettrico è il preavviso di un principio d'incendio.",
    controlli: [
      {
        titolo: "Fumo bianco al primo utilizzo di un forno nuovo",
        difficolta: "facile",
        testo:
          "Normale e previsto: i residui di lavorazione e i grassi protettivi bruciano al primo riscaldamento. Il libretto di quasi tutti i forni consiglia un ciclo a vuoto a temperatura massima per mezz'ora, a finestra aperta, prima del primo utilizzo. Dopo quello non deve ripresentarsi.",
      },
      {
        titolo: "Grasso accumulato sul fondo o sulle pareti",
        difficolta: "facile",
        testo:
          "È la causa più frequente in assoluto. Gli schizzi di cotture precedenti si carbonizzano e fumano ogni volta che il forno arriva a temperatura, soprattutto col grill. Lascia raffreddare, poi pulisci a fondo il fondo, il soffitto e i bordi della porta. Se il fumo sparisce, non c'era nessun guasto.",
      },
      {
        titolo: "Qualcosa è colato sulla resistenza inferiore",
        difficolta: "facile",
        testo:
          "Una teglia troppo piena o una torta che trabocca lasciano zucchero e grasso direttamente sull'elemento, dove bruciano a ogni accensione facendo molto fumo e odore acre. Va rimosso a forno freddo e senza corrente, con delicatezza: la guaina della resistenza non va graffiata né bagnata.",
      },
      {
        titolo: "È rimasto dentro qualcosa che non doveva",
        difficolta: "facile",
        testo:
          "Succede: un manico di plastica, una pellicola, un sacchetto di carta, la protezione di un accessorio nuovo. Se l'odore è di plastica ma vedi anche l'oggetto, spegni, aera e togli. Non è un guasto, ma l'odore resterà per qualche cottura.",
      },
      {
        titolo: "Fumo durante la pirolisi",
        difficolta: "facile",
        testo:
          "La pulizia pirolitica porta il forno oltre i 400 gradi e brucia tutti i residui: un po' di fumo e odore forte sono attesi. Diventa anomalo se il fumo è denso: significa che dentro c'era troppo grasso, e prima di una pirolisi conviene sempre togliere il grosso a mano.",
      },
      {
        titolo: "Odore elettrico o fumo dal pannello",
        difficolta: "da tecnico",
        testo:
          "Questo è l'unico caso di tutta la guida in cui non c'è niente da provare: un componente elettrico si sta surriscaldando. Togli corrente dal quadro e non riaccendere per nessun motivo, nemmeno per finire la cottura. Non è cautela eccessiva — è la differenza tra una riparazione e un incendio in cucina.",
      },
    ],
    quandoTecnico: [
      "Il fumo ha odore di plastica, gomma o bruciato elettrico",
      "Vedi fumo uscire dal pannello comandi o da dietro il forno",
      "Il fumo continua anche a forno pulito e vuoto",
      "Insieme al fumo l'interruttore è scattato",
    ],
    faq: [
      {
        domanda: "Il fumo del grasso è pericoloso?",
        risposta:
          "È irritante e fa puzzare la casa, ma non è la stessa cosa del fumo elettrico. Il rischio vero è che uno strato spesso di grasso prenda fiamma: per questo la pulizia periodica non è solo una questione di ordine.",
      },
      {
        domanda: "Posso usare prodotti sgrassanti forti dentro il forno?",
        risposta:
          "Con cautela, e mai sulle resistenze o sulla ventola. Molti sgrassanti aggrediscono lo smalto e le guarnizioni; nei forni pirolitici sono espressamente sconsigliati perché rovinano il rivestimento interno.",
      },
      {
        domanda: "Dopo aver pulito fuma ancora: perché?",
        risposta:
          "Spesso restano residui di detergente, che bruciano al primo riscaldamento. Fai un ciclo a vuoto a finestra aperta. Se il fumo persiste anche dopo, allora è il caso di guardare più a fondo.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "porta-non-chiude",
    ricerca: "porta forno non chiude bene",
    titolo: "Porta del forno che non chiude bene: perché conta più di quanto sembri",
    descrizione:
      "Uno spiraglio da cui esce calore non è solo un difetto estetico: cambia le cotture, alza i consumi e scalda il mobile attorno.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "La porta resta leggermente aperta, o chiude ma non aderisce. Sembra un dettaglio, e invece è la causa nascosta di cotture sbagliate che si attribuiscono al termostato: se il calore esce, il forno non tiene la temperatura e compensa scaldando di più.",
    sicurezza:
      "Non tentare di forzare le cerniere con il forno montato: sono a molla e sotto carico, e scattando possono ferire. Se la porta va rimossa, il libretto indica la procedura corretta con le levette di blocco delle cerniere.",
    controlli: [
      {
        titolo: "La prova del foglio di carta",
        difficolta: "facile",
        testo:
          "Metti un foglio A4 tra porta e forno, chiudi, e prova a sfilarlo. Deve fare resistenza. Ripeti in cinque o sei punti diversi lungo tutto il perimetro: se in una zona il foglio scivola via senza attrito, la tenuta lì non c'è. È la verifica più rapida ed è sorprendentemente affidabile.",
      },
      {
        titolo: "La guarnizione è indurita o staccata",
        difficolta: "facile",
        testo:
          "Passa il dito lungo tutta la gomma a forno freddo: deve essere morbida ed elastica, senza tratti appiattiti o vetrificati dal calore. Spesso si sfila da un angolo e basta reinserirla nella sua sede. Se è dura come plastica o si sbriciola, va sostituita: è un ricambio economico e su molti modelli si cambia a mano.",
      },
      {
        titolo: "Le cerniere hanno ceduto",
        difficolta: "media",
        testo:
          "Con gli anni le molle delle cerniere si allentano e la porta si abbassa: chiude in alto e resta aperta in basso, o viceversa. Si riconosce perché la porta non resta più ferma nelle posizioni intermedie e tende a cadere. Le cerniere si sostituiscono, ma vanno maneggiate con attenzione perché sono caricate a molla.",
      },
      {
        titolo: "C'è qualcosa che ostacola la chiusura",
        difficolta: "facile",
        testo:
          "Una griglia infilata male, una teglia troppo profonda o un accumulo di residui induriti nel bordo inferiore impediscono la chiusura completa. Guarda il perimetro interno con una torcia: il punto in cui la porta appoggia si sporca e nessuno lo pulisce mai.",
      },
      {
        titolo: "La porta è stata rimontata storta",
        difficolta: "media",
        testo:
          "Se il problema è comparso dopo una pulizia in cui hai tolto la porta, quasi certamente non è rientrata bene nelle sedi: le cerniere devono entrare fino in fondo e le levette di blocco tornare in posizione. Togliere e rimettere seguendo il libretto risolve.",
      },
      {
        titolo: "Il vetro interno si è spostato",
        difficolta: "da tecnico",
        testo:
          "Nei forni con due o tre vetri, uno può scivolare dalla sua sede e impedire la chiusura corretta o creare uno spessore. Smontare il pacchetto vetri è fattibile ma delicato: sono temperati, e un colpo sul bordo li fa esplodere in mille pezzi.",
      },
    ],
    quandoTecnico: [
      "La porta non resta ferma e cade da sola",
      "Vedi il vetro interno spostato o scheggiato",
      "Esce calore visibile o il mobile attorno scotta",
      "La guarnizione è integra ma la porta resta comunque distanziata",
    ],
    faq: [
      {
        domanda: "Quanto calore si perde davvero?",
        risposta:
          "Abbastanza da cambiare i tempi di cottura e da far lavorare il forno molto più a lungo per mantenere la temperatura. È anche il motivo per cui, dopo la sostituzione di una guarnizione, molti si accorgono che le ricette tornano a funzionare come una volta.",
      },
      {
        domanda: "Posso continuare a usarlo così?",
        risposta:
          "Per qualche settimana sì, tenendo d'occhio il mobile attorno: se scotta più del solito, il calore sta uscendo dove non deve e i pannelli in truciolare non lo gradiscono.",
      },
      {
        domanda: "La guarnizione si può incollare?",
        risposta:
          "No. Deve stare nella sua sede senza colla, che a quelle temperature si degrada e rilascia odori. Se non tiene più da sola, il pezzo è da sostituire.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "si-spegne-da-solo",
    ricerca: "forno si spegne da solo",
    titolo: "Forno che si spegne da solo durante la cottura",
    descrizione:
      "Si ferma sempre dopo lo stesso tempo, o a caso? La differenza tra le due cose porta a due cause completamente diverse.",
    elettrodomestico: "forno",
    aggiornata: "2026-09-05",
    introduzione:
      "Metti in cottura, torni dopo mezz'ora e il forno è spento. La domanda che sblocca tutto è una sola: si spegne sempre dopo lo stesso tempo, o in momenti imprevedibili? Annotalo su un foglio per due o tre cotture, prima di qualsiasi altra cosa.",
    sicurezza:
      "Se insieme allo spegnimento senti odore di bruciato o l'interruttore del quadro è scattato, non riaccendere e passa alla guida sul forno che fa saltare la corrente. Uno spegnimento accompagnato da odore elettrico non è un problema di programmazione.",
    controlli: [
      {
        titolo: "C'è un timer o una durata impostata",
        difficolta: "facile",
        testo:
          "La spiegazione più frequente, e la più facile da non vedere. Il programmatore può avere una durata di cottura impostata: allo scadere spegne tutto, esattamente come deve. Se si spegne sempre dopo lo stesso identico tempo — trenta minuti, un'ora — questa è quasi certamente la causa. Cerca sul display il simbolo della pentola o la lettera A.",
      },
      {
        titolo: "Le fessure di ventilazione sono ostruite",
        difficolta: "facile",
        testo:
          "I forni da incasso hanno bisogno di aria attorno: se il vano è troppo stretto, se qualcuno ha tappato le fessure con carta stagnola per proteggere il mobile, o se sopra al forno è stato appoggiato qualcosa, l'elettronica scalda e interviene la protezione termica. Guarda sotto, sopra e dietro il forno.",
      },
      {
        titolo: "La ventola di raffreddamento non gira",
        difficolta: "media",
        testo:
          "È la conseguenza logica del punto precedente. Metti la mano davanti alla fessura sopra la porta a forno acceso: deve uscire aria. Se non esce, l'elettronica non viene raffreddata e la protezione spegne tutto dopo un tempo che è spesso sorprendentemente costante.",
      },
      {
        titolo: "Il micro-interruttore della porta",
        difficolta: "media",
        testo:
          "Molti forni si spengono se credono che la porta si sia aperta. Se il contatto è sporco o allentato, basta una vibrazione. Il sintomo tipico: si spegne in momenti casuali, e a volte riparte se chiudi bene la porta. Prova a spingerla mentre il forno lavora e vedi se cambia qualcosa.",
      },
      {
        titolo: "Foratura del piano: il forno usa la presa del piano cottura",
        difficolta: "media",
        testo:
          "Se forno e piano cottura condividono una linea sottodimensionata, accendendo entrambi si supera l'assorbimento e qualcosa interviene. Non è un guasto del forno: prova a farlo funzionare da solo, con tutto il resto della cucina spento, e vedi se regge.",
      },
      {
        titolo: "Termostato di sicurezza o scheda",
        difficolta: "da tecnico",
        testo:
          "Ogni forno ha un termostato di sicurezza che stacca tutto se la temperatura supera un limite. Se interviene con un forno che non è realmente troppo caldo, o è lui a essere difettoso o è la sonda principale a leggere male. In alternativa la scheda si riavvia da sola per un difetto di alimentazione interno.",
      },
    ],
    quandoTecnico: [
      "Si spegne accompagnato da odore di bruciato",
      "Non esce aria dalla fessura di raffreddamento",
      "Si spegne in momenti del tutto casuali, anche a vuoto",
      "Dopo lo spegnimento non riparte finché non si raffredda per ore",
    ],
    faq: [
      {
        domanda: "Come capisco se è il timer?",
        risposta:
          "Cronometra. Se il forno si spegne dopo un tempo identico per due o tre volte di fila, è una durata impostata; se i tempi variano, è un problema termico o elettrico. È un'informazione che si raccoglie gratis e vale più di qualsiasi ipotesi.",
      },
      {
        domanda: "Il forno da incasso può stare in un vano qualsiasi?",
        risposta:
          "No: il libretto indica le misure minime del vano e le aperture di ventilazione necessarie. Un forno chiuso in uno spazio troppo stretto si spegne per protezione, e nel tempo si danneggia davvero.",
      },
      {
        domanda: "Riparte da solo dopo un po': è normale?",
        risposta:
          "È il comportamento tipico di una protezione termica: stacca, aspetta che la temperatura scenda, e si riarma. Non è un guasto della protezione — è il sintomo che qualcosa la sta facendo intervenire.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-raffredda",
    ricerca: "frigorifero non raffredda",
    titolo: "Frigorifero che non raffredda: cosa controllare prima di allarmarsi",
    descrizione:
      "Il frigo è acceso ma dentro è tiepido. Prima di pensare al gas ci sono cinque cause molto più comuni, e alcune si risolvono senza spendere nulla.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "La luce si accende, il motore magari lo senti pure, ma dentro la temperatura non scende. È il guasto che spaventa di più perché mette a rischio il cibo, e anche quello dove si salta più spesso alla conclusione sbagliata: quasi mai è il gas.",
    sicurezza:
      "Puoi controllare termostato, guarnizioni, ventole e griglia posteriore in tranquillità, staccando la spina prima di toccare qualsiasi cosa dietro. Non intervenire mai sul circuito sigillato del refrigerante: nei frigoriferi moderni il gas è R600a, cioè isobutano, ed è infiammabile.",
    controlli: [
      {
        titolo: "Il termostato è stato spostato",
        difficolta: "facile",
        testo:
          "La manopola dentro il frigo si urta facilmente riponendo la spesa, e su alcuni modelli la posizione zero significa spento. Portala su un valore intermedio — di solito 3 o 4 su 7 — e aspetta almeno dodici ore prima di giudicare: un frigorifero non recupera in mezz'ora.",
      },
      {
        titolo: "La griglia posteriore è coperta di polvere",
        difficolta: "facile",
        testo:
          "Dietro il frigo c'è il condensatore, una serpentina nera che deve smaltire calore. Coperta di polvere e peli, non ci riesce: il motore lavora in continuazione e la temperatura interna non scende comunque. Stacca la spina, scosta il frigo e passa un aspirapolvere con la spazzola. È la manutenzione più trascurata e una delle più efficaci.",
      },
      {
        titolo: "Il frigo è troppo attaccato al muro o incassato male",
        difficolta: "facile",
        testo:
          "Serve aria attorno: la maggior parte dei costruttori indica almeno cinque centimetri dietro e uno sfogo in alto. Se il frigo è stato spinto contro la parete o chiuso in una nicchia senza aperture, il calore non se ne va e il raffreddamento peggiora, soprattutto d'estate.",
      },
      {
        titolo: "La guarnizione della porta non tiene",
        difficolta: "facile",
        testo:
          "Fai la prova del foglio: chiudi un A4 nella porta e prova a sfilarlo, in cinque o sei punti diversi. Dove esce senza resistenza, entra aria calda in continuazione. Le guarnizioni si induriscono con gli anni e spesso basta lavarle con acqua tiepida per farle tornare morbide; se sono tagliate o deformate, vanno sostituite.",
      },
      {
        titolo: "Il frigo raffredda ma il freezer no, o viceversa",
        difficolta: "media",
        testo:
          "Nei modelli no-frost il freddo nasce nel congelatore e viene soffiato nel frigo da una ventola. Se il freezer è gelido e il frigo tiepido, il sospetto è la ventola ferma o il condotto ostruito dal ghiaccio, non il gas. È un'informazione preziosa: restringe il campo a un pezzo economico invece che al circuito sigillato.",
      },
      {
        titolo: "Compressore o perdita di gas",
        difficolta: "da tecnico",
        testo:
          "Se la griglia è pulita, le guarnizioni tengono e non senti mai partire il motore — oppure lo senti partire e fermarsi ogni pochi secondi — il problema è nella parte sigillata. Qui non c'è nulla da provare in casa: la ricarica del gas richiede il patentino F-Gas per legge, e su un frigo di dieci anni va confrontata col prezzo di uno nuovo.",
      },
    ],
    quandoTecnico: [
      "Non senti mai partire il compressore, nemmeno dopo ore",
      "Il motore parte e si ferma ogni pochi secondi con uno scatto",
      "Il freezer funziona benissimo ma il frigo resta tiepido dopo giorni",
      "Senti odore dolciastro dietro il frigorifero",
    ],
    faq: [
      {
        domanda: "Quanto tempo ci mette un frigorifero a raffreddare?",
        risposta:
          "Da vuoto e a temperatura ambiente, tra le quattro e le dodici ore per arrivare a regime. Dopo aver caricato la spesa o cambiato impostazione, dare meno di mezza giornata di tempo porta a conclusioni sbagliate.",
      },
      {
        domanda: "La ricarica del gas si può fare da soli?",
        risposta:
          "No, ed è anche vietata: serve la certificazione F-Gas. Nei frigoriferi domestici moderni il gas è isobutano, infiammabile, in un circuito sigillato che va aperto e richiuso con attrezzatura dedicata.",
      },
      {
        domanda: "Conviene ripararlo?",
        risposta:
          "Termostato, ventola o guarnizione quasi sempre sì. Compressore o perdita di gas su un apparecchio di dieci anni quasi mai: il conto si avvicina a quello di un frigo nuovo, che consuma anche molto meno.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "congela-tutto",
    ricerca: "frigorifero congela gli alimenti",
    titolo: "Frigorifero che congela tutto: perché succede",
    descrizione:
      "Insalata ghiacciata e latte con i cristalli, ma il frigo funziona. Quasi sempre non è un guasto: è dove metti le cose e come è regolato.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Apri il frigo e trovi la verdura congelata, le bottiglie con il ghiaccio dentro, lo yogurt solido. Sembra il contrario di un guasto — raffredda troppo — e infatti nella maggior parte dei casi non c'è nulla di rotto, solo qualcosa da spostare o da regolare.",
    sicurezza:
      "Nessun rischio in questi controlli. Se devi togliere ghiaccio dalla parete di fondo, mai con coltelli o cacciaviti: dietro quella parete passa l'evaporatore, e forarlo significa buttare il frigorifero.",
    controlli: [
      {
        titolo: "Il cibo tocca la parete di fondo",
        difficolta: "facile",
        testo:
          "È la causa numero uno e non è un guasto. La parete in fondo al frigo è la parte più fredda: tutto ciò che la tocca — un contenitore spinto indietro, una busta di insalata appoggiata — congela per contatto. Basta lasciare due dita di spazio dal fondo.",
      },
      {
        titolo: "Il termostato è troppo alto",
        difficolta: "facile",
        testo:
          "Sulle manopole numerate il valore più alto significa più freddo, non più caldo: molti lo interpretano al contrario. Se sei a 6 o 7 su 7, scendi a 3 o 4 e aspetta un giorno. Nei modelli digitali la temperatura giusta del frigo sta tra i 4 e i 5 gradi.",
      },
      {
        titolo: "Le cose sbagliate nel ripiano sbagliato",
        difficolta: "facile",
        testo:
          "Il ripiano più basso, sopra i cassetti, è il più freddo di tutti; la porta è la zona più calda. Latte e latticini vanno in mezzo, la verdura nei cassetti, e nella porta ci stanno bene solo bevande e condimenti. Se congela solo quello che sta in basso, hai già la spiegazione.",
      },
      {
        titolo: "Il frigo è quasi vuoto",
        difficolta: "facile",
        testo:
          "Sembra controintuitivo ma un frigorifero mezzo vuoto raffredda in modo più irregolare: c'è meno massa a stabilizzare la temperatura e le poche cose presenti prendono tutto il freddo. Con la spesa fatta il problema spesso sparisce da solo.",
      },
      {
        titolo: "Il cassetto della verdura è regolato male",
        difficolta: "facile",
        testo:
          "Molti cassetti hanno una levetta per l'umidità, e alcuni modelli hanno un vano a temperatura regolabile — la zona zero gradi — che se impostata per carne e pesce congela la verdura. Se congela solo lì dentro, guarda quella regolazione prima di ogni altra cosa.",
      },
      {
        titolo: "Termostato o sonda guasti",
        difficolta: "da tecnico",
        testo:
          "Se hai abbassato il termostato al minimo e continua a congelare, il pezzo che misura la temperatura non sta più facendo il suo lavoro: il compressore non si ferma mai e il freddo si accumula. Il sintomo che lo accompagna è il motore che gira quasi in continuazione.",
      },
    ],
    quandoTecnico: [
      "Congela anche col termostato al minimo",
      "Il compressore non si ferma quasi mai",
      "Si forma ghiaccio spesso sulla parete di fondo che torna subito",
      "Congela tutto, anche quello che sta nella porta",
    ],
    faq: [
      {
        domanda: "Qual è la temperatura giusta per il frigorifero?",
        risposta:
          "Tra 4 e 5 gradi nel comparto frigo e −18 nel congelatore. Sotto i 4 gradi si rischia di congelare la verdura senza guadagnare nulla in conservazione.",
      },
      {
        domanda: "Sulla manopola, 1 è il più freddo o il più caldo?",
        risposta:
          "Quasi sempre 1 è il meno freddo e il numero più alto il più freddo. È l'esatto contrario di quello che molti immaginano, ed è la causa di parecchi frigoriferi che congelano.",
      },
      {
        domanda: "Un po' di ghiaccio sulla parete di fondo è normale?",
        risposta:
          "Una brina sottile che compare e sparisce sì, fa parte del ciclo di sbrinamento automatico. Uno strato spesso che non se ne va mai no: quello indica uno sbrinamento che non funziona.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-ghiaccio",
    ricerca: "frigorifero fa ghiaccio sulla parete",
    titolo: "Ghiaccio nel frigorifero o nel freezer: da cosa dipende",
    descrizione:
      "Uno strato di brina che torna sempre indica un problema preciso. E c'è un modo sbagliato di toglierlo che rovina il frigorifero per sempre.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Uno strato di ghiaccio sulla parete di fondo del frigo, o una crosta spessa nel congelatore che riduce lo spazio. Toglierlo è facile, ma se non capisci perché si forma torna nel giro di due settimane.",
    sicurezza:
      "Mai raschiare il ghiaccio con coltelli, cacciaviti o oggetti appuntiti. Dietro la parete di plastica corre l'evaporatore, un tubo sottile in alluminio pieno di gas in pressione: forarlo significa perdere il refrigerante e buttare il frigorifero. Il ghiaccio si toglie solo aspettando che si sciolga.",
    controlli: [
      {
        titolo: "La porta resta aperta troppo a lungo",
        difficolta: "facile",
        testo:
          "Il ghiaccio è umidità che entra dall'esterno e si condensa sulla parte fredda. Ogni apertura porta dentro aria umida, e d'estate molto di più. Se in casa il frigo viene aperto spesso o resta aperto mentre si cucina, un po' di brina è la conseguenza naturale, non un guasto.",
      },
      {
        titolo: "La guarnizione non tiene",
        difficolta: "facile",
        testo:
          "È la causa più frequente quando il ghiaccio si forma sempre nella stessa zona, vicino alla porta. Fai la prova del foglio A4 lungo tutto il perimetro: dove scivola via senza attrito, entra aria umida ventiquattro ore al giorno. Lava la guarnizione con acqua tiepida; se è tagliata o indurita, va sostituita.",
      },
      {
        titolo: "Il foro di scarico è otturato",
        difficolta: "facile",
        testo:
          "Sul fondo del comparto frigo, al centro della parete posteriore, c'è un forellino che raccoglie l'acqua di sbrinamento. Se si tappa con briciole e residui, l'acqua non defluisce, ristagna e ghiaccia. Si libera con un cotton fioc o un bastoncino morbido — mai con oggetti metallici — e con un po' d'acqua tiepida versata dentro.",
      },
      {
        titolo: "Cibi caldi o scoperti dentro il frigo",
        difficolta: "facile",
        testo:
          "Mettere dentro una pentola ancora tiepida o lasciare piatti senza coperchio immette una quantità enorme di umidità, che va a finire tutta sulla parete fredda. Contenitori chiusi e cibi raffreddati prima riducono il ghiaccio in modo visibile.",
      },
      {
        titolo: "La porta del freezer non chiude per il cassetto pieno",
        difficolta: "facile",
        testo:
          "Nel congelatore la causa più comune è un cassetto strapieno che tiene la porta appena socchiusa: non te ne accorgi, ma entra aria umida di continuo e si forma una crosta. Controlla che i cassetti scorrano fino in fondo e che nulla sporga.",
      },
      {
        titolo: "Lo sbrinamento automatico non funziona",
        difficolta: "da tecnico",
        testo:
          "Nei no-frost una resistenza scioglie periodicamente la brina dall'evaporatore. Se si guasta — o se si guasta il timer che la comanda — il ghiaccio si accumula finché non blocca la ventola, e a quel punto il frigo smette anche di raffreddare. Il segnale tipico: sbrini tutto a mano, per due settimane va benissimo, poi ricomincia.",
      },
    ],
    quandoTecnico: [
      "Il ghiaccio torna sempre entro due settimane dopo lo sbrinamento",
      "La ventola del no-frost è bloccata dal ghiaccio",
      "Il frigo ha smesso di raffreddare insieme alla formazione di ghiaccio",
      "Vedi ghiaccio anche fuori dalle pareti, sul soffitto del vano",
    ],
    faq: [
      {
        domanda: "Come sbrino senza rovinare niente?",
        risposta:
          "Stacca la spina, svuota, lascia le porte aperte e metti asciugamani sul fondo. Una bacinella d'acqua calda dentro accelera. Ci vogliono da due a sei ore: qualsiasi scorciatoia con oggetti appuntiti rischia di forare l'evaporatore.",
      },
      {
        domanda: "Posso usare il phon?",
        risposta:
          "Meglio evitarlo: elettricità e acqua di scioglimento sono una combinazione da non cercare, e il calore concentrato può deformare la plastica interna. Se hai fretta, l'acqua calda in una bacinella fa lo stesso lavoro senza rischi.",
      },
      {
        domanda: "Ogni quanto va sbrinato un frigorifero non no-frost?",
        risposta:
          "Quando lo strato supera i cinque millimetri, in genere due o tre volte l'anno. Oltre quello spessore il ghiaccio isola invece di raffreddare, e il consumo sale in modo sensibile.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "perde-acqua",
    ricerca: "frigorifero perde acqua",
    titolo: "Frigorifero che perde acqua: dentro o sotto?",
    descrizione:
      "Acqua sul fondo del frigo o una pozza sul pavimento. Nel primo caso c'è un forellino da liberare, nel secondo il punto da guardare è un altro.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "L'acqua in un frigorifero non è di per sé un guasto: se ne produce ad ogni ciclo di sbrinamento, ed è previsto. Il problema nasce quando non trova la strada per andarsene, e la prima cosa da capire è dove si ferma.",
    sicurezza:
      "Stacca la spina prima di scostare il frigo o di infilare le mani dietro. Asciuga subito l'acqua sul pavimento, soprattutto se è parquet o se il frigo è incassato in un mobile: il truciolare bagnato si gonfia e non torna indietro.",
    controlli: [
      {
        titolo: "Acqua sul fondo, dentro il frigo",
        difficolta: "facile",
        testo:
          "È il caso più comune di tutti, ed è quasi sempre il foro di scarico otturato. Sta al centro della parete posteriore, in basso, e raccoglie l'acqua di sbrinamento. Briciole, semi e residui appiccicosi lo tappano. Liberalo con un cotton fioc o un bastoncino morbido e versa dentro un bicchiere d'acqua tiepida: deve defluire subito.",
      },
      {
        titolo: "Acqua nei cassetti della verdura",
        difficolta: "facile",
        testo:
          "Stessa causa vista dal basso: l'acqua che non defluisce si raccoglie sotto i cassetti. Va svuotata a mano e poi risolto il foro, altrimenti torna. È anche il motivo per cui la verdura marcisce in fretta: sta a bagno senza che tu lo veda.",
      },
      {
        titolo: "Pozza sul pavimento, davanti",
        difficolta: "media",
        testo:
          "Se l'acqua arriva fuori davanti, spesso è il ghiaccio accumulato nel freezer che si scioglie e trabocca oltre la vaschetta, oppure la porta che non chiude bene e fa condensa in continuazione. Guarda se c'è brina spessa da qualche parte prima di cercare altro.",
      },
      {
        titolo: "Acqua dietro, sotto il frigo",
        difficolta: "media",
        testo:
          "Dietro, sopra il compressore, c'è una vaschetta di raccolta: l'acqua ci arriva dal tubetto di scarico ed evapora grazie al calore del motore. Se è crepata, spostata o troppo piena — perché il tubetto è ostruito più in alto — l'acqua finisce a terra. Si vede scostando il frigo, a spina staccata.",
      },
      {
        titolo: "Il frigo non è in bolla",
        difficolta: "facile",
        testo:
          "Se è inclinato in avanti, l'acqua di sbrinamento non raggiunge il foro di scarico e cola dentro. I frigoriferi vanno leggermente inclinati all'indietro, non in avanti: regola i piedini anteriori qualche giro e verifica che la porta si richiuda da sola quando la lasci a metà.",
      },
      {
        titolo: "Perdita dal circuito o guasto interno",
        difficolta: "da tecnico",
        testo:
          "Se l'acqua non viene né dallo scarico né dalla vaschetta, e soprattutto se il liquido è oleoso o ha odore, non è acqua di condensa. Quello è un caso in cui vale la pena non insistere: il circuito di raffreddamento non contiene acqua, e ciò che ne esce non va toccato.",
      },
    ],
    quandoTecnico: [
      "Il liquido è oleoso o ha un odore dolciastro",
      "Il foro di scarico è libero ma l'acqua continua a raccogliersi dentro",
      "La vaschetta posteriore è crepata o mancante",
      "L'acqua compare insieme a un peggioramento del raffreddamento",
    ],
    faq: [
      {
        domanda: "Dov'è esattamente il foro di scarico?",
        risposta:
          "Al centro della parete di fondo del comparto frigo, nella parte più bassa, appena sopra i cassetti. Spesso è dentro una piccola conca ed è largo pochi millimetri, quindi si nota solo cercandolo.",
      },
      {
        domanda: "Posso usare un filo di ferro per liberarlo?",
        risposta:
          "Meglio di no: rigidi e appuntiti possono forare il tubetto o l'evaporatore poco dietro. Un cotton fioc, uno scovolino morbido o acqua tiepida con una siringa senza ago fanno il lavoro senza rischi.",
      },
      {
        domanda: "È normale trovare acqua nella vaschetta dietro?",
        risposta:
          "Sì, è il suo mestiere: raccoglie l'acqua di sbrinamento e la fa evaporare con il calore del compressore. Diventa anomalo solo se trabocca o se è sempre piena anche in inverno.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-rumore",
    ricerca: "frigorifero fa rumore",
    titolo: "Frigorifero rumoroso: quali rumori sono normali",
    descrizione:
      "Gorgoglii, scatti e ronzii fanno parte del funzionamento. Il rumore che deve preoccuparti è un altro, e si riconosce da come cambia nel tempo.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Un frigorifero non è mai silenzioso, e molti dei suoni che sembrano allarmanti sono semplicemente il gas che si muove nei tubi. Vale la pena imparare a distinguerli, perché sostituire un frigo che funziona benissimo è un errore costoso.",
    sicurezza:
      "Per i controlli qui sotto basta staccare la spina prima di scostare il frigorifero. Attenzione al peso: da pieno supera facilmente il centinaio di chili, e va spostato svuotandolo o con l'aiuto di qualcuno.",
    controlli: [
      {
        titolo: "Gorgoglii e scrosci: normali",
        difficolta: "facile",
        testo:
          "Sono il refrigerante che circola. Si sentono soprattutto quando il compressore si ferma, e ricordano l'acqua in un tubo. Non indicano alcun guasto e non c'è modo di eliminarli: fanno parte di come funziona un frigorifero.",
      },
      {
        titolo: "Scatti e schiocchi: normali",
        difficolta: "facile",
        testo:
          "Le plastiche interne si dilatano e si contraggono a ogni ciclo, e producono schiocchi secchi anche di notte quando la casa è silenziosa. Lo stesso vale per lo scatto del termostato quando accende o spegne il motore.",
      },
      {
        titolo: "Vibrazioni da appoggio",
        difficolta: "facile",
        testo:
          "Se il ronzio del compressore diventa un rimbombo, spesso il frigo non è in bolla o tocca il mobile accanto. Spingi delicatamente gli angoli: se dondola, regola i piedini. Controlla anche che non tocchi la parete dietro e che sopra non ci siano oggetti che vibrano.",
      },
      {
        titolo: "La ventola del no-frost sfrega sul ghiaccio",
        difficolta: "media",
        testo:
          "Un rumore ritmico, tipo elica che tocca qualcosa, viene quasi sempre dalla ventola del congelatore che urta contro il ghiaccio accumulato. Il segnale che conferma: il rumore cambia o sparisce aprendo la porta del freezer, perché la ventola si ferma. Uno sbrinamento completo risolve.",
      },
      {
        titolo: "Il rumore viene da dietro, in basso",
        difficolta: "media",
        testo:
          "Lì c'è il compressore, appoggiato su gommini antivibranti. Con gli anni si induriscono o si spostano e il motore trasmette le vibrazioni al telaio. Si vede a spina staccata scostando il frigo: sono quattro tamponi di gomma sotto il corpo nero del motore.",
      },
      {
        titolo: "Ronzio metallico crescente dal compressore",
        difficolta: "da tecnico",
        testo:
          "È l'unico rumore che merita attenzione: forte, metallico, che peggiora di settimana in settimana, a volte accompagnato da avvii e spegnimenti ravvicinati. Indica un compressore in sofferenza — e su un frigorifero non recente è anche il momento in cui conviene farsi due conti prima di riparare.",
      },
    ],
    quandoTecnico: [
      "Ronzio metallico che cresce di settimana in settimana",
      "Il motore parte e si ferma ogni pochi secondi con uno scatto",
      "Il rumore è accompagnato da un peggioramento del raffreddamento",
      "Senti odore di bruciato dalla zona del compressore",
    ],
    faq: [
      {
        domanda: "Quanto rumore fa un frigorifero normale?",
        risposta:
          "I modelli recenti stanno tra i 35 e i 42 decibel, cioè poco più di un sussurro. Un frigo di quindici anni può essere sensibilmente più rumoroso senza avere nulla di rotto: è la tecnologia, non un guasto.",
      },
      {
        domanda: "Perché fa più rumore d'estate?",
        risposta:
          "Perché lavora di più: con la cucina a trenta gradi il compressore resta acceso molto più a lungo per mantenere la stessa temperatura interna. È normale, e si attenua tenendo pulita la griglia posteriore.",
      },
      {
        domanda: "Il frigo nuovo fa rumori strani. È difettoso?",
        risposta:
          "Nei primi giorni i modelli con inverter cambiano velocità di continuo e producono suoni a cui non si è abituati. Se raffredda correttamente e i rumori non peggiorano, quasi sempre è solo questione di farci l'orecchio.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "frigorifero non si accende",
    titolo: "Frigorifero che non si accende: le verifiche da fare subito",
    descrizione:
      "Luce spenta e silenzio totale. Prima di svuotare tutto conviene escludere quattro cause che non costano nulla — e sapere quanto tempo hai.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Apri il frigo e non si accende la luce, e non senti alcun motore. Qui c'è un'urgenza in più rispetto agli altri elettrodomestici: dentro c'è cibo che si deteriora. La prima cosa da sapere è che un frigorifero chiuso mantiene il freddo per quattro o sei ore, e un congelatore pieno fino a ventiquattro.",
    sicurezza:
      "Puoi controllare presa, spina e quadro elettrico senza rischi. Non aprire il pannello posteriore né toccare il compressore: contiene olio in pressione e collegamenti che restano pericolosi anche a frigo spento.",
    controlli: [
      {
        titolo: "La presa non porta corrente",
        difficolta: "facile",
        testo:
          "Sembra ovvio ed è la causa più frequente. La presa del frigo sta dietro il mobile, spesso dietro un pannello, e basta un urto durante una pulizia. Prova la presa con un altro apparecchio se riesci a raggiungerla. Occhio anche alle prolunghe: molte hanno un interruttore che si spegne da solo con un colpo.",
      },
      {
        titolo: "È scattato l'interruttore nel quadro",
        difficolta: "facile",
        testo:
          "Guarda tutte le levette del quadro, non solo quelle che di solito scattano. Se il frigo condivide la linea con altre prese, potrebbe essersi spento senza che tu te ne sia accorto — e se è successo di notte, il cibo potrebbe già averne risentito.",
      },
      {
        titolo: "Il termostato è su zero",
        difficolta: "facile",
        testo:
          "Su molti modelli meccanici la posizione zero della manopola interna spegne davvero il frigorifero. Si urta con facilità sistemando la spesa. Portala su un valore intermedio e ascolta: entro qualche minuto dovresti sentire partire il compressore.",
      },
      {
        titolo: "Il frigo è in modalità vacanza o display spento",
        difficolta: "facile",
        testo:
          "I modelli elettronici hanno una funzione vacanza che mantiene solo il congelatore, e alcuni spengono il display dopo qualche minuto per risparmiare. Tocca un tasto qualsiasi prima di concludere che sia morto: potrebbe essere solo il pannello a riposo.",
      },
      {
        titolo: "Il compressore è caldissimo e non parte",
        difficolta: "media",
        testo:
          "Tocca il corpo nero dietro in basso, con prudenza: se scotta molto, è intervenuta la protezione termica e il motore ripartirà solo dopo essersi raffreddato. Spesso la causa è la griglia intasata o poca aria attorno, e in quel caso il problema tornerà finché non si risolve quello.",
      },
      {
        titolo: "Relè di avviamento o compressore",
        difficolta: "da tecnico",
        testo:
          "Se la corrente arriva e il frigo resta muto, il sospetto principale è il relè di avviamento: un pezzo piccolo ed economico attaccato al compressore, che si guasta abbastanza spesso. Il sintomo tipico è un clic ripetuto ogni pochi minuti senza che il motore parta. Va sostituito da chi sa distinguere il relè dal compressore, che invece costa quanto un frigo nuovo.",
      },
    ],
    quandoTecnico: [
      "Senti un clic ripetuto ma il motore non parte mai",
      "L'interruttore scatta appena colleghi il frigorifero",
      "Il compressore scotta e non riparte nemmeno dopo ore",
      "Arriva corrente ma non si accende nemmeno la luce interna",
    ],
    faq: [
      {
        domanda: "Quanto dura il cibo con il frigo spento?",
        risposta:
          "Tenendo le porte chiuse, il comparto frigo mantiene una temperatura sicura per quattro o sei ore. Il congelatore pieno regge fino a ventiquattro ore, quello mezzo vuoto circa la metà. Ogni apertura riduce questi tempi in modo netto.",
      },
      {
        domanda: "Posso ricollegarlo subito dopo averlo staccato?",
        risposta:
          "Meglio aspettare almeno cinque o dieci minuti: il compressore deve poter ripartire con le pressioni equilibrate. Riattaccarlo subito lo fa lavorare in sforzo e può far intervenire la protezione.",
      },
      {
        domanda: "Il frigo è caldo dietro: è normale?",
        risposta:
          "Sì. La griglia posteriore smaltisce il calore estratto dall'interno, e a toccarla è tiepida o calda. Diventa un problema solo se è coperta di polvere o se il frigo è schiacciato contro il muro.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "puzza",
    ricerca: "frigorifero puzza",
    titolo: "Frigorifero che puzza: come eliminare l'odore davvero",
    descrizione:
      "Se l'odore torna dopo aver buttato tutto e pulito, il punto da guardare è uno solo — e quasi nessuno lo controlla.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Un frigorifero che puzza contamina il sapore di tutto quello che contiene, burro e formaggi per primi. La pulizia dei ripiani è ovvia e spesso non basta: se l'odore torna dopo pochi giorni, il colpevole è quasi sempre in un punto che non si vede.",
    sicurezza:
      "Nessun rischio particolare. Evita candeggina pura sulle superfici interne: lascia un odore persistente che si trasferisce al cibo, ed è più difficile da togliere di quello che volevi eliminare.",
    controlli: [
      {
        titolo: "Il foro di scarico è otturato",
        difficolta: "facile",
        testo:
          "È il colpevole nascosto più frequente. Nel forellino al centro della parete di fondo ristagna acqua con residui organici, che marcisce. Puoi pulire i ripiani quanto vuoi: finché quello è tappato l'odore torna. Liberalo con un cotton fioc e versaci dentro acqua tiepida con un cucchiaino di bicarbonato.",
      },
      {
        titolo: "Qualcosa è caduto sotto i cassetti",
        difficolta: "facile",
        testo:
          "Sotto e dietro i cassetti della verdura finiscono foglie, pezzi di cipolla e liquidi che nessuno vede per mesi. Togli completamente i cassetti — di solito si sfilano sollevando leggermente — e guarda cosa c'è nel vano sotto.",
      },
      {
        titolo: "La guarnizione della porta",
        difficolta: "facile",
        testo:
          "Nella piega della gomma si accumulano residui di cibo e umidità, e in estate ci cresce la muffa. Ripiegala verso di te e pulisci con un panno umido e bicarbonato. È lo stesso punto che causa i problemi di tenuta: due controlli in uno.",
      },
      {
        titolo: "La vaschetta di raccolta dietro",
        difficolta: "media",
        testo:
          "Sopra il compressore c'è una vaschetta dove l'acqua di sbrinamento evapora. Se il tubetto ha portato lì anche residui organici, l'odore risale nel frigo attraverso lo scarico. A spina staccata, scosta il frigorifero e guarda: spesso basta svuotarla e lavarla.",
      },
      {
        titolo: "Contenitori non chiusi",
        difficolta: "facile",
        testo:
          "In un ambiente chiuso e umido gli odori migrano: melone, formaggi e cibi speziati profumano tutto il resto. Contenitori ermetici non sono una raffinatezza, sono la differenza tra un frigo neutro e uno che sa di cena di tre giorni fa.",
      },
      {
        titolo: "Odore che resta dopo tutto",
        difficolta: "media",
        testo:
          "Se hai pulito ovunque e l'odore persiste, spesso è penetrato nelle plastiche — succede dopo un blackout lungo con il cibo andato a male dentro. Bicarbonato in una ciotola aperta per qualche giorno, oppure carbone attivo, assorbono molto. Il caffè macinato funziona ma lascia il suo di odore.",
      },
    ],
    quandoTecnico: [
      "L'odore è di bruciato o di plastica calda, non di cibo",
      "Torna entro pochi giorni nonostante scarico e vaschetta puliti",
      "C'è muffa nera che si riforma sempre nello stesso punto",
      "Insieme all'odore c'è acqua che non defluisce",
    ],
    faq: [
      {
        domanda: "Il bicarbonato serve davvero?",
        risposta:
          "Sì, come assorbitore di odori residui: una ciotolina aperta cambiata ogni mese fa il suo lavoro. Non risolve però la causa: se c'è materiale organico in decomposizione da qualche parte, va tolto quello.",
      },
      {
        domanda: "Posso lavare l'interno con aceto?",
        risposta:
          "Sì, aceto diluito o acqua e bicarbonato sono ideali: puliscono, non lasciano odore e non aggrediscono le plastiche. Evita detersivi profumati, che trasferiscono il loro odore al cibo.",
      },
      {
        domanda: "Dopo un blackout devo buttare tutto?",
        risposta:
          "Dipende da quanto è durato. Sotto le quattro ore a porte chiuse il frigo mantiene la temperatura; oltre, i cibi deperibili — carne, pesce, latticini freschi — vanno valutati con prudenza. Il congelatore regge molto di più.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "freezer-non-congela",
    ricerca: "congelatore non congela",
    titolo: "Congelatore che non congela: cosa guardare",
    descrizione:
      "Il freezer è freddo ma non abbastanza, e il gelato resta molle. Le cause vanno dal termostato spostato al ghiaccio che blocca la ventola.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Il congelatore raffredda, ma non arriva alla temperatura giusta: il gelato è cremoso, il ghiaccio non si forma bene, i surgelati sembrano appena morbidi. È diverso dal freezer completamente spento, e le cause sono altre.",
    sicurezza:
      "Se il congelatore è rimasto sopra i −18 gradi per ore, valuta con prudenza i cibi prima di ricongelarli. Per il resto, i controlli qui sotto sono innocui: stacca solo la spina prima di scostare l'apparecchio.",
    controlli: [
      {
        titolo: "La temperatura impostata è troppo alta",
        difficolta: "facile",
        testo:
          "Il congelatore deve stare a −18 gradi. Molti modelli permettono di impostare −16 o −14 per risparmiare, ma a quelle temperature i surgelati durano molto meno e il gelato resta morbido. Controlla il valore e scendi a −18 prima di cercare guasti.",
      },
      {
        titolo: "C'è troppo ghiaccio accumulato",
        difficolta: "facile",
        testo:
          "Una crosta spessa isola invece di raffreddare: il freddo non passa e la temperatura non scende. Se lo strato supera il centimetro, sbrina completamente prima di qualsiasi altra diagnosi. Molti problemi di questo elenco si risolvono qui e basta.",
      },
      {
        titolo: "La porta o il cassetto non chiudono",
        difficolta: "facile",
        testo:
          "Un cassetto strapieno che sporge di un centimetro tiene la porta socchiusa senza che si noti. Entra aria umida in continuazione, si forma ghiaccio e la temperatura non scende mai. Controlla che tutti i cassetti rientrino fino in fondo e fai la prova del foglio sulla guarnizione.",
      },
      {
        titolo: "Il freezer è troppo pieno o troppo vuoto",
        difficolta: "facile",
        testo:
          "Strapieno, l'aria non circola e le zone lontane dall'evaporatore restano più calde. Quasi vuoto, ogni apertura fa entrare aria calda che non ha massa fredda da contrastare. Il congelatore lavora meglio pieno per tre quarti.",
      },
      {
        titolo: "Fa molto caldo dove sta il frigorifero",
        difficolta: "facile",
        testo:
          "In una cucina a trenta gradi, o con il frigo accanto al forno o esposto al sole, il congelatore fatica ad arrivare a temperatura. Vale anche il contrario, in modo controintuitivo: in un garage sotto i dieci gradi molti frigoriferi smettono di far partire il compressore, e il freezer si scalda.",
      },
      {
        titolo: "Ventola, sbrinamento o gas",
        difficolta: "da tecnico",
        testo:
          "Se dopo lo sbrinamento e con la guarnizione a posto il freezer non tiene i −18, restano tre cose: la ventola del no-frost ferma, la resistenza di sbrinamento guasta che fa riformare ghiaccio in continuazione, oppure una perdita nel circuito sigillato. Le prime due sono riparazioni sensate, la terza raramente lo è.",
      },
    ],
    quandoTecnico: [
      "Dopo uno sbrinamento completo il ghiaccio torna in due settimane",
      "Il compressore non si ferma mai ma la temperatura non scende",
      "Il frigo raffredda bene ma il congelatore no, anche senza ghiaccio",
      "Senti un fischio o un odore dolciastro dal retro",
    ],
    faq: [
      {
        domanda: "Posso ricongelare un alimento che si è ammorbidito?",
        risposta:
          "Se è rimasto sotto i −8 gradi e ha ancora cristalli di ghiaccio, in genere si può, ma la qualità peggiora. Se si è scongelato del tutto — carne, pesce, gelato — ricongelare non è consigliabile.",
      },
      {
        domanda: "Quanto ci mette a tornare a temperatura?",
        risposta:
          "Da vuoto, quattro o sei ore. Dopo aver caricato molta spesa, anche un giorno intero. Molti modelli hanno una funzione di congelamento rapido da attivare qualche ora prima di riempirlo.",
      },
      {
        domanda: "Il freezer in garage funziona peggio d'inverno?",
        risposta:
          "Sì, e sorprende sempre. Sotto una certa temperatura ambiente il termostato non chiama più il compressore, e paradossalmente il congelatore si scalda. Esistono modelli dichiarati per ambienti freddi: gli altri non lo sono.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "motore-sempre-acceso",
    ricerca: "frigorifero motore sempre acceso",
    titolo: "Frigorifero con il motore sempre acceso: quanto è normale",
    descrizione:
      "Il compressore non si ferma mai e la bolletta lo sente. A volte è previsto, a volte è il segnale di qualcosa che non tiene il freddo.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "Ti accorgi che il frigo ronza in continuazione, giorno e notte. Prima di preoccuparti: i frigoriferi moderni con inverter lavorano quasi sempre, ma a bassa potenza, ed è il loro modo normale di funzionare. Il problema esiste se prima si fermava e adesso no.",
    sicurezza:
      "I controlli qui sotto sono innocui. Stacca la spina prima di pulire la griglia posteriore, e ricorda che la serpentina nera dietro può essere calda: è il suo mestiere.",
    controlli: [
      {
        titolo: "La griglia posteriore è sporca",
        difficolta: "facile",
        testo:
          "È la prima causa da escludere e la più facile da risolvere. Il condensatore coperto di polvere non smaltisce calore, il gas non si raffredda abbastanza e il compressore resta acceso per compensare. Stacca la spina, scosta il frigo, aspira polvere e peli. È anche il modo più concreto di abbassare i consumi.",
      },
      {
        titolo: "Il frigo è schiacciato contro il muro",
        difficolta: "facile",
        testo:
          "Senza spazio dietro, il calore ristagna e succede esattamente la stessa cosa. Servono almeno cinque centimetri dietro e uno sfogo in alto, e nelle installazioni a incasso le aperture di ventilazione non vanno mai coperte.",
      },
      {
        titolo: "La guarnizione lascia entrare aria",
        difficolta: "facile",
        testo:
          "Se la porta non tiene, il freddo esce ventiquattro ore al giorno e il motore non si ferma mai. Prova del foglio A4 lungo tutto il perimetro, sia frigo sia freezer. È il controllo che spiega più casi di quanto ci si aspetti.",
      },
      {
        titolo: "Il termostato è impostato troppo basso",
        difficolta: "facile",
        testo:
          "Chiedere 2 gradi al frigo o −24 al freezer significa far lavorare il compressore molto più a lungo per un beneficio inesistente. I valori sensati sono 4 o 5 gradi nel frigo e −18 nel congelatore.",
      },
      {
        titolo: "Fa molto caldo, o hai appena fatto la spesa",
        difficolta: "facile",
        testo:
          "D'estate, o dopo aver caricato molta roba a temperatura ambiente, è normale che il motore vada quasi in continuazione per un giorno intero. Se il ronzio continuo è comparso a luglio ed è la prima estate che ci fai caso, probabilmente non è un guasto.",
      },
      {
        titolo: "Ghiaccio sull'evaporatore o perdita di gas",
        difficolta: "da tecnico",
        testo:
          "Se il motore gira sempre ma la temperatura resta alta, il freddo prodotto non arriva dove serve. Le due spiegazioni sono il ghiaccio che isola l'evaporatore — spesso per uno sbrinamento guasto — oppure una perdita che ha ridotto la carica di refrigerante. La seconda si riconosce perché il compressore lavora ma non raffredda mai davvero.",
      },
    ],
    quandoTecnico: [
      "Il motore gira sempre ma dentro la temperatura non è corretta",
      "Il compressore scotta molto più del solito",
      "Il consumo elettrico è aumentato in modo evidente",
      "Insieme al motore continuo si forma ghiaccio spesso",
    ],
    faq: [
      {
        domanda: "Quante ore al giorno dovrebbe funzionare un frigorifero?",
        risposta:
          "Un modello tradizionale lavora tra il 30 e il 50 per cento del tempo, in cicli. Uno con inverter può restare acceso quasi sempre ma a potenza ridotta, ed è il suo funzionamento corretto: consuma meno proprio evitando le partenze continue.",
      },
      {
        domanda: "Pulire la griglia fa davvero risparmiare?",
        risposta:
          "Sì, ed è la manutenzione con il miglior rapporto tra fatica e risultato: un condensatore sporco può far aumentare i consumi in modo sensibile, oltre ad accorciare la vita del compressore.",
      },
      {
        domanda: "Il frigo nuovo non si ferma mai: è difettoso?",
        risposta:
          "Nei primi giorni deve portare a temperatura tutta la struttura, e lavora molto. Se ha l'inverter, poi continuerà a girare quasi sempre a bassa velocità. Quello che conta è la temperatura interna, non il rumore del motore.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "porta-non-chiude",
    ricerca: "porta frigorifero non chiude bene",
    titolo: "Porta del frigorifero che non chiude: la prova del foglio",
    descrizione:
      "Una tenuta che non c'è più spiega ghiaccio, condensa, motore sempre acceso e bolletta più alta. Si verifica in un minuto con un foglio di carta.",
    elettrodomestico: "frigorifero",
    aggiornata: "2026-09-05",
    introduzione:
      "La porta sembra chiusa, ma il frigo si comporta male: fa ghiaccio, forma condensa, il motore non si ferma mai. Prima di cercare guasti complicati vale la pena verificare la cosa più semplice — se la porta tiene davvero.",
    sicurezza:
      "Nessun rischio in questi controlli. Se devi rimuovere una guarnizione, fallo a frigo spento e senza tirare con forza: molte sono incastrate a pressione e si strappano se maneggiate male.",
    controlli: [
      {
        titolo: "La prova del foglio",
        difficolta: "facile",
        testo:
          "Chiudi un foglio A4 nella porta e prova a sfilarlo: deve fare resistenza. Ripeti in sei o otto punti lungo tutto il perimetro, sia in alto sia in basso sia sui lati. Dove il foglio scivola via senza attrito, la guarnizione non tiene — e lì entra aria umida in continuazione.",
      },
      {
        titolo: "La guarnizione è sporca o schiacciata",
        difficolta: "facile",
        testo:
          "Spesso non è rotta: è solo sporca o si è appiattita restando compressa. Lavala con acqua tiepida e sapone, poi asciuga. Un trucco che funziona su gomme indurite: passare un phon a bassa temperatura per ammorbidirla e rimodellarla delicatamente con le dita.",
      },
      {
        titolo: "Qualcosa dentro impedisce la chiusura",
        difficolta: "facile",
        testo:
          "Un ripiano della porta spostato, una bottiglia troppo alta, un cassetto non rientrato: basta poco. È anche la causa più comune del ghiaccio che si forma sempre nello stesso angolo, perché lo spiraglio è sempre lo stesso.",
      },
      {
        titolo: "Il frigo non è in bolla",
        difficolta: "facile",
        testo:
          "Un frigorifero va inclinato leggermente all'indietro: così la porta tende a richiudersi da sola. Prova ad aprirla a metà e lasciarla: se resta ferma o si apre di più, regola i piedini anteriori qualche giro. Risolve anche i problemi di acqua che non raggiunge lo scarico.",
      },
      {
        titolo: "La porta si è abbassata",
        difficolta: "media",
        testo:
          "Con gli anni, e con le porte cariche di bottiglie, la cerniera inferiore si consuma e la porta scende di qualche millimetro: chiude in alto e resta aperta in basso. Alcuni modelli hanno una regolazione nella cerniera; in altri si sostituisce la boccola, che è un pezzo economico.",
      },
      {
        titolo: "La guarnizione va sostituita",
        difficolta: "media",
        testo:
          "Se è tagliata, sbriciolata o ha perso la forma in modo permanente, non c'è pulizia che tenga. È uno dei pochi ricambi alla portata di tutti: molte si sfilano dalla loro sede tirando con decisione e la nuova si inserisce a pressione, seguendo il perimetro senza tenderla.",
      },
    ],
    quandoTecnico: [
      "La porta resta abbassata anche dopo aver registrato la cerniera",
      "La guarnizione nuova non aderisce comunque",
      "Il pannello della porta si è deformato",
      "La porta non si apre più o si apre con difficoltà",
    ],
    faq: [
      {
        domanda: "Quanto incide una guarnizione che non tiene?",
        risposta:
          "Abbastanza da far lavorare il compressore molto più a lungo, da far formare ghiaccio e da alzare la bolletta. È tra le riparazioni meno costose e con l'effetto più immediato.",
      },
      {
        domanda: "Come capisco se la guarnizione è ancora buona?",
        risposta:
          "Deve essere morbida ed elastica, e riprendere forma se la schiacci. Se è dura come plastica, appiattita in un tratto o piena di crepe, ha finito il suo lavoro.",
      },
      {
        domanda: "La porta va invertita se apro dal lato scomodo?",
        risposta:
          "Quasi tutti i frigoriferi lo permettono e il libretto spiega come. È un'operazione fattibile ma va fatta con calma: le cerniere reggono il peso della porta, che è notevole quando è carica.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-asciuga",
    ricerca: "asciugatrice non asciuga",
    titolo: "Asciugatrice che non asciuga: le cause in ordine",
    descrizione:
      "Il ciclo finisce ma il bucato è ancora umido. Nella grande maggioranza dei casi il colpevole è un filtro, e non è quello che pulisci ogni volta.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il programma termina regolarmente, ma i vestiti sono ancora umidi e vanno stesi lo stesso. Nelle asciugatrici questo sintomo ha una causa dominante su tutte le altre — l'aria che non circola più come dovrebbe — e si risolve quasi sempre senza spendere nulla.",
    sicurezza:
      "Stacca la spina prima di aprire il vano del condensatore in basso. E una regola che vale sempre: non far mai funzionare l'asciugatrice senza il filtro della lanugine. La lanugine è infiammabile, e accumulata vicino alla resistenza è la causa principale degli incendi di questi apparecchi.",
    controlli: [
      {
        titolo: "Il filtro nello sportello è intasato",
        difficolta: "facile",
        testo:
          "Va pulito a ogni ciclo, e quasi nessuno lo fa così spesso. Se la retina è coperta da un feltro di lanugine, l'aria calda non attraversa il bucato e l'asciugatura si allunga o non avviene. Toglilo, stacca il feltro con le mani e sciacqualo sotto l'acqua se è untuoso di ammorbidente — poi asciugalo bene prima di rimetterlo.",
      },
      {
        titolo: "Il condensatore in basso non viene pulito da mesi",
        difficolta: "facile",
        testo:
          "È il filtro che quasi nessuno sa di avere, e la causa più frequente di tutte. Dietro lo sportellino in basso c'è un blocco a lamelle — il condensatore o scambiatore — che si intasa di lanugine fine. Va estratto e sciacquato sotto il rubinetto ogni due o tre mesi. Nei modelli a pompa di calore spesso c'è una spugna filtrante davanti, ed è quella a sporcarsi.",
      },
      {
        titolo: "Il carico è troppo grande",
        difficolta: "facile",
        testo:
          "La capacità dichiarata è quella di lavaggio, non di asciugatura: un'asciugatrice da 8 chili asciuga bene con quattro o cinque. Se il cestello è pieno, i capi non si muovono, l'aria non passa e l'umidità resta all'interno del rotolo di panni. Se il bucato esce umido solo in alcuni capi, quasi certamente è questo.",
      },
      {
        titolo: "Il bucato entra troppo bagnato",
        difficolta: "facile",
        testo:
          "Un'asciugatrice non è fatta per togliere l'acqua, ma l'umidità. Se la lavatrice centrifuga a 400 o 600 giri, o non centrifuga affatto, i capi arrivano fradici e nessun programma riesce a compensare. Centrifugare a 1000 giri o più cambia il risultato in modo evidente e fa risparmiare corrente.",
      },
      {
        titolo: "I sensori di umidità sono sporchi",
        difficolta: "media",
        testo:
          "Nel cestello ci sono due lamelle metalliche che misurano quanto è umido il bucato toccandolo. L'ammorbidente le ricopre di una patina isolante, e a quel punto leggono sempre asciutto: la macchina spegne il riscaldamento troppo presto e il ciclo finisce con i panni umidi. Puliscile con un panno e un po' di aceto — è un rimedio che risolve moltissimi casi apparentemente misteriosi.",
      },
      {
        titolo: "Resistenza o pompa di calore",
        difficolta: "da tecnico",
        testo:
          "Se filtri e sensori sono a posto e i panni escono umidi ma freddi, la macchina non sta scaldando. Nelle asciugatrici tradizionali il sospetto è la resistenza o il suo termostato di sicurezza; in quelle a pompa di calore il circuito refrigerante, che non si tocca in casa. È il caso in cui vale la pena farsi dire il preventivo prima di autorizzare.",
      },
    ],
    quandoTecnico: [
      "Il bucato esce umido e freddo, senza mai scaldarsi",
      "Hai pulito filtro e condensatore e non cambia nulla",
      "Il ciclo finisce sempre molto prima del tempo indicato",
      "Senti odore di bruciato durante il funzionamento",
    ],
    faq: [
      {
        domanda: "Ogni quanto va pulito il condensatore?",
        risposta:
          "Ogni due o tre mesi per una famiglia che la usa spesso. È la manutenzione più trascurata delle asciugatrici, e insieme al filtro dello sportello spiega la maggior parte dei problemi di asciugatura.",
      },
      {
        domanda: "L'ammorbidente fa male all'asciugatrice?",
        risposta:
          "Non la rompe, ma i suoi residui rivestono i sensori di umidità e intasano il filtro più in fretta. Se usi l'asciugatrice spesso, ridurre l'ammorbidente ha un effetto concreto sul risultato.",
      },
      {
        domanda: "Quanto dovrebbe durare un ciclo?",
        risposta:
          "Da un'ora e mezza a tre ore a seconda del carico e della tecnologia. I modelli a pompa di calore sono più lenti per costruzione, perché asciugano a temperatura più bassa: non è un difetto.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "asciugatrice non si accende",
    titolo: "Asciugatrice che non si accende o non parte",
    descrizione:
      "Nessuna spia, o spie accese ma il ciclo non parte. Sono due situazioni diverse, e la seconda ha quasi sempre una spiegazione banale.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Prima di cercare il guasto, distingui due casi: la macchina è completamente morta, oppure si accende ma rifiuta di partire. Nel secondo caso, nove volte su dieci, ti sta dicendo qualcosa che non hai letto.",
    sicurezza:
      "Presa, spina e sportello puoi controllarli senza rischi. Non smontare il pannello posteriore: le asciugatrici assorbono molto e hanno componenti che restano in tensione.",
    controlli: [
      {
        titolo: "Lo sportello non è chiuso davvero",
        difficolta: "facile",
        testo:
          "Deve fare clic. È la causa più frequente in assoluto tra quelle che impediscono la partenza: basta un capo che sporge dal cestello e tiene la porta a un millimetro dalla chiusura. Riapri, spingi dentro il bucato e richiudi con decisione.",
      },
      {
        titolo: "Il serbatoio dell'acqua è pieno",
        difficolta: "facile",
        testo:
          "Nelle asciugatrici a condensazione, con il serbatoio pieno la macchina si blocca e accende una spia — piccola e facile da ignorare. Svuotalo e riprova: se riparte, era quello. Alcuni modelli si fermano anche se il serbatoio non è inserito bene nella sua sede.",
      },
      {
        titolo: "La presa non porta corrente",
        difficolta: "facile",
        testo:
          "Le asciugatrici sono spesso in bagno, in garage o in lavanderia, su prese che nessuno usa per altro: un interruttore differenziale scattato lì può passare inosservato per giorni. Prova la presa con un altro apparecchio, e controlla tutte le levette del quadro.",
      },
      {
        titolo: "È attiva la sicurezza bambini o una partenza ritardata",
        difficolta: "facile",
        testo:
          "Il blocco tasti fa ignorare i comandi e si riconosce da un lucchetto sul display. La partenza ritardata invece fa sembrare la macchina spenta mentre sta solo aspettando: cerca un tempo o un simbolo di orologio. Tenere premuto il tasto di avvio per qualche secondo di solito azzera tutto.",
      },
      {
        titolo: "Il filtro non è inserito",
        difficolta: "facile",
        testo:
          "Alcuni modelli rifiutano di partire se il filtro dello sportello o il condensatore non sono al loro posto dopo una pulizia. È una sicurezza sensata — senza filtro la lanugine finisce sulla resistenza — e capita di rimontarli male senza accorgersene.",
      },
      {
        titolo: "Blocco porta o scheda",
        difficolta: "da tecnico",
        testo:
          "Se lo sportello chiude col suo clic, la corrente arriva e la macchina resta muta, i sospetti sono il micro-interruttore della porta — pezzo economico che si guasta spesso — oppure la scheda. Il primo si riconosce perché la macchina si comporta come se la porta fosse sempre aperta.",
      },
    ],
    quandoTecnico: [
      "L'interruttore scatta appena accendi la macchina",
      "Lo sportello fa clic ma la macchina si comporta come se fosse aperto",
      "Senti odore di bruciato o vedi la spina annerita",
      "Il display si accende ma nessun programma parte mai",
    ],
    faq: [
      {
        domanda: "Perché si è fermata a metà ciclo e ora non riparte?",
        risposta:
          "Spesso è il serbatoio riempitosi durante il ciclo, oppure una protezione termica intervenuta per surriscaldamento. Nel secondo caso la macchina riparte da sola dopo un'ora, ma la causa — filtri intasati — resta da risolvere.",
      },
      {
        domanda: "Posso usarla senza il filtro se l'ho perso?",
        risposta:
          "No, mai. Senza filtro la lanugine si deposita sulla resistenza e sul condensatore: è la situazione che porta agli incendi. Il ricambio costa poco e si trova col modello dell'apparecchio.",
      },
      {
        domanda: "Serve una presa speciale?",
        risposta:
          "Una presa normale da 16 ampere in buono stato è sufficiente per la maggior parte dei modelli. Quello che non va bene sono le prolunghe sottili e le ciabatte condivise con altri apparecchi: assorbono molto e scaldano il contatto.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-scalda",
    ricerca: "asciugatrice non scalda",
    titolo: "Asciugatrice che non scalda: aria fredda nel cestello",
    descrizione:
      "Il cestello gira, il ciclo va avanti, ma l'aria è fredda e il bucato non asciuga. Ecco cosa può bloccare il riscaldamento.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "L'asciugatrice funziona in tutto tranne che nella cosa principale: il cestello ruota, la ventola soffia, ma l'aria resta fredda. Prima di pensare al pezzo guasto, va escluso il motivo per cui la macchina potrebbe aver smesso di scaldare di proposito.",
    sicurezza:
      "Stacca la spina prima di aprire il vano del condensatore. La resistenza è protetta da termostati di sicurezza che intervengono in caso di surriscaldamento: se sono scattati, dietro c'è sempre una causa — quasi sempre filtri intasati — e va risolta quella, non aggirata.",
    controlli: [
      {
        titolo: "Hai scelto un programma senza calore",
        difficolta: "facile",
        testo:
          "Da controllare per primo, e capita più spesso di quanto si ammetta. I programmi per capi delicati, lana o rinfresca usano aria a temperatura ambiente di proposito. Prova un cotone standard: se scalda, la macchina non ha niente.",
      },
      {
        titolo: "I filtri sono intasati e la protezione è intervenuta",
        difficolta: "facile",
        testo:
          "È la causa più frequente. Con l'aria che non circola la resistenza scalda troppo e un termostato di sicurezza la stacca: il cestello continua a girare, ma senza calore. Pulisci il filtro dello sportello e il condensatore in basso, lascia raffreddare un'ora e riprova. Molti casi si risolvono qui.",
      },
      {
        titolo: "Il tubo di scarico dell'aria è ostruito",
        difficolta: "facile",
        testo:
          "Vale per le asciugatrici a evacuazione, quelle col tubo che va alla finestra o al muro. Un tubo piegato, schiacciato o pieno di lanugine impedisce all'aria di uscire e fa intervenire la stessa protezione. Va controllato per tutta la lunghezza, anche nel tratto esterno.",
      },
      {
        titolo: "È un modello a pompa di calore",
        difficolta: "facile",
        testo:
          "Un equivoco comune: le asciugatrici a pompa di calore lavorano a temperature molto più basse, e l'aria all'interno non diventa mai calda al tatto come nei modelli tradizionali. Se la tua è di quel tipo e il bucato asciuga — solo più lentamente — non c'è nessun guasto.",
      },
      {
        titolo: "Il cestello è troppo pieno",
        difficolta: "facile",
        testo:
          "Con il cestello strapieno l'aria non attraversa il bucato: la macchina scalda ma il calore non arriva ai capi, e la sensazione è la stessa di un riscaldamento assente. Prova con metà carico prima di concludere.",
      },
      {
        titolo: "Resistenza bruciata o termostato guasto",
        difficolta: "da tecnico",
        testo:
          "Se filtri e tubo sono liberi e l'aria resta fredda anche a carico ridotto, il pezzo è la resistenza o uno dei termostati che la comandano. Su molti modelli il termostato di sicurezza è monouso: una volta scattato va sostituito, non riarmato. Costa poco, ma va cambiato insieme alla causa che lo ha fatto intervenire.",
      },
    ],
    quandoTecnico: [
      "L'aria resta fredda anche con filtri puliti e mezzo carico",
      "La protezione termica scatta a ogni ciclo",
      "Senti odore di bruciato o di plastica calda",
      "L'interruttore del quadro scatta durante il ciclo",
    ],
    faq: [
      {
        domanda: "Quanto deve essere calda l'aria?",
        risposta:
          "Nelle asciugatrici tradizionali il bucato esce caldo al tatto. In quelle a pompa di calore esce appena tiepido: è normale e fa parte del motivo per cui consumano molto meno.",
      },
      {
        domanda: "Il termostato di sicurezza si può riarmare?",
        risposta:
          "Alcuni sì, con un pulsantino, altri sono monouso e vanno sostituiti. In entrambi i casi, riarmarlo senza rimuovere la causa significa farlo scattare di nuovo — e nel frattempo la macchina lavora in condizioni anomale.",
      },
      {
        domanda: "Conviene ripararla?",
        risposta:
          "Resistenza e termostati sono pezzi economici e la riparazione ha senso su qualsiasi macchina in buono stato. Il circuito a pompa di calore è un'altra storia: lì il conto si avvicina spesso a quello di un apparecchio nuovo.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ci-mette-troppo-tempo",
    ricerca: "asciugatrice ci mette troppo tempo",
    titolo: "Asciugatrice lentissima: quando è normale e quando no",
    descrizione:
      "Tre ore per un carico di magliette. A volte è la tecnologia dell'apparecchio, a volte un filtro che nessuno pulisce mai: ecco come distinguerle.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il bucato alla fine asciuga, ma i tempi si sono allungati o sono sempre stati lunghi. Prima di cercare guasti va chiarito con che tipo di asciugatrice hai a che fare, perché la risposta cambia completamente.",
    sicurezza:
      "Stacca la spina prima di estrarre il condensatore. Un apparecchio che impiega molto più del previsto sta anche scaldando più a lungo del previsto: se ai tempi lunghi si aggiunge odore di caldo o di bruciato, non rimandare il controllo dei filtri.",
    controlli: [
      {
        titolo: "È un modello a pompa di calore",
        difficolta: "facile",
        testo:
          "Da chiarire subito. Le asciugatrici a pompa di calore asciugano a temperatura molto più bassa e impiegano naturalmente più tempo — spesso due o tre ore contro l'ora e mezza di un modello tradizionale. In cambio consumano meno della metà. Se la tua è sempre stata così, non c'è nulla da riparare.",
      },
      {
        titolo: "Il condensatore è intasato",
        difficolta: "facile",
        testo:
          "È la causa numero uno quando i tempi si sono allungati nel tempo. Il blocco a lamelle dietro lo sportellino in basso si riempie di lanugine fine e l'aria non circola più: la macchina continua finché il bucato non è asciutto, ma ci mette il doppio. Estrailo e sciacqualo sotto il rubinetto.",
      },
      {
        titolo: "Il bucato entra troppo bagnato",
        difficolta: "facile",
        testo:
          "Il fattore che incide di più dopo i filtri. Centrifugare a 1400 giri invece che a 800 toglie molta più acqua, e l'asciugatrice parte da molto più vicino al traguardo. Costa pochi centesimi di corrente in lavatrice e ne fa risparmiare parecchi in asciugatrice.",
      },
      {
        titolo: "Il carico è troppo grande o troppo misto",
        difficolta: "facile",
        testo:
          "Un cestello pieno impedisce ai capi di rotolare, e la macchina va avanti finché il capo più umido non è asciutto. Anche mescolare asciugamani spessi e magliette leggere allunga tutto: i secondi sono pronti da un'ora e la macchina aspetta i primi.",
      },
      {
        titolo: "L'ambiente è freddo o poco arieggiato",
        difficolta: "facile",
        testo:
          "Un'asciugatrice in garage a cinque gradi o in un ripostiglio chiuso lavora molto peggio: le asciugatrici a pompa di calore in particolare rendono poco sotto i quindici gradi. Se il problema si presenta solo d'inverno, la causa è quella.",
      },
      {
        titolo: "Sensori di umidità sporchi o guasto del circuito",
        difficolta: "media",
        testo:
          "Se le lamelle metalliche nel cestello sono incrostate di ammorbidente, la macchina legge male l'umidità e può prolungare il ciclo inutilmente. Puliscile con aceto. Se dopo questo e la pulizia dei filtri i tempi restano doppi rispetto a prima, è il momento di far guardare il circuito di riscaldamento.",
      },
    ],
    quandoTecnico: [
      "I tempi sono raddoppiati rispetto a qualche mese fa",
      "Filtri e condensatore sono puliti e non cambia nulla",
      "Il bucato esce caldissimo ma ancora umido",
      "Il ciclo non finisce mai e va interrotto a mano",
    ],
    faq: [
      {
        domanda: "Quanto dovrebbe durare un ciclo normale?",
        risposta:
          "Da un'ora e mezza a due per un modello tradizionale con mezzo carico; da due a tre per una pompa di calore. Sopra le quattro ore c'è qualcosa che non va, qualunque sia la tecnologia.",
      },
      {
        domanda: "Conviene usare i programmi rapidi?",
        risposta:
          "Solo per carichi piccoli e capi leggeri. Su un carico normale spesso finiscono con il bucato ancora umido, e rilanciare un secondo ciclo consuma più di un programma unico fatto bene.",
      },
      {
        domanda: "Le palline per asciugatrice servono?",
        risposta:
          "Aiutano a separare i capi e a far passare l'aria, quindi qualche minuto lo fanno risparmiare. Non risolvono però nessuno dei problemi di questa lista: se i filtri sono intasati, le palline non compensano.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "si-ferma-subito",
    ricerca: "asciugatrice si ferma subito",
    titolo: "Asciugatrice che si ferma dopo pochi minuti",
    descrizione:
      "Il ciclo finisce quasi subito e il bucato è bagnato. Spesso non è un guasto: è la macchina che crede di aver finito, e c'è un motivo preciso.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Avvii un programma da due ore e dopo venti minuti la macchina segnala di aver finito, con il bucato ancora umido. È uno dei sintomi più fraintesi delle asciugatrici, e ha una causa specifica che quasi nessuno conosce.",
    sicurezza:
      "Stacca la spina prima di pulire i sensori dentro il cestello. Se invece la macchina si ferma con un errore e scotta, lascia raffreddare prima di riavviare: sta intervenendo una protezione, e riavviarla subito non aiuta.",
    controlli: [
      {
        titolo: "I sensori di umidità sono ricoperti di ammorbidente",
        difficolta: "facile",
        testo:
          "Questa è la causa principale, e spiega da sola la maggior parte dei casi. Dentro il cestello ci sono due lamelle metalliche che misurano l'umidità toccando i panni. L'ammorbidente e i residui di detersivo le rivestono di una patina isolante: a quel punto leggono sempre asciutto e la macchina si ferma quasi subito, convinta di aver finito. Puliscile con un panno imbevuto di aceto bianco.",
      },
      {
        titolo: "Il carico è troppo piccolo",
        difficolta: "facile",
        testo:
          "Con due o tre capi soltanto, il bucato può non toccare mai i sensori: la macchina non riesce a misurare nulla e chiude il ciclo. Molti modelli lo dichiarano nel libretto. Per carichi minimi conviene usare un programma a tempo invece di uno automatico.",
      },
      {
        titolo: "Hai selezionato un programma a tempo breve",
        difficolta: "facile",
        testo:
          "I programmi rinfresca o antipiega durano pochi minuti di proposito e non asciugano. È facile selezionarli per sbaglio girando la manopola, soprattutto se stanno accanto ai cotoni nel selettore.",
      },
      {
        titolo: "Il serbatoio si riempie e blocca il ciclo",
        difficolta: "facile",
        testo:
          "Se il serbatoio dell'acqua era già mezzo pieno all'avvio, si riempie in poco tempo e la macchina si ferma accendendo la spia. Da fuori sembra che il ciclo sia terminato. Svuotalo sempre prima di avviare, non dopo.",
      },
      {
        titolo: "Protezione per surriscaldamento",
        difficolta: "media",
        testo:
          "Con filtri intasati la macchina scalda troppo e una sicurezza la ferma. Il segnale che distingue questo caso: l'apparecchio è caldo e spesso non riparte finché non si raffredda. La soluzione non è riavviare, ma pulire filtro e condensatore.",
      },
      {
        titolo: "Scheda o sensore guasti",
        difficolta: "da tecnico",
        testo:
          "Se hai pulito i sensori, usi carichi normali e la macchina continua a fermarsi dopo pochi minuti, il sensore può essere guasto davvero o il collegamento interrotto. È un pezzo economico, ma va individuato con uno strumento invece che per tentativi.",
      },
    ],
    quandoTecnico: [
      "Si ferma subito anche con sensori puliti e carico normale",
      "Mostra un codice di errore che torna sempre",
      "Si ferma solo quando è calda e riparte da fredda",
      "Il cestello smette di girare insieme all'arresto",
    ],
    faq: [
      {
        domanda: "Dove sono i sensori di umidità?",
        risposta:
          "Sono due strisce metalliche verticali dentro il cestello, di solito vicino all'apertura o sul fondo, lunghe qualche centimetro. Si vedono facilmente aprendo lo sportello e guardando bene.",
      },
      {
        domanda: "Devo smettere di usare l'ammorbidente?",
        risposta:
          "Non necessariamente, ma va ridotto e i sensori vanno puliti ogni tanto. Chi usa l'asciugatrice spesso e l'ammorbidente a dosi generose si ritrova in questa situazione ogni pochi mesi.",
      },
      {
        domanda: "Il programma a tempo è meno efficiente?",
        risposta:
          "Consuma di più perché non si ferma quando il bucato è pronto, ma è l'unica opzione affidabile per carichi molto piccoli o per capi che i sensori faticano a leggere.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-rumore",
    ricerca: "asciugatrice fa rumore",
    titolo: "Asciugatrice rumorosa: cigolii, colpi e sferragliare",
    descrizione:
      "Il tipo di rumore indica il pezzo: un cigolio continuo, un colpo ritmico e uno sferragliare metallico portano in tre posti diversi.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Le asciugatrici hanno un cestello grande che gira su supporti semplici, quindi i rumori nascono presto e sono anche piuttosto riconoscibili. Ascoltare il tipo di suono restringe il campo prima ancora di aprire qualcosa.",
    sicurezza:
      "Stacca la spina prima di infilare le mani nel cestello o di guardare dietro. Non far funzionare la macchina con i pannelli smontati: la cinghia e la puleggia girano scoperte e sono un punto di presa pericoloso.",
    controlli: [
      {
        titolo: "C'è qualcosa nel cestello o nei bordi",
        difficolta: "facile",
        testo:
          "Monete, bottoni, fermagli e ferretti di reggiseno finiscono nella fessura tra cestello e guarnizione, e fanno un colpo secco a ogni giro. Gira il cestello a mano con la spina staccata e ispeziona il bordo con una torcia: è la causa più frequente e la più facile da togliere.",
      },
      {
        titolo: "Le cerniere e i bottoni dei jeans",
        difficolta: "facile",
        testo:
          "Uno sferragliare metallico regolare durante tutto il ciclo spesso è semplicemente quello: zip e bottoni che sbattono contro il cestello. Rivoltare i jeans o chiudere le cerniere prima di asciugare riduce parecchio il rumore, e protegge anche l'oblò.",
      },
      {
        titolo: "La macchina non è in piano",
        difficolta: "facile",
        testo:
          "Se il ronzio diventa un rimbombo, spingi gli angoli con una mano: se dondola, regola i piedini. Nelle installazioni a colonna sopra la lavatrice, il problema è quasi sempre il kit di sovrapposizione non fissato bene o assente — e in quel caso la vibrazione si sente in tutta la casa.",
      },
      {
        titolo: "Cigolio continuo che segue la rotazione",
        difficolta: "media",
        testo:
          "Un cigolio ritmico e costante viene di solito dai feltri di scorrimento o dai rulli su cui appoggia il cestello: si consumano e cominciano a stridere. Non è pericoloso nell'immediato, ma peggiora e alla fine il cestello si blocca. Sono pezzi economici, la manodopera è la parte cara.",
      },
      {
        titolo: "Rumore dalla zona della ventola",
        difficolta: "media",
        testo:
          "Un ronzio ruvido o un rumore di raschiamento continuo può essere la ventola che tocca lanugine accumulata o un piccolo oggetto risucchiato. È il motivo per cui il filtro va sempre montato: senza, il percorso verso la ventola è aperto.",
      },
      {
        titolo: "Cinghia o cuscinetti",
        difficolta: "da tecnico",
        testo:
          "Un fischio acuto o un rumore di attrito crescente indica la cinghia che slitta o i cuscinetti del cestello in sofferenza. Se insieme al rumore il cestello fatica a partire o si ferma sotto carico, il pezzo va cambiato prima che ceda del tutto.",
      },
    ],
    quandoTecnico: [
      "Il rumore cresce di settimana in settimana",
      "Il cestello fatica a partire o si ferma sotto carico",
      "Senti un fischio acuto continuo durante la rotazione",
      "Il rumore è accompagnato da odore di gomma bruciata",
    ],
    faq: [
      {
        domanda: "È normale che sia più rumorosa della lavatrice?",
        risposta:
          "Sì, in genere lo è: il cestello è grande, gira sempre, e c'è una ventola in funzione per tutto il ciclo. Quello che conta non è il livello assoluto ma il cambiamento rispetto a com'era prima.",
      },
      {
        domanda: "Posso continuare a usarla con il cigolio?",
        risposta:
          "Per qualche settimana sì, ma i feltri consumati fanno lavorare male il cestello e il danno si estende. Non è un'urgenza, ma nemmeno una cosa da rimandare per un anno.",
      },
      {
        domanda: "Il rumore di monete è pericoloso?",
        risposta:
          "Non per la macchina in sé, ma un oggetto metallico che sbatte può graffiare il cestello o incastrarsi nella ventola. Vale la pena toglierlo appena lo senti.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "perde-acqua",
    ricerca: "asciugatrice perde acqua",
    titolo: "Asciugatrice che perde acqua: da dove viene",
    descrizione:
      "Una macchina che asciuga non dovrebbe bagnare il pavimento — eppure l'acqua c'è, e viene dal sistema che la raccoglie.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Sembra un controsenso, ma un'asciugatrice a condensazione produce litri d'acqua a ogni ciclo: è l'umidità tolta dal bucato. Se quell'acqua non arriva dove deve, finisce sul pavimento — e le cause sono poche e ben identificabili.",
    sicurezza:
      "Stacca la spina prima di estrarre il serbatoio o il condensatore. Asciuga subito l'acqua: le asciugatrici stanno spesso in locali con pavimenti in legno o sopra la lavatrice, e in colonna l'acqua finisce direttamente sull'apparecchio sotto.",
    controlli: [
      {
        titolo: "Il serbatoio non è inserito bene",
        difficolta: "facile",
        testo:
          "È la causa numero uno. Dopo averlo svuotato, il serbatoio va spinto fino in fondo: se resta anche solo un centimetro fuori, l'acqua che arriva dal condotto tracima. Estrailo e reinseriscilo con decisione, sentendo che aggancia.",
      },
      {
        titolo: "Il serbatoio è pieno oltre il segno",
        difficolta: "facile",
        testo:
          "Se il sensore di livello non ha funzionato, l'acqua continua ad arrivare e trabocca. Svuotalo, e da lì in poi svuotalo prima di ogni ciclo invece che quando si accende la spia: è un'abitudine che elimina il problema alla radice.",
      },
      {
        titolo: "Il condensatore è sporco o mal rimontato",
        difficolta: "facile",
        testo:
          "Il blocco a lamelle in basso ha una guarnizione e uno sportellino che devono chiudere bene. Dopo una pulizia capita di rimetterlo storto o di lasciare lo sportello non agganciato: l'acqua di condensa esce da lì, in basso, davanti alla macchina. Verifica che le levette di blocco siano tornate in posizione.",
      },
      {
        titolo: "Il tubo di scarico diretto è staccato",
        difficolta: "media",
        testo:
          "Molte asciugatrici possono scaricare direttamente nel sifone del lavandino invece che nel serbatoio. Se il tuo è collegato così, controlla il raccordo e che il tubo non sia piegato o uscito dal sifone: è una perdita che si manifesta solo a ciclo avviato.",
      },
      {
        titolo: "Il filtro dello sportello è intasato",
        difficolta: "facile",
        testo:
          "Sembra scollegato ma non lo è: con l'aria che non circola la condensa si forma dove non dovrebbe, e può colare dallo sportello quando lo apri. È l'ennesimo problema che si risolve pulendo il filtro a ogni ciclo.",
      },
      {
        titolo: "Pompa di scarico o vaschetta interna",
        difficolta: "da tecnico",
        testo:
          "L'acqua raccolta viene spinta al serbatoio da una piccola pompa. Se è bloccata o il condotto è ostruito dalla lanugine, la vaschetta interna trabocca e l'acqua esce dal basamento — cioè sotto la macchina, non davanti. La distinzione tra i due punti di uscita è l'indizio più utile che puoi dare a chi verrà a guardarla.",
      },
    ],
    quandoTecnico: [
      "L'acqua esce da sotto la macchina, non davanti",
      "Il serbatoio resta vuoto anche dopo un ciclo lungo",
      "Senti la pompa ronzare senza che l'acqua arrivi al serbatoio",
      "La perdita continua anche con serbatoio e condensatore a posto",
    ],
    faq: [
      {
        domanda: "Quanta acqua produce un ciclo?",
        risposta:
          "Da uno a tre litri a seconda del carico e di quanto era bagnato il bucato. È esattamente l'acqua che la lavatrice non ha tolto in centrifuga, e per questo centrifugare bene riduce anche il lavoro dell'asciugatrice.",
      },
      {
        domanda: "Posso collegarla direttamente allo scarico?",
        risposta:
          "Molti modelli lo permettono e nel retro c'è un attacco predisposto: si evita di svuotare il serbatoio a ogni ciclo. Va fatto seguendo il libretto, perché il tubo ha bisogno di una pendenza corretta.",
      },
      {
        domanda: "L'acqua del serbatoio si può riutilizzare?",
        risposta:
          "È acqua distillata di fatto, e in molti la usano per il ferro da stiro. Attenzione però: contiene residui di detersivo e fibre, quindi va filtrata con un panno se la usi in un ferro con caldaia.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "serbatoio-sempre-pieno",
    ricerca: "asciugatrice segnala serbatoio pieno",
    titolo: "Spia del serbatoio sempre accesa anche se è vuoto",
    descrizione:
      "Hai svuotato il serbatoio ma la macchina insiste e si blocca. Il problema non è l'acqua: è il modo in cui la macchina la misura.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Svuoti il serbatoio, lo rimetti, e la spia resta accesa — oppure si riaccende dopo cinque minuti bloccando il ciclo. È un problema frequente e nella maggior parte dei casi ha una causa meccanica banale, non elettronica.",
    sicurezza:
      "Stacca la spina prima di estrarre serbatoio e condensatore. Nessun altro rischio particolare, ma evita di forzare il galleggiante con oggetti rigidi: è un pezzo di plastica leggera che si rompe con poco.",
    controlli: [
      {
        titolo: "Il serbatoio non è inserito fino in fondo",
        difficolta: "facile",
        testo:
          "La macchina rileva la presenza del serbatoio con un contatto: se non è spinto completamente in sede, per lei è come se mancasse o fosse pieno. Estrailo e reinseriscilo con decisione, sentendo lo scatto finale. È la spiegazione nella maggior parte dei casi.",
      },
      {
        titolo: "Il galleggiante è bloccato",
        difficolta: "facile",
        testo:
          "Dentro il serbatoio c'è un piccolo galleggiante che sale con l'acqua. Residui di lanugine e calcare lo incastrano in alto: la macchina continua a leggere pieno. Sciacqua bene il serbatoio con acqua calda e muovi il galleggiante con un dito finché non scorre libero.",
      },
      {
        titolo: "Il condotto verso il serbatoio è ostruito",
        difficolta: "media",
        testo:
          "Se il serbatoio è davvero vuoto ma l'acqua non ci arriva, si accumula nella vaschetta interna che ha il suo sensore: la macchina segnala pieno pur avendo il serbatoio asciutto. È un indizio importante — serbatoio vuoto e spia accesa insieme puntano al condotto, non al galleggiante.",
      },
      {
        titolo: "Hai collegato lo scarico diretto ma non l'hai impostato",
        difficolta: "media",
        testo:
          "Su alcuni modelli, collegando il tubo allo scarico bisogna anche disattivare il controllo del serbatoio dal pannello, altrimenti la macchina continua ad aspettarsi che si riempia. Il libretto lo spiega, e senza quel passaggio la spia resta accesa per sempre.",
      },
      {
        titolo: "Il contatto del serbatoio è sporco",
        difficolta: "media",
        testo:
          "Nella sede del serbatoio c'è un micro-interruttore o un contatto magnetico. La lanugine si accumula anche lì. Con la spina staccata, pulisci l'alloggiamento con un panno asciutto e guarda se qualcosa impedisce al serbatoio di appoggiare bene.",
      },
      {
        titolo: "Sensore o pompa guasti",
        difficolta: "da tecnico",
        testo:
          "Se il condotto è libero, il galleggiante scorre e il serbatoio è in sede, resta il sensore di livello o la pompa che non spinge l'acqua. Il sintomo che li distingue: con la pompa guasta senti un ronzio a fine ciclo ma il serbatoio resta asciutto.",
      },
    ],
    quandoTecnico: [
      "Il serbatoio resta asciutto a fine ciclo ma la spia dice pieno",
      "Senti la pompa ronzare senza che arrivi acqua",
      "La spia resta accesa anche con serbatoio nuovo",
      "La macchina si blocca a metà ciclo ogni volta",
    ],
    faq: [
      {
        domanda: "Posso ignorare la spia e usarla lo stesso?",
        risposta:
          "Quasi tutte le asciugatrici si bloccano e non completano il ciclo, quindi non è una scelta. E se il problema fosse davvero acqua che non defluisce, insistere significa farla uscire da qualche altra parte.",
      },
      {
        domanda: "Quanto spesso va svuotato il serbatoio?",
        risposta:
          "Dopo ogni ciclo, prima di avviare il successivo. Un serbatoio mezzo pieno all'avvio si riempie a metà programma e blocca tutto proprio quando non sei lì a guardare.",
      },
      {
        domanda: "Il serbatoio va lavato?",
        risposta:
          "Ogni tanto sì, con acqua calda: dentro si formano depositi e a volte muffa, che oltre a bloccare il galleggiante danno un odore sgradevole che si trasferisce al bucato.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "puzza",
    ricerca: "asciugatrice puzza",
    titolo: "Asciugatrice che puzza: di chiuso, di bruciato o di muffa",
    descrizione:
      "Tre odori diversi con tre cause diverse — e uno dei tre richiede di spegnere subito e non riaccendere.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Il bucato esce con un odore che non dovrebbe avere, o la macchina puzza appena la apri. Prima di cercare rimedi va identificato l'odore: di chiuso, di muffa e di bruciato portano in tre direzioni completamente diverse, e l'ultima è urgente.",
    sicurezza:
      "Se senti odore di bruciato, di plastica calda o di gomma, spegni e stacca la spina immediatamente. Nelle asciugatrici la lanugine accumulata vicino alla resistenza è la causa principale degli incendi domestici di elettrodomestici: non è un allarme teorico, ed è il motivo per cui il filtro va pulito a ogni ciclo.",
    controlli: [
      {
        titolo: "Odore di bruciato: fermati",
        difficolta: "facile",
        testo:
          "Se l'odore è di bruciato, di caldo eccessivo o di plastica, spegni e non riavviare. Quasi sempre è lanugine accumulata dove non dovrebbe, che si sta scaldando oltre misura. Prima di qualsiasi altra cosa vanno puliti a fondo il filtro, il condensatore e — se ci arrivi — il condotto dell'aria.",
      },
      {
        titolo: "Odore di chiuso sul bucato",
        difficolta: "facile",
        testo:
          "Se i panni escono con odore di stantio, spesso il problema è a monte: bucato rimasto ore in lavatrice prima di essere trasferito. L'asciugatrice non toglie quell'odore, lo fissa con il calore. Il rimedio è nel tempo di trasferimento, non nella macchina.",
      },
      {
        titolo: "Muffa nel serbatoio o nel condensatore",
        difficolta: "facile",
        testo:
          "Il serbatoio contiene acqua tiepida ferma per giorni: è un ambiente ideale per la muffa, e l'odore risale nel cestello. Lavalo con acqua calda ogni tanto. Stessa cosa per il condensatore, dove lanugine umida e residui di ammorbidente fermentano.",
      },
      {
        titolo: "La guarnizione dello sportello",
        difficolta: "facile",
        testo:
          "Nella piega della gomma restano umidità e residui. Passala con un panno umido e bicarbonato, e controlla anche il bordo inferiore dell'apertura, dove si accumula lanugine bagnata che nessuno vede.",
      },
      {
        titolo: "Odore al primo utilizzo di una macchina nuova",
        difficolta: "facile",
        testo:
          "Normale e passeggero: sono i residui di lavorazione e gli oli protettivi che bruciano al primo riscaldamento. Dopo due o tre cicli deve sparire. Se persiste oltre, non è più il rodaggio.",
      },
      {
        titolo: "Lanugine nel condotto dell'aria",
        difficolta: "da tecnico",
        testo:
          "L'accumulo di lanugine nella parte non accessibile del percorso dell'aria è la causa più seria di questo elenco: dà odore di caldo, allunga i tempi e crea un rischio reale. Una pulizia interna periodica ha senso su qualsiasi asciugatrice usata spesso da anni.",
      },
    ],
    quandoTecnico: [
      "Odore di bruciato, di plastica o di gomma: subito, e senza riaccendere",
      "L'odore di caldo compare anche a filtri appena puliti",
      "La macchina scotta all'esterno più del solito",
      "L'odore di muffa torna nonostante serbatoio e condensatore puliti",
    ],
    faq: [
      {
        domanda: "Posso mettere un profumatore nel cestello?",
        risposta:
          "Copre l'odore senza toglierne la causa, e se la causa è lanugine surriscaldata è esattamente ciò che non vuoi fare. Prima si risolve, poi eventualmente si profuma.",
      },
      {
        domanda: "Ogni quanto pulire davvero il filtro?",
        risposta:
          "A ogni ciclo, senza eccezioni. È l'operazione da trenta secondi che previene la maggior parte dei problemi descritti in tutte queste guide sull'asciugatrice, incluso il rischio più serio.",
      },
      {
        domanda: "Si possono asciugare capi sporchi di olio o solventi?",
        risposta:
          "No. Tessuti impregnati di oli, cere o solventi possono incendiarsi da soli con il calore, anche dopo il lavaggio. Vanno asciugati all'aria, ed è una delle poche regole assolute in materia.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "cestello-non-gira",
    ricerca: "asciugatrice cestello non gira",
    titolo: "Cestello dell'asciugatrice che non gira",
    descrizione:
      "Senti il motore ma il cestello resta fermo, oppure non si muove niente. Sono due guasti diversi, e uno è tra i più comuni di questi apparecchi.",
    elettrodomestico: "asciugatrice",
    aggiornata: "2026-09-05",
    introduzione:
      "Avvii il programma e il cestello non ruota. La distinzione che serve subito: senti il motore ronzare, oppure c'è silenzio? La risposta a questa domanda vale metà della diagnosi.",
    sicurezza:
      "Stacca la spina prima di provare a girare il cestello con le mani. Non azionare mai la macchina con i pannelli aperti per vedere cosa succede: cinghia e puleggia girano scoperte, e sono un punto in cui le dita si infilano molto facilmente.",
    controlli: [
      {
        titolo: "Il motore ronza ma il cestello è fermo",
        difficolta: "media",
        testo:
          "È il sintomo classico della cinghia rotta o uscita dalla puleggia, ed è uno dei guasti più comuni delle asciugatrici. La conferma: a spina staccata, gira il cestello con la mano. Se ruota liberissimo, quasi senza attrito e senza opporre resistenza, la cinghia non lo sta più trascinando. Il pezzo costa poco; smontare la macchina richiede metodo.",
      },
      {
        titolo: "Silenzio totale: non parte proprio",
        difficolta: "facile",
        testo:
          "Se non senti nulla, il problema non è meccanico ma di avvio: sportello non chiuso bene, serbatoio pieno, sicurezza bambini, presa senza corrente. Sono le stesse verifiche della guida su quando non si accende, e vanno fatte prima di pensare alla cinghia.",
      },
      {
        titolo: "Il cestello è bloccato da un capo incastrato",
        difficolta: "facile",
        testo:
          "Un lenzuolo o un capo lungo può infilarsi tra cestello e struttura e bloccare tutto. Con la spina staccata, prova a ruotare il cestello a mano: se incontra un ostacolo netto invece di girare libero, guarda nella fessura del bordo con una torcia.",
      },
      {
        titolo: "Il carico è troppo pesante",
        difficolta: "facile",
        testo:
          "Un cestello caricato oltre misura, magari con capi bagnati fradici, può essere troppo per il motore: parte, fatica e si ferma. Prova a togliere metà del bucato e riavvia. Se così gira, non c'è nessun guasto — c'è un'abitudine da cambiare.",
      },
      {
        titolo: "La protezione termica del motore è intervenuta",
        difficolta: "media",
        testo:
          "Dopo uno sforzo prolungato il motore si protegge e si ferma. Riparte da solo dopo mezz'ora o un'ora, quando si è raffreddato. Se succede spesso, la causa è a monte: carichi troppo grandi, filtri intasati o cuscinetti che oppongono resistenza.",
      },
      {
        titolo: "Motore, condensatore di avviamento o rulli",
        difficolta: "da tecnico",
        testo:
          "Se il cestello gira a fatica anche a mano — con attrito o rumore di raschiamento — i rulli di appoggio sono consumati e il motore non ce la fa. Se invece il motore emette un ronzio sordo senza partire, spesso è il condensatore di avviamento: pezzo piccolo ed economico, ma va sostituito da chi sa scaricarlo prima di toccarlo.",
      },
    ],
    quandoTecnico: [
      "Il motore ronza ma il cestello resta fermo",
      "Il cestello gira a mano con attrito o rumore di raschiamento",
      "Senti odore di gomma bruciata dopo il tentativo di avvio",
      "La protezione termica interviene a ogni ciclo",
    ],
    faq: [
      {
        domanda: "La cinghia si può cambiare da soli?",
        risposta:
          "È una riparazione economica come pezzo ma laboriosa: bisogna smontare i pannelli, sfilare il cestello e rimettere la cinghia sul tenditore nella posizione giusta. Chi ha manualità e il manuale di servizio ci riesce; è comunque una mezza giornata.",
      },
      {
        domanda: "Come faccio a capire se è la cinghia senza smontare?",
        risposta:
          "Il test del cestello girato a mano è affidabile: con la cinghia integra si sente una resistenza elastica, perché stai trascinando anche il motore. Se gira libero come una ruota, la cinghia non c'è più.",
      },
      {
        domanda: "Conviene ripararla?",
        risposta:
          "Cinghia e rulli sì, quasi sempre: sono pezzi economici su una macchina che per il resto funziona. Il motore su un'asciugatrice datata è un altro discorso, e va confrontato con il prezzo di una nuova.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "odore-di-gas",
    ricerca: "odore di gas dal piano cottura",
    titolo: "Odore di gas in cucina: cosa fare subito",
    descrizione:
      "Questa non è una guida per riparare: è la procedura da seguire nell'ordine giusto, e la sola cosa da leggere se senti odore di gas adesso.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Se senti odore di gas mentre leggi questa pagina, non continuare a leggere sul telefono dentro casa: esci e leggi fuori. Tutto il resto di questa guida presume che tu sia già al sicuro.",
    sicurezza:
      "Non accendere né spegnere NULLA: interruttori, luci, cappa, telefono, campanello. Una scintilla basta. Non usare l'ascensore. Apri le finestre, chiudi il rubinetto del gas, esci, e da fuori chiama il pronto intervento del distributore — il numero è sulla bolletta — oppure i vigili del fuoco al 115.",
    controlli: [
      {
        titolo: "Chiudi il rubinetto del gas",
        difficolta: "facile",
        testo:
          "È il primo gesto, prima di ogni altra cosa. Il rubinetto del piano cottura sta di solito sotto il lavello o dietro il mobile; quello generale è vicino al contatore. Chiudili entrambi se ci arrivi senza dover accendere luci per vedere.",
      },
      {
        titolo: "Apri tutte le finestre",
        difficolta: "facile",
        testo:
          "Corrente d'aria da parte a parte. Il gas metano è più leggero dell'aria e sale, il GPL è più pesante e ristagna in basso: nel dubbio si arieggia tutto, dal pavimento al soffitto. Non usare ventilatori elettrici per accelerare.",
      },
      {
        titolo: "Non toccare nessun interruttore",
        difficolta: "facile",
        testo:
          "Questa è la regola che salva. Accendere o spegnere una luce, staccare una spina, suonare un campanello, rispondere al telefono: ognuno di questi gesti produce una piccola scintilla, e in un ambiente saturo è tutto ciò che serve. Se la luce è accesa, lasciala accesa.",
      },
      {
        titolo: "Esci e chiama da fuori",
        difficolta: "facile",
        testo:
          "Usa il telefono all'aperto, non in casa. Il numero del pronto intervento gas è stampato sulla bolletta del distributore ed è attivo ventiquattro ore su ventiquattro, gratuitamente. In alternativa, i vigili del fuoco al 115. Avvisa i vicini bussando, non citofonando.",
      },
      {
        titolo: "Se l'odore è lieve e occasionale",
        difficolta: "media",
        testo:
          "Un odore breve al momento dell'accensione, che sparisce subito, di solito è il gas non bruciato del primo istante. Diventa un problema se lo senti a fornelli spenti, o se compare sempre nello stesso punto. In quel caso vale comunque la procedura sopra: il gas non è un campo dove tentare diagnosi.",
      },
      {
        titolo: "Chi può cercare la perdita",
        difficolta: "da tecnico",
        testo:
          "Solo un tecnico abilitato agli impianti a gas, con la strumentazione per la prova di tenuta. Il tubo di collegamento del piano ha una scadenza stampata sopra e va sostituito quando arriva — è la causa più comune di perdite domestiche, e controllare quella data è l'unica verifica sensata che puoi fare tu, a impianto chiuso.",
      },
    ],
    quandoTecnico: [
      "Sempre, senza eccezioni, se senti odore di gas",
      "Se il tubo flessibile ha la data di scadenza superata",
      "Se l'odore torna dopo l'intervento del pronto intervento",
      "Se qualcuno in casa ha mal di testa o nausea ricorrenti",
    ],
    faq: [
      {
        domanda: "Il gas ha odore di suo?",
        risposta:
          "No, è inodore: l'odore pungente che senti è una sostanza aggiunta apposta perché le perdite siano percepibili. È un sistema che funziona, e per questo va preso sul serio anche quando l'odore è debole.",
      },
      {
        domanda: "Ogni quanto va cambiato il tubo del gas?",
        risposta:
          "I tubi flessibili in gomma hanno una data di scadenza stampata, in genere cinque anni. Quelli in acciaio inox flessibile durano molto di più. Controllare quella data è la manutenzione più semplice e più ignorata della cucina.",
      },
      {
        domanda: "Un rilevatore di gas serve?",
        risposta:
          "È un dispositivo economico che ha senso soprattutto per chi vive solo, per gli anziani o dove il piano è a GPL, che ristagna in basso. Non sostituisce la manutenzione, ma avvisa quando l'olfatto non basta.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "piano cottura non si accende",
    titolo: "Piano cottura che non si accende: gas, elettrico o induzione",
    descrizione:
      "Le cause cambiano completamente a seconda del tipo di piano. Ecco cosa controllare per ciascuno, dal più banale al più serio.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Prima di cercare il guasto serve sapere che piano hai: a gas, elettrico in vetroceramica o a induzione. Sono tre apparecchi diversi che condividono solo il posto in cucina, e le cause del mancato funzionamento non si somigliano affatto.",
    sicurezza:
      "Se hai un piano a gas e senti odore di gas, chiudi il rubinetto, non toccare interruttori e leggi la guida dedicata. Per i piani elettrici e a induzione, togli corrente dal quadro prima di qualsiasi verifica: assorbono molto e spesso hanno una linea dedicata.",
    controlli: [
      {
        titolo: "Gas: la scintilla non parte",
        difficolta: "facile",
        testo:
          "Se premendo la manopola non senti il ticchettio dell'accensione, la causa più frequente è l'elettrodo bagnato o sporco: basta un travaso durante la cottura. Asciuga bene con un panno, pulisci la punta di ceramica bianca accanto al bruciatore e riprova. Molti piani hanno bisogno anche della corrente elettrica per la scintilla: controlla che la presa sotto il mobile sia inserita.",
      },
      {
        titolo: "Gas: il coperchietto del bruciatore è messo storto",
        difficolta: "facile",
        testo:
          "Dopo una pulizia capita di rimontare male lo spartifiamma: se non appoggia perfettamente in sede, il gas esce dove non deve e il fornello non si accende o si accende a metà corona. Toglilo e rimettilo verificando che i riferimenti combacino e che sia in piano.",
      },
      {
        titolo: "Gas: i forellini della corona sono otturati",
        difficolta: "facile",
        testo:
          "Residui di cibo e grasso li chiudono. Sfila la corona, lasciala a bagno in acqua calda e sgrassante, poi libera ogni forellino con uno spillo o una spazzola dura. Asciuga bene prima di rimontare: anche solo l'umidità impedisce l'accensione.",
      },
      {
        titolo: "Induzione: la pentola non è adatta",
        difficolta: "facile",
        testo:
          "Il piano funziona ma non succede niente, e magari compare un simbolo di pentola con la barra. Prova con una calamita: se non si attacca al fondo, quella pentola non può funzionare a induzione. È il malinteso più comune quando si passa dal gas all'induzione.",
      },
      {
        titolo: "Elettrico e induzione: manca corrente o è saltato l'interruttore",
        difficolta: "facile",
        testo:
          "I piani elettrici hanno quasi sempre una linea dedicata, spesso condivisa col forno: un interruttore abbassato nel quadro non toglie corrente al resto della cucina, e nessuno lo nota. Guarda tutte le levette, non solo quella che salta di solito.",
      },
      {
        titolo: "Accenditore, valvola o scheda",
        difficolta: "da tecnico",
        testo:
          "Se la scintilla non parte su nessun fornello, o se un piano a induzione resta completamente spento pur avendo corrente, il pezzo è la centralina di accensione oppure la scheda di potenza. Sui piani a gas la sostituzione tocca l'impianto e richiede un tecnico abilitato: non è un lavoro da fare per tentativi.",
      },
    ],
    quandoTecnico: [
      "La scintilla non parte su nessun fornello",
      "Senti gas uscire senza che il fornello si accenda",
      "L'interruttore scatta ogni volta che accendi il piano",
      "Il piano a induzione resta spento pur avendo corrente",
    ],
    faq: [
      {
        domanda: "Posso accendere il gas con un accendino se la scintilla non parte?",
        risposta:
          "Tecnicamente sì e molti lo fanno, ma solo se il fornello si accende subito e la fiamma resta stabile. Se devi insistere mentre esce gas, fermati: stai accumulando gas nell'ambiente prima dell'accensione.",
      },
      {
        domanda: "Perché scintillano tutti i fornelli insieme?",
        risposta:
          "Su molti piani l'accensione è unica per tutti i bruciatori: è normale. Diventa un sintomo se il ticchettio continua da solo senza che tu prema nulla — quello indica umidità o una manopola non tornata a riposo.",
      },
      {
        domanda: "Un piano a induzione può funzionare con una presa normale?",
        risposta:
          "Dipende dalla potenza. Molti richiedono un collegamento dedicato con una portata superiore a quella di una presa domestica standard: usarne una inadeguata fa scattare la protezione e scalda i contatti.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fiamma-gialla",
    ricerca: "fiamma gialla fornello",
    titolo: "Fiamma gialla invece che blu: perché va risolta subito",
    descrizione:
      "Non è un dettaglio estetico. Una fiamma gialla significa combustione incompleta, e la combustione incompleta produce monossido di carbonio.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Una fiamma a gas ben regolata è blu, con un cono interno più definito. Se è gialla, arancione o fa fuliggine sul fondo delle pentole, il gas non sta bruciando completamente — e vale la pena capire perché prima di continuare a usarlo.",
    sicurezza:
      "La combustione incompleta produce monossido di carbonio, che è inodore e non si vede. Cucina sempre con la cappa accesa o una finestra socchiusa, e non usare mai il piano cottura per riscaldare la stanza. Se in casa qualcuno ha mal di testa o nausea che passano uscendo all'aperto, esci e fai controllare l'impianto.",
    controlli: [
      {
        titolo: "Il bruciatore è sporco",
        difficolta: "facile",
        testo:
          "È la causa più frequente. Grasso e residui otturano i forellini della corona e alterano la miscela di aria e gas. Smonta corona e spartifiamma, lasciali a bagno in acqua calda con sgrassante, libera ogni foro con uno spillo, asciuga perfettamente e rimonta verificando che tutto appoggi in sede.",
      },
      {
        titolo: "Il coperchietto è montato male",
        difficolta: "facile",
        testo:
          "Uno spartifiamma appoggiato storto cambia il modo in cui l'aria si mescola al gas, e la fiamma diventa irregolare e gialla su un lato. Controlla i riferimenti di montaggio: quasi tutti i bruciatori hanno una tacca o un incastro che impedisce il montaggio sbagliato, se ci si fa caso.",
      },
      {
        titolo: "Fiamma gialla solo con certe pentole",
        difficolta: "facile",
        testo:
          "Una pentola troppo grande o appoggiata troppo in basso soffoca il bruciatore e impedisce all'aria di arrivare. Se il giallo compare solo con la pentola grande, non c'è nulla di rotto: c'è un fornello sbagliato per quella pentola.",
      },
      {
        titolo: "Sei passato da metano a GPL, o viceversa",
        difficolta: "media",
        testo:
          "È una causa che spiega i casi apparentemente inspiegabili. Metano e GPL hanno bisogno di ugelli diversi: un piano nato per il metano e collegato a una bombola senza cambiare gli ugelli brucia male, con fiamme gialle e fuligginose. La conversione va fatta da un tecnico, con il kit del costruttore.",
      },
      {
        titolo: "Manca aria nella stanza",
        difficolta: "media",
        testo:
          "La combustione consuma ossigeno. In cucine molto sigillate, con infissi nuovi e nessuna presa d'aria, o con una cappa aspirante potente che mette l'ambiente in depressione, la fiamma tende al giallo. Provare con la finestra socchiusa è una verifica immediata e dice molto.",
      },
      {
        titolo: "Pressione del gas o ugelli",
        difficolta: "da tecnico",
        testo:
          "Se dopo la pulizia la fiamma resta gialla su tutti i fornelli, il problema è nella regolazione: pressione in ingresso sbagliata, riduttore della bombola difettoso o ugelli non adatti. Sono verifiche che richiedono strumenti e abilitazione, e non si fanno a occhio.",
      },
    ],
    quandoTecnico: [
      "La fiamma resta gialla dopo aver pulito i bruciatori",
      "Le pentole si anneriscono di fuliggine sul fondo",
      "Il piano è stato convertito tra metano e GPL",
      "Qualcuno in casa ha sintomi che passano all'aria aperta",
    ],
    faq: [
      {
        domanda: "Una punta gialla è sempre grave?",
        risposta:
          "Piccole punte arancioni occasionali possono venire da polvere o da un granello che brucia, e non sono allarmanti. Il segnale vero è una fiamma stabilmente gialla, morbida e senza cono blu definito.",
      },
      {
        domanda: "Cos'è il monossido di carbonio e perché non lo sento?",
        risposta:
          "È un gas prodotto dalla combustione incompleta: incolore, inodore e insapore. Proprio perché non è percepibile, la fiamma gialla è uno dei pochi segnali visibili che si hanno, e i rilevatori esistono apposta.",
      },
      {
        domanda: "Posso continuare a cucinare nel frattempo?",
        risposta:
          "Con la cappa accesa e una finestra socchiusa, per il tempo necessario a organizzare la pulizia o il controllo. Non è una situazione da lasciare così per mesi, ed è tra le poche di queste guide in cui il rinvio ha un costo reale.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fiamma-si-spegne",
    ricerca: "fornello si spegne quando lascio la manopola",
    titolo: "Il fornello si spegne appena lasci la manopola",
    descrizione:
      "È il sintomo di un pezzo preciso, che esiste apposta per la tua sicurezza: la termocoppia. Ecco come funziona e cosa si può pulire.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Accendi, la fiamma parte, ma appena molli la manopola si spegne. Non è un capriccio: c'è un dispositivo che sta facendo esattamente il suo mestiere, cioè impedire che esca gas quando non c'è fiamma. Il problema è che a volte lo fa anche quando la fiamma c'è.",
    sicurezza:
      "Se dopo qualche tentativo il fornello non resta acceso, fermati e arieggia: a ogni prova esce gas per qualche secondo prima dell'accensione. Non insistere dieci volte di fila, e mai con la cappa spenta e le finestre chiuse.",
    controlli: [
      {
        titolo: "Non tieni premuto abbastanza",
        difficolta: "facile",
        testo:
          "La termocoppia deve scaldarsi per generare la corrente che tiene aperta la valvola: servono dai cinque ai quindici secondi con la manopola premuta a fondo. Molti mollano dopo tre. Prova a contare fino a quindici prima di rilasciare, tenendo la fiamma al massimo.",
      },
      {
        titolo: "La punta della termocoppia è sporca",
        difficolta: "facile",
        testo:
          "È un bastoncino metallico accanto al bruciatore, spesso confuso con l'elettrodo di accensione. Coperto di residui carbonizzati non percepisce più il calore. Puliscilo delicatamente con una spugnetta abrasiva fine o carta vetrata sottilissima, a fornello freddo, senza piegarlo.",
      },
      {
        titolo: "La termocoppia non è nella fiamma",
        difficolta: "facile",
        testo:
          "La punta deve trovarsi dentro la corona di fuoco, non accanto. Se dopo una pulizia hai rimontato la corona ruotata, o se il supporto si è piegato, la termocoppia resta fuori dalla fiamma e non scalda mai abbastanza. Guarda a fornello acceso: la punta deve essere lambita dal fuoco.",
      },
      {
        titolo: "Il coperchietto è montato male",
        difficolta: "facile",
        testo:
          "Uno spartifiamma fuori sede fa uscire la fiamma in modo irregolare, spesso proprio dalla parte opposta alla termocoppia. Rimontalo verificando gli incastri: è la stessa causa che produce fiamme gialle e accensioni a metà corona.",
      },
      {
        titolo: "La fiamma è troppo bassa al minimo",
        difficolta: "media",
        testo:
          "Se il fornello resta acceso al massimo ma si spegne appena abbassi, la regolazione del minimo è troppo scarsa e la fiamma non scalda più la termocoppia. Su molti piani c'è una piccola vite di registro nel corpo del rubinetto, ma è una regolazione che tocca l'impianto gas: meglio farla fare a chi è abilitato.",
      },
      {
        titolo: "Termocoppia o valvola da sostituire",
        difficolta: "da tecnico",
        testo:
          "Se la punta è pulita, ben posizionata e il fornello continua a spegnersi, la termocoppia ha esaurito la sua vita — è un pezzo di consumo — oppure la valvola di sicurezza non tiene più. Entrambi costano poco, ma si sostituiscono aprendo il circuito del gas: è lavoro da tecnico abilitato, non da fai-da-te.",
      },
    ],
    quandoTecnico: [
      "Il fornello si spegne anche tenendo premuto venti secondi",
      "La termocoppia è pulita e ben posizionata ma non funziona",
      "Si spegne solo abbassando la fiamma al minimo",
      "Senti odore di gas durante i tentativi",
    ],
    faq: [
      {
        domanda: "Posso disattivare la sicurezza per comodità?",
        risposta:
          "No, e nessun tecnico serio lo farebbe. Quella valvola esiste perché se la fiamma si spegne — un colpo d'aria, una pentola che trabocca — il gas smetta di uscire. È il dispositivo che evita le saturazioni di gas in cucina.",
      },
      {
        domanda: "Perché succede solo su un fornello?",
        risposta:
          "Perché ogni bruciatore ha la sua termocoppia. Se il problema è su uno solo, la causa è quasi certamente locale: sporco, posizione o pezzo a fine vita. Se succede su tutti, guarda più a monte.",
      },
      {
        domanda: "Quanto dura una termocoppia?",
        risposta:
          "Anni, ma è un componente sottoposto a cicli continui di calore e prima o poi cede. È tra i ricambi più economici di una cucina a gas, e la manodopera pesa più del pezzo.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "induzione-non-riconosce-pentola",
    ricerca: "piano a induzione non riconosce la pentola",
    titolo: "Induzione che non riconosce la pentola: la prova della calamita",
    descrizione:
      "Il piano si accende, la zona lampeggia, ma non scalda. Prima di pensare a un guasto ci sono tre verifiche che si fanno in trenta secondi.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Metti la pentola, imposti la potenza e il piano lampeggia o mostra un simbolo di pentola barrata. Nella grande maggioranza dei casi non c'è nessun guasto: l'induzione funziona solo con certi materiali, e questo coglie di sorpresa chi arriva dal gas.",
    sicurezza:
      "Nessun rischio in queste verifiche. Ricorda solo che la superficie può essere calda per il calore restituito dalla pentola, anche se il piano in sé non scalda: le spie di calore residuo servono a quello.",
    controlli: [
      {
        titolo: "La prova della calamita",
        difficolta: "facile",
        testo:
          "È la verifica definitiva e costa zero. Prendi una calamita da frigo e appoggiala sul fondo esterno della pentola: se si attacca con decisione, la pentola va bene; se non si attacca o tiene appena, quella pentola non funzionerà mai a induzione. Alluminio, rame, vetro e la maggior parte dell'acciaio inox leggero non sono adatti.",
      },
      {
        titolo: "La pentola è troppo piccola per la zona",
        difficolta: "facile",
        testo:
          "Ogni zona ha un diametro minimo, spesso dodici centimetri. Un pentolino piccolo su una zona grande non viene rilevato affatto: il piano lampeggia come se non ci fosse nulla sopra. Sposta la pentola su una zona più piccola prima di concludere qualsiasi cosa.",
      },
      {
        titolo: "Il fondo non è piatto",
        difficolta: "facile",
        testo:
          "Una pentola deformata dall'uso appoggia solo sui bordi, e il piano fatica a rilevarla o si spegne a intermittenza. Appoggiala su un piano dritto e guarda controluce: se dondola o passa luce sotto, il problema è quello.",
      },
      {
        titolo: "La pentola non è centrata",
        difficolta: "facile",
        testo:
          "I sensori stanno al centro della zona. Una pentola spostata di lato, magari perché il piano è affollato, può non essere vista. Sembra banale, ed è una delle cause più frequenti dei rilevamenti intermittenti.",
      },
      {
        titolo: "Il piano ha ridotto la potenza da solo",
        difficolta: "media",
        testo:
          "I piani a induzione ripartiscono la potenza disponibile tra le zone: usandone quattro insieme al massimo, alcune scendono automaticamente e sembrano non funzionare. Non è un guasto — è la gestione dei carichi. Il libretto indica quali zone condividono lo stesso generatore.",
      },
      {
        titolo: "Bobina o scheda di potenza",
        difficolta: "da tecnico",
        testo:
          "Se una sola zona non riconosce nessuna pentola mentre le altre funzionano con la stessa, il sospetto è la bobina di quella zona o la sua elettronica. La riparazione ha senso solo se il piano non è troppo datato: le schede di potenza dei piani a induzione non sono economiche.",
      },
    ],
    quandoTecnico: [
      "Una sola zona non riconosce pentole che le altre accettano",
      "Il piano mostra un codice di errore che torna sempre",
      "Le zone si spengono da sole dopo pochi secondi",
      "Il rilevamento è intermittente con pentole sicuramente adatte",
    ],
    faq: [
      {
        domanda: "Come riconosco una pentola per induzione senza calamita?",
        risposta:
          "Sul fondo o sulla confezione c'è di solito un simbolo con una spirale o la scritta induction. Ma la calamita resta la prova più affidabile, perché anche pentole dichiarate adatte possono avere un fondo troppo sottile.",
      },
      {
        domanda: "Esistono adattatori per pentole non adatte?",
        risposta:
          "Sì, sono dischi in acciaio ferromagnetico da mettere sotto la pentola. Funzionano ma fanno perdere gran parte dell'efficienza dell'induzione, cioè il motivo principale per cui la si sceglie.",
      },
      {
        domanda: "Il piano ronza con certe pentole: è normale?",
        risposta:
          "Sì. Le pentole con fondo multistrato vibrano leggermente ad alta potenza e producono un ronzio. È un fenomeno noto, non un guasto, e cambia da pentola a pentola.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "tasti-non-rispondono",
    ricerca: "piano cottura tasti non funzionano",
    titolo: "Comandi a sfioramento che non rispondono",
    descrizione:
      "Il piano è acceso ma i tasti ignorano il tocco. Quasi sempre è una delle tre cose che il piano fa apposta, non un guasto.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Tocchi i comandi e non succede nulla, o il piano emette un bip e si spegne. I piani in vetroceramica e a induzione hanno diverse condizioni in cui bloccano volutamente i comandi, ed è quasi sempre una di quelle.",
    sicurezza:
      "Se il piano si blocca mentre una zona è ancora calda, la spia di calore residuo resta accesa: non appoggiare le mani sulla superficie per pulirla finché non si è spenta.",
    controlli: [
      {
        titolo: "C'è acqua o un panno sulla superficie",
        difficolta: "facile",
        testo:
          "È la causa numero uno. I comandi a sfioramento leggono la capacità elettrica del dito: una goccia d'acqua, un panno umido appoggiato o del liquido traboccato vengono interpretati come tocchi continui, e il piano blocca tutto per sicurezza. Asciuga completamente la zona dei comandi con un panno asciutto e riprova.",
      },
      {
        titolo: "È attivo il blocco comandi",
        difficolta: "facile",
        testo:
          "Cerca un simbolo di lucchetto o di chiave sul display. Si attiva con un tasto dedicato tenuto premuto, e capita di premerlo pulendo la superficie. Si toglie allo stesso modo: tieni premuto quel tasto per tre o quattro secondi.",
      },
      {
        titolo: "Il piano si è spento da solo per inattività",
        difficolta: "facile",
        testo:
          "Se accendi il piano e non tocchi nulla entro una decina di secondi, molti modelli si rispengono. Da fuori sembra che i comandi non funzionino, mentre stanno semplicemente aspettando una sequenza: prima il tasto di accensione generale, poi subito la zona.",
      },
      {
        titolo: "Tocchi più tasti insieme",
        difficolta: "facile",
        testo:
          "Le superfici a sfioramento sono piccole e vicine: appoggiare il palmo o toccare due comandi contemporaneamente fa scattare una protezione che li blocca. Usa la punta di un solo dito, senza guanti e senza unghia — il vetro legge il polpastrello, non l'unghia.",
      },
      {
        titolo: "Surriscaldamento dei comandi",
        difficolta: "media",
        testo:
          "Una pentola grande che sporge sopra la zona dei comandi li scalda e fa intervenire una protezione: il piano si blocca finché non si raffredda. Se succede sempre quando usi la pentola grande davanti, hai la spiegazione e anche il rimedio.",
      },
      {
        titolo: "Scheda comandi guasta",
        difficolta: "da tecnico",
        testo:
          "Se la superficie è asciutta, non c'è blocco attivo e i comandi restano inerti anche da freddi, il pezzo è la scheda dei comandi. È un guasto che capita soprattutto dopo infiltrazioni di liquido sotto il vetro, ed è un altro buon motivo per asciugare subito quello che trabocca.",
      },
    ],
    quandoTecnico: [
      "I comandi restano inerti anche con superficie asciutta e piano freddo",
      "Il piano si accende e si spegne da solo",
      "Alcuni tasti funzionano e altri mai",
      "È entrato liquido sotto il vetro",
    ],
    faq: [
      {
        domanda: "Posso usare i comandi con i guanti?",
        risposta:
          "Quasi mai: il sensore legge la conducibilità del dito e un guanto la interrompe. È lo stesso motivo per cui non funzionano con le unghie lunghe o toccando con un cucchiaio.",
      },
      {
        domanda: "Come pulisco senza attivare i comandi?",
        risposta:
          "Spegni il piano e attiva il blocco comandi prima di passare il panno: è esattamente la funzione per cui esiste. Altrimenti finisci per impostare potenze a caso mentre pulisci.",
      },
      {
        domanda: "Il piano fa bip in continuazione: perché?",
        risposta:
          "Di solito è un tocco continuo che non riconosce: liquido sui comandi, oppure una pentola appoggiata sopra. Asciuga e togli tutto dalla zona dei tasti, e il bip si ferma.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "si-spegne-da-solo",
    ricerca: "piano a induzione si spegne da solo",
    titolo: "Piano cottura che si spegne da solo durante la cottura",
    descrizione:
      "Si ferma dopo pochi minuti, o sempre dopo lo stesso tempo. La regolarità con cui succede è l'indizio che distingue le cause.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Stai cucinando e la zona si spegne senza che tu abbia toccato niente. La prima informazione da raccogliere è se succede sempre dopo lo stesso tempo o in momenti casuali: sono due famiglie di cause diverse.",
    sicurezza:
      "Se il piano è a gas e si spegne lasciando uscire gas anche per pochi secondi, non è un fastidio ma un problema di sicurezza: leggi la guida sulla termocoppia e fai controllare la valvola. Se è elettrico e insieme allo spegnimento scatta l'interruttore, non insistere a riarmarlo.",
    controlli: [
      {
        titolo: "Induzione: la ventola di raffreddamento è ostruita",
        difficolta: "facile",
        testo:
          "L'elettronica dei piani a induzione sta sotto il vetro e ha bisogno di aria. Se le feritoie sotto il piano o nel mobile sono ostruite — un cassetto pieno subito sotto, un pannello aggiunto, polvere accumulata — la temperatura sale e una protezione spegne tutto. Il segnale tipico è lo spegnimento sempre dopo lo stesso tempo, a potenza alta.",
      },
      {
        titolo: "Induzione: pentola sbagliata o spostata",
        difficolta: "facile",
        testo:
          "Se la pentola viene rilevata a intermittenza — fondo deformato, diametro al limite, spostata di lato — il piano interrompe l'erogazione. Prova con una pentola sicuramente adatta e ben centrata prima di cercare guasti.",
      },
      {
        titolo: "È attivo un timer di zona",
        difficolta: "facile",
        testo:
          "Quasi tutti i piani elettronici hanno un timer per singola zona, e quasi tutti hanno anche un limite massimo di funzionamento continuo — spesso una o due ore alle potenze basse, meno a quelle alte. Se lo spegnimento arriva sempre allo stesso minuto, guarda lì prima di ogni altra cosa.",
      },
      {
        titolo: "Gas: la termocoppia non tiene",
        difficolta: "media",
        testo:
          "Su un piano a gas lo spegnimento improvviso è quasi sempre la valvola di sicurezza che chiude perché la termocoppia non scalda abbastanza. Succede spesso con la fiamma al minimo o con pentole che traboccano e bagnano il bruciatore.",
      },
      {
        titolo: "Liquido traboccato sui comandi",
        difficolta: "facile",
        testo:
          "Una pentola che borbotta e cola sui comandi a sfioramento li fa impazzire: il piano legge tocchi continui e si spegne per sicurezza. È la causa più comune degli spegnimenti in momenti apparentemente casuali, ed è anche la più facile da riconoscere — succede sempre durante bolliture.",
      },
      {
        titolo: "Scheda di potenza o sonda termica",
        difficolta: "da tecnico",
        testo:
          "Se le feritoie sono libere, la pentola è adatta e nessun timer è attivo, resta l'elettronica: una sonda che legge male fa intervenire la protezione anche a temperature normali. È il caso in cui conviene annotare il tempo esatto e le condizioni prima di chiamare qualcuno.",
      },
    ],
    quandoTecnico: [
      "Si spegne sempre dopo lo stesso tempo anche a bassa potenza",
      "Scatta l'interruttore del quadro insieme allo spegnimento",
      "Mostra un codice di errore che torna sempre",
      "Su un piano a gas si spegne lasciando uscire gas",
    ],
    faq: [
      {
        domanda: "È normale che l'induzione si spenga dopo qualche ora?",
        risposta:
          "Sì. Quasi tutti i piani hanno un limite di funzionamento continuo per sicurezza, pensato per il caso in cui qualcuno dimentichi una zona accesa. Il tempo dipende dalla potenza impostata.",
      },
      {
        domanda: "La ventola sotto il piano si sente sempre?",
        risposta:
          "Nei piani a induzione sì, ed è normale: continua anche qualche minuto dopo lo spegnimento. Se non la senti mai, è proprio quella l'informazione utile.",
      },
      {
        domanda: "Posso mettere un cassetto sotto il piano a induzione?",
        risposta:
          "Solo se il libretto lo prevede e rispettando le distanze indicate. Molti modelli richiedono uno spazio libero o aperture di ventilazione, e riempire quel vano è la causa più comune degli spegnimenti per surriscaldamento.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-scalda-abbastanza",
    ricerca: "piano cottura non scalda abbastanza",
    titolo: "Piano cottura che scalda poco: gas debole o induzione lenta",
    descrizione:
      "L'acqua ci mette il doppio a bollire. Le cause cambiano tra gas, vetroceramica e induzione, e alcune non riguardano affatto il piano.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Il piano funziona ma sembra aver perso forza: la pasta ci mette un'eternità, la padella non arriva mai in temperatura. Prima di dare la colpa all'apparecchio conviene escludere le pentole, che incidono più di quanto si immagini.",
    sicurezza:
      "Su un piano a gas, una fiamma debole accompagnata da colore giallo o da fuliggine è un problema di combustione e va trattato come tale: leggi la guida sulla fiamma gialla, perché lì il rischio non è solo la pasta scotta.",
    controlli: [
      {
        titolo: "La pentola è sbagliata per quel fornello",
        difficolta: "facile",
        testo:
          "Una pentola larga su un fornello piccolo non arriverà mai in temperatura, e sull'induzione una pentola con fondo sottile o deformato trasferisce molto meno calore. È la causa più frequente in assoluto, e la più facile da escludere: prova la stessa cottura con un'altra pentola.",
      },
      {
        titolo: "Gas: i forellini della corona sono parzialmente otturati",
        difficolta: "facile",
        testo:
          "Se la fiamma esce solo da una parte della corona o è più corta del solito, il bruciatore è sporco. Smonta corona e spartifiamma, lasciali a bagno, libera ogni foro con uno spillo e asciuga bene prima di rimontare.",
      },
      {
        titolo: "Gas: la bombola sta finendo o il riduttore è freddo",
        difficolta: "facile",
        testo:
          "Con il GPL la pressione cala quando la bombola è quasi vuota, e d'inverno una bombola all'esterno rende molto meno perché il gas fatica a evaporare. La fiamma diventa corta su tutti i fornelli contemporaneamente: se il calo è simultaneo, guarda la bombola prima del piano.",
      },
      {
        titolo: "Induzione: la potenza è ripartita tra le zone",
        difficolta: "facile",
        testo:
          "Usando più zone insieme il piano divide la potenza disponibile, e alcune scendono automaticamente. Non è un guasto ed è dichiarato nel libretto: due zone che condividono lo stesso generatore non possono essere entrambe al massimo.",
      },
      {
        titolo: "Vetroceramica: il piano lavora a cicli",
        difficolta: "facile",
        testo:
          "Le zone radianti si accendono e spengono a intermittenza per mantenere la potenza media impostata: vedere la spia rossa che va e viene è normale. Diventa un sintomo solo se la zona resta spenta molto più a lungo di quanto sta accesa.",
      },
      {
        titolo: "Ugelli, pressione o elemento riscaldante",
        difficolta: "da tecnico",
        testo:
          "Se tutti i fornelli a gas sono deboli e i bruciatori sono puliti, il problema è la pressione o gli ugelli — verifica da tecnico abilitato. Su un piano elettrico, una zona che scalda molto meno delle altre indica una resistenza in via di cedimento; sull'induzione, la bobina o la sua elettronica.",
      },
    ],
    quandoTecnico: [
      "Tutti i fornelli a gas sono deboli con bruciatori puliti",
      "Una zona elettrica scalda molto meno delle altre",
      "La fiamma è debole e anche gialla",
      "Il calo è comparso all'improvviso su tutto il piano",
    ],
    faq: [
      {
        domanda: "L'induzione è davvero più veloce del gas?",
        risposta:
          "Sì, in modo netto: trasferisce calore direttamente al fondo della pentola invece di scaldare l'aria attorno. Se la tua induzione sembra lenta, quasi sempre è la pentola o la ripartizione di potenza tra zone.",
      },
      {
        domanda: "Perché d'inverno la bombola rende meno?",
        risposta:
          "Il GPL deve evaporare per uscire, e al freddo evapora peggio. Una bombola esposta all'esterno in gennaio può dare metà della resa. Tenerla in un vano riparato — mai in ambienti chiusi sotto il livello del suolo — migliora la situazione.",
      },
      {
        domanda: "Il coperchio fa davvero differenza?",
        risposta:
          "Molta più di quanto sembri, e in modo misurabile: l'acqua bolle in circa la metà del tempo e il consumo scende. Prima di cercare guasti vale la pena escludere che la cottura sia semplicemente scoperta.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-rumore",
    ricerca: "piano a induzione fa rumore",
    titolo: "Piano a induzione che ronza o fischia: è normale?",
    descrizione:
      "Ronzii, ticchettii e il soffio della ventola fanno parte del funzionamento. Ecco quali suoni sono previsti e quale invece merita attenzione.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Chi passa dal gas all'induzione si stupisce dei rumori: un piano che dovrebbe essere silenzioso ronza, fischia e soffia. Quasi tutti quei suoni sono normali e dipendono più dalla pentola che dall'apparecchio.",
    sicurezza:
      "Nessun rischio nei controlli qui sotto. L'unica cosa da non fare è usare il piano se il vetro è crepato, indipendentemente dal rumore: sotto ci sono elettronica e collegamenti, e un liquido che filtra dalla crepa arriva dritto lì.",
    controlli: [
      {
        titolo: "Ronzio con pentole a fondo multistrato: normale",
        difficolta: "facile",
        testo:
          "È il suono più comune e non indica alcun guasto. Il campo magnetico fa vibrare leggermente gli strati di metallo diversi che compongono il fondo, e ad alta potenza si sente. Cambia da pentola a pentola: con una diversa spesso sparisce del tutto.",
      },
      {
        titolo: "Il soffio della ventola: normale",
        difficolta: "facile",
        testo:
          "L'elettronica sotto il vetro va raffreddata, e la ventola gira per tutta la cottura e per qualche minuto dopo lo spegnimento. Se non la senti mai, quella sì è un'informazione: significa che l'elettronica non viene raffreddata, ed è la premessa degli spegnimenti per surriscaldamento.",
      },
      {
        titolo: "Ticchettio alle potenze basse: normale",
        difficolta: "facile",
        testo:
          "A potenza ridotta il piano non eroga in modo continuo ma a impulsi, e il passaggio tra acceso e spento produce un ticchettio regolare. Sparisce alzando la potenza, ed è il modo in cui l'induzione ottiene i livelli bassi.",
      },
      {
        titolo: "Fischio acuto usando due zone insieme: normale",
        difficolta: "facile",
        testo:
          "Due generatori vicini che lavorano a frequenze leggermente diverse producono un battimento, cioè un fischio. Si attenua cambiando la potenza di una delle due zone di un livello: è un fenomeno fisico, non un difetto.",
      },
      {
        titolo: "Rumore ruvido o raschiante dalla ventola",
        difficolta: "media",
        testo:
          "Diverso dal soffio regolare: è un rumore meccanico e continuo, e di solito significa polvere accumulata o un corpo estraneo nelle pale. Le feritoie sotto il piano vanno tenute libere anche per questo.",
      },
      {
        titolo: "Vibrazione forte del piano nel mobile",
        difficolta: "media",
        testo:
          "Se tutto il piano vibra, spesso non è fissato bene nel top: le clip di ancoraggio si allentano e il vetro trasmette il ronzio a tutto il mobile, amplificandolo. È una verifica da fare a piano freddo e spento, controllando i fissaggi sotto.",
      },
    ],
    quandoTecnico: [
      "La ventola non parte mai durante la cottura",
      "Il rumore è metallico e proviene da sotto il vetro",
      "Senti odore di caldo o di bruciato insieme al rumore",
      "Il rumore è comparso insieme a spegnimenti improvvisi",
    ],
    faq: [
      {
        domanda: "Il ronzio danneggia il piano?",
        risposta:
          "No, è la pentola che vibra, non il piano. Se ti dà fastidio, cambiare pentola è l'unico rimedio efficace: quelle con fondo in un solo materiale ferromagnetico ronzano molto meno.",
      },
      {
        domanda: "Quanto deve andare avanti la ventola dopo lo spegnimento?",
        risposta:
          "Da qualche minuto a un quarto d'ora, a seconda di quanto hai cucinato. È normale e serve a proteggere l'elettronica: non ha senso staccare la corrente per farla smettere.",
      },
      {
        domanda: "Un piano a gas che fischia è normale?",
        risposta:
          "No. Un fischio dal bruciatore indica di solito una pressione troppo alta o un ugello non adatto, ed è un caso da far verificare a un tecnico abilitato — non rientra nei rumori fisiologici.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "vetro-crepato",
    ricerca: "vetro piano cottura crepato",
    titolo: "Vetro del piano cottura crepato o scheggiato: si può usare?",
    descrizione:
      "La risposta breve è no, e il motivo non è estetico: sotto quel vetro ci sono l'elettronica e i collegamenti elettrici.",
    elettrodomestico: "piano-cottura",
    aggiornata: "2026-09-05",
    introduzione:
      "Ti è caduto qualcosa, o hai trovato una crepa comparsa da sola dopo una cottura. La domanda che tutti fanno è se si può continuare a usarlo finché regge, e in questo caso la risposta è netta.",
    sicurezza:
      "Un piano in vetroceramica crepato non va usato. Sotto la superficie ci sono resistenze o bobine e i loro collegamenti: un liquido che filtra dalla crepa ci arriva direttamente. E il vetro temperato indebolito può cedere di colpo mentre sopra c'è una pentola di acqua bollente. Togli corrente dal quadro finché non è sostituito.",
    controlli: [
      {
        titolo: "Distingui una crepa da un graffio",
        difficolta: "facile",
        testo:
          "Passa un'unghia perpendicolare al segno: se si impunta, è una crepa passante; se scivola sopra senza incontrare nulla, è un graffio superficiale. I graffi sono antiestetici ma non compromettono la tenuta, e con un piano graffiato si può continuare a cucinare.",
      },
      {
        titolo: "Crepa comparsa senza urti",
        difficolta: "facile",
        testo:
          "Succede per shock termico: una pentola bagnata fredda appoggiata su una zona molto calda, o un liquido freddo traboccato sul vetro rovente. È il motivo per cui non conviene appoggiare pentole gocciolanti su una zona appena spenta.",
      },
      {
        titolo: "Scheggia sul bordo",
        difficolta: "media",
        testo:
          "Le schegge sui bordi sono le più insidiose, perché è lì che il vetro temperato è più sollecitato e da lì partono le rotture. Anche una scheggia piccola sul perimetro va considerata come un piano da sostituire, non come un difetto estetico.",
      },
      {
        titolo: "Non tentare riparazioni",
        difficolta: "facile",
        testo:
          "Resine, siliconi e nastri per vetro non hanno alcun senso qui: devono reggere temperature altissime e sollecitazioni meccaniche continue, e nessun prodotto domestico lo fa. Peggio, sigillare la crepa dà l'illusione che il problema sia risolto.",
      },
      {
        titolo: "Nel frattempo, togli corrente",
        difficolta: "facile",
        testo:
          "Non basta spegnere il piano dai comandi: abbassa l'interruttore dedicato nel quadro. Serve a evitare accensioni accidentali e a mettere in sicurezza la parte sotto il vetro fino alla sostituzione.",
      },
      {
        titolo: "Sostituzione del piano di lavoro",
        difficolta: "da tecnico",
        testo:
          "Su alcuni modelli il vetro si sostituisce come ricambio, su altri fa corpo unico con la struttura e conviene cambiare l'apparecchio. Il preventivo dipende molto dal modello: vale la pena chiederlo prima di decidere, perché la differenza tra le due strade è ampia.",
      },
    ],
    quandoTecnico: [
      "Sempre: un piano crepato va sostituito, non riparato",
      "Se la crepa attraversa una zona di cottura",
      "Se c'è una scheggia sul bordo del vetro",
      "Se è entrato liquido attraverso la crepa",
    ],
    faq: [
      {
        domanda: "Posso usare solo le zone lontane dalla crepa?",
        risposta:
          "Non è una buona idea. Il calore fa dilatare il vetro e la crepa si estende, spesso proprio durante l'uso. E il rischio di infiltrazione di liquidi resta indipendentemente da quale zona accendi.",
      },
      {
        domanda: "Il vetro può esplodere?",
        risposta:
          "Il vetroceramico non esplode come il vetro temperato di una porta, ma può cedere di schianto sotto sollecitazione termica se è già lesionato — con una pentola pesante e piena sopra, le conseguenze non sono banali.",
      },
      {
        domanda: "Come evito che succeda di nuovo?",
        risposta:
          "Non appoggiare pentole bagnate su zone calde, non far cadere oggetti pesanti — i barattoli di vetro sono i responsabili più frequenti — e non usare il piano spento come piano d'appoggio per la spesa.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-raffredda",
    ricerca: "condizionatore non raffredda",
    titolo: "Condizionatore che non raffredda: cosa controllare",
    descrizione:
      "Soffia aria ma la stanza non si rinfresca. Prima di pensare al gas ci sono tre cause molto più frequenti, e la prima si risolve in dieci minuti.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "L'apparecchio è acceso, la ventola gira, ma l'aria che esce è appena fresca e la stanza resta calda. Nella grande maggioranza dei casi non manca il gas: manca il passaggio dell'aria, ed è una cosa che puoi sistemare tu.",
    sicurezza:
      "Puoi pulire i filtri e controllare le impostazioni senza rischi, staccando l'alimentazione dall'interruttore dedicato. Non toccare mai il circuito del gas refrigerante: nei modelli recenti è R32 o R290, infiammabili, e per legge la manipolazione richiede il patentino F-Gas. E non sporgerti dalla finestra per raggiungere l'unità esterna.",
    controlli: [
      {
        titolo: "I filtri sono intasati",
        difficolta: "facile",
        testo:
          "È la causa numero uno, senza rivali. Apri lo sportello dell'unità interna: i due filtri a rete si sfilano tirandoli verso l'alto e poi verso di te. Se sono coperti da un feltro grigio, l'aria non passa e il raffreddamento crolla. Lavali sotto l'acqua tiepida, asciugali completamente all'ombra e rimettili. In stagione vanno puliti ogni due o tre settimane.",
      },
      {
        titolo: "La modalità o la temperatura sono sbagliate",
        difficolta: "facile",
        testo:
          "Sul telecomando controlla di essere in modalità raffreddamento — il fiocco di neve — e non in ventilazione o deumidificazione, che raffreddano poco o nulla. E imposta una temperatura sotto quella della stanza: se la stanza è a 27 e il telecomando dice 26, l'apparecchio lavora pochissimo. Un valore sensato è 24 o 25 gradi.",
      },
      {
        titolo: "L'unità esterna è ostruita o al sole",
        difficolta: "facile",
        testo:
          "L'unità esterna deve smaltire il calore che toglie dalla stanza: se è coperta di foglie, chiusa in un cassonetto senza aria, o addossata a una parete, non ci riesce. Guarda che la griglia sia libera e che davanti al flusso d'aria non ci siano ostacoli entro mezzo metro.",
      },
      {
        titolo: "Le finestre o le tapparelle",
        difficolta: "facile",
        testo:
          "Sembra ovvio, ma un condizionatore dimensionato per una stanza non ce la fa con il sole diretto sui vetri per tutto il pomeriggio. Se il problema si presenta solo nelle ore calde e su un lato della casa, la causa può essere semplicemente il carico termico — non l'apparecchio.",
      },
      {
        titolo: "La batteria dell'unità interna è sporca",
        difficolta: "media",
        testo:
          "Dietro i filtri c'è uno scambiatore a lamelle fitte. Anche con i filtri puliti, dopo anni si riempie di polvere compattata e di muffa: l'aria passa a fatica e il rendimento cala. Esistono spray specifici, ma una pulizia fatta bene richiede lo smontaggio della carenatura ed è un lavoro da tecnico.",
      },
      {
        titolo: "Manca gas nel circuito",
        difficolta: "da tecnico",
        testo:
          "È l'ultima ipotesi, non la prima. Il segnale che la rende probabile è il ghiaccio sui tubi o sulla batteria interna, insieme a un raffreddamento debole. Attenzione: se manca gas c'è una perdita, e limitarsi a ricaricare significa ritrovarsi nella stessa situazione l'estate dopo. La ricarica richiede per legge un tecnico certificato F-Gas.",
      },
    ],
    quandoTecnico: [
      "Vedi ghiaccio sui tubi o sulla batteria interna",
      "Hai pulito i filtri e non è cambiato nulla",
      "L'unità esterna non parte mai",
      "L'apparecchio è del 2015 o precedente e usa gas R22",
    ],
    faq: [
      {
        domanda: "Ogni quanto va ricaricato il gas?",
        risposta:
          "Mai, in un impianto sano. Il circuito è sigillato: se il gas cala, c'è una perdita. Chi propone ricariche periodiche come manutenzione ordinaria sta trattando il sintomo invece della causa.",
      },
      {
        domanda: "Abbassare la temperatura a 18 raffredda più in fretta?",
        risposta:
          "No, e consuma di più. L'apparecchio lavora già al massimo finché non raggiunge il valore impostato: mettere 18 non accelera nulla, allunga solo il tempo in cui resta al massimo.",
      },
      {
        domanda: "Il mio condizionatore ha vent'anni, conviene ripararlo?",
        risposta:
          "Se usa gas R22, non è nemmeno una scelta: quel refrigerante è vietato dal 2015 e non è più reperibile per le ricariche. In pratica una perdita su un impianto R22 significa sostituzione.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "perde-acqua",
    ricerca: "condizionatore perde acqua",
    titolo: "Condizionatore che gocciola in casa: da cosa dipende",
    descrizione:
      "Acqua che cola dallo split sul muro o sul pavimento. Nella maggior parte dei casi è un tubicino otturato, non un guasto serio.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Un condizionatore produce acqua per mestiere: raffreddando toglie umidità dall'aria, e quella deve andarsene attraverso un tubo di scarico. Se comincia a gocciolare in casa, quasi sempre quel percorso si è bloccato.",
    sicurezza:
      "Stacca l'alimentazione dall'interruttore dedicato prima di aprire l'unità interna. Non salire su sedie instabili per raggiungere uno split montato in alto, e non sporgerti dalla finestra per seguire il tubo all'esterno: sono i due modi in cui questa riparazione banale diventa un incidente.",
    controlli: [
      {
        titolo: "Il tubo di scarico è otturato",
        difficolta: "facile",
        testo:
          "È la causa nella grande maggioranza dei casi. Nel tubicino della condensa si formano alghe e melma che lo chiudono: l'acqua non defluisce, la vaschetta si riempie e trabocca in casa. All'esterno, dove il tubo esce, prova a soffiare o aspirare delicatamente; molti usano una siringa senza ago con acqua e un cucchiaino di aceto per sciogliere il tappo.",
      },
      {
        titolo: "I filtri sono sporchi",
        difficolta: "facile",
        testo:
          "Con i filtri intasati la batteria si raffredda troppo e si forma ghiaccio: quando si scioglie, l'acqua arriva tutta insieme e supera la capacità della vaschetta. Il sintomo tipico è il gocciolamento che comincia dopo qualche ora di funzionamento continuo, non subito.",
      },
      {
        titolo: "Lo split non è in bolla",
        difficolta: "media",
        testo:
          "L'unità interna deve essere leggermente inclinata verso il lato dello scarico. Se è stata montata storta, o se la staffa ha ceduto negli anni, l'acqua si accumula dalla parte sbagliata e esce dal bordo. Si vede con una livella appoggiata sopra la carenatura.",
      },
      {
        titolo: "Il tubo ha una risalita o una piega",
        difficolta: "media",
        testo:
          "Lo scarico funziona per gravità: deve scendere sempre, senza tratti in salita né avvallamenti dove l'acqua ristagna. Capita dopo lavori di ristrutturazione, o quando il tubo viene spostato per far posto a qualcos'altro. Se il problema è comparso dopo un intervento in casa, guarda lì.",
      },
      {
        titolo: "Gocciola dall'unità esterna",
        difficolta: "facile",
        testo:
          "In raffreddamento è normale che l'esterna sia asciutta e l'interna scarichi. In riscaldamento è il contrario: l'unità esterna produce molta acqua e durante i cicli di sbrinamento ne butta fuori parecchia, a volte con del vapore. Non è un guasto, ed è il motivo per cui in inverno si vede quella pozza sotto il condensatore.",
      },
      {
        titolo: "Perdita di gas o vaschetta crepata",
        difficolta: "da tecnico",
        testo:
          "Se lo scarico è libero, i filtri puliti e l'unità in bolla, restano la vaschetta di raccolta incrinata o il ghiaccio dovuto a gas insufficiente. In quest'ultimo caso il gocciolamento arriva insieme a un raffreddamento scarso: sono due sintomi della stessa causa.",
      },
    ],
    quandoTecnico: [
      "Lo scarico è libero ma l'acqua continua a uscire",
      "Vedi ghiaccio sulla batteria interna",
      "L'acqua esce dal corpo dell'unità e non dal bordo inferiore",
      "Il muro sotto lo split è macchiato o umido da tempo",
    ],
    faq: [
      {
        domanda: "Quanta acqua è normale che produca?",
        risposta:
          "In una giornata umida anche diversi litri, tutti dal tubo di scarico esterno. Vedere acqua che esce da lì è il segno che tutto funziona: il problema è quando non ne esce e la trovi in casa.",
      },
      {
        domanda: "Posso mettere una bacinella sotto nel frattempo?",
        risposta:
          "Come rimedio per un giorno sì, ma l'acqua che ristagna nella vaschetta interna diventa maleodorante in fretta e finisce nell'aria che respiri. Non è una soluzione da tenere per settimane.",
      },
      {
        domanda: "Il tubo si può pulire con la candeggina?",
        risposta:
          "Meglio aceto diluito o prodotti specifici: la candeggina in un tubo di plastica sottile può danneggiarlo e lascia odore. Alcuni tecnici usano pastiglie apposite da mettere nella vaschetta a inizio stagione.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "puzza",
    ricerca: "condizionatore puzza",
    titolo: "Condizionatore che puzza di muffa o di chiuso",
    descrizione:
      "L'odore che esce dallo split non è un difetto estetico: viene da quello che respiri. Ed è tra i problemi più facili da prevenire.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Accendi il condizionatore e per i primi minuti esce un odore di chiuso, di calzino bagnato o di muffa. Non è l'aria della stanza: è quello che c'è dentro l'apparecchio, e il rimedio più efficace è anche il più semplice.",
    sicurezza:
      "Stacca l'alimentazione dall'interruttore dedicato prima di aprire l'unità e di toccare la batteria a lamelle: sono taglienti, e i prodotti spray non vanno mai spruzzati sulla scheda elettronica, che di solito sta sul lato destro dietro un coperchio.",
    controlli: [
      {
        titolo: "I filtri non vengono lavati da tempo",
        difficolta: "facile",
        testo:
          "Primo posto senza gara. La polvere trattenuta dai filtri si inumidisce e diventa terreno di coltura per muffe e batteri. Sfila i due filtri, lavali con acqua tiepida e un po' di sapone, asciugali completamente all'ombra — mai al sole, che li deforma — e rimettili. In stagione, ogni due o tre settimane.",
      },
      {
        titolo: "La batteria interna è umida e sporca",
        difficolta: "media",
        testo:
          "Dietro i filtri, lo scambiatore a lamelle resta bagnato dopo ogni utilizzo: è lì che si forma la patina biologica responsabile dell'odore. Esistono spray igienizzanti specifici da spruzzare a apparecchio spento seguendo le istruzioni. Se la muffa è visibile e nera, serve una pulizia professionale con smontaggio.",
      },
      {
        titolo: "L'acqua ristagna nella vaschetta",
        difficolta: "media",
        testo:
          "Se il tubo di scarico è parzialmente otturato, l'acqua resta ferma nella vaschetta di raccolta e marcisce. È la causa degli odori più forti e sgradevoli, quelli che ricordano la fogna più della muffa. Pulire lo scarico risolve due problemi insieme, perché è lo stesso che provoca il gocciolamento.",
      },
      {
        titolo: "Non usi la funzione di asciugatura prima di spegnere",
        difficolta: "facile",
        testo:
          "Questa è la prevenzione che cambia tutto, e quasi nessuno la conosce. Prima di spegnere, fai andare l'apparecchio in sola ventilazione per dieci o quindici minuti: asciuga la batteria e toglie l'umidità su cui cresce la muffa. Molti telecomandi hanno un tasto apposta, spesso chiamato clean, dry o self-clean.",
      },
      {
        titolo: "Odore alla prima accensione stagionale",
        difficolta: "facile",
        testo:
          "Dopo mesi di inattività l'odore al primo avvio è quasi la regola, e viene dall'umidità rimasta dentro tutto l'inverno. Pulizia dei filtri e un paio d'ore di funzionamento con le finestre aperte di solito lo eliminano. Se resta anche dopo, la batteria va igienizzata.",
      },
      {
        titolo: "Odore di bruciato o di plastica",
        difficolta: "da tecnico",
        testo:
          "Diverso da tutto il resto e da non ignorare: se l'odore è di bruciato, di plastica calda o di elettrico, spegni e togli l'alimentazione. Non è muffa, è qualcosa che si sta surriscaldando, ed è l'unico caso di questa guida in cui non c'è niente da provare da soli.",
      },
    ],
    quandoTecnico: [
      "Odore di bruciato o di plastica calda: subito",
      "Vedi muffa nera sulle lamelle o sul deflettore",
      "L'odore resta dopo pulizia dei filtri e igienizzazione",
      "Chi vive in casa ha sintomi respiratori quando è acceso",
    ],
    faq: [
      {
        domanda: "Gli spray igienizzanti funzionano davvero?",
        risposta:
          "Sui casi leggeri sì, e vanno usati a inizio stagione. Non sostituiscono la pulizia meccanica quando la muffa è visibile: in quel caso coprono l'odore per qualche settimana e poi torna.",
      },
      {
        domanda: "Ogni quanto serve una pulizia professionale?",
        risposta:
          "Una sanificazione della batteria ogni uno o due anni è ragionevole per un apparecchio usato tutte le estati, di più se in casa ci sono allergie o animali. Non è la stessa cosa del controllo del gas.",
      },
      {
        domanda: "L'odore può fare male?",
        risposta:
          "L'odore in sé no, ma indica presenza di muffe e batteri nell'aria che circola nella stanza. Per chi ha asma o allergie non è un dettaglio, ed è il motivo principale per cui i filtri andrebbero puliti sul serio.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-si-accende",
    ricerca: "condizionatore non si accende",
    titolo: "Condizionatore che non si accende: le verifiche in ordine",
    descrizione:
      "Nessuna spia, nessun bip. Prima di chiamare qualcuno vale la pena escludere le tre cose che spiegano quasi tutti i casi.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Punti il telecomando, premi, e non succede niente. La prima cosa da capire è se il problema è nell'apparecchio o nel telecomando, perché la seconda ipotesi è molto più frequente della prima e costa due pile.",
    sicurezza:
      "Puoi controllare il quadro elettrico e il telecomando senza rischi. Non aprire l'unità interna né l'esterna: contengono componenti che restano in tensione, e l'esterna ha anche parti in movimento e il circuito del gas.",
    controlli: [
      {
        titolo: "Le pile del telecomando",
        difficolta: "facile",
        testo:
          "La causa più frequente, e la più banale. Le pile si scaricano lentamente: il display si accende ancora ma la trasmissione a infrarossi non ha più potenza sufficiente. Cambiale entrambe, non una sola, e verifica che siano nel verso giusto. Prima di ogni altra verifica: costa due euro.",
      },
      {
        titolo: "L'interruttore dedicato è abbassato",
        difficolta: "facile",
        testo:
          "I condizionatori hanno quasi sempre una linea propria nel quadro elettrico, e un interruttore abbassato lì non toglie corrente a nient'altro: tutto il resto della casa funziona e nessuno se ne accorge. Guarda tutte le levette, non solo quella che di solito scatta.",
      },
      {
        titolo: "C'è un sezionatore vicino all'unità esterna",
        difficolta: "facile",
        testo:
          "Molti impianti hanno un piccolo interruttore dedicato vicino all'unità esterna o sul balcone, spesso dentro una scatola stagna. Viene spento a fine estate e dimenticato fino all'estate dopo. È la causa classica del condizionatore che non riparte a giugno.",
      },
      {
        titolo: "Il timer o una programmazione attiva",
        difficolta: "facile",
        testo:
          "Se sul telecomando o sul display dell'unità c'è un simbolo di orologio, l'apparecchio sta aspettando un orario impostato. Capita di attivare il timer per sbaglio premendo un tasto vicino. Annulla la programmazione e riprova.",
      },
      {
        titolo: "Prova con l'accensione manuale",
        difficolta: "media",
        testo:
          "Quasi tutti gli split hanno un pulsantino nascosto sotto lo sportello dei filtri, a volte marcato auto o manual: premendolo l'apparecchio parte senza telecomando. È la prova che distingue definitivamente i due casi — se così si accende, il problema è il telecomando e non il condizionatore.",
      },
      {
        titolo: "Scheda elettronica o alimentazione",
        difficolta: "da tecnico",
        testo:
          "Se l'interruttore è alzato, l'accensione manuale non funziona e l'unità resta completamente muta, il problema è nell'alimentazione o nella scheda. Su alcuni modelli c'è un fusibile interno, ma sta dietro la carenatura in una zona con collegamenti in tensione.",
      },
    ],
    quandoTecnico: [
      "L'accensione manuale non funziona e la corrente arriva",
      "L'interruttore scatta ogni volta che accendi",
      "Senti odore di bruciato dall'unità interna o esterna",
      "L'unità interna si accende ma l'esterna resta sempre ferma",
    ],
    faq: [
      {
        domanda: "Dov'è il pulsante di accensione manuale?",
        risposta:
          "Sotto lo sportello che copre i filtri, di solito sul lato destro dell'unità interna: è piccolo, spesso incassato, e a volte serve una penna per premerlo. Il libretto lo indica come funzionamento di emergenza.",
      },
      {
        domanda: "Il condizionatore va spento dal quadro d'inverno?",
        risposta:
          "Non è obbligatorio e molti costruttori preferiscono di no, perché alcune unità mantengono attiva una resistenza anticondensa nel compressore. Se lo spegni, ricordati di ridare corrente qualche ora prima di riaccenderlo in primavera.",
      },
      {
        domanda: "Come faccio a sapere se il telecomando trasmette?",
        risposta:
          "Con la fotocamera del telefono: inquadra il led del telecomando e premi un tasto. Se il led si illumina sullo schermo — di solito viola — la trasmissione c'è. È un trucco che funziona sulla maggior parte dei telefoni.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "telecomando-non-funziona",
    ricerca: "telecomando condizionatore non funziona",
    titolo: "Telecomando del condizionatore che non funziona",
    descrizione:
      "C'è un modo per sapere in trenta secondi se il telecomando trasmette davvero, usando la fotocamera del telefono.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Il telecomando è la parte più fragile di un impianto di climatizzazione e anche quella che si guasta più spesso. La buona notizia è che si verifica con certezza, senza smontare nulla e senza attrezzi.",
    sicurezza:
      "Nessun rischio in queste verifiche. Se apri il telecomando per pulirlo, fallo con calma: i contatti in gomma e le piste stampate si danneggiano con poco.",
    controlli: [
      {
        titolo: "La prova della fotocamera",
        difficolta: "facile",
        testo:
          "È la verifica definitiva. Apri la fotocamera del telefono, inquadra la punta del telecomando e premi un tasto qualsiasi: se il led a infrarossi si illumina sullo schermo, di solito con una luce viola o bianca, il telecomando trasmette. Se non si illumina, il problema è lì — e hai risparmiato una chiamata.",
      },
      {
        titolo: "Le pile sono scariche o messe male",
        difficolta: "facile",
        testo:
          "Il display può accendersi ancora anche con pile troppo deboli per trasmettere: è la situazione che confonde di più. Sostituiscile entrambe con pile nuove della stessa marca, controlla il verso e guarda se i contatti nel vano sono ossidati — in quel caso puliscili con una gomma da matita.",
      },
      {
        titolo: "Il sensore dell'unità è coperto o al sole",
        difficolta: "facile",
        testo:
          "Il ricevitore a infrarossi sta sull'unità interna, dietro una finestrella scura. Se è coperto di polvere, o se il sole ci batte direttamente, il segnale non viene letto. Pulisci la zona con un panno e prova avvicinandoti a un metro puntando bene.",
      },
      {
        titolo: "Sei troppo lontano o fuori angolo",
        difficolta: "facile",
        testo:
          "Gli infrarossi hanno una portata limitata, in genere sette o otto metri, e vanno puntati con una certa precisione. Se lo split è in alto e tu sei sotto di lato, il segnale può non arrivare. Avvicinati e punta direttamente il ricevitore prima di concludere.",
      },
      {
        titolo: "Il telecomando è bloccato o in modalità sbagliata",
        difficolta: "facile",
        testo:
          "Molti hanno un blocco tasti — un lucchetto sul display — o un piccolo interruttore fisico per scegliere il tipo di apparecchio. Un reset con l'apposito forellino, premuto con una graffetta, riporta tutto alle impostazioni di fabbrica e risolve i comportamenti strani.",
      },
      {
        titolo: "Ricevitore dell'unità guasto",
        difficolta: "da tecnico",
        testo:
          "Se il led del telecomando si illumina alla prova della fotocamera ma l'apparecchio non risponde nemmeno da vicino, e l'accensione manuale invece funziona, il problema è il ricevitore nell'unità interna. È un pezzo economico, ma sta dietro la carenatura.",
      },
    ],
    quandoTecnico: [
      "Il telecomando trasmette ma l'unità non risponde da vicino",
      "L'accensione manuale funziona e il telecomando no, con pile nuove",
      "L'apparecchio risponde a intermittenza senza motivo",
      "Il ricevitore è visibilmente danneggiato",
    ],
    faq: [
      {
        domanda: "Posso comprare un telecomando universale?",
        risposta:
          "Sì, e per i condizionatori funzionano meglio che per altri apparecchi: quelli specifici contengono i codici delle marche principali. Verifica solo che il modello sia supportato prima di acquistare.",
      },
      {
        domanda: "Posso usare il telefono al posto del telecomando?",
        risposta:
          "Solo se il telefono ha un emettitore a infrarossi, cosa ormai rara, oppure se il condizionatore ha il wi-fi o un modulo aggiuntivo. Le app da sole, senza hardware compatibile, non bastano.",
      },
      {
        domanda: "Il display del telecomando è sbiadito: è un problema?",
        risposta:
          "Di solito è il primo segnale di pile in esaurimento. Se persiste con pile nuove, il display a cristalli liquidi si sta degradando: l'apparecchio può ancora funzionare, ma diventa difficile leggere cosa stai impostando.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "fa-rumore",
    ricerca: "condizionatore fa rumore",
    titolo: "Condizionatore rumoroso: interna o esterna?",
    descrizione:
      "Gorgoglii, ticchettii e scrosci fanno parte del funzionamento. Il rumore che merita attenzione viene quasi sempre da fuori.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Prima di cercare il guasto stabilisci da dove viene il rumore: dall'unità interna in casa o da quella esterna. Sono due macchine diverse, e i rumori che producono hanno cause completamente diverse.",
    sicurezza:
      "Non aprire l'unità esterna e non sporgerti dalla finestra per guardarci dentro: contiene una ventola grande, un compressore e il circuito del gas in pressione. Se il rumore viene da lì, la diagnosi si fa guardando e ascoltando da posizione sicura.",
    controlli: [
      {
        titolo: "Gorgoglii e scrosci dall'unità interna: normali",
        difficolta: "facile",
        testo:
          "Sono il refrigerante che circola nei tubi e la condensa che scorre nella vaschetta. Si sentono soprattutto all'accensione e allo spegnimento, e ricordano l'acqua in un tubo. Non indicano alcun guasto.",
      },
      {
        titolo: "Ticchettii della plastica: normali",
        difficolta: "facile",
        testo:
          "La carenatura si dilata e si contrae con gli sbalzi di temperatura, e produce schiocchi secchi anche a distanza di minuti. Sono più evidenti di notte, quando la casa è silenziosa, e non hanno alcun significato.",
      },
      {
        titolo: "Fruscio irregolare dall'unità interna",
        difficolta: "media",
        testo:
          "Se il soffio è ruvido o intermittente, spesso è la ventola a rullo che ha accumulato polvere sulle palette, oppure i filtri intasati che creano turbolenza. La pulizia dei filtri è il primo passo; se il fruscio resta, la ventola va pulita a fondo.",
      },
      {
        titolo: "Vibrazione dell'unità esterna",
        difficolta: "media",
        testo:
          "Se il ronzio diventa un rimbombo che si sente in tutta la casa, spesso sono i supporti antivibranti dell'unità esterna che si sono induriti o le staffe allentate. È anche il motivo per cui i vicini si lamentano: la vibrazione si trasmette alla parete.",
      },
      {
        titolo: "Sferragliare dall'unità esterna",
        difficolta: "media",
        testo:
          "Un rumore metallico irregolare da fuori indica di solito qualcosa che tocca la ventola: foglie, un pezzo di griglia allentato, un nido. Va guardato — ma da posizione sicura, e con l'apparecchio spento dall'interruttore, non affacciandosi nel vuoto.",
      },
      {
        titolo: "Ronzio forte all'avvio del compressore",
        difficolta: "da tecnico",
        testo:
          "Se all'accensione l'unità esterna emette un ronzio sordo e la ventola non parte, il sospetto è il condensatore di avviamento: un pezzo economico che si guasta con il caldo. Se invece il rumore è metallico e crescente, è il compressore in sofferenza, ed è tutta un'altra storia in termini di costi.",
      },
    ],
    quandoTecnico: [
      "L'unità esterna ronza ma la ventola non parte",
      "Rumore metallico crescente dal compressore",
      "Sferragliare continuo dall'unità esterna",
      "Il rumore è comparso insieme a un calo del raffreddamento",
    ],
    faq: [
      {
        domanda: "Quanto rumore fa un condizionatore normale?",
        risposta:
          "L'unità interna sta tra i 20 e i 45 decibel a seconda della velocità della ventola; l'esterna tra i 45 e i 55. I modelli con inverter sono sensibilmente più silenziosi, soprattutto quando lavorano a regime ridotto.",
      },
      {
        domanda: "I vicini si lamentano dell'unità esterna: cosa posso fare?",
        risposta:
          "Verificare i supporti antivibranti e il fissaggio alla parete risolve buona parte dei casi, perché il problema è quasi sempre la vibrazione trasmessa alla struttura più che il rumore in aria.",
      },
      {
        domanda: "È normale che l'esterna parta e si fermi in continuazione?",
        risposta:
          "Nei modelli non inverter sì, funzionano a cicli. In quelli inverter no: dovrebbero modulare invece di accendersi e spegnersi, e partenze frequenti indicano che qualcosa non va.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ghiaccio-sui-tubi",
    ricerca: "condizionatore fa ghiaccio sui tubi",
    titolo: "Ghiaccio sui tubi del condizionatore: due cause possibili",
    descrizione:
      "Brina bianca sui tubi o sulla batteria interna. Le cause sono sostanzialmente due, e una la risolvi tu in dieci minuti.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Vedi brina o ghiaccio vero sui tubi di rame che escono dall'unità, o sulle lamelle dietro i filtri. È un sintomo che non va ignorato: l'apparecchio in quelle condizioni raffredda male e il compressore lavora in sofferenza.",
    sicurezza:
      "Spegni l'apparecchio e lascialo sbrinare naturalmente prima di qualsiasi verifica: continuare a farlo funzionare col ghiaccio può danneggiare il compressore, che è il pezzo più costoso dell'impianto. Non staccare mai il ghiaccio con oggetti appuntiti — sotto ci sono lamelle sottili e tubi in pressione.",
    controlli: [
      {
        titolo: "I filtri sono intasati",
        difficolta: "facile",
        testo:
          "È la prima causa e la più comune. Con poco flusso d'aria la batteria si raffredda oltre misura e l'umidità che vi si condensa congela invece di scorrere via. Spegni, lascia sciogliere il ghiaccio del tutto — possono volerci un paio d'ore — poi lava i filtri, asciugali bene e riprova. Nella maggior parte dei casi finisce qui.",
      },
      {
        titolo: "La ventola interna gira piano o è sporca",
        difficolta: "media",
        testo:
          "Stesso effetto dei filtri sporchi: se il rullo della ventola è coperto di polvere compattata, l'aria mossa è molto meno di quella prevista. Lo si sospetta quando il flusso in uscita è debole anche con filtri appena puliti.",
      },
      {
        titolo: "La temperatura impostata è troppo bassa",
        difficolta: "facile",
        testo:
          "Far lavorare l'apparecchio a 16 o 17 gradi per ore, magari di notte quando fuori si è già rinfrescato, favorisce la formazione di ghiaccio. È un caso in cui la macchina non ha nulla che non va: sta solo lavorando in condizioni per cui non è pensata.",
      },
      {
        titolo: "Le finestre aperte o l'ambiente troppo umido",
        difficolta: "facile",
        testo:
          "Con molta umidità in ingresso la condensa aumenta e supera la capacità di smaltimento. Se ti capita solo nelle giornate afose e con le finestre socchiuse, la causa è quella e non l'impianto.",
      },
      {
        titolo: "L'unità esterna è ostruita",
        difficolta: "facile",
        testo:
          "Una batteria esterna coperta di foglie, pioppo o polvere non smaltisce il calore, e le pressioni del circuito si sbilanciano fino a far ghiacciare la parte interna. Controlla che la griglia sia libera e che nulla ostacoli il flusso d'aria.",
      },
      {
        titolo: "Manca gas nel circuito",
        difficolta: "da tecnico",
        testo:
          "È la seconda causa classica del ghiaccio, e si distingue dalla prima per un dettaglio: se dopo la pulizia dei filtri il ghiaccio torna, quasi certamente il refrigerante è insufficiente. Ricordati che una carica che cala significa una perdita da trovare, non solo da rabboccare, e che serve un tecnico certificato F-Gas.",
      },
    ],
    quandoTecnico: [
      "Il ghiaccio torna dopo aver pulito i filtri",
      "Vedi ghiaccio anche sui tubi dell'unità esterna",
      "Il raffreddamento è debole insieme al ghiaccio",
      "L'impianto ha perso gas altre volte in passato",
    ],
    faq: [
      {
        domanda: "Posso usarlo mentre c'è ghiaccio?",
        risposta:
          "No. Il ghiaccio impedisce lo scambio termico e può far arrivare liquido al compressore, che è progettato per comprimere gas: è così che una riparazione da poche decine di euro diventa la sostituzione dell'impianto.",
      },
      {
        domanda: "Quanto ci mette a sbrinare?",
        risposta:
          "Da una a tre ore a apparecchio spento. Si può accelerare mettendolo in sola ventilazione, senza raffreddamento: l'aria della stanza scioglie il ghiaccio più in fretta senza scaldare nulla.",
      },
      {
        domanda: "Il ghiaccio sull'unità esterna d'inverno è normale?",
        risposta:
          "In riscaldamento sì: l'unità esterna si copre di brina e periodicamente esegue un ciclo di sbrinamento, durante il quale si ferma e produce vapore. È previsto e non è un guasto.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "spie-lampeggiano",
    ricerca: "condizionatore spie lampeggiano",
    titolo: "Spie del condizionatore che lampeggiano: come leggerle",
    descrizione:
      "Gli split non hanno un display con i codici: comunicano contando i lampeggi. Ecco come raccogliere l'informazione che serve.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "L'apparecchio si è fermato e una spia lampeggia con un ritmo strano. A differenza di lavatrici e forni, la maggior parte degli split non mostra un codice scritto: dice quale problema ha contando i lampeggi. Saperlo leggere è metà del lavoro.",
    sicurezza:
      "Non resettare ripetutamente togliendo corrente per far sparire la segnalazione: l'apparecchio si è fermato per una ragione, e continuare a riavviarlo mentre il problema è presente può danneggiare il compressore.",
    controlli: [
      {
        titolo: "Conta i lampeggi e il ritmo",
        difficolta: "facile",
        testo:
          "È l'informazione più preziosa che puoi raccogliere, e costa solo attenzione. Guarda la sequenza: quanti lampeggi, quale spia — timer, funzionamento, sbrinamento — e quanto dura la pausa tra un gruppo e il successivo. Annota tutto. Con quel dato, il libretto o un tecnico arrivano alla causa in pochi minuti; senza, si procede per tentativi.",
      },
      {
        titolo: "Cerca la tabella nel libretto",
        difficolta: "facile",
        testo:
          "Quasi tutti i manuali hanno una tabella che associa il numero di lampeggi a una famiglia di guasti: sonda, comunicazione tra unità, protezione del compressore, mancanza di gas. Se hai perso il libretto, si trova sul sito del costruttore cercando il modello, che è scritto su un'etichetta sul fianco dell'unità interna.",
      },
      {
        titolo: "Prova il riavvio completo, una volta sola",
        difficolta: "facile",
        testo:
          "Togli corrente dall'interruttore dedicato, aspetta cinque minuti, ridai corrente. Alcuni blocchi sono temporanei e si azzerano così. Se la segnalazione torna subito o dopo poco, hai la conferma che il problema è reale e non un intoppo momentaneo.",
      },
      {
        titolo: "Guarda cosa stava succedendo",
        difficolta: "facile",
        testo:
          "Il contesto vale quanto il codice: si è fermato nelle ore più calde, o di notte? In raffreddamento o in riscaldamento? Dopo quanto tempo dall'accensione? Un blocco che arriva sempre dopo venti minuti a pieno carico dice cose diverse da uno casuale.",
      },
      {
        titolo: "Escludi le cause banali prima di chiamare",
        difficolta: "facile",
        testo:
          "Molti codici segnalano protezioni che scattano per cause semplici: filtri intasati, unità esterna ostruita, temperature estreme. Pulire i filtri e liberare l'esterna prima di chiamare qualcuno risolve una parte dei blocchi e, se non li risolve, elimina comunque due ipotesi.",
      },
      {
        titolo: "Sonde, comunicazione o compressore",
        difficolta: "da tecnico",
        testo:
          "I codici più frequenti riguardano una sonda di temperatura guasta — pezzo economico — o la comunicazione tra unità interna ed esterna, spesso un problema di cablaggio. Quelli sul compressore o sulla pressione del gas sono i più seri. Presentarsi con la sequenza dei lampeggi annotata accorcia la diagnosi e quindi il conto.",
      },
    ],
    quandoTecnico: [
      "La segnalazione torna dopo il riavvio",
      "L'apparecchio si blocca sempre dopo lo stesso tempo",
      "Il codice riguarda il compressore o le pressioni",
      "Insieme al blocco c'è ghiaccio o un calo di rendimento",
    ],
    faq: [
      {
        domanda: "Posso continuare a usarlo ignorando la spia?",
        risposta:
          "Dipende dal codice, ma in generale no: molte segnalazioni corrispondono a protezioni che si sono attivate per evitare danni. Aggirarle riavviando in continuazione è il modo tipico di trasformare un guasto piccolo in uno grande.",
      },
      {
        domanda: "Dove trovo il modello del mio condizionatore?",
        risposta:
          "Su un'etichetta adesiva sul fianco destro o sotto lo sportello dei filtri dell'unità interna, e su una targhetta metallica sull'unità esterna. Fotografale: servono ogni volta che cerchi ricambi o manuali.",
      },
      {
        domanda: "Perché non c'è un display con il codice?",
        risposta:
          "Per contenere i costi e mantenere l'unità interna sottile e silenziosa. I modelli più recenti stanno introducendo display o segnalazioni via app, ma la maggior parte degli split installati comunica ancora con i lampeggi.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "non-scalda",
    ricerca: "condizionatore non scalda in inverno",
    titolo: "Condizionatore che non scalda: come funziona la pompa di calore",
    descrizione:
      "In riscaldamento un climatizzatore si comporta in modi che sembrano guasti e non lo sono — a partire dalle pause improvvise.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "Metti la modalità riscaldamento e l'aria esce fredda, oppure l'apparecchio si ferma ogni tanto senza motivo. Nella maggior parte dei casi non è rotto: sta facendo cose che in raffreddamento non fa, e che è utile conoscere prima di allarmarsi.",
    sicurezza:
      "Le verifiche qui sotto sono innocue. Come sempre, il circuito del gas non si tocca: se il problema è quello, serve un tecnico certificato F-Gas, e nei modelli recenti il refrigerante è anche infiammabile.",
    controlli: [
      {
        titolo: "Hai selezionato la modalità giusta",
        difficolta: "facile",
        testo:
          "Sul telecomando serve il simbolo del sole, non il fiocco di neve né la goccia. E la temperatura impostata deve essere superiore a quella della stanza, altrimenti l'apparecchio considera l'obiettivo già raggiunto e non fa nulla. Sembra ovvio ed è la causa più comune.",
      },
      {
        titolo: "Aspetta i primi minuti",
        difficolta: "facile",
        testo:
          "In riscaldamento quasi tutti gli split tengono la ventola ferma finché la batteria non si è scaldata, per non soffiare aria fredda addosso. Possono volerci tre o quattro minuti in cui sembra che non stia succedendo nulla: è previsto e si chiama controllo dell'aria fredda.",
      },
      {
        titolo: "Si ferma ogni tanto ed esce vapore da fuori",
        difficolta: "facile",
        testo:
          "È il ciclo di sbrinamento, ed è normale. In inverno l'unità esterna si copre di brina e periodicamente inverte il funzionamento per scioglierla: si ferma il riscaldamento per qualche minuto, si sente un gorgoglio, e da fuori esce vapore che sembra fumo. Non è un guasto — è il motivo per cui esiste.",
      },
      {
        titolo: "Fa troppo freddo fuori",
        difficolta: "facile",
        testo:
          "Le pompe di calore rendono meno man mano che la temperatura esterna scende: sotto lo zero il rendimento cala parecchio, e i modelli non progettati per il freddo possono quasi smettere di scaldare. Non è un difetto dell'apparecchio, è un limite della tecnologia — che va conosciuto se lo si usa come riscaldamento principale.",
      },
      {
        titolo: "Filtri e unità esterna",
        difficolta: "facile",
        testo:
          "Valgono esattamente come in estate: filtri intasati e batteria esterna ostruita riducono la resa anche in riscaldamento. È la manutenzione che nessuno fa a novembre perché la associa alla stagione calda.",
      },
      {
        titolo: "Valvola di inversione o gas insufficiente",
        difficolta: "da tecnico",
        testo:
          "Se l'apparecchio raffredda benissimo ma non scalda affatto, il sospetto principale è la valvola a quattro vie che inverte il ciclo: è il pezzo che distingue le due modalità, e quando si blocca la macchina resta capace di fare solo una delle due cose. È una diagnosi che richiede strumenti.",
      },
    ],
    quandoTecnico: [
      "Raffredda perfettamente ma non scalda per niente",
      "L'aria resta fredda anche dopo dieci minuti",
      "Lo sbrinamento si ripete ogni pochi minuti",
      "L'unità esterna resta coperta di ghiaccio senza sbrinare mai",
    ],
    faq: [
      {
        domanda: "Conviene usarlo come riscaldamento?",
        risposta:
          "Nelle mezze stagioni e nei climi miti è tra i modi più efficienti di scaldare, perché sposta calore invece di produrlo. Con temperature esterne molto basse il vantaggio si riduce, e va valutato caso per caso.",
      },
      {
        domanda: "Perché esce fumo dall'unità esterna in inverno?",
        risposta:
          "È vapore acqueo prodotto durante lo sbrinamento, non fumo. Dura pochi minuti e si accompagna a una pausa del riscaldamento: entrambi i fenomeni sono normali e programmati.",
      },
      {
        domanda: "Va spento di notte?",
        risposta:
          "In genere conviene abbassare la temperatura piuttosto che spegnere: riportare in temperatura una casa fredda costa più che mantenerla, soprattutto con una pompa di calore che lavora meglio a regime costante.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "unita-esterna-non-parte",
    ricerca: "unità esterna condizionatore non parte",
    titolo: "Unità esterna che non parte: l'interna soffia ma non raffredda",
    descrizione:
      "La ventola dentro casa gira, ma fuori è tutto fermo. È il sintomo che indica dove guardare — e a volte la causa è un pezzo da pochi euro.",
    elettrodomestico: "condizionatore",
    aggiornata: "2026-09-05",
    introduzione:
      "L'unità interna funziona, soffia, risponde al telecomando. Ma l'aria non è fredda, e affacciandoti noti che l'unità esterna è silenziosa e immobile. È una diagnosi già a metà strada: il freddo nasce fuori, e fuori non sta succedendo niente.",
    sicurezza:
      "Non aprire l'unità esterna e non sporgerti per raggiungerla. Contiene una ventola grande, il compressore e un condensatore elettrico che resta carico anche dopo aver tolto corrente — è uno dei pochi componenti domestici che può dare una scossa seria a macchina spenta.",
    controlli: [
      {
        titolo: "Aspetta qualche minuto",
        difficolta: "facile",
        testo:
          "Dopo uno spegnimento, il compressore non riparte subito: c'è una protezione che impone una pausa di tre o quattro minuti per far equilibrare le pressioni. Se hai spento e riacceso poco fa, non è un guasto — è attesa.",
      },
      {
        titolo: "La temperatura impostata è già raggiunta",
        difficolta: "facile",
        testo:
          "Se il telecomando dice 26 e in stanza ci sono 25 gradi, l'apparecchio ha finito il suo lavoro: la ventola interna continua a girare ma l'esterna resta ferma, correttamente. Abbassa di qualche grado e verifica se parte.",
      },
      {
        titolo: "L'interruttore o il sezionatore esterno",
        difficolta: "facile",
        testo:
          "Molti impianti hanno un interruttore dedicato vicino all'unità esterna, spesso in una scatola stagna sul balcone, oltre a quello nel quadro. Spento a fine estate e dimenticato, è la causa classica del climatizzatore che a giugno soffia aria tiepida.",
      },
      {
        titolo: "L'unità esterna è ostruita o surriscaldata",
        difficolta: "facile",
        testo:
          "In pieno sole, con la griglia coperta di foglie o chiusa in un cassonetto senza ventilazione, l'unità va in protezione e si ferma. Il sintomo tipico: funziona la mattina e si blocca nel pomeriggio più caldo.",
      },
      {
        titolo: "Senti un ronzio ma la ventola non gira",
        difficolta: "media",
        testo:
          "È l'indizio più utile di tutti. Un ronzio sordo senza movimento indica quasi sempre il condensatore di avviamento esaurito: un pezzo piccolo ed economico, tra i più frequenti guasti dei climatizzatori, che d'estate cede per il caldo. Ma è anche il componente che resta carico: non è un fai-da-te.",
      },
      {
        titolo: "Comunicazione tra le unità o compressore",
        difficolta: "da tecnico",
        testo:
          "Se l'esterna resta completamente muta e la corrente arriva, il problema può essere il cavo di comunicazione tra le due unità — spesso corroso nel punto in cui esce dal muro — oppure la scheda. Il compressore guasto è l'ipotesi peggiore e anche la meno frequente.",
      },
    ],
    quandoTecnico: [
      "Senti un ronzio ma la ventola esterna non parte",
      "L'unità esterna resta muta con l'interruttore alzato",
      "L'interruttore scatta quando l'esterna prova a partire",
      "Si ferma sempre nelle ore più calde e riparte la sera",
    ],
    faq: [
      {
        domanda: "Posso far partire la ventola dandole una spinta?",
        risposta:
          "Assolutamente no. È un gesto che si vede raccontare in giro e che manda la gente al pronto soccorso: la ventola parte all'improvviso, e per arrivarci bisogna infilare le mani in un apparecchio in tensione.",
      },
      {
        domanda: "Quanto costa il condensatore di avviamento?",
        risposta:
          "Il pezzo costa pochi euro; quello che si paga è l'uscita del tecnico. È comunque tra le riparazioni più economiche che un climatizzatore possa richiedere, ed è una buona notizia quando la diagnosi è quella.",
      },
      {
        domanda: "L'unità esterna può stare al sole?",
        risposta:
          "Funziona, ma rende meno e va in protezione più facilmente. Una posizione ombreggiata e ventilata migliora resa e consumi in modo misurabile, purché non si ostacoli il flusso d'aria con pannelli troppo aderenti.",
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
