import Head from "next/head";
import { testiPer } from "../lib/testi";
import { riempi, grassetto, spezzaSu, dataLeggibile } from "../lib/frasi";
import { prefissoDi, PREDEFINITA } from "../lib/lingue";

// Pagina richiesta da Google Play (Sicurezza dei dati → "Offri agli utenti un
// modo per richiedere l'eliminazione dei loro dati?"). L'URL va incollato nella
// Play Console e compare sulla scheda dello Store.
// Deve soddisfare i tre requisiti indicati da Google:
//   1. citare il nome dell'app e dello sviluppatore della scheda Store
//   2. mettere in evidenza i passaggi per richiedere la cancellazione
//   3. dire quali dati vengono cancellati, quali conservati e per quanto
// Tenere allineata a /privacy: se cambiano i dati raccolti, aggiornare entrambe.
//
// L'indirizzo italiano — /cancellazione-dati, senza prefisso — e' quello
// registrato nella Play Console: deve continuare a rispondere per sempre. Le
// versioni tradotte nascono accanto (/es/cancellazione-dati), mai al suo posto.

const EMAIL = "lorisostojic05@gmail.com";
// La data si tiene in forma anno-mese-giorno e non gia' scritta a parole: il
// mese lo compone dataLeggibile() nella lingua di chi legge. Scritta per
// esteso restava italiana dentro le pagine tradotte — "Letzte Aktualisierung:
// 25 luglio 2026", tedesco tranne il mese.
const AGGIORNAMENTO = "2026-07-25";
const TITOLARE = "Loris Ostojic";

export async function getStaticProps({ locale }) {
  return {
    props: {
      testi: testiPer(locale).cancellazione,
      tradotta: locale !== PREDEFINITA,
      lingua: locale,
      pre: prefissoDi(locale),
    },
  };
}

export default function CancellazioneDati({ testi: t, tradotta, pre, lingua }) {
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(t.oggettoEmail)}`;
  const Email = () => <a href={mailto} style={linkStyle}>{EMAIL}</a>;

  return (
    <>
      <Head>
        <title>{t.metaTitolo}</title>
        <meta name="robots" content="all" />
      </Head>
      <div style={{ background: "#FAF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1C1C1A" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#1A6B50", marginBottom: "4px" }}>Fixi</div>
          <h1 style={{ fontSize: "30px", margin: "12px 0 6px" }}>{t.titolo}</h1>
          <p style={{ color: "#6B6B68", fontSize: "14px", marginBottom: tradotta ? "16px" : "32px" }}>
            {riempi(t.aggiornato, { data: dataLeggibile(AGGIORNAMENTO, lingua) })}
          </p>

          {/* Solo dove serve: sulla pagina italiana non ha senso. */}
          {tradotta && (
            <p
              style={{
                background: "#F1EEE6",
                border: "1px solid #E4E0D8",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                color: "#55554F",
                marginBottom: "32px",
                lineHeight: 1.6,
              }}
            >
              {t.traduzioneDiCortesia}
            </p>
          )}

          <Sezione titolo={t.quale.titolo}>
            <p><Forte frase={riempi(t.quale.app, { titolare: TITOLARE })} /></p>
            <p><Forte frase={t.quale.senzaAccount} /></p>
          </Sezione>

          <div style={{ background: "#E9F3EE", border: "1px solid #C3E0D2", borderRadius: "12px", padding: "20px 24px", marginBottom: "28px" }}>
            <h2 style={{ fontSize: "19px", color: "#1A6B50", marginBottom: "10px" }}>{t.come.titolo}</h2>
            <ol style={{ paddingLeft: "20px", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
              <li>
                {(() => {
                  const { prima, dopo } = spezzaSu(
                    riempi(t.come.passo1, { oggetto: t.oggettoEmail }),
                    "email"
                  );
                  return (
                    <>
                      <Forte frase={prima} />
                      <Email />
                      <Forte frase={dopo} />
                    </>
                  );
                })()}
              </li>
              <li><Forte frase={t.come.passo2} /></li>
              <li><Forte frase={t.come.passo3} /></li>
              <li>{t.come.passo4}</li>
            </ol>
            <p style={{ fontSize: "14px", color: "#4A4A47", marginTop: "12px", marginBottom: 0 }}>
              {t.come.gratis}
            </p>
          </div>

          <Sezione titolo={t.cosaSiCancella.titolo}>
            <p>{t.cosaSiCancella.intro}</p>
            <Elenco voci={t.cosaSiCancella.voci} />
            <p><Forte frase={t.cosaSiCancella.camera} /></p>
          </Sezione>

          <Sezione titolo={t.cosaResta.titolo}>
            <Elenco voci={t.cosaResta.voci} />
            <p>{t.cosaResta.chiusura}</p>
          </Sezione>

          <Sezione titolo={t.tempi.titolo}>
            <p><Forte frase={t.tempi.testo} /></p>
          </Sezione>

          <Sezione titolo={t.altriDiritti.titolo}>
            <p>
              {(() => {
                const { prima, dopo } = spezzaSu(t.altriDiritti.testo, "link");
                return (
                  <>
                    {prima}
                    <a href={`${pre}/privacy`} style={linkStyle}>{t.altriDiritti.link}</a>
                    {dopo}
                  </>
                );
              })()}{" "}
              {(() => {
                const { prima, dopo } = spezzaSu(t.altriDiritti.scrivi, "email");
                return (<>{prima}<Email />{dopo}</>);
              })()}
            </p>
          </Sezione>

          <p style={{ marginTop: "40px" }}>
            <a href={`${pre}/privacy`} style={linkStyle}>{t.vaiAllaPrivacy}</a>
            <span style={{ color: "#B5B5B0", margin: "0 10px" }}>·</span>
            <a href={pre || "/"} style={linkStyle}>← {t.torna}</a>
          </p>
        </div>
      </div>
    </>
  );
}

const linkStyle = { color: "#1A6B50", textDecoration: "underline" };
const ulStyle = { paddingLeft: "20px", lineHeight: 1.7 };

// **cosi** diventa grassetto. I pezzi arrivano da lib/frasi.js come dati, mai
// come HTML da iniettare: vedi il commento li' dentro.
function Forte({ frase }) {
  return (
    <>
      {grassetto(frase).map((p) =>
        p.forte ? <strong key={p.chiave}>{p.testo}</strong> : <span key={p.chiave}>{p.testo}</span>
      )}
    </>
  );
}

function Elenco({ voci }) {
  return (
    <ul style={ulStyle}>
      {voci.map((v, i) => (
        <li key={i}><Forte frase={v} /></li>
      ))}
    </ul>
  );
}

function Sezione({ titolo, children }) {
  return (
    <div style={{ marginBottom: "28px", lineHeight: 1.7, fontSize: "15px" }}>
      <h2 style={{ fontSize: "19px", color: "#1A6B50", marginBottom: "8px" }}>{titolo}</h2>
      {children}
    </div>
  );
}
