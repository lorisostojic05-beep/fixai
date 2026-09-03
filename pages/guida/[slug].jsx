import Head from "next/head";
import { guidaPerSlug, guideCollegate, tutteLeGuide, urlGuida } from "../../lib/guide";

// Una pagina per sintomo. Il contenuto sta tutto in lib/guide.js: qui c'è
// solo il modo di mostrarlo, così aggiungere una guida non richiede di
// toccare il codice.
//
// Le pagine sono generate in fase di build (getStaticPaths): arrivano al
// visitatore come HTML già pronto. Per Google conta: deve poter leggere il
// testo senza aspettare che parta JavaScript.

export default function Guida({ guida, altre }) {
  // Dati strutturati per le domande frequenti. Sono il modo in cui si chiede
  // a Google di mostrare le risposte già aperte nei risultati di ricerca.
  // Vanno dichiarate solo domande che stanno DAVVERO nella pagina: se non
  // corrispondono, Google toglie il riconoscimento al sito intero.
  const datiStrutturati = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guida.faq.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  };

  return (
    <>
      <Head>
        <title>{`${guida.titolo} — Fixi`}</title>
        <meta name="description" content={guida.descrizione} />
        <link rel="canonical" href={urlGuida(guida.slug)} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={guida.titolo} />
        <meta property="og:description" content={guida.descrizione} />
        <meta property="og:url" content={urlGuida(guida.slug)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datiStrutturati) }}
        />
      </Head>

      <div style={sfondo}>
        <div style={colonna}>
          <a href="/" style={{ ...link, fontSize: "26px", fontWeight: 800, textDecoration: "none" }}>
            Fixi
          </a>

          <nav style={{ fontSize: "13px", color: "#6B6B68", margin: "20px 0 4px" }}>
            <a href="/" style={link}>Home</a>
            {" › "}
            <a href="/guida" style={link}>Guide</a>
            {" › "}
            <span>{guida.elettrodomestico}</span>
          </nav>

          <h1 style={{ fontSize: "32px", lineHeight: 1.25, margin: "8px 0 12px" }}>{guida.titolo}</h1>
          <p style={{ color: "#6B6B68", fontSize: "13px", marginBottom: "28px" }}>
            Aggiornata il {dataItaliana(guida.aggiornata)} · lettura 4 minuti
          </p>

          <p style={paragrafo}>{guida.introduzione}</p>

          <div style={riquadroSicurezza}>
            <strong style={{ display: "block", marginBottom: "6px" }}>⚠️ Prima di iniziare</strong>
            {guida.sicurezza}
          </div>

          <h2 style={titoloSezione}>Cosa controllare, in ordine</h2>
          {guida.controlli.map((c, i) => (
            <div key={c.titolo} style={{ marginBottom: "26px" }}>
              <h3 style={{ fontSize: "18px", margin: "0 0 8px", display: "flex", gap: "10px", alignItems: "baseline" }}>
                <span style={numero}>{i + 1}</span>
                <span>{c.titolo}</span>
              </h3>
              <div style={{ marginLeft: "34px" }}>
                <span style={etichetta(c.difficolta)}>{c.difficolta}</span>
                <p style={{ ...paragrafo, marginTop: "8px" }}>{c.testo}</p>
              </div>
            </div>
          ))}

          <h2 style={titoloSezione}>Quando conviene fermarsi e chiamare un tecnico</h2>
          <ul style={elenco}>
            {guida.quandoTecnico.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <div style={riquadroFixi}>
            <strong style={{ fontSize: "17px" }}>Hai controllato tutto e non ne esci?</strong>
            <p style={{ margin: "10px 0 16px", lineHeight: 1.65 }}>
              Con Fixi inquadri {articolo(guida.elettrodomestico)} {guida.elettrodomestico} con la
              fotocamera del telefono e un assistente ti guida passo passo fino a capire cos'è, in
              circa 10 minuti. Alla fine ricevi un referto scritto, con il pezzo da sostituire se
              serve. Costa 9,90 € una volta sola — e se non ti è stata utile, te li restituiamo.
            </p>
            <a href="/diagnosi" style={pulsante}>Avvia una diagnosi →</a>
          </div>

          <h2 style={titoloSezione}>Domande frequenti</h2>
          {guida.faq.map((f) => (
            <div key={f.domanda} style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>{f.domanda}</h3>
              <p style={paragrafo}>{f.risposta}</p>
            </div>
          ))}

          {altre.length > 0 && (
            <>
              <h2 style={titoloSezione}>Altre guide</h2>
              <ul style={elenco}>
                {altre.map((g) => (
                  <li key={g.slug} style={{ marginBottom: "6px" }}>
                    <a href={`/guida/${g.slug}`} style={link}>{g.titolo}</a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p style={{ marginTop: "40px", fontSize: "13px", color: "#6B6B68", lineHeight: 1.6 }}>
            Queste indicazioni sono di orientamento generale e non sostituiscono l'intervento di un
            tecnico qualificato. Sugli apparecchi collegati alla rete elettrica o idrica, in caso di
            dubbio rivolgiti a un professionista.
          </p>

          <p style={{ marginTop: "28px" }}>
            <a href="/guida" style={link}>← Tutte le guide</a>
          </p>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: tutteLeGuide().map((g) => ({ params: { slug: g.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const guida = guidaPerSlug(params.slug);
  if (!guida) return { notFound: true };
  return { props: { guida, altre: guideCollegate(params.slug) } };
}

// ── Stile e formattazione ───────────────────────────────────────────

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

function dataItaliana(iso) {
  const [a, m, g] = iso.split("-");
  return `${Number(g)} ${MESI[Number(m) - 1]} ${a}`;
}

// "la lavatrice" ma "il forno": l'articolo cambia e scriverlo a mano in ogni
// guida sarebbe una svista in agguato.
function articolo(nome) {
  return /^(lavatrice|lavastoviglie|asciugatrice|cappa|piastra)$/.test(nome) ? "la" : "il";
}

const sfondo = { background: "#FAF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1C1C1A" };
const colonna = { maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" };
const link = { color: "#1A6B50", textDecoration: "underline" };
const paragrafo = { lineHeight: 1.75, fontSize: "16px", margin: "0 0 12px" };
const elenco = { paddingLeft: "20px", lineHeight: 1.8, fontSize: "16px" };
const titoloSezione = { fontSize: "22px", color: "#1A6B50", margin: "36px 0 16px" };
const numero = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: "24px", height: "24px", borderRadius: "50%",
  background: "#1A6B50", color: "#fff", fontSize: "13px", fontWeight: 700, flexShrink: 0,
};
const riquadroSicurezza = {
  background: "#FFF6E5", border: "1px solid #F0D9A8", borderRadius: "10px",
  padding: "16px 18px", margin: "24px 0", lineHeight: 1.65, fontSize: "15px",
};
const riquadroFixi = {
  background: "#EAF4EF", border: "1px solid #BFDDCE", borderRadius: "12px",
  padding: "22px", margin: "34px 0",
};
const pulsante = {
  display: "inline-block", background: "#1A6B50", color: "#fff", textDecoration: "none",
  padding: "13px 24px", borderRadius: "8px", fontWeight: 700, fontSize: "15px",
};

function etichetta(difficolta) {
  const colori = {
    facile: { background: "#DFF3E7", color: "#14603F" },
    media: { background: "#FFF0D6", color: "#8A5A00" },
    "da tecnico": { background: "#F6E1E1", color: "#8A2B2B" },
  };
  return {
    ...(colori[difficolta] || colori.media),
    display: "inline-block", fontSize: "12px", fontWeight: 700,
    padding: "3px 9px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.4px",
  };
}
