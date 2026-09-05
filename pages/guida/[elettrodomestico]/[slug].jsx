import GuscioGuida from "../../../components/GuscioGuida";
import {
  ELETTRODOMESTICI,
  guidaPer,
  guideCollegate,
  tutteLeGuide,
  urlGuida,
} from "../../../lib/guide";

// Una pagina per sintomo. Il contenuto sta tutto in lib/guide.js e l'aspetto
// in components/GuscioGuida.jsx: qui c'e' solo il montaggio, cosi' aggiungere
// una guida non richiede di toccare ne' il codice ne' lo stile.
//
// Le pagine sono generate in fase di build (getStaticPaths): arrivano al
// visitatore come HTML gia' pronto. Per Google conta: deve poter leggere il
// testo senza aspettare che parta JavaScript.

export default function Guida({ guida, scheda, altre }) {
  // Dati strutturati per le domande frequenti: il modo di chiedere a Google
  // di mostrare le risposte gia' aperte nei risultati di ricerca. Vanno
  // dichiarate solo domande che stanno DAVVERO nella pagina — se non
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
    <GuscioGuida
      titolo={`${guida.titolo} — Fixi`}
      descrizione={guida.descrizione}
      canonical={urlGuida(guida.elettrodomestico, guida.slug)}
      datiStrutturati={datiStrutturati}
    >
      <nav className="g-briciole">
        <a href="/">Home</a> › <a href="/guida">Guide</a> ›{" "}
        <a href={`/guida/${guida.elettrodomestico}`}>{scheda.titolo.toLowerCase()}</a>
      </nav>

      <span className="g-etichetta">
        {scheda.emoji} {scheda.titolo}
      </span>
      <h1 className="g-titolo">{guida.titolo}</h1>
      <p className="g-meta">
        Aggiornata il {dataItaliana(guida.aggiornata)} · lettura 4 minuti
      </p>

      <p className="g-intro">{guida.introduzione}</p>

      <div className="g-sicurezza">
        <strong>⚠️ Prima di iniziare</strong>
        {guida.sicurezza}
      </div>

      <h2 className="g-sezione">Cosa controllare, in ordine</h2>
      {guida.controlli.map((c, i) => (
        <div className="g-passo" key={c.titolo}>
          <div className="g-numero">{String(i + 1).padStart(2, "0")}</div>
          <div>
            <h3 className="g-passo-titolo">{c.titolo}</h3>
            <span className={`g-difficolta ${classeDifficolta(c.difficolta)}`}>{c.difficolta}</span>
            <p className="g-testo">{c.testo}</p>
          </div>
        </div>
      ))}

      <h2 className="g-sezione">Quando fermarsi e chiamare un tecnico</h2>
      <ul className="g-elenco">
        {guida.quandoTecnico.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>

      <div className="g-cta">
        <div className="g-cta-titolo">Hai controllato tutto e non ne esci?</div>
        <p>
          Inquadri {articolo(guida.elettrodomestico)} {scheda.titolo.toLowerCase()} con la
          fotocamera del telefono e un assistente ti guida passo passo fino a capire cos'è, in circa
          10 minuti. Alla fine ricevi un referto scritto, con il pezzo da sostituire se serve.
        </p>
        <a href="/diagnosi" className="g-bottone">Avvia una diagnosi →</a>
        <span className="g-garanzia">
          9,90 € una volta sola. Se non ti è stata utile te li restituiamo, entro 14 giorni.
        </span>
      </div>

      <h2 className="g-sezione">Domande frequenti</h2>
      {guida.faq.map((f) => (
        <div className="g-faq" key={f.domanda}>
          <h3 className="g-faq-domanda">{f.domanda}</h3>
          <p className="g-testo">{f.risposta}</p>
        </div>
      ))}

      {altre.length > 0 && (
        <>
          <h2 className="g-sezione">Altri guasti {articolo(guida.elettrodomestico)} {scheda.titolo.toLowerCase()}</h2>
          {altre.map((g) => (
            <a className="g-scheda" href={`/guida/${g.elettrodomestico}/${g.slug}`} key={g.slug}>
              <div className="g-scheda-titolo">{g.titolo}</div>
              <div className="g-scheda-testo">{g.descrizione}</div>
            </a>
          ))}
        </>
      )}

      <p className="g-nota">
        Queste indicazioni sono di orientamento generale e non sostituiscono l'intervento di un
        tecnico qualificato. Sugli apparecchi collegati alla rete elettrica o idrica, in caso di
        dubbio rivolgiti a un professionista.
      </p>
    </GuscioGuida>
  );
}

export async function getStaticPaths() {
  return {
    paths: tutteLeGuide().map((g) => ({
      params: { elettrodomestico: g.elettrodomestico, slug: g.slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const guida = guidaPer(params.elettrodomestico, params.slug);
  const scheda = ELETTRODOMESTICI.find((e) => e.nome === params.elettrodomestico);
  if (!guida || !scheda) return { notFound: true };
  return {
    props: { guida, scheda, altre: guideCollegate(params.elettrodomestico, params.slug) },
  };
}

// ── Formattazione ───────────────────────────────────────────────────

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

function dataItaliana(iso) {
  const [a, m, g] = iso.split("-");
  return `${Number(g)} ${MESI[Number(m) - 1]} ${a}`;
}

// "la lavatrice" ma "il forno": l'articolo cambia, e scriverlo a mano in ogni
// guida sarebbe una svista in agguato.
function articolo(nome) {
  return /^(lavatrice|lavastoviglie|asciugatrice)$/.test(nome) ? "la" : "il";
}

function classeDifficolta(d) {
  if (d === "facile") return "g-facile";
  if (d === "da tecnico") return "g-tecnico";
  return "g-media";
}
