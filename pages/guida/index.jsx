import Head from "next/head";
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
    <>
      <Head>
        <title>Guide ai guasti degli elettrodomestici — Fixi</title>
        <meta
          name="description"
          content="Lavatrice che non centrifuga, forno che non scalda, lavastoviglie che non scarica: cosa controllare da solo e quando serve un tecnico."
        />
        <link rel="canonical" href={`${SITO}/guida`} />
        <meta name="robots" content="index, follow" />
      </Head>

      <div style={sfondo}>
        <div style={colonna}>
          <a href="/" style={{ color: "#1A6B50", fontSize: "26px", fontWeight: 800, textDecoration: "none" }}>
            Fixi
          </a>

          <h1 style={{ fontSize: "32px", margin: "24px 0 10px" }}>Guide ai guasti più comuni</h1>
          <p style={{ lineHeight: 1.75, fontSize: "16px", color: "#4A4A47", marginBottom: "34px" }}>
            Prima di chiamare qualcuno, vale la pena escludere le cause banali: sono più frequenti
            di quanto sembri, e si risolvono in pochi minuti senza attrezzi. Qui trovi cosa
            controllare, in ordine di probabilità, e il punto preciso in cui conviene fermarsi.
          </p>

          {Object.entries(perElettrodomestico).map(([elettrodomestico, elenco]) => (
            <div key={elettrodomestico} style={{ marginBottom: "30px" }}>
              <h2 style={{ fontSize: "15px", color: "#6B6B68", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                {elettrodomestico}
              </h2>
              {elenco.map((g) => (
                <a key={g.slug} href={`/guida/${g.slug}`} style={scheda}>
                  <div style={{ fontWeight: 700, fontSize: "17px", color: "#1A6B50", marginBottom: "5px" }}>
                    {g.titolo}
                  </div>
                  <div style={{ fontSize: "14px", color: "#4A4A47", lineHeight: 1.6 }}>{g.descrizione}</div>
                </a>
              ))}
            </div>
          ))}

          <p style={{ marginTop: "40px" }}>
            <a href="/" style={{ color: "#1A6B50" }}>← Torna a Fixi</a>
          </p>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: { guide: tutteLeGuide() } };
}

const sfondo = { background: "#FAF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1C1C1A" };
const colonna = { maxWidth: "720px", margin: "0 auto", padding: "40px 24px 80px" };
const scheda = {
  display: "block", background: "#fff", border: "1px solid #E6E2D8", borderRadius: "10px",
  padding: "16px 18px", marginBottom: "10px", textDecoration: "none",
};
