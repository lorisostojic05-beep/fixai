import { useState, useEffect } from "react";

export default function Admin() {
  const [autenticato, setAutenticato] = useState(false);
  const [password, setPassword] = useState("");
  const [errorePassword, setErrorePassword] = useState(false);
  const [dati, setDati] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      setAutenticato(true);
      setErrorePassword(false);
      caricaDati();
    } else {
      setErrorePassword(true);
    }
  };

  const caricaDati = async () => {
    setLoading(true);
    const res = await fetch("/api/admin-dati");
    const data = await res.json();
    setDati(data);
    setLoading(false);
  };

  if (!autenticato) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f5f3", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "2rem",
          width: "100%", maxWidth: "360px", boxShadow: "0 2px 20px rgba(0,0,0,0.08)"
        }}>
          <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>FixAI Admin</h1>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "1.5rem" }}>Accesso riservato</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{
              width: "100%", padding: "10px 12px", border: errorePassword ? "1.5px solid red" : "1.5px solid #e0e0de",
              borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
              boxSizing: "border-box", marginBottom: "8px"
            }}
          />
          {errorePassword && <p style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>Password errata</p>}
          <button
            onClick={login}
            style={{
              width: "100%", background: "#1D9E75", color: "white", border: "none",
              borderRadius: "10px", padding: "12px", fontSize: "15px",
              fontFamily: "inherit", cursor: "pointer"
            }}
          >
            Accedi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f3", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0F6E56" }}>FixAI</h1>
            <p style={{ fontSize: "13px", color: "#666" }}>Dashboard amministratore</p>
          </div>
          <button
            onClick={caricaDati}
            style={{
              background: "white", border: "1px solid #e0e0de", borderRadius: "8px",
              padding: "8px 14px", fontSize: "13px", cursor: "pointer"
            }}
          >
            🔄 Aggiorna
          </button>
        </div>

        {loading && <p style={{ color: "#666", textAlign: "center" }}>Caricamento...</p>}

        {dati && (
          <>
            {/* Statistiche principali */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "1.5rem" }}>
              {[
                { label: "Sessioni totali", valore: dati.totale, colore: "#0F6E56" },
                { label: "Voto medio", valore: dati.votoMedio ? dati.votoMedio.toFixed(1) + " / 5" : "—", colore: "#185FA5" },
                { label: "Risolti fai-da-te", valore: dati.risoltiPercent + "%", colore: "#1D9E75" },
                { label: "Durata media", valore: dati.duratMedia ? Math.round(dati.duratMedia / 60) + " min" : "—", colore: "#854F0B" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: "12px", padding: "1rem",
                  boxShadow: "0 1px 8px rgba(0,0,0,0.06)"
                }}>
                  <p style={{ fontSize: "11px", color: "#999", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: "700", color: s.colore }}>{s.valore}</p>
                </div>
              ))}
            </div>

            {/* Problemi più comuni */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "1rem" }}>Problemi più comuni</h2>
              {dati.problemiComuni.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0ee", fontSize: "13px" }}>
                  <span>{p.problema}</span>
                  <span style={{ color: "#666" }}>{p.count} sessioni</span>
                </div>
              ))}
            </div>

            {/* Elettrodomestici */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "1rem" }}>Per elettrodomestico</h2>
              {dati.perElettrodomestico.map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0ee", fontSize: "13px" }}>
                  <span>{e.appliance || "Non specificato"}</span>
                  <span style={{ color: "#666" }}>{e.count} sessioni</span>
                </div>
              ))}
            </div>

            {/* Sessioni recenti */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "1rem" }}>Sessioni recenti</h2>
              {dati.sessioni.map((s, i) => (
                <div key={i} style={{
                  padding: "12px 0", borderBottom: "1px solid #f0f0ee",
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "8px", fontSize: "13px"
                }}>
                  <div>
                    <p style={{ fontWeight: "500" }}>{s.brand} {s.appliance}</p>
                    <p style={{ color: "#666", fontSize: "12px" }}>{s.problem}</p>
                  </div>
                  <div>
                    <p style={{ color: "#666" }}>{s.email_utente || "—"}</p>
                  </div>
                  <div>
                    <p style={{ color: "#666" }}>
                      {s.durata_secondi ? Math.round(s.durata_secondi / 60) + " min" : "—"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {s.feedback_voto && (
                      <span style={{
                        background: s.feedback_risolto ? "#e8f5f0" : "#faeeda",
                        color: s.feedback_risolto ? "#0F6E56" : "#854F0B",
                        padding: "2px 8px", borderRadius: "20px", fontSize: "11px"
                      }}>
                        {s.feedback_risolto ? "✅ Risolto" : "🔧 Tecnico"} · {s.feedback_voto}/5
                      </span>
                    )}
                    <p style={{ color: "#999", fontSize: "11px", marginTop: "4px" }}>
                      {new Date(s.created_at).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}