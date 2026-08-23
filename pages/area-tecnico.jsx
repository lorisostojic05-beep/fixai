// Area personale del tecnico: lavori assegnati, contatti clienti, profilo.
// Vi si accede solo con il link personale ricevuto via email all'approvazione.

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const SPECIALIZZAZIONI = [
  "Lavatrici",
  "Lavastoviglie",
  "Asciugatrici",
  "Frigoriferi",
  "Forni",
  "Piani cottura",
  "Climatizzatori",
  "Caldaie",
];

const STATO_BADGE = {
  accettata: { bg: "#faeeda", col: "#854F0B", label: "🔧 Da fare" },
  completata: { bg: "#e8f5f0", col: "#0F6E56", label: "✅ Completato" },
};

function Stelle({ voto }) {
  return (
    <span style={{ color: "#E8A21D", fontSize: "14px" }}>
      {"★".repeat(voto)}{"☆".repeat(5 - voto)}
    </span>
  );
}

export default function AreaTecnico() {
  const router = useRouter();
  const { token } = router.query;

  const [dati, setDati] = useState(null);
  const [errore, setErrore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilo, setProfilo] = useState(null);
  const [salvandoProfilo, setSalvandoProfilo] = useState(false);
  const [profiloSalvato, setProfiloSalvato] = useState(false);
  const [completandoId, setCompletandoId] = useState(null);

  const carica = () => {
    fetch(`/api/area-tecnico?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setErrore(d.error);
        else {
          setDati(d);
          setProfilo({
            telefono: d.tecnico.telefono || "",
            citta: d.tecnico.citta || "",
            cap: d.tecnico.cap || "",
            specializzazioni: d.tecnico.specializzazioni || [],
          });
        }
      })
      .catch(() => setErrore("Errore di rete. Ricarica la pagina."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setErrore("Link non valido.");
      setLoading(false);
      return;
    }
    carica();
  }, [router.isReady, token]);

  const salvaProfilo = async () => {
    setSalvandoProfilo(true);
    setProfiloSalvato(false);
    try {
      const res = await fetch("/api/area-tecnico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, azione: "profilo", ...profilo }),
      });
      const d = await res.json();
      if (d.error) alert(`⚠️ ${d.error}`);
      else setProfiloSalvato(true);
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setSalvandoProfilo(false);
    }
  };

  const completaLavoro = async (richiestaId) => {
    setCompletandoId(richiestaId);
    try {
      const res = await fetch("/api/area-tecnico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, azione: "completa", richiestaId }),
      });
      const d = await res.json();
      if (d.error) alert(`⚠️ ${d.error}`);
      else carica();
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setCompletandoId(null);
    }
  };

  const card = {
    background: "white", borderRadius: "16px", padding: "1.5rem",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06)", marginBottom: "16px",
  };
  const input = {
    width: "100%", padding: "10px 12px", border: "1.5px solid #e0e0de",
    borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <>
      <Head><title>Fixi — Area tecnico</title></Head>
      <div style={{ minHeight: "100vh", background: "#f5f5f3", fontFamily: "system-ui, sans-serif", padding: "24px 16px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0F6E56", marginBottom: "4px" }}>Fixi</h1>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>Area tecnico</p>

          {loading && <p style={{ color: "#666" }}>Caricamento...</p>}
          {errore && (
            <div style={card}>
              <p style={{ fontWeight: 600, marginBottom: "4px" }}>⚠️ Accesso non riuscito</p>
              <p style={{ color: "#666", fontSize: "14px" }}>{errore}</p>
            </div>
          )}

          {dati && (
            <>
              {/* Benvenuto */}
              <div style={card}>
                <p style={{ fontSize: "18px", fontWeight: 700 }}>Ciao {dati.tecnico.nome}! 👋</p>
                <p style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                  {dati.lavori.filter((l) => l.stato === "accettata").length} lavori da fare ·{" "}
                  {dati.lavori.filter((l) => l.stato === "completata").length} completati
                </p>
              </div>

              {/* Lavori */}
              <div style={card}>
                <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>🔧 I tuoi lavori</h2>
                {dati.lavori.length === 0 && (
                  <p style={{ fontSize: "13px", color: "#666" }}>
                    Ancora nessun lavoro. Quando accetterai un lavoro dalle email che ricevi, lo troverai qui.
                  </p>
                )}
                {dati.lavori.map((l) => {
                  const badge = STATO_BADGE[l.stato] || { bg: "#f0f0ee", col: "#666", label: l.stato };
                  return (
                    <div key={l.id} style={{ padding: "14px 0", borderBottom: "1px solid #f0f0ee" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "14px" }}>{l.brand} {l.appliance}</p>
                          <p style={{ fontSize: "13px", color: "#555", marginTop: "2px" }}>"{l.problem}"</p>
                          <p style={{ fontSize: "13px", marginTop: "6px" }}>
                            👤 {l.nome} · 📞 <a href={`tel:${l.telefono}`} style={{ color: "#0F6E56" }}>{l.telefono}</a>
                          </p>
                          <p style={{ fontSize: "12px", color: "#666" }}>📍 {l.citta || ""} ({l.cap})</p>
                        </div>
                        <span style={{
                          background: badge.bg, color: badge.col, whiteSpace: "nowrap",
                          padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
                        }}>
                          {badge.label}
                        </span>
                      </div>

                      {l.stato === "accettata" && (
                        <button
                          onClick={() => completaLavoro(l.id)}
                          disabled={completandoId === l.id}
                          style={{
                            marginTop: "10px", background: "#0F6E56", color: "white", border: "none",
                            borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: 600,
                            cursor: "pointer", opacity: completandoId === l.id ? 0.7 : 1,
                          }}
                        >
                          {completandoId === l.id ? "⏳ Un attimo..." : "✅ Segna come completato"}
                        </button>
                      )}

                      {l.stato === "completata" && (
                        <div style={{ marginTop: "8px", fontSize: "13px" }}>
                          {l.recensione_voto ? (
                            <>
                              <Stelle voto={l.recensione_voto} />
                              {l.recensione_commento && (
                                <p style={{ color: "#555", fontStyle: "italic", marginTop: "2px" }}>
                                  "{l.recensione_commento}"
                                </p>
                              )}
                            </>
                          ) : (
                            <p style={{ color: "#999", fontSize: "12px" }}>In attesa della recensione del cliente</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Profilo */}
              {profilo && (
                <div style={card}>
                  <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "12px" }}>👤 Il tuo profilo</h2>
                  <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
                    {dati.tecnico.nome} {dati.tecnico.cognome} · {dati.tecnico.email}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: "8px", marginBottom: "12px" }}>
                    <input
                      style={input} type="tel" placeholder="Telefono"
                      value={profilo.telefono}
                      onChange={(e) => setProfilo({ ...profilo, telefono: e.target.value })}
                    />
                    <input
                      style={input} type="text" placeholder="Città"
                      value={profilo.citta}
                      onChange={(e) => setProfilo({ ...profilo, citta: e.target.value })}
                    />
                    <input
                      style={input} type="text" placeholder="CAP" maxLength={5}
                      value={profilo.cap}
                      onChange={(e) => setProfilo({ ...profilo, cap: e.target.value.replace(/\D/g, "") })}
                    />
                  </div>
                  <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Le tue specializzazioni:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                    {SPECIALIZZAZIONI.map((s) => {
                      const attiva = profilo.specializzazioni.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() =>
                            setProfilo({
                              ...profilo,
                              specializzazioni: attiva
                                ? profilo.specializzazioni.filter((x) => x !== s)
                                : [...profilo.specializzazioni, s],
                            })
                          }
                          style={{
                            border: attiva ? "1.5px solid #0F6E56" : "1.5px solid #e0e0de",
                            background: attiva ? "#e8f5f0" : "white",
                            color: attiva ? "#0F6E56" : "#555",
                            borderRadius: "100px", padding: "6px 14px", fontSize: "13px", cursor: "pointer",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={salvaProfilo}
                    disabled={salvandoProfilo}
                    style={{
                      background: "#0F6E56", color: "white", border: "none", borderRadius: "10px",
                      padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                      opacity: salvandoProfilo ? 0.7 : 1,
                    }}
                  >
                    {salvandoProfilo ? "⏳ Salvo..." : "💾 Salva profilo"}
                  </button>
                  {profiloSalvato && (
                    <span style={{ marginLeft: "10px", color: "#0F6E56", fontSize: "13px" }}>✅ Salvato!</span>
                  )}
                </div>
              )}
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
