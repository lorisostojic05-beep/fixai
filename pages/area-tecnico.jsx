// Area personale del tecnico: lavori assegnati, contatti clienti, profilo.
// Vi si accede solo con il link personale ricevuto via email all'approvazione.

import { useState, useEffect } from "react";
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
  accettata: { bg: "#faeeda", col: "#854F0B", label: "💬 Da preventivare" },
  preventivo: { bg: "#e6f1fb", col: "#185FA5", label: "⏳ In attesa del cliente" },
  preventivo_accettato: { bg: "#e6f1fb", col: "#185FA5", label: "💳 In attesa del pagamento" },
  pagata: { bg: "#e8f5f0", col: "#0F6E56", label: "✅ Pagato: puoi andare" },
  in_corso: { bg: "#faeeda", col: "#854F0B", label: "🔧 In corso" },
  completata: { bg: "#e8f5f0", col: "#0F6E56", label: "✅ Completato" },
  annullata: { bg: "#f0f0ee", col: "#666", label: "Annullato" },
  contestata: { bg: "#fdeaea", col: "#A01E1E", label: "⚠️ Contestato" },
};

// Il tecnico non deve leggere la parola "Stripe": deve sapere se verra' pagato.
const PAGAMENTI = {
  non_configurato: { col: "#A01E1E", testo: "Pagamenti non configurati" },
  incompleto: { col: "#854F0B", testo: "Configurazione incompleta" },
  attivo: { col: "#0F6E56", testo: "Pagamenti attivi" },
};

const euro = (c) =>
  typeof c === "number" ? new Intl.NumberFormat("it", { style: "currency", currency: "EUR" }).format(c / 100) : "";

// Quanto resta al tecnico, calcolato mentre scrive il prezzo.
// E' una stima mostrata a schermo: il numero che conta lo calcola il server
// quando il cliente accetta, e viene riscritto sulla riga del lavoro.
function Economia({ prezzo }) {
  const p = Math.round(parseFloat(String(prezzo ?? "").replace(",", ".")) * 100);
  if (!p || p <= 0) return null;
  const commissione = Math.round(p * 0.1);
  return (
    <div style={{ marginTop: "12px", fontSize: "13px", lineHeight: 1.9 }}>
      <Voce testo="Prezzo al cliente" valore={euro(p)} />
      <Voce testo="Commissione Fixi (10%)" valore={"−" + euro(commissione)} />
      <Voce testo="Tu ricevi" valore={euro(p - commissione)} forte />
    </div>
  );
}

function Voce({ testo, valore, forte, colore }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: forte ? 700 : 400,
        color: colore || (forte ? "#0F6E56" : "inherit"),
        borderTop: forte ? "1px solid #e8e4dc" : "none",
        paddingTop: forte ? "6px" : 0,
        marginTop: forte ? "4px" : 0,
      }}
    >
      <span style={{ color: forte || colore ? "inherit" : "#666" }}>{testo}</span>
      <span>{valore}</span>
    </div>
  );
}

const riquadro = {
  marginTop: "12px",
  background: "#f9f9f7",
  borderRadius: "12px",
  padding: "14px",
};

const bottone = {
  marginTop: "10px",
  background: "#0F6E56",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "9px 16px",
  fontSize: "13px",
  fontWeight: 600,
  fontFamily: "inherit",
  cursor: "pointer",
};

function Stelle({ voto }) {
  return (
    <span style={{ color: "#E8A21D", fontSize: "14px" }}>
      {"★".repeat(voto)}{"☆".repeat(5 - voto)}
    </span>
  );
}

export default function AreaTecnico() {
  // Il token si legge dall'indirizzo, non da router.query.
  //
  // Questa pagina si apre SEMPRE da un link ricevuto per email: non ci si
  // arriva mai navigando dentro il sito. Aspettare che il router di Next sia
  // pronto aggiunge una dipendenza che non serve — e in certi browser quel
  // "pronto" non arriva mai, lasciando il tecnico su "Caricamento..." per
  // sempre. L'indirizzo invece c'e' da subito, sempre.
  const [token, setToken] = useState(null);
  const [tokenLetto, setTokenLetto] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    setTokenLetto(true);
  }, []);

  const [dati, setDati] = useState(null);
  const [errore, setErrore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilo, setProfilo] = useState(null);
  const [salvandoProfilo, setSalvandoProfilo] = useState(false);
  const [profiloSalvato, setProfiloSalvato] = useState(false);
  const [completandoId, setCompletandoId] = useState(null);
  const [prezzi, setPrezzi] = useState({});     // quanto sta scrivendo, per lavoro
  const [occupato, setOccupato] = useState(null);

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
    if (!tokenLetto) return;
    if (!token) {
      setErrore("Link non valido.");
      setLoading(false);
      return;
    }
    carica();
  }, [tokenLetto, token]);

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

  // Apre la configurazione dei pagamenti su Stripe. Il tecnico esce dal sito
  // e torna qui quando ha finito.
  const configuraPagamenti = async () => {
    setOccupato("pagamenti");
    try {
      const res = await fetch("/api/connect-tecnico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else alert(`⚠️ ${d.error || "Riprova fra un momento."}`);
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setOccupato(null);
    }
  };

  // Il tecnico scrive il prezzo TOTALE dell'intervento. Del credito da 9,90 €
  // del cliente non deve sapere niente: non cambia di un centesimo quello che
  // prende lui, e saperlo lo porterebbe solo a sbagliare per eccesso di zelo.
  const proponiPrezzo = async (richiestaId) => {
    const prezzo = prezzi[richiestaId];
    if (!prezzo) return;
    setOccupato(richiestaId);
    try {
      const res = await fetch("/api/preventivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ azione: "proponi", token, richiestaId, prezzo }),
      });
      const d = await res.json();
      if (d.error) alert(`⚠️ ${d.error}`);
      else carica();
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setOccupato(null);
    }
  };

  const avanza = async (richiestaId, azione) => {
    setOccupato(richiestaId);
    try {
      const res = await fetch("/api/avanza-lavoro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, richiestaId, azione }),
      });
      const d = await res.json();
      if (d.error) alert(`⚠️ ${d.error}`);
      else {
        // Se il bonifico non e' partito, il tecnico deve saperlo subito: il
        // lavoro e' comunque completato, ma i soldi arrivano dopo.
        if (d.bonifico && !d.bonifico.fatto) alert(`Lavoro completato. Pagamento: ${d.bonifico.motivo}`);
        carica();
      }
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setOccupato(null);
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

              {/* Pagamenti — sta in alto perche' senza questo il tecnico
                  lavora e non viene pagato, ed e' la cosa che deve sistemare
                  per prima. */}
              {dati.pagamenti !== "attivo" && (
                <div style={{ ...card, borderLeft: "4px solid " + PAGAMENTI[dati.pagamenti].col }}>
                  <p style={{ fontWeight: 600, fontSize: "15px", color: PAGAMENTI[dati.pagamenti].col }}>
                    {PAGAMENTI[dati.pagamenti].testo}
                  </p>
                  <p style={{ fontSize: "13px", color: "#666", marginTop: "6px", lineHeight: 1.6 }}>
                    Per ricevere i pagamenti dei lavori devi completare la configurazione. Ci vogliono
                    pochi minuti e ti servono i dati del tuo conto corrente.
                  </p>
                  <button
                    onClick={configuraPagamenti}
                    disabled={occupato === "pagamenti"}
                    style={{
                      marginTop: "12px", background: "#0F6E56", color: "white", border: "none",
                      borderRadius: "10px", padding: "11px 18px", fontSize: "14px", fontWeight: 600,
                      fontFamily: "inherit", cursor: "pointer",
                    }}
                  >
                    {occupato === "pagamenti" ? "⏳ Un attimo..." : "Configura i pagamenti →"}
                  </button>
                </div>
              )}

              {dati.pagamenti === "attivo" && (
                <p style={{ fontSize: "13px", color: "#0F6E56", margin: "-8px 0 16px 4px" }}>
                  ✅ Pagamenti attivi
                </p>
              )}

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

                      {/* ── Il preventivo ─────────────────────────────────
                          Si scrive il prezzo TOTALE dell'intervento. Del
                          credito da 9,90 € del cliente qui non c'e' traccia,
                          ed e' voluto: non cambia di un centesimo quello che
                          prende il tecnico, e saperlo lo porterebbe solo a
                          scontarselo da solo. */}
                      {(l.stato === "accettata" || l.stato === "preventivo") && (
                        <div style={riquadro}>
                          <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
                            {l.stato === "preventivo" ? "Correggi il preventivo" : "Fai il preventivo"}
                          </p>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              style={{ ...input, flex: "0 0 130px" }}
                              inputMode="decimal"
                              placeholder="es. 120"
                              value={prezzi[l.id] ?? (l.preventivo_centesimi ? String(l.preventivo_centesimi / 100) : "")}
                              onChange={(e) => setPrezzi({ ...prezzi, [l.id]: e.target.value })}
                            />
                            <span style={{ fontSize: "14px", color: "#666" }}>€ totali</span>
                          </div>

                          <Economia prezzo={prezzi[l.id] ?? (l.preventivo_centesimi ? String(l.preventivo_centesimi / 100) : "")} />

                          <button
                            onClick={() => proponiPrezzo(l.id)}
                            disabled={occupato === l.id}
                            style={{
                              marginTop: "12px", background: "#0F6E56", color: "white", border: "none",
                              borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: 600,
                              fontFamily: "inherit", cursor: "pointer",
                            }}
                          >
                            {occupato === l.id ? "⏳ Un attimo..." : "Manda il preventivo al cliente"}
                          </button>

                          {l.stato === "preventivo" && (
                            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                              Inviato: {euro(l.preventivo_centesimi)}. Puoi correggerlo finche&#39; il
                              cliente non lo accetta.
                            </p>
                          )}
                        </div>
                      )}

                      {l.stato === "pagata" && (
                        <button onClick={() => avanza(l.id, "inizia")} disabled={occupato === l.id} style={bottone}>
                          {/* Apostrofo vero, non &#39;: dentro una stringa JavaScript
                              le entita' HTML non vengono decodificate e il tecnico
                              leggerebbe "l&#39;intervento" scritto per esteso. */}
                          {occupato === l.id ? "⏳..." : "🚗 Ho iniziato l’intervento"}
                        </button>
                      )}

                      {l.stato === "in_corso" && (
                        <button onClick={() => avanza(l.id, "completa")} disabled={occupato === l.id} style={bottone}>
                          {occupato === l.id ? "⏳..." : "✅ Ho finito: segna come completato"}
                        </button>
                      )}

                      {/* I conti del lavoro. Arrivano dal server: qui non si
                          calcola niente, si scrive e basta. */}
                      {l.prezzo_finale_centesimi > 0 && (
                        <div style={{ ...riquadro, lineHeight: 1.8, fontSize: "13px" }}>
                          <Voce testo="Totale cliente" valore={euro(l.prezzo_finale_centesimi)} />
                          <Voce testo="Commissione Fixi" valore={"−" + euro(l.commissione_centesimi)} />
                          <Voce testo="Netto" valore={euro(l.netto_tecnico_centesimi)} forte />
                          <Voce
                            testo="Stato pagamento"
                            valore={l.transfer_id ? "Pagato" : "In attesa"}
                            colore={l.transfer_id ? "#0F6E56" : "#854F0B"}
                          />
                        </div>
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
