import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

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

export default function IscrivitiTecnico() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inviato, setInviato] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    citta: "",
    cap: "",
    specializzazioni: [],
    anni_esperienza: "",
    descrizione: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const toggleSpec = (s) => {
    setForm((prev) => ({
      ...prev,
      specializzazioni: prev.specializzazioni.includes(s)
        ? prev.specializzazioni.filter((x) => x !== s)
        : [...prev.specializzazioni, s],
    }));
  };

  const invia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/iscriviti-tecnico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) setInviato(true);
      else alert("Errore durante l'invio. Riprova.");
    } catch (err) {
      alert("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (inviato) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: "48px", marginBottom: "16px", textAlign: "center" }}>🎉</div>
          <h1 style={{ ...styles.title, textAlign: "center" }}>Richiesta inviata!</h1>
          <p style={{ ...styles.sub, textAlign: "center", marginBottom: "24px" }}>
            Abbiamo ricevuto la tua iscrizione. La esamineremo entro 48 ore e ti contatteremo via email.
          </p>
          <Link href="/" style={styles.btnPrimary}>Torna alla home →</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Iscriviti come tecnico — Fixi</title>
        <meta name="description" content="Unisciti alla rete Fixi. Ricevi lavori qualificati, zero costi fissi." />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <Link href="/" style={styles.logo}>Fixi</Link>
        </div>

        <div style={styles.container}>
          <div style={styles.card}>
            {/* Progress */}
            <div style={styles.progress}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    ...styles.progressDot,
                    background: step >= n ? "#1A6B50" : "#E4E0D8",
                    color: step >= n ? "white" : "#999",
                  }}>
                    {step > n ? "✓" : n}
                  </div>
                  {n < 3 && <div style={{ width: "40px", height: "1px", background: step > n ? "#1A6B50" : "#E4E0D8" }} />}
                </div>
              ))}
            </div>

            {/* Step 1 — Dati personali */}
            {step === 1 && (
              <div>
                <h1 style={styles.title}>Ciao! Iniziamo<br /><em style={styles.em}>con i tuoi dati.</em></h1>
                <p style={styles.sub}>Ci vogliono 3 minuti. Nessun costo, nessun obbligo.</p>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nome</label>
                    <input style={styles.input} value={form.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Mario" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cognome</label>
                    <input style={styles.input} value={form.cognome} onChange={(e) => update("cognome", e.target.value)} placeholder="Rossi" />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input style={styles.input} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="mario@email.com" />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Telefono</label>
                  <input style={styles.input} type="tel" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} placeholder="+39 333 1234567" />
                </div>

                {/* Al passo 1 "Indietro" esce dal modulo. Prima non c'era, e chi
                    cambiava idea qui restava intrappolato: l'unica uscita era la
                    scritta "Fixi" in alto, che nessuno legge come un pulsante.
                    Segnalato da un tester. Stessa forma e stessa posizione degli
                    altri passi, se no non lo si riconosce come la via d'uscita. */}
                <div style={styles.btnRow}>
                  <Link href="/" style={{ ...styles.btnGhost, textAlign: "center", textDecoration: "none" }}>
                    ← Indietro
                  </Link>
                  <button
                    style={styles.btnPrimary}
                    onClick={() => setStep(2)}
                    disabled={!form.nome || !form.cognome || !form.email || !form.telefono}
                  >
                    Continua →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Zona e specializzazioni */}
            {step === 2 && (
              <div>
                <h1 style={styles.title}>Dove operi<br /><em style={styles.em}>e in cosa sei esperto?</em></h1>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Città</label>
                    <input style={styles.input} value={form.citta} onChange={(e) => update("citta", e.target.value)} placeholder="Milano" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>CAP</label>
                    <input style={styles.input} value={form.cap} onChange={(e) => update("cap", e.target.value)} placeholder="20100" />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Specializzazioni</label>
                  <div style={styles.specGrid}>
                    {SPECIALIZZAZIONI.map((s) => (
                      <button
                        key={s}
                        style={{
                          ...styles.specBtn,
                          ...(form.specializzazioni.includes(s) ? styles.specBtnActive : {}),
                        }}
                        onClick={() => toggleSpec(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Anni di esperienza</label>
                  <input style={styles.input} type="number" value={form.anni_esperienza} onChange={(e) => update("anni_esperienza", e.target.value)} placeholder="es. 10" min="0" max="50" />
                </div>

                <div style={styles.btnRow}>
                  <button style={styles.btnGhost} onClick={() => setStep(1)}>← Indietro</button>
                  <button
                    style={styles.btnPrimary}
                    onClick={() => setStep(3)}
                    disabled={!form.citta || !form.cap || form.specializzazioni.length === 0}
                  >
                    Continua →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Presentazione */}
            {step === 3 && (
              <div>
                <h1 style={styles.title}>Presentati<br /><em style={styles.em}>ai tuoi futuri clienti.</em></h1>
                <p style={styles.sub}>Una breve descrizione di chi sei e come lavori.</p>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Descrizione (opzionale)</label>
                  <textarea
                    style={{ ...styles.input, height: "120px", resize: "vertical" }}
                    value={form.descrizione}
                    onChange={(e) => update("descrizione", e.target.value)}
                    placeholder="Es. Tecnico specializzato in lavatrici e lavastoviglie con 10 anni di esperienza. Intervengo a Milano e provincia entro 24 ore..."
                  />
                </div>

                <div style={{ background: "#EAF5EF", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", color: "#1A6B50", lineHeight: "1.6" }}>
                    ✓ Iscrizione gratuita<br />
                    ✓ Nessuna commissione sui lavori in questa fase di lancio<br />
                    ✓ Attivazione entro 48 ore dalla verifica<br />
                    ✓ Puoi disiscriverti in qualsiasi momento
                  </p>
                  <p style={{ fontSize: "12px", color: "#4A6B5E", lineHeight: "1.6", marginTop: "10px" }}>
                    Se in futuro introdurremo una commissione sui lavori, te lo comunicheremo
                    via email con anticipo: potrai decidere se continuare o disiscriverti.
                  </p>
                </div>

                <div style={styles.btnRow}>
                  <button style={styles.btnGhost} onClick={() => setStep(2)}>← Indietro</button>
                  <button style={styles.btnPrimary} onClick={invia} disabled={loading}>
                    {loading ? "Invio..." : "Invia richiesta →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FAF8F3",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  header: {
    padding: "20px 48px",
    borderBottom: "1px solid #E4E0D8",
    background: "white",
  },
  logo: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "22px",
    color: "#1A6B50",
    textDecoration: "none",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
    border: "1px solid #E4E0D8",
  },
  progress: {
    display: "flex",
    alignItems: "center",
    marginBottom: "32px",
  },
  progressDot: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
  },
  title: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "32px",
    lineHeight: "1.1",
    marginBottom: "8px",
    color: "#1C1C1A",
  },
  em: {
    fontStyle: "italic",
    color: "#1A6B50",
  },
  sub: {
    fontSize: "14px",
    color: "#6B6B68",
    lineHeight: "1.6",
    marginBottom: "28px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#444",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #E4E0D8",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1C1C1A",
    background: "white",
    boxSizing: "border-box",
    outline: "none",
  },
  specGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "4px",
  },
  specBtn: {
    background: "#F5F5F3",
    border: "1.5px solid #E4E0D8",
    borderRadius: "100px",
    padding: "7px 16px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#444",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },
  specBtnActive: {
    background: "#EAF5EF",
    borderColor: "#1A6B50",
    color: "#1A6B50",
    fontWeight: "500",
  },
  btnPrimary: {
    display: "inline-block",
    background: "#1A6B50",
    color: "white",
    border: "none",
    borderRadius: "100px",
    padding: "13px 28px",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 0.2s",
    width: "100%",
    textAlign: "center",
  },
  btnGhost: {
    background: "none",
    border: "none",
    color: "#6B6B68",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: "13px 0",
  },
  btnRow: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    justifyContent: "space-between",
  },
};