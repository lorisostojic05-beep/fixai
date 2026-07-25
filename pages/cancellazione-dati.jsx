import Head from "next/head";

// Pagina richiesta da Google Play (Sicurezza dei dati → "Offri agli utenti un
// modo per richiedere l'eliminazione dei loro dati?"). L'URL va incollato nella
// Play Console e compare sulla scheda dello Store.
// Deve soddisfare i tre requisiti indicati da Google:
//   1. citare il nome dell'app e dello sviluppatore della scheda Store
//   2. mettere in evidenza i passaggi per richiedere la cancellazione
//   3. dire quali dati vengono cancellati, quali conservati e per quanto
// Tenere allineata a /privacy: se cambiano i dati raccolti, aggiornare entrambe.

const EMAIL = "lorisostojic05@gmail.com";
const AGGIORNAMENTO = "25 luglio 2026";
const OGGETTO = "Cancellazione dati Fixi";

export default function CancellazioneDati() {
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(OGGETTO)}`;

  return (
    <>
      <Head>
        <title>Richiesta di cancellazione dei dati — Fixi</title>
        <meta name="robots" content="all" />
      </Head>
      <div style={{ background: "#FAF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1C1C1A" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#1A6B50", marginBottom: "4px" }}>Fixi</div>
          <h1 style={{ fontSize: "30px", margin: "12px 0 6px" }}>Richiesta di cancellazione dei dati</h1>
          <p style={{ color: "#6B6B68", fontSize: "14px", marginBottom: "32px" }}>Ultimo aggiornamento: {AGGIORNAMENTO}</p>

          <Sezione titolo="A quale app si riferisce questa pagina">
            <p>
              Questa pagina riguarda l'applicazione <strong>Fixi — Diagnosi Elettrodomestici</strong>, sviluppata e
              pubblicata da <strong>Loris Ostojic</strong>, e il sito <strong>Fixi</strong>. Vale sia per chi usa il
              servizio di diagnosi, sia per i tecnici iscritti alla rete.
            </p>
            <p>
              Fixi <strong>non ha account né registrazione</strong>: non esiste un profilo da eliminare
              dall'app. La cancellazione dei dati si richiede scrivendoci, come spiegato qui sotto.
            </p>
          </Sezione>

          <div style={{ background: "#E9F3EE", border: "1px solid #C3E0D2", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px" }}>
            <h2 style={{ fontSize: "19px", color: "#1A6B50", marginBottom: "10px" }}>Come richiedere la cancellazione</h2>
            <ol style={{ paddingLeft: "20px", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
              <li>
                Invia un'email a <a href={mailto} style={linkStyle}>{EMAIL}</a> con oggetto{" "}
                <strong>&laquo;{OGGETTO}&raquo;</strong>.
              </li>
              <li>
                Nel messaggio indica i dati che ci hai fornito, così possiamo trovare le tue informazioni:
                l'<strong>indirizzo email</strong> che hai usato per ricevere il referto e, se hai richiesto
                l'intervento di un tecnico, anche <strong>nome, numero di telefono e CAP</strong>.
              </li>
              <li>
                Specifica se vuoi cancellare <strong>tutti i dati</strong> oppure solo una parte (ad esempio la sola
                richiesta di intervento).
              </li>
              <li>
                Riceverai una conferma via email quando la cancellazione è stata eseguita.
              </li>
            </ol>
            <p style={{ fontSize: "14px", color: "#4A4A47", marginTop: "12px", marginBottom: 0 }}>
              Non serve nessun modulo e la richiesta è gratuita.
            </p>
          </div>

          <Sezione titolo="Quali dati vengono cancellati">
            <p>Su tua richiesta eliminiamo dai nostri sistemi:</p>
            <ul style={ulStyle}>
              <li>la <strong>sessione di diagnosi</strong>: elettrodomestico, marca, descrizione del problema, la conversazione con l'assistente AI e il referto generato;</li>
              <li>il tuo <strong>indirizzo email</strong>, se ce l'hai lasciato per ricevere il referto;</li>
              <li>la <strong>richiesta di intervento</strong>: nome, telefono, email, città e CAP comunicati per essere ricontattato da un tecnico;</li>
              <li>l'eventuale <strong>recensione</strong> (voto e commento) lasciata dopo un intervento;</li>
              <li>per i tecnici iscritti: <strong>l'intera scheda</strong>, con nome, cognome, email, telefono, città, CAP, specializzazioni ed esperienza.</li>
            </ul>
            <p>
              Le <strong>immagini della camera</strong> non compaiono in questo elenco perché non vengono mai
              salvate: i fotogrammi sono analizzati durante la sessione e subito scartati, quindi non c'è nulla da
              cancellare.
            </p>
          </Sezione>

          <Sezione titolo="Quali dati vengono conservati, e per quanto">
            <ul style={ulStyle}>
              <li>
                <strong>Registrazioni dei pagamenti</strong> — sono trattate da Stripe e devono essere conservate per
                gli obblighi contabili e fiscali previsti dalla legge, anche dopo la cancellazione degli altri dati.
                Non contengono i dati della tua carta, che non vediamo e non conserviamo mai.
              </li>
              <li>
                <strong>Statistiche in forma aggregata e anonima</strong> — ad esempio &laquo;quante diagnosi hanno
                riguardato una lavatrice&raquo;. Non permettono di risalire a te e vengono mantenute a tempo
                indeterminato.
              </li>
              <li>
                <strong>Dati già condivisi con un tecnico</strong> — se hai richiesto un intervento e un tecnico ha
                accettato il lavoro, ha già ricevuto i tuoi contatti per chiamarti. Cancelliamo la richiesta dai nostri
                sistemi, ma il tecnico è titolare autonomo dei dati ricevuti: per quelli va contattato direttamente.
                Su richiesta ti indichiamo il suo recapito.
              </li>
            </ul>
            <p>
              Al di fuori di questi casi non applichiamo nessun periodo di conservazione aggiuntivo: i dati vengono
              eliminati definitivamente.
            </p>
          </Sezione>

          <Sezione titolo="In quanto tempo">
            <p>
              Rispondiamo e completiamo la cancellazione <strong>entro 30 giorni</strong> dalla ricezione della
              richiesta, come previsto dal Regolamento europeo sulla protezione dei dati (GDPR).
            </p>
          </Sezione>

          <Sezione titolo="Altri diritti sui tuoi dati">
            <p>
              Oltre alla cancellazione puoi chiedere di accedere ai tuoi dati, correggerli, limitarne l'uso o opporti al
              trattamento. Trovi il quadro completo nell'<a href="/privacy" style={linkStyle}>informativa sulla privacy</a>.
              Per qualsiasi richiesta scrivi a <a href={mailto} style={linkStyle}>{EMAIL}</a>.
            </p>
          </Sezione>

          <p style={{ marginTop: "40px" }}>
            <a href="/privacy" style={linkStyle}>Informativa sulla privacy</a>
            <span style={{ color: "#B5B5B0", margin: "0 10px" }}>·</span>
            <a href="/" style={linkStyle}>← Torna a Fixi</a>
          </p>
        </div>
      </div>
    </>
  );
}

const linkStyle = { color: "#1A6B50", textDecoration: "underline" };
const ulStyle = { paddingLeft: "20px", lineHeight: 1.7 };

function Sezione({ titolo, children }) {
  return (
    <div style={{ marginBottom: "28px", lineHeight: 1.7, fontSize: "15px" }}>
      <h2 style={{ fontSize: "19px", color: "#1A6B50", marginBottom: "8px" }}>{titolo}</h2>
      {children}
    </div>
  );
}
