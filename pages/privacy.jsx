import Head from "next/head";

// Privacy policy pubblica — richiesta da Google Play e dalle normative privacy.
// NOTA per Loris: i punti tra [parentesi quadre] vanno completati con i tuoi dati.
// È una base solida e onesta; per un'attività che incassa pagamenti conviene
// farla rivedere da un consulente privacy prima del lancio pubblico.

const AGGIORNAMENTO = "23 luglio 2026";
const EMAIL = "lorisostojic05@gmail.com";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Fixi</title>
        <meta name="robots" content="all" />
      </Head>
      <div style={{ background: "#FAF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1C1C1A" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#1A6B50", marginBottom: "4px" }}>Fixi</div>
          <h1 style={{ fontSize: "30px", margin: "12px 0 6px" }}>Informativa sulla privacy</h1>
          <p style={{ color: "#6B6B68", fontSize: "14px", marginBottom: "32px" }}>Ultimo aggiornamento: {AGGIORNAMENTO}</p>

          <Sezione titolo="1. Chi siamo (Titolare del trattamento)">
            <p>Fixi è un servizio di diagnosi di elettrodomestici tramite videochiamata con intelligenza artificiale, che mette inoltre in contatto gli utenti con tecnici riparatori.</p>
            <p>Titolare del trattamento: <strong>[Nome e cognome / ragione sociale]</strong>, <strong>[eventuale P.IVA e indirizzo]</strong>. Per qualsiasi domanda sulla privacy puoi scriverci a <a href={`mailto:${EMAIL}`} style={linkStyle}>{EMAIL}</a>.</p>
          </Sezione>

          <Sezione titolo="2. Quali dati raccogliamo">
            <p>A seconda di come usi Fixi, trattiamo:</p>
            <ul style={ulStyle}>
              <li><strong>Dati della diagnosi</strong>: tipo di elettrodomestico, marca, descrizione del problema e i messaggi che scambi con l'assistente AI.</li>
              <li><strong>Immagini dalla camera</strong>: durante la sessione, i fotogrammi che inquadri vengono inviati per l'analisi all'AI. <strong>Non salviamo i video né i fotogrammi</strong>: sono elaborati e poi scartati.</li>
              <li><strong>Email</strong>: se scegli di ricevere il referto via email o di essere ricontattato da un tecnico.</li>
              <li><strong>Dati per la richiesta di un tecnico</strong>: nome, telefono, città e CAP, che condividiamo con i tecnici della tua zona per permettere loro di contattarti.</li>
              <li><strong>Dati di pagamento</strong>: i pagamenti sono gestiti da Stripe. <strong>Non vediamo né conserviamo i dati della tua carta</strong>; registriamo solo l'esito del pagamento.</li>
              <li><strong>Recensioni</strong>: il voto e il commento che lasci su un intervento.</li>
              <li><strong>Se sei un tecnico</strong>: nome, cognome, email, telefono, città, CAP, specializzazioni ed esperienza che inserisci in fase di iscrizione.</li>
            </ul>
          </Sezione>

          <Sezione titolo="3. Perché li usiamo">
            <ul style={ulStyle}>
              <li>Per fornirti la diagnosi e generare il referto.</li>
              <li>Per inviarti il referto via email, se lo richiedi.</li>
              <li>Per metterti in contatto con un tecnico della tua zona, se lo richiedi.</li>
              <li>Per gestire il pagamento del servizio.</li>
              <li>Per migliorare il servizio (statistiche aggregate e feedback).</li>
            </ul>
            <p>La base giuridica è l'esecuzione del servizio che ci chiedi e, dove previsto, il tuo consenso.</p>
          </Sezione>

          <Sezione titolo="4. La camera">
            <p>L'accesso alla camera viene usato <strong>solo durante la sessione di diagnosi</strong> e solo per mostrare all'AI ciò che inquadri. I fotogrammi vengono analizzati in tempo reale e non vengono memorizzati sui nostri sistemi. Puoi disattivare la camera in qualsiasi momento durante la sessione.</p>
          </Sezione>

          <Sezione titolo="5. Servizi di terze parti">
            <p>Per funzionare, Fixi si appoggia a fornitori che trattano alcuni dati per nostro conto:</p>
            <ul style={ulStyle}>
              <li><strong>Anthropic</strong> — l'intelligenza artificiale che analizza le immagini e dialoga con te.</li>
              <li><strong>Stripe</strong> — la gestione dei pagamenti.</li>
              <li><strong>Supabase</strong> — il database dove salviamo le sessioni, le richieste di intervento e i dati dei tecnici.</li>
              <li><strong>Resend</strong> — l'invio delle email (referti, notifiche ai tecnici).</li>
              <li><strong>Vercel</strong> — l'hosting del servizio.</li>
            </ul>
            <p>Ciascun fornitore tratta i dati secondo le proprie informative privacy.</p>
          </Sezione>

          <Sezione titolo="6. Per quanto tempo conserviamo i dati">
            <p>Conserviamo i dati delle sessioni, delle richieste di intervento e dei tecnici per il tempo necessario a fornire il servizio e adempiere agli obblighi di legge. Puoi chiederci in qualsiasi momento la cancellazione dei tuoi dati.</p>
          </Sezione>

          <Sezione titolo="7. I tuoi diritti">
            <p>Hai il diritto di accedere ai tuoi dati, correggerli, chiederne la cancellazione o limitarne l'uso, e di opporti al trattamento. Per esercitare questi diritti scrivici a <a href={`mailto:${EMAIL}`} style={linkStyle}>{EMAIL}</a>.</p>
          </Sezione>

          <Sezione titolo="8. Minori">
            <p>Fixi non è rivolto a minori di 16 anni e non raccogliamo consapevolmente i loro dati.</p>
          </Sezione>

          <Sezione titolo="9. Modifiche a questa informativa">
            <p>Potremmo aggiornare questa informativa. In caso di modifiche rilevanti lo segnaleremo su questa pagina, aggiornando la data in alto.</p>
          </Sezione>

          <Sezione titolo="10. Contatti">
            <p>Per qualsiasi domanda sulla privacy o sui tuoi dati: <a href={`mailto:${EMAIL}`} style={linkStyle}>{EMAIL}</a>.</p>
          </Sezione>

          <p style={{ marginTop: "40px" }}><a href="/" style={linkStyle}>← Torna a Fixi</a></p>
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
