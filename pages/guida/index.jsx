import GuscioGuida from "../../components/GuscioGuida";
import { tutteLeGuide, SITO } from "../../lib/guide";

// L'indice delle guide. Serve a chi arriva da una guida e ha un secondo
// problema in casa, e serve a Google come punto da cui raggiungere tutte
// le pagine con un solo salto.

export default function IndiceGuide({ guide }) {
  const perElettrodomestico = guide.reduce((acc, g) => {
    (acc[g.elettrodomestico] = acc[g.elettrodomestico] || []).push(g);
    return acc;
  }, {});

  return (
    <GuscioGuida
      titolo="Guide ai guasti degli elettrodomestici — Fixi"
      descrizione="Lavatrice che non centrifuga, forno che non scalda, lavastoviglie che non scarica: cosa controllare da solo e quando serve un tecnico."
      canonical={`${SITO}/guida`}
    >
      <span className="g-etichetta">Guide</span>
      <h1 className="g-titolo">Prima di chiamare qualcuno.</h1>
      <p className="g-intro">
        Le cause banali sono più frequenti di quanto sembri, e si risolvono in pochi minuti senza
        attrezzi. Qui trovi cosa controllare, in ordine di probabilità, e il punto preciso in cui
        conviene fermarsi.
      </p>

      {Object.entries(perElettrodomestico).map(([elettrodomestico, elenco]) => (
        <div key={elettrodomestico}>
          <div className="g-gruppo">{elettrodomestico}</div>
          {elenco.map((g) => (
            <a className="g-scheda" href={`/guida/${g.slug}`} key={g.slug}>
              <div className="g-scheda-titolo">{g.titolo}</div>
              <div className="g-scheda-testo">{g.descrizione}</div>
            </a>
          ))}
        </div>
      ))}

      <div className="g-cta">
        <div className="g-cta-titolo">Il tuo guasto non è in elenco?</div>
        <p>
          Fixi funziona su lavatrice, lavastoviglie, asciugatrice, frigorifero, forno, piano
          cottura e condizionatore. Inquadri l'elettrodomestico con il telefono e un assistente ti
          guida fino a capire cos'è, anche se il sintomo è insolito.
        </p>
        <a href="/diagnosi" className="g-bottone">Avvia una diagnosi →</a>
        <span className="g-garanzia">
          9,90 € una volta sola. Se non ti è stata utile te li restituiamo, entro 14 giorni.
        </span>
      </div>
    </GuscioGuida>
  );
}

export async function getStaticProps() {
  return { props: { guide: tutteLeGuide() } };
}
