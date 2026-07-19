// Pagina raggiunta dal tecnico tramite il link nell'email.
// Mostra il lavoro e un pulsante per accettarlo; i contatti del cliente
// compaiono solo dopo l'accettazione.

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const URGENZA_LABEL = { bassa: "Bassa", media: "Media", alta: "Alta" };

export default function AccettaLavoro() {
  const router = useRouter();
  const { token, t: tecnicoId } = router.query;

  const [lavoro, setLavoro] = useState(null);
  const [errore, setErrore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accettando, setAccettando] = useState(false);
  const [esito, setEsito] = useState(null); // { ok, cliente } | { giaAssegnata }

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setErrore("Link non valido.");
      setLoading(false);
      return;
    }
    fetch(`/api/accetta-lavoro?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setErrore(data.error);
        else setLavoro(data);
      })
      .catch(() => setErrore("Errore di rete. Riprova."))
      .finally(() => setLoading(false));
  }, [router.isReady, token]);

  const accetta = async () => {
    setAccettando(true);
    try {
      const res = await fetch("/api/accetta-lavoro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tecnicoId }),
      });
      const data = await res.json();
      if (data.error) setErrore(data.error);
      else setEsito(data);
    } catch {
      setErrore("Errore di rete. Riprova.");
    } finally {
      setAccettando(false);
    }
  };

  const card = {
    background: "white", borderRadius: "16px", padding: "2rem",
    width: "100%", maxWidth: "480px", boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
  };
  const box = { background: "#f5f5f3", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px" };
  const label = { fontSize: "10px", fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" };

  return (
    <>
      <Head><title>Fixi — Accetta il lavoro</title></Head>
      <div style={{
        minHeight: "100vh", background: "#f5f5f3", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "16px",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={card}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F6E56", marginBottom: "4px" }}>Fixi</h1>

          {loading && <p style={{ color: "#666", fontSize: "14px" }}>Caricamento lavoro...</p>}

          {errore && (
            <>
              <p style={{ fontSize: "15px", fontWeight: 600, margin: "12px 0 4px" }}>⚠️ Ops</p>
              <p style={{ color: "#666", fontSize: "14px" }}>{errore}</p>
            </>
          )}

          {/* Lavoro già preso da un altro tecnico */}
          {esito?.giaAssegnata && (
            <>
              <p style={{ fontSize: "15px", fontWeight: 600, margin: "12px 0 4px" }}>😕 Lavoro già assegnato</p>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.6 }}>
                Un altro tecnico ha accettato prima di te. Ti avviseremo alla prossima richiesta nella tua zona!
              </p>
            </>
          )}

          {/* Accettazione riuscita: contatti del cliente */}
          {esito?.ok && (
            <>
              <p style={{ fontSize: "16px", fontWeight: 600, margin: "12px 0 8px" }}>✅ Il lavoro è tuo!</p>
              <p style={{ color: "#666", fontSize: "13px", marginBottom: "14px" }}>
                Ti abbiamo inviato questi dati anche via email. Contatta il cliente per accordarvi:
              </p>
              <div style={{ ...box, background: "#e8f5f0" }}>
                <p style={{ fontSize: "15px", fontWeight: 600, margin: 0 }}>{esito.cliente.nome}</p>
                <p style={{ fontSize: "14px", margin: "6px 0 0" }}>
                  📞 <a href={`tel:${esito.cliente.telefono}`} style={{ color: "#0F6E56" }}>{esito.cliente.telefono}</a>
                </p>
                {esito.cliente.email && <p style={{ fontSize: "14px", margin: "4px 0 0" }}>✉️ {esito.cliente.email}</p>}
                <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0" }}>
                  📍 {esito.cliente.citta || ""} {esito.cliente.cap && `(${esito.cliente.cap})`}
                </p>
              </div>
            </>
          )}

          {/* Dettagli lavoro + pulsante accetta */}
          {lavoro && !esito && !errore && (
            <>
              {lavoro.stato !== "inviata" ? (
                <>
                  <p style={{ fontSize: "15px", fontWeight: 600, margin: "12px 0 4px" }}>😕 Lavoro non più disponibile</p>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    Questa richiesta è già stata assegnata o chiusa.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: "#666", fontSize: "13px", marginBottom: "16px" }}>
                    Nuovo lavoro con diagnosi già fatta — zona {lavoro.citta || ""} (CAP {lavoro.cap})
                  </p>
                  <div style={box}>
                    <p style={label}>Elettrodomestico</p>
                    <p style={{ fontSize: "14px", margin: 0, fontWeight: 600 }}>{lavoro.brand} {lavoro.appliance}</p>
                    <p style={{ fontSize: "13px", color: "#555", margin: "4px 0 0" }}>"{lavoro.problem}"</p>
                  </div>
                  {lavoro.diagnosis && (
                    <div style={{ ...box, background: "#e8f5f0" }}>
                      <p style={label}>Diagnosi AI</p>
                      <p style={{ fontSize: "13px", margin: 0, lineHeight: 1.5 }}>{lavoro.diagnosis}</p>
                    </div>
                  )}
                  {lavoro.technicianCost && (
                    <div style={{ ...box, background: "#e6f1fb" }}>
                      <p style={{ ...label, color: "#185FA5" }}>Stima mostrata al cliente</p>
                      <p style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "#0F6E56" }}>{lavoro.technicianCost}</p>
                      {lavoro.urgency && (
                        <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0" }}>
                          Urgenza: {URGENZA_LABEL[lavoro.urgency] || lavoro.urgency}
                        </p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={accetta}
                    disabled={accettando || !tecnicoId}
                    style={{
                      width: "100%", background: "#0F6E56", color: "white", border: "none",
                      borderRadius: "100px", padding: "14px", fontSize: "15px", fontWeight: 600,
                      cursor: "pointer", marginTop: "8px", opacity: accettando ? 0.7 : 1,
                    }}
                  >
                    {accettando ? "⏳ Un attimo..." : "✅ Accetta il lavoro"}
                  </button>
                  <p style={{ fontSize: "12px", color: "#888", marginTop: "10px", textAlign: "center" }}>
                    Il lavoro va al primo tecnico che accetta. Accettando ricevi subito i contatti del cliente.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
