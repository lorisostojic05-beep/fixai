import GuscioGuida from "../../../components/GuscioGuida";
import {
  ELETTRODOMESTICI,
  guidePerElettrodomestico,
  urlElettrodomestico,
} from "../../../lib/guide";

// Secondo livello: i sintomi di un solo elettrodomestico.
//
// Esiste solo per gli elettrodomestici che hanno almeno una guida: gli altri
// nella pagina indice compaiono spenti e non portano da nessuna parte,
// invece di aprire una pagina vuota.

export default function IndiceElettrodomestico({ scheda, guide }) {
  return (
    <GuscioGuida
      titolo={`Guasti ${scheda.titolo.toLowerCase()}: guide e soluzioni — Fixi`}
      descrizione={`Cosa controllare quando ${articolo(scheda.nome)} ${scheda.titolo.toLowerCase()} non funziona: le cause in ordine di probabilità, cosa puoi fare da solo e quando serve un tecnico.`}
      canonical={urlElettrodomestico(scheda.nome)}
    >
      <nav className="g-briciole">
        <a href="/">Home</a> › <a href="/guida">Guide</a> › {scheda.titolo.toLowerCase()}
      </nav>

      <span className="g-etichetta">
        {scheda.emoji} {scheda.titolo}
      </span>
      <h1 className="g-titolo">Cosa c'è che non va?</h1>
      <p className="g-intro">
        Scegli il sintomo che assomiglia di più al tuo. Ogni guida parte dalle cause più probabili —
        che sono anche le più banali — e ti dice dove conviene fermarsi.
      </p>

      {guide.map((g) => (
        <a className="g-scheda" href={`/guida/${scheda.nome}/${g.slug}`} key={g.slug}>
          <div className="g-scheda-titolo">{g.titolo}</div>
          <div className="g-scheda-testo">{g.descrizione}</div>
        </a>
      ))}

      <div className="g-cta">
        <div className="g-cta-titolo">Nessuno di questi è il tuo caso?</div>
        <p>
          Inquadri {articolo(scheda.nome)} {scheda.titolo.toLowerCase()} con la fotocamera del
          telefono e un assistente ti guida passo passo fino a capire cos'è, in circa 10 minuti.
          Alla fine ricevi un referto scritto, con il pezzo da sostituire se serve.
        </p>
        <a href="/diagnosi" className="g-bottone">Avvia una diagnosi →</a>
        <span className="g-garanzia">
          9,90 € una volta sola. Se non ti è stata utile te li restituiamo, entro 14 giorni.
        </span>
      </div>

      <p className="g-nota">
        <a href="/guida">← Tutti gli elettrodomestici</a>
      </p>
    </GuscioGuida>
  );
}

// "la lavatrice" ma "il forno": scriverlo a mano in ogni pagina sarebbe una
// svista in agguato.
function articolo(nome) {
  return /^(lavatrice|lavastoviglie|asciugatrice)$/.test(nome) ? "la" : "il";
}

export async function getStaticPaths() {
  return {
    paths: ELETTRODOMESTICI.filter((e) => guidePerElettrodomestico(e.nome).length > 0).map((e) => ({
      params: { elettrodomestico: e.nome },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const scheda = ELETTRODOMESTICI.find((e) => e.nome === params.elettrodomestico);
  const guide = guidePerElettrodomestico(params.elettrodomestico);
  if (!scheda || guide.length === 0) return { notFound: true };
  return { props: { scheda, guide } };
}
