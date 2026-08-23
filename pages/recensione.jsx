// Pagina raggiunta dal cliente tramite l'email "Com'è andata?":
// voto da 1 a 5 stelle + commento facoltativo.

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Recensione() {
  const router = useRouter();
  const { token } = router.query;

  const [info, setInfo] = useState(null);
  const [errore, setErrore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voto, setVoto] = useState(0);
  const [commento, setCommento] = useState("");
  const [inviando, setInviando] = useState(false);
  const [inviata, setInviata] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setErrore("Link non valido.");
      setLoading(false);
      return;
    }
    fetch(`/api/recensione?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErrore(d.error);
        else setInfo(d);
      })
      .catch(() => setErrore("Errore di rete. Ricarica la pagina."))
      .finally(() => setLoading(false));
  }, [router.isReady, token]);

  const invia = async () => {
    if (!voto) {
      alert("Seleziona un voto da 1 a 5 stelle.");
      return;
    }
    setInviando(true);
    try {
      const res = await fetch("/api/recensione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, voto, commento }),
      });
      const d = await res.json();
      if (d.error) alert(`⚠️ ${d.error}`);
      else setInviata(true);
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setInviando(false);
    }
  };

  return (
    <>
      <Head><title>Fixi — Lascia una recensione</title></Head>
      <div style={{
        minHeight: "100vh", background: "#f5f5f3", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "16px",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "2rem",
          width: "100%", maxWidth: "420px", boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        }}>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0F6E56", marginBottom: "4px" }}>Fixi</h1>

          {loading && <p style={{ color: "#666", fontSize: "14px" }}>Caricamento...</p>}

          {errore && (
            <>
              <p style={{ fontWeight: 600, margin: "12px 0 4px" }}>⚠️ Ops</p>
              <p style={{ color: "#666", fontSize: "14px" }}>{errore}</p>
            </>
          )}

          {(inviata || info?.giaRecensito) && !errore && (
            <>
              <p style={{ fontSize: "16px", fontWeight: 600, margin: "12px 0 6px" }}>
                {inviata ? "Grazie! 🙏" : "Recensione già inviata ✅"}
              </p>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.6 }}>
                {inviata
                  ? "La tua recensione aiuta gli altri clienti a scegliere il tecnico giusto."
                  : "Hai già lasciato la tua recensione per questo lavoro — grazie!"}
              </p>
            </>
          )}

          {info && !info.giaRecensito && !inviata && !errore && (
            <>
              <p style={{ color: "#666", fontSize: "14px", margin: "8px 0 20px", lineHeight: 1.6 }}>
                Com'è andata la riparazione della tua <strong>{info.brand} {info.appliance}</strong> con <strong>{info.tecnico}</strong>?
              </p>

              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "16px" }}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVoto(v)}
                    style={{
                      fontSize: "34px", background: "none", border: "none", cursor: "pointer",
                      color: v <= voto ? "#E8A21D" : "#ddd", padding: "0 2px", lineHeight: 1,
                    }}
                    aria-label={`${v} stelle`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Racconta com'è andata (facoltativo)..."
                value={commento}
                onChange={(e) => setCommento(e.target.value)}
                rows={3}
                maxLength={500}
                style={{
                  width: "100%", padding: "10px 12px", border: "1.5px solid #e0e0de",
                  borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
                  boxSizing: "border-box", marginBottom: "12px", resize: "vertical",
                }}
              />

              <button
                onClick={invia}
                disabled={inviando}
                style={{
                  width: "100%", background: "#0F6E56", color: "white", border: "none",
                  borderRadius: "100px", padding: "13px", fontSize: "15px", fontWeight: 600,
                  cursor: "pointer", opacity: inviando ? 0.7 : 1,
                }}
              >
                {inviando ? "⏳ Invio..." : "Invia recensione"}
              </button>
            </>
          )}
        </div>
        <a
          href="/"
          style={{
            display: "block", textAlign: "center", margin: "18px auto 0",
            color: "#8A8A85", fontSize: "14px", textDecoration: "underline",
          }}
        >
          ← Torna alla home
        </a>
      </div>
    </>
  );
}
