import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { leggiRegistro, svuotaRegistro } from "../lib/registro";
import { prendiPluginSubito } from "../lib/plugin-nativo";
import { testiPer } from "../lib/testi";
import { riempi } from "../lib/frasi";
import { prefissoDi } from "../lib/lingue";

// Pagina di diagnostica, da aprire DENTRO l'app quando qualcosa "non va".
//
// Nasce da due segnalazioni ("non va il microfono", "non va il download") in cui
// non compariva nessun messaggio. Se alert() nella WebView non viene mostrato,
// ogni avviso d'errore che scriviamo è invisibile e si resta al buio: qui invece
// tutto finisce SULLA PAGINA, dove basta una fotografia per capire.

const PLUGIN = [
  ["SalvaFile", "salvataggio del referto nei Download (dalla 1.5)"],
  ["TastiVolume", "analisi con i tasti del volume (dalla 1.6)"],
  ["VersioneApp", "lettura della versione installata (dalla 1.7)"],
  ["SpeechRecognition", "dettatura vocale (dalla 1.1)"],
];

export async function getStaticProps({ locale }) {
  return { props: { testi: testiPer(locale).stato, pre: prefissoDi(locale) } };
}

export default function Stato({ testi: t, pre }) {
  const [info, setInfo] = useState(null);
  const [esiti, setEsiti] = useState({});

  const [guasto, setGuasto] = useState(null);
  const [registro, setRegistro] = useState([]);

  useEffect(() => {
    try {
      setRegistro(leggiRegistro());
      raccogli();
    } catch (e) {
      // Se anche la raccolta fallisce, la pagina deve dirlo invece di restare
      // su "Carico…" — sarebbe di nuovo un silenzio senza spiegazione.
      setGuasto(`${e?.message || e}`);
    }
  }, []);

  function raccogli() {
    const C = typeof window !== "undefined" ? window.Capacitor : undefined;
    const base = {
      nellApp: C?.isNativePlatform?.() === true,
      piattaforma: C?.getPlatform?.() || "(sconosciuta)",
      capacitorPresente: !!C,
      sannoRispondere: typeof C?.isPluginAvailable === "function",
      plugin: {},
      userAgent: navigator.userAgent,
      versione: null,
    };
    for (const [nome] of PLUGIN) {
      base.plugin[nome] = base.sannoRispondere ? C.isPluginAvailable(nome) : null;
    }
    setInfo(base);

    if (base.plugin.VersioneApp) {
      Promise.resolve(prendiPluginSubito("VersioneApp")?.leggi())
        .then((v) => setInfo((p) => ({ ...p, versione: `${v?.nome} (codice ${v?.codice})` })))
        .catch((e) => setInfo((p) => ({ ...p, versione: `errore: ${e?.message || e}` })));
    }
  }

  const segna = (chiave, testo) => setEsiti((p) => ({ ...p, [chiave]: testo }));

  // Ogni prova scrive l'esito nella pagina, mai in un alert: è tutto il punto.
  const provaAlert = () => {
    try {
      window.alert("Se leggi questo, alert() funziona.");
      segna("alert", "chiamato senza errori — se non hai visto nessuna finestra, alert() è bloccato");
    } catch (e) {
      segna("alert", `errore: ${e?.message || e}`);
    }
  };

  const provaDownload = async () => {
    segna("download", "in corso...");
    try {
      const dati = btoa("Prova Fixi");
      const r = await prendiPluginSubito("SalvaFile").nelleDownload({
        nomeFile: `Fixi_prova_${Date.now()}.txt`,
        dati,
        tipo: "text/plain",
      });
      segna("download", `RIUSCITO → ${r?.uri || "(nessun percorso)"}`);
    } catch (e) {
      segna("download", `FALLITO → codice: ${e?.code || "-"} | messaggio: ${e?.message || e}`);
    }
  };

  // Il pulsante "Scarica" non chiama subito il plugin: prima costruisce il PDF.
  // Se jsPDF fallisce dentro la WebView, il salvataggio non parte nemmeno — e
  // l'unico avviso e' un alert(), che qui sospettiamo non venga mostrato.
  const provaPDF = async () => {
    segna("pdf", "in corso...");
    try {
      const { refertoPDF } = await import("../lib/generaPDF");
      const finto = {
        diagnosis: "Prova di generazione del referto.",
        urgency: "media",
        diyPossible: true,
        diyInstructions: ["Primo passo di prova", "Secondo passo di prova"],
        sparePart: { name: "Pezzo di prova", code: "XX-000", price: "€10" },
        technicianCost: "€50–80",
      };
      const { blob, nomeFile } = refertoPDF(finto, "Lavatrice", "Bosch", "Prova");
      segna("pdf", `RIUSCITO → ${nomeFile}, ${blob?.size ?? "?"} byte`);
    } catch (e) {
      segna("pdf", `FALLITO → ${e?.name || ""} ${e?.message || e}`);
    }
  };

  // Ripete la catena completa del pulsante "Scarica": PDF + scrittura nei
  // Download. Se le due prove separate riescono e questa no, il guasto sta
  // nel punto in cui si passano i dati da una all'altra.
  const provaCatena = async () => {
    segna("catena", "in corso...");
    try {
      const { refertoPDF } = await import("../lib/generaPDF");
      const { blob, nomeFile } = refertoPDF(
        { diagnosis: "Prova catena completa.", urgency: "bassa", diyPossible: false, sparePart: null, technicianCost: "€50" },
        "Lavatrice", "Bosch", "Prova"
      );
      const base64 = await new Promise((ris, rif) => {
        const l = new FileReader();
        l.onerror = () => rif(l.error);
        l.onload = () => ris(String(l.result).split(",")[1]);
        l.readAsDataURL(blob);
      });
      const r = await prendiPluginSubito("SalvaFile").nelleDownload({ nomeFile, dati: base64, tipo: "application/pdf" });
      segna("catena", `RIUSCITO → ${r?.uri || "(nessun percorso)"}`);
    } catch (e) {
      segna("catena", `FALLITO → ${e?.name || ""} ${e?.code || ""} ${e?.message || e}`);
    }
  };

  const provaDettatura = async () => {
    segna("voce", "in corso...");
    try {
      // Dal ponte, come fa il codice vero: se la prova usasse una strada
      // diversa direbbe che funziona una cosa che nell'app non funziona.
      const SpeechRecognition = prendiPluginSubito("SpeechRecognition");
      if (!SpeechRecognition) throw new Error("Plugin non raggiungibile dal ponte nativo");
      const disp = await SpeechRecognition.available();
      let perm = await SpeechRecognition.checkPermissions();
      if (perm.speechRecognition !== "granted") perm = await SpeechRecognition.requestPermissions();
      segna("voce", `disponibile: ${JSON.stringify(disp)} | permesso: ${perm?.speechRecognition}`);
    } catch (e) {
      segna("voce", `FALLITO → ${e?.message || e}`);
    }
  };

  const riga = (etichetta, valore, buono) => (
    <div style={s.riga} key={etichetta}>
      <span style={s.etichetta}>{etichetta}</span>
      <span style={{ ...s.valore, color: buono === undefined ? "#333" : buono ? "#0F6E56" : "#B3261E" }}>
        {valore}
      </span>
    </div>
  );

  return (
    <>
      <Head><title>{t.metaTitolo}</title></Head>
      <div style={s.pagina}>
        <h1 style={s.titolo}>{t.titolo}</h1>
        <p style={s.sotto}>{t.aCosaServe}</p>

        {guasto ? (
          <p style={s.avviso}>{riempi(t.nonLetto, { errore: guasto })}</p>
        ) : !info ? (
          <p>{t.carico}</p>
        ) : (
          <>
            <h2 style={s.sezione}>{t.dove}</h2>
            {riga(t.dentroApp, info.nellApp ? t.si : t.noBrowser, info.nellApp)}
            {riga(t.piattaforma, info.piattaforma)}
            {riga(t.versione, info.versione || t.nonDisponibile)}

            <h2 style={s.sezione}>{t.funzioni}</h2>
            {!info.sannoRispondere && (
              <p style={s.avviso}>{t.troppoVecchia}</p>
            )}
            {PLUGIN.map(([nome, cosa]) =>
              riga(`${nome} — ${cosa}`, info.plugin[nome] === null ? "?" : info.plugin[nome] ? t.presente : t.assente, info.plugin[nome])
            )}

            <h2 style={s.sezione}>{t.prove}</h2>
            <button style={s.bottone} onClick={provaAlert}>{t.prova1}</button>
            <p style={s.esito}>{esiti.alert || "—"}</p>

            <button style={s.bottone} onClick={provaDownload}>{t.prova2}</button>
            <p style={s.esito}>{esiti.download || "—"}</p>

            <button style={s.bottone} onClick={provaDettatura}>{t.prova3}</button>
            <p style={s.esito}>{esiti.voce || "—"}</p>

            <button style={s.bottone} onClick={provaPDF}>{t.prova4}</button>
            <p style={s.esito}>{esiti.pdf || "—"}</p>

            <button style={s.bottone} onClick={provaCatena}>{t.prova5}</button>
            <p style={s.esito}>{esiti.catena || "—"}</p>

            {/* Il pezzo piu' utile: cosa e' successo davvero premendo i
                pulsanti veri, dentro la diagnosi. Le righe le scrive l'app
                mentre la usi e restano qui anche cambiando schermata. */}
            <h2 style={s.sezione}>{t.diario}</h2>
            <p style={s.sotto}>{t.diarioSpiega}</p>
            {registro.length === 0 ? (
              <p style={s.esito}>{t.diarioVuoto}</p>
            ) : (
              <pre style={s.diario}>{registro.join("\n")}</pre>
            )}
            <button
              style={s.bottone}
              onClick={() => {
                svuotaRegistro();
                setRegistro([]);
              }}
            >
              {t.svuota}
            </button>

            <h2 style={s.sezione}>{t.dettagli}</h2>
            <p style={s.piccolo}>{info.userAgent}</p>
          </>
        )}

        <Link href={pre || "/"} style={s.indietro}>← {t.torna}</Link>
      </div>
    </>
  );
}

const s = {
  pagina: { maxWidth: 640, margin: "0 auto", padding: "28px 20px 60px", fontFamily: "system-ui, sans-serif", color: "#1C1C1A", background: "#FAF8F3", minHeight: "100vh" },
  titolo: { fontSize: 24, margin: "0 0 6px" },
  sotto: { fontSize: 14, color: "#6B6B68", lineHeight: 1.5, margin: "0 0 20px" },
  sezione: { fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0F6E56", margin: "24px 0 8px" },
  riga: { display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid #E8E4DC", fontSize: 13 },
  etichetta: { color: "#55655f", flex: 1 },
  valore: { fontWeight: 600, textAlign: "right", wordBreak: "break-word" },
  bottone: { display: "block", width: "100%", padding: 12, marginTop: 10, borderRadius: 10, border: "1px solid #C5E5DA", background: "#E8F5F0", color: "#0F6E56", fontSize: 14, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" },
  esito: { fontSize: 12, lineHeight: 1.5, color: "#333", background: "#fff", border: "1px solid #E8E4DC", borderRadius: 8, padding: "8px 10px", margin: "6px 0 0", wordBreak: "break-word" },
  avviso: { fontSize: 13, color: "#B3261E", margin: "0 0 8px" },
  piccolo: { fontSize: 11, color: "#8a9691", wordBreak: "break-all", lineHeight: 1.5 },
  diario: { fontSize: 11, lineHeight: 1.6, background: "#fff", border: "1px solid #E8E4DC", borderRadius: 8, padding: "10px 12px", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "ui-monospace, monospace" },
  indietro: { display: "inline-block", marginTop: 28, fontSize: 14, color: "#0F6E56" },
};
