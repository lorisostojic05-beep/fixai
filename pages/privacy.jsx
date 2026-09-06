import Head from "next/head";
import { testiPer } from "../lib/testi";
import { riempi, grassetto, spezzaSu, dataLeggibile } from "../lib/frasi";
import { prefissoDi, PREDEFINITA } from "../lib/lingue";

// Privacy policy pubblica — richiesta da Google Play e dalle normative privacy.
// È una base solida e onesta; per un'attività che incassa pagamenti conviene
// farla rivedere da un consulente privacy.
//
// Dal 06/09/2026 è tradotta nelle sette lingue del sito. È un documento
// legale, non un'interfaccia: le versioni tradotte portano in alto una riga
// che dice che in caso di differenze fa fede l'italiano. Non è un cavillo —
// è la stessa cosa che fanno tutti i servizi che pubblicano un'informativa in
// più lingue, perché una sfumatura persa in traduzione non può cambiare quello
// a cui il titolare si è impegnato.

// La data si tiene in forma anno-mese-giorno e non gia' scritta a parole: il
// mese lo compone dataLeggibile() nella lingua di chi legge. Scritta per
// esteso restava italiana dentro le pagine tradotte — "Letzte Aktualisierung:
// 25 luglio 2026", tedesco tranne il mese.
const AGGIORNAMENTO = "2026-08-31";
const EMAIL = "lorisostojic05@gmail.com";

// P.IVA e sede compaiono nell'informativa SOLO se compilate qui: finché sono
// vuote la pagina resta identica a prima. Serve a non pubblicare per sbaglio
// un numero di partita IVA finto, che sarebbe peggio di non averlo scritto.
// Compilandole, aggiorna anche AGGIORNAMENTO con la data di oggi.
const PIVA = "05223940239";
// SEDE resta vuota di proposito: è l'indirizzo di casa di Loris, e questa
// pagina è pubblica e indicizzata. La legge chiede che il titolare sia
// identificabile e contattabile — nome, partita IVA ed email lo soddisfano,
// senza rendere cercabile per sempre dove abita.
const SEDE = "";

const TITOLARE = "Loris Ostojic";

export async function getStaticProps({ locale }) {
  return {
    props: {
      testi: testiPer(locale).privacy,
      tradotta: locale !== PREDEFINITA,
      lingua: locale,
      pre: prefissoDi(locale),
    },
  };
}

export default function Privacy({ testi: t, tradotta, pre, lingua }) {
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

          {/* Solo sulle versioni tradotte: sull'italiana non avrebbe senso. */}
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

          <Sezione titolo={t.chiSiamo.titolo}>
            <p>{t.chiSiamo.cosa}</p>
            <p>
              <Forte
                frase={riempi(t.chiSiamo.titolare, {
                  nome: TITOLARE,
                  piva: PIVA ? riempi(t.chiSiamo.conPiva, { piva: PIVA }) : "",
                  sede: SEDE ? riempi(t.chiSiamo.conSede, { sede: SEDE }) : "",
                })}
              />{" "}
              <ConEmail frase={t.chiSiamo.domande} />
            </p>
          </Sezione>

          <Sezione titolo={t.dati.titolo}>
            <p>{t.dati.intro}</p>
            <Elenco voci={t.dati.voci} />
          </Sezione>

          <Sezione titolo={t.perche.titolo}>
            <Elenco voci={t.perche.voci} />
            <p>{t.perche.base}</p>
          </Sezione>

          <Sezione titolo={t.camera.titolo}>
            <p><Forte frase={t.camera.testo} /></p>
          </Sezione>

          <Sezione titolo={t.terzeParti.titolo}>
            <p>{t.terzeParti.intro}</p>
            <Elenco voci={t.terzeParti.voci} />
            <p>{t.terzeParti.chiusura}</p>
          </Sezione>

          <Sezione titolo={t.conservazione.titolo}>
            <p>{t.conservazione.testo}</p>
          </Sezione>

          <Sezione titolo={t.diritti.titolo}>
            <p><ConEmail frase={t.diritti.testo} /></p>
            <p>
              {(() => {
                const { prima, dopo } = spezzaSu(t.diritti.cancellazione, "link");
                return (
                  <>
                    {prima}
                    <a href={`${pre}/cancellazione-dati`} style={linkStyle}>
                      {t.diritti.cancellazioneLink}
                    </a>
                    {dopo}
                  </>
                );
              })()}
            </p>
          </Sezione>

          <Sezione titolo={t.minori.titolo}>
            <p>{t.minori.testo}</p>
          </Sezione>

          <Sezione titolo={t.modifiche.titolo}>
            <p>{t.modifiche.testo}</p>
          </Sezione>

          <Sezione titolo={t.contatti.titolo}>
            <p><ConEmail frase={t.contatti.testo} /></p>
          </Sezione>

          <p style={{ marginTop: "40px" }}>
            <a href={pre || "/"} style={linkStyle}>← {t.torna}</a>
          </p>
        </div>
      </div>
    </>
  );
}

const linkStyle = { color: "#1A6B50", textDecoration: "underline" };
const ulStyle = { paddingLeft: "20px", lineHeight: 1.7 };

// Rende **cosi** in grassetto. I pezzi arrivano da lib/frasi.js come dati, mai
// come HTML: se in una traduzione finisse del codice, verrebbe stampato invece
// che eseguito.
function Forte({ frase }) {
  return (
    <>
      {grassetto(frase).map((p) =>
        p.forte ? <strong key={p.chiave}>{p.testo}</strong> : <span key={p.chiave}>{p.testo}</span>
      )}
    </>
  );
}

// Frase con dentro l'indirizzo email, cliccabile. Il segnaposto {email} sta
// nella frase e non ai suoi bordi, cosi' ogni lingua lo mette dove vuole.
function ConEmail({ frase }) {
  const { prima, dopo } = spezzaSu(frase, "email");
  return (
    <>
      {prima}
      <a href={`mailto:${EMAIL}`} style={linkStyle}>{EMAIL}</a>
      {dopo}
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
