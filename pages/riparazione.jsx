import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { testiPer } from "../lib/testi";
import { riempi } from "../lib/frasi";
import { inEuro } from "../lib/soldi";
import { prefissoDi } from "../lib/lingue";

// pages/riparazione.jsx
// La schermata dove il cliente vede il preventivo e paga il saldo.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  I TRE NUMERI SONO IL CUORE DELLA PAGINA                                  │
// │                                                                           │
// │      Prezzo intervento          120,00 €                                  │
// │      Credito videodiagnosi       -9,90 €                                  │
// │      Da pagare                  110,10 €                                  │
// │                                                                           │
// │  Si mostrano SEMPRE tutti e tre, anche se il conto sembra ovvio. Far      │
// │  vedere solo "110,10 €" farebbe sparire il vantaggio: il cliente non      │
// │  saprebbe di aver risparmiato, e dei 9,90 € pagati per la diagnosi si     │
// │  ricorderebbe solo come di una spesa in piu'.                             │
// └───────────────────────────────────────────────────────────────────────────┘
//
// Nessun importo viene calcolato qui. Arrivano tutti da /api/preventivo, che
// li legge dalla riga del database: questa pagina li sa solo scrivere.

export async function getStaticProps({ locale }) {
  const tutti = testiPer(locale);
  return {
    props: {
      testi: tutti.riparazione,
      // I nomi degli elettrodomestici girano nel programma in italiano
      // ("Lavatrice"): sono chiavi, non etichette. Qui vanno tradotti prima di
      // scriverli, se no una pagina spagnola dice "Riparazione Bosch Lavatrice".
      nomiMacchine: tutti.diagnosi.elettrodomestici,
      lingua: locale,
      pre: prefissoDi(locale),
    },
  };
}

export default function Riparazione({ testi: t, nomiMacchine, lingua, pre }) {
  const [dati, setDati] = useState(null);
  const [errore, setErrore] = useState(null);
  const [token, setToken] = useState(null);
  const [inCorso, setInCorso] = useState(false);

  const soldi = (c) => inEuro(c, lingua);

  const carica = useCallback(async (c) => {
    try {
      const r = await fetch(`/api/preventivo?cliente=${encodeURIComponent(c)}`);
      if (!r.ok) throw new Error("non trovata");
      setDati(await r.json());
    } catch {
      setErrore(t.erroreGenerico);
    }
  }, [t]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = q.get("c");
    if (!c) return setErrore(t.erroreGenerico);
    setToken(c);
    carica(c);
  }, [carica, t]);

  async function paga() {
    setInCorso(true);
    try {
      // ── Prima si accetta, poi si paga ────────────────────────────────────
      // Il pulsante dice "paga E CONFERMA": sono due cose, e questa e' la
      // prima. E' accettando che i numeri si congelano sulla riga e che il
      // credito da 9,90 € viene messo da parte. Senza, /api/paga-saldo
      // trova il lavoro ancora in stato "preventivo" e rifiuta — cioe'
      // nessuna riparazione si potrebbe pagare.
      //
      // Se questa chiamata fallisce NON ci si ferma: quasi sempre vuol dire
      // che il cliente aveva gia' accettato e poi era uscito dalla cassa di
      // Stripe senza pagare. Chi decide davvero e' /api/paga-saldo, che
      // rifiuta tutto quello che non e' un preventivo accettato.
      await fetch("/api/preventivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ azione: "accetta", clienteToken: token }),
      });

      const r = await fetch("/api/paga-saldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clienteToken: token }),
      });
      const d = await r.json();
      // Si esce verso Stripe. Da qui in poi non decide piu' niente il browser:
      // la conferma tornera' al webhook, firmata.
      if (d.url) window.location.href = d.url;
      else throw new Error(d.error);
    } catch {
      setErrore(t.erroreGenerico);
      setInCorso(false);
    }
  }

  async function rifiuta() {
    if (!window.confirm(t.confermaRifiuto)) return;
    setInCorso(true);
    await fetch("/api/preventivo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ azione: "rifiuta", clienteToken: token }),
    });
    await carica(token);
    setInCorso(false);
  }

  const macchina = dati
    ? [dati.brand, nomiMacchine[dati.appliance] || dati.appliance].filter(Boolean).join(" ")
    : "";

  return (
    <>
      <Head>
        <title>{`${t.titolo} — Fixi`}</title>
        {/* Pagina privata, raggiungibile solo con il link: non va su Google. */}
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={s.pagina}>
        <a href={pre || "/"} style={s.logo}>Fixi</a>

        <div style={s.foglio}>
          {errore && <p style={s.errore}>{errore}</p>}

          {!dati && !errore && <p style={s.attesa}>…</p>}

          {dati && (
            <>
              <p style={s.occhiello}>{t.titolo}</p>
              <h1 style={s.titolo}>{riempi(t.lavoro, { macchina })}</h1>
              {dati.problem && <p style={s.problema}>&laquo;{dati.problem}&raquo;</p>}

              {/* ── Il tecnico non ha ancora fatto il prezzo ── */}
              {!dati.conti && (
                <div style={s.avviso}>
                  <p style={s.avvisoTitolo}>{t.inAttesaTitolo}</p>
                  <p style={s.avvisoTesto}>{t.inAttesaTesto}</p>
                </div>
              )}

              {/* ── C'e' un preventivo da guardare ── */}
              {dati.conti && (
                <>
                  <div style={s.conto}>
                    <Riga etichetta={t.prezzoIntervento} valore={soldi(dati.conti.prezzo)} />
                    {dati.conti.credito > 0 && (
                      <Riga
                        etichetta={t.creditoVideodiagnosi}
                        valore={`−${soldi(dati.conti.credito)}`}
                        verde
                      />
                    )}
                    <div style={s.riquadroTotale}>
                      <span style={s.etichettaTotale}>{t.daPagare}</span>
                      <span style={s.valoreTotale}>{soldi(dati.conti.daPagare)}</span>
                    </div>
                  </div>

                  {dati.stato === "preventivo" || dati.stato === "preventivo_accettato" ? (
                    <>
                      <button style={s.bottone} onClick={paga} disabled={inCorso}>
                        {riempi(t.paga, { importo: soldi(dati.conti.daPagare) })}
                      </button>

                      {dati.conti.credito > 0 && (
                        <p style={s.spiegazione}>
                          {riempi(t.spiegazioneCredito, { credito: soldi(dati.conti.credito) })}
                        </p>
                      )}

                      <button style={s.rifiuta} onClick={rifiuta} disabled={inCorso}>
                        {t.rifiuta}
                      </button>
                    </>
                  ) : (
                    <Stato stato={dati.stato} t={t} conti={dati.conti} soldi={soldi} />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Riga({ etichetta, valore, verde }) {
  return (
    <div style={s.riga}>
      <span style={s.etichetta}>{etichetta}</span>
      <span style={{ ...s.valore, color: verde ? "#1A6B50" : "#1C1C1A" }}>{valore}</span>
    </div>
  );
}

// Dopo il pagamento la pagina smette di chiedere soldi e diventa un
// riepilogo: e' la stessa schermata che il cliente riaprira' dal link
// nell'email, e deve dirgli a che punto e' il lavoro.
function Stato({ stato, t, conti, soldi }) {
  const testi = {
    pagata: [t.pagatoTitolo, t.pagatoTesto],
    in_corso: [t.inCorsoTitolo, t.pagatoTesto],
    completata: [t.completatoTitolo, t.completatoTesto],
    annullata: [t.annullatoTitolo, t.annullatoTesto],
  }[stato];

  if (!testi) return null;
  const pagato = ["pagata", "in_corso", "completata"].includes(stato);

  return (
    <div style={s.avviso}>
      <p style={s.avvisoTitolo}>{testi[0]}</p>
      <p style={s.avvisoTesto}>{testi[1]}</p>

      {pagato && (
        <div style={s.riepilogo}>
          <p style={s.riepilogoTitolo}>{t.riepilogo}</p>
          <Riga etichetta={t.pagatoPerDiagnosi} valore={soldi(conti.credito)} />
          <Riga etichetta={t.pagatoPerRiparazione} valore={soldi(conti.daPagare)} />
          <div style={s.riga}>
            <span style={{ ...s.etichetta, fontWeight: 600 }}>{t.totale}</span>
            <span style={{ ...s.valore, fontWeight: 600 }}>{soldi(conti.prezzo)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  pagina: {
    minHeight: "100vh",
    background: "#FAF8F3",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: "#1C1C1A",
    padding: "28px 20px 60px",
  },
  logo: {
    display: "block",
    fontFamily: "'Instrument Serif', serif",
    fontSize: "26px",
    color: "#1A6B50",
    textDecoration: "none",
    marginBottom: "24px",
  },
  foglio: {
    maxWidth: "460px",
    margin: "0 auto",
    background: "white",
    border: "1px solid #E4E0D8",
    borderRadius: "16px",
    padding: "28px 24px",
  },
  occhiello: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#1A6B50",
  },
  titolo: { fontFamily: "'Instrument Serif', serif", fontSize: "28px", margin: "6px 0 4px", fontWeight: 400 },
  problema: { margin: "0 0 22px", fontSize: "14px", color: "#6B6B68", fontStyle: "italic" },
  conto: { borderTop: "1px solid #E4E0D8", paddingTop: "8px" },
  riga: { display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0" },
  etichetta: { fontSize: "15px", color: "#55655f" },
  valore: { fontSize: "16px", fontVariantNumeric: "tabular-nums" },
  riquadroTotale: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: "8px",
    padding: "16px",
    background: "#EAF5EF",
    borderRadius: "12px",
  },
  etichettaTotale: { fontSize: "15px", fontWeight: 600, color: "#1A6B50" },
  valoreTotale: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1A6B50",
    fontVariantNumeric: "tabular-nums",
  },
  bottone: {
    width: "100%",
    marginTop: "20px",
    padding: "16px",
    background: "#1A6B50",
    color: "white",
    border: "none",
    borderRadius: "100px",
    fontSize: "16px",
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  spiegazione: { margin: "14px 0 0", fontSize: "13px", color: "#6B6B68", lineHeight: 1.6, textAlign: "center" },
  rifiuta: {
    display: "block",
    margin: "18px auto 0",
    background: "none",
    border: "none",
    color: "#8A8A85",
    fontSize: "14px",
    fontFamily: "inherit",
    textDecoration: "underline",
    cursor: "pointer",
  },
  avviso: { marginTop: "18px", background: "#F5F5F3", borderRadius: "12px", padding: "18px" },
  avvisoTitolo: { margin: "0 0 6px", fontSize: "16px", fontWeight: 600 },
  avvisoTesto: { margin: 0, fontSize: "14px", color: "#55655f", lineHeight: 1.6 },
  riepilogo: { marginTop: "16px", borderTop: "1px solid #E4E0D8", paddingTop: "6px" },
  riepilogoTitolo: {
    margin: "6px 0 0",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#8A8A85",
  },
  attesa: { textAlign: "center", color: "#8A8A85", margin: 0 },
  errore: { margin: 0, color: "#A01E1E", fontSize: "15px" },
};
