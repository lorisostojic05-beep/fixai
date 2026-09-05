import GuscioGuida from "../../components/GuscioGuida";
import { elettrodomesticiConGuide, tutteLeGuide, SITO } from "../../lib/guide";

// Primo livello delle guide: un riquadro per elettrodomestico.
//
// Prima qui c'era l'elenco piatto di tutte le guide. Con dieci pagine sulla
// sola lavatrice diventava un muro di testo in cui chi ha il forno rotto
// doveva scorrere per trovarsi. Due livelli: prima si sceglie la macchina,
// poi il sintomo.

export default function IndiceGuide({ elettrodomestici, totale }) {
  return (
    <GuscioGuida
      titolo="Guide ai guasti degli elettrodomestici — Fixi"
      descrizione="Lavatrice che non centrifuga, forno che non scalda, lavastoviglie che non scarica: cosa controllare da solo, in ordine di probabilità, e quando serve un tecnico."
      canonical={`${SITO}/guida`}
    >
      <span className="g-etichetta">Guide</span>
      <h1 className="g-titolo">Prima di chiamare qualcuno.</h1>
      <p className="g-intro">
        Le cause banali sono più frequenti di quanto sembri, e spesso si risolvono in pochi minuti
        senza attrezzi. Scegli l'elettrodomestico: trovi cosa controllare in ordine di probabilità,
        e il punto preciso in cui conviene fermarsi.
      </p>

      <div className="g-griglia">
        {elettrodomestici.map((e) =>
          e.quante > 0 ? (
            <a className="g-riquadro" href={`/guida/${e.nome}`} key={e.nome}>
              <div className="g-riquadro-icona">{e.emoji}</div>
              <div className="g-riquadro-titolo">{e.titolo}</div>
              <div className="g-riquadro-quante">
                {e.quante} {e.quante === 1 ? "guida" : "guide"}
              </div>
            </a>
          ) : (
            <div className="g-riquadro spento" key={e.nome}>
              <div className="g-riquadro-icona">{e.emoji}</div>
              <div className="g-riquadro-titolo">{e.titolo}</div>
              <div className="g-riquadro-quante">in arrivo</div>
            </div>
          )
        )}
      </div>

      <div className="g-cta">
        <div className="g-cta-titolo">Il tuo guasto non è tra questi?</div>
        <p>
          Fixi funziona su tutti e sette gli elettrodomestici qui sopra, anche dove le guide non ci
          sono ancora. Inquadri la macchina con il telefono e un assistente ti guida fino a capire
          cos'è, anche se il sintomo è insolito.
        </p>
        <a href="/diagnosi" className="g-bottone">Avvia una diagnosi →</a>
        <span className="g-garanzia">
          9,90 € una volta sola. Se non ti è stata utile te li restituiamo, entro 14 giorni.
        </span>
      </div>

      <p className="g-nota">
        {totale} guide pubblicate finora. Ne aggiungiamo di nuove ogni settimana.
      </p>
    </GuscioGuida>
  );
}

export async function getStaticProps() {
  return {
    props: {
      elettrodomestici: elettrodomesticiConGuide(),
      totale: tutteLeGuide().length,
    },
  };
}
