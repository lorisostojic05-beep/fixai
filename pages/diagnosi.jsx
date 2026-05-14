import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/diagnosi.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { generaRefertoPDF } from "../lib/generaPDF";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ─── Configurazione ────────────────────────────────────────────────
const SCREENSHOT_INTERVAL_MS = 25000; // cattura frame ogni 4 secondi
const MAX_HISTORY = 20;              // massimo messaggi nella history

// ─── Componenti UI ─────────────────────────────────────────────────
function ChatBubble({ message }) {
  return (
    <div className={`${styles.bubble} ${styles[message.role]}`}>
      {message.role === "assistant" && (
        <div className={styles.aiLabel}>FixAI</div>
      )}
      <p dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
      {message.suggestions && (
        <div className={styles.suggestions}>
          {message.suggestions.map((s, i) => (
            <button key={i} className={styles.suggestion} onClick={() => s.onClick()}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoPanel({ videoRef, isActive, analysisActive }) {
  return (
    <div className={styles.videoPanel}>
      <video ref={videoRef} autoPlay muted playsInline className={styles.video} />
      {!isActive && (
        <div className={styles.videoOverlay}>
          <div className={styles.videoPlaceholder}>
            <span className={styles.cameraIcon}>📷</span>
            <p>Camera non attiva</p>
          </div>
        </div>
      )}
      {isActive && (
        <div className={styles.videoStatus}>
          <span className={`${styles.statusDot} ${analysisActive ? styles.analyzing : ""}`} />
          {analysisActive ? "AI sta analizzando..." : "In attesa..."}
        </div>
      )}
    </div>
  );
}

// ─── Pagina principale ──────────────────────────────────────────────
export default function Diagnosi() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const chatEndRef = useRef(null);
  const canvasRef = useRef(null);

  const [phase, setPhase] = useState("setup");       // setup | session | report
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisActive, setAnalysisActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliance, setAppliance] = useState("");
  const [brand, setBrand] = useState("");
  const [problem, setProblem] = useState("");
  const [report, setReport] = useState(null);
  const [emailUtente, setEmailUtente] = useState("");
  const [emailInviata, setEmailInviata] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackInviato, setFeedbackInviato] = useState(false);
  const [voceAttiva, setVoceAttiva] = useState(true);
  const voceAttivaRef = useRef(true);
  const [ascoltoAttivo, setAscoltoAttivo] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [pagamentoVerificato, setPagamentoVerificato] = useState(false);
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);
  const messagesRef = useRef([]);
  const recognitionRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  // Scroll automatico
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Ripristina pagamento se utente ricarica la pagina
useEffect(() => {
  const giaPagato = sessionStorage.getItem("fixai_pagato");
  if (giaPagato === "true") {
    setPagamentoVerificato(true);
  }
}, []);

// Verifica pagamento al ritorno da Stripe
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const esitoPagamento = params.get("pagamento");
  const stripeSessionId = params.get("session_id");
  const urlAppliance = params.get("appliance");
  const urlBrand = params.get("brand");
  const urlProblem = params.get("problem");

  if (esitoPagamento === "ok" && stripeSessionId) {
    setVerificandoPagamento(true);
    fetch(`/api/verifica-pagamento?session_id=${stripeSessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.pagato) {
          if (urlAppliance) setAppliance(urlAppliance);
          if (urlBrand) setBrand(urlBrand);
          if (urlProblem) setProblem(urlProblem);

          setPagamentoVerificato(true);
          sessionStorage.setItem("fixai_pagato", "true");
          setTimeout(() => startSession(urlAppliance, urlBrand, urlProblem), 500);
        } else {
          alert("Pagamento non confermato. Riprova.");
        }
      })
      .finally(() => setVerificandoPagamento(false));
  } else if (esitoPagamento === "annullato") {
    alert("Pagamento annullato. Puoi riprovare quando vuoi.");
  }
}, []);

  // ── Gestione camera ─────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 500);
    } catch (err) {
      console.error("Errore camera:", err);
      stopPeriodicAnalysis();
      setPhase("setup");
      if (err.name === "NotAllowedError") {
        alert("⚠️ Hai negato l'accesso alla camera. Per usare FixAI devi consentire l'accesso alla camera nelle impostazioni del browser.");
      } else if (err.name === "NotFoundError") {
        alert("⚠️ Nessuna camera trovata. Assicurati che il dispositivo abbia una camera funzionante.");
      } else if (err.name === "NotReadableError") {
        alert("⚠️ La camera è già in uso da un'altra applicazione. Chiudi Teams, Zoom o altre app e riprova.");
      } else {
        alert("⚠️ Impossibile accedere alla camera. Controlla i permessi del browser e riprova.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  };

  // ── Cattura screenshot dal video ────────────────────────────────
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 320, 240);
    // Ritorna base64 senza il prefisso "data:image/jpeg;base64,"
    return canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
  }, []);

  // ── Chiama l'API backend ────────────────────────────────────────
  const callAI = useCallback(
    async (userMessage, frameBase64 = null) => {
      if (userMessage === "[FRAME_AUTO]" && loading) return;
      setLoading(true);
      setAnalysisActive(!!frameBase64);

      const newUserMsg = { role: "user", content: userMessage };
      const updatedMessages = [...messagesRef.current, newUserMsg].slice(-MAX_HISTORY);
      
      if (userMessage !== "[FRAME_AUTO]") {
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);
      }

      try {
        const res = await fetch("/api/diagnosi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: updatedMessages,
            frame: frameBase64,
            appliance,
            brand,
            initialProblem: problem,
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

  if (!data.message.includes("SKIP")) {
    const aiMsg = { role: "assistant", content: data.message };
    const withAi = [...messagesRef.current, aiMsg];
    messagesRef.current = withAi;
    setMessages(withAi);
    leggiAd(data.message);
    }

        if (data.report) {
          setReport(data.report);
          setTimeout(() => setPhase("report"), 1200);
        }
      } catch (err) {
        console.error("Errore API:", err);
        let errMsg = "⚠️ Qualcosa è andato storto. Riprova o clicca Genera referto per salvare la diagnosi fin qui.";
        if (err.message && err.message.includes("fetch")) {
          errMsg = "⚠️ Problema di rete. Controlla la connessione internet e riprova.";
        } else if (err.message && err.message.includes("500")) {
          errMsg = "⚠️ Servizio temporaneamente non disponibile. Riprova tra qualche secondo.";
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errMsg },
        ]);
      
      } finally {
        setLoading(false);
        setAnalysisActive(false);
      }
    },
    [loading, sessionId, appliance, brand, problem]
  );

  // ── Invio messaggio testuale ────────────────────────────────────
  const handleSend = async () => {
    if (!inputText.trim() || loading) return;
    const text = inputText.trim();
    setInputText("");
    await callAI(text, null);
  };

  // ── Analisi periodica automatica ────────────────────────────────
  const startPeriodicAnalysis = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(async () => {
      if (loading) return;
      const inputEl = document.getElementById('chat-input');
      if (inputEl && inputEl.value.length > 0) return;
      const frame = captureFrame();
if (!frame) return;
setMessages((prev) => {
  const last = prev[prev.length - 1];
  if (last?.content === "📷 Sto analizzando quello che inquadri...") return prev;
  return [...prev, { role: "assistant", content: "📷 Sto analizzando quello che inquadri..." }];
});
await callAI("[FRAME_AUTO]", frame);
setMessages((prev) => prev.filter(m => m.content !== "📷 Sto analizzando quello che inquadri..."));
    }, SCREENSHOT_INTERVAL_MS);
  }, [loading, captureFrame, callAI]);

  const stopPeriodicAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      stopPeriodicAnalysis();
    };
  }, []);
const avviaCheckout = async () => {
  if (!appliance || !problem || !brand) {
    alert("Compila tutti i campi prima di procedere.");
    return;
  }
  // Salva le info prima di andare su Stripe
  sessionStorage.setItem("fixai_appliance", appliance);
sessionStorage.setItem("fixai_brand", brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase());  sessionStorage.setItem("fixai_problem", problem);

  const res = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ appliance, brand, problem }),
});
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  }
};
  // ── Avvia sessione ──────────────────────────────────────────────
  const startSession = async (overrideAppliance, overrideBrand, overrideProblem) => {
    const currentAppliance = overrideAppliance || appliance;
    const currentBrand = overrideBrand || brand;
    const currentProblem = overrideProblem || problem;

    if (!currentAppliance || !currentProblem) {
      alert("Seleziona l'elettrodomestico e descrivi il problema.");
      return;
    }
    sessionStorage.removeItem("fixai_pagato");
    await startCamera();
    setPhase("session");

    const welcomeMsg = {
      role: "assistant",
      content: `Ciao! Sono FixAI. Vedo che hai un problema con la tua **${currentBrand ? currentBrand + " " : ""}${currentAppliance}**: *"${currentProblem}"*.\n\n⚠️ **Prima di tutto:** assicurati che l'elettrodomestico sia **spento e staccato dalla presa elettrica**. Se devi aprire sportelli o toccare componenti, chiudi anche il rubinetto dell'acqua.\n\nPer darti una diagnosi più precisa, cerca la **targhetta del modello** — di solito si trova:\n- Lavatrice/Lavastoviglie: **dentro lo sportello**, sul bordo\n- Frigorifero: **dentro il vano**, sulla parete laterale\n\nClicca **📷 Analizza** puntando sulla targhetta. Se non riesci a trovarla, scrivi pure e iniziamo lo stesso!\n\n*(You can also write in English, Spanish, French or German — I'll reply in your language)*`,
    };
    messagesRef.current = [welcomeMsg];
    setMessages([welcomeMsg]);
    leggiAd(welcomeMsg.content);

    // Analisi automatica disabilitata — usa il pulsante "Analizza ora"
    // setTimeout(startPeriodicAnalysis, 30000);

    // Timeout automatico dopo 30 minuti
    sessionTimeoutRef.current = setTimeout(() => {
      stopCamera();
      stopPeriodicAnalysis();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⏱️ La sessione è scaduta dopo 30 minuti. Clicca **Genera referto** per ricevere la diagnosi con le informazioni raccolte finora." },
      ]);
    }, 30 * 60 * 1000);
  };

  // ── Genera referto manuale ──────────────────────────────────────
  const requestReport = async () => {
    stopPeriodicAnalysis();
    // Salva appliance e brand prima di generare il referto
    sessionStorage.setItem("fixai_report_appliance", appliance);
    sessionStorage.setItem("fixai_report_brand", brand);
    sessionStorage.setItem("fixai_report_problem", problem);
    await callAI("Genera ora il referto finale con diagnosi, soluzione e stima costi.");
  };

  // ── Rendering ──────────────────────────────────────────────────
// Sintesi vocale — legge il messaggio AI
const rilevaLingua = (testo) => {
  const paroleEN = (testo.match(/\b(the|is|are|you|your|please|this|that|have|has|can|will|with|for|not|but)\b/gi) || []).length;
  const paroleES = (testo.match(/\b(el|la|los|las|es|son|tiene|puede|para|con|que|del)\b/gi) || []).length;
  const paroleFR = (testo.match(/\b(le|les|est|sont|vous|votre|pour|avec|que|des)\b/gi) || []).length;
  const paroleDE = (testo.match(/\b(der|die|das|ist|sind|haben|Sie|Ihr|und|mit)\b/gi) || []).length;
  
  const max = Math.max(paroleEN, paroleES, paroleFR, paroleDE);
  if (max < 3) return "it-IT"; // Se meno di 3 parole chiave → italiano
  if (max === paroleEN) return "en-GB";
  if (max === paroleES) return "es-ES";
  if (max === paroleFR) return "fr-FR";
  if (max === paroleDE) return "de-DE";
  return "it-IT";
};

const leggiAd = (testo) => {
 if (!voceAttivaRef.current) return;
  window.speechSynthesis.cancel();
  const pulito = testo
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u2600-\u27FF]/g, "")
    .replace(/⚠️|✅|🔧|📋|⏱️|💰|🔍/g, "");
  const utterance = new SpeechSynthesisUtterance(pulito);
  utterance.lang = rilevaLingua(pulito);
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
};

// Avvia riconoscimento vocale
const avviaAscolto = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Il tuo browser non supporta il riconoscimento vocale. Usa Chrome.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "it-IT";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = (e) => {
    const testo = e.results[0][0].transcript;
    setInputText(testo);
  };
  recognition.onend = () => setAscoltoAttivo(false);
  recognition.onerror = () => setAscoltoAttivo(false);
  recognitionRef.current = recognition;
  recognition.start();
  setAscoltoAttivo(true);
};

const fermaAscolto = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
};
  if (phase === "setup") {
    return (
      <div className={styles.container}>
        <div className={styles.setupCard}>
          <div className={styles.logo}>FixAI</div>
          <h1>Diagnosi elettrodomestico</h1>
          <p className={styles.subtitle}>
            Risparmia fino a €70 sulla visita del tecnico. La nostra AI diagnostica il problema via videochiamata.
          </p>

          <div className={styles.formGroup}>
            <label>Che elettrodomestico?</label>
            <div className={styles.applianceGrid}>
              {["Lavatrice", "Lavastoviglie", "Asciugatrice", "Frigorifero"].map((a) => (
                <button
                  key={a}
                  className={`${styles.applianceBtn} ${appliance === a ? styles.selected : ""}`}
                  onClick={() => setAppliance(a)}
                >
                  {a === "Lavatrice" ? "🫧" : a === "Lavastoviglie" ? "🍽️" : a === "Asciugatrice" ? "🌀" : "🧊"} {a}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Marca</label>
            <input
              type="text"
              placeholder="es. Bosch, Samsung, Indesit..."
              value={brand}
onChange={(e) => setBrand(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Descrivi il problema</label>
            <textarea
              placeholder="es. Non scarica l'acqua, codice errore E18, fa rumore strano..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>

          {verificandoPagamento ? (
  <button className={styles.startBtn} disabled>
    ⏳ Verifica pagamento...
  </button>
) : pagamentoVerificato ? (
  <>
  <button
    className={styles.startBtn}
    onClick={startSession}
    disabled={!appliance || !problem || !brand}
  >
    🎥 Avvia videodiagnosi
  </button>
</>
) : (
  <>
    <button
      className={styles.startBtn}
      onClick={avviaCheckout}
      disabled={!appliance || !problem || !brand}
    >
      💳 Paga €9,90 e avvia diagnosi
    </button>
    <p className={styles.disclaimer}>
      Pagamento sicuro con Stripe. Riceverai il referto PDF al termine.
    </p>
  </>
)}

          <p className={styles.disclaimer}>
            La camera viene usata solo durante la sessione. Nessun video viene salvato.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "report") {
    return (
      <div className={styles.container}>
        <div className={styles.reportCard}>
          <div className={styles.reportHeader}>
            <div className={styles.logo}>FixAI</div>
            <h2>📋 Referto diagnosi</h2>
            <p className={styles.reportDate}>{new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>

          {report && (
            <div className={styles.reportBody}>
              <div className={styles.reportSection}>
                <h3>🔍 Diagnosi</h3>
                <p>{report.diagnosis}</p>
              </div>

              {report.diyPossible && (
                <div className={`${styles.reportSection} ${styles.diy}`}>
                  <h3>✅ Soluzione fai-da-te</h3>
                  <p>{report.diyInstructions}</p>
                </div>
              )}

              {report.sparePart && (
                <div className={`${styles.reportSection} ${styles.part}`}>
                  <h3>🔧 Pezzo da sostituire</h3>
                  <p><strong>{report.sparePart.name}</strong></p>
                  <p>Codice: {report.sparePart.code}</p>
                  <p>Prezzo stimato: {report.sparePart.price}</p>
                </div>
              )}

              <div className={`${styles.reportSection} ${styles.cost}`}>
                <h3>💰 Stima intervento tecnico</h3>
                <p className={styles.priceEstimate}>{report.technicianCost}</p>
                <p className={styles.priceNote}>Mostra questo referto al tecnico per ottenere un prezzo equo.</p>
              </div>
            </div>
          )}

          <div className={styles.reportActions}>
  <button
    className={styles.downloadBtn}
onClick={() => {
  const a = sessionStorage.getItem("fixai_report_appliance") || appliance;
  const b = sessionStorage.getItem("fixai_report_brand") || brand;
  const p = sessionStorage.getItem("fixai_report_problem") || problem;
  generaRefertoPDF(report, a, b, p);
}}  >
    📄 Scarica PDF
  </button>
  <button
    className={styles.restartBtn}
    onClick={() => { setPhase("setup"); setMessages([]); setReport(null); stopCamera(); }}
  >
    🔄 Nuova diagnosi
  </button>
</div>

{!emailInviata ? (
  <div className={styles.emailRow}>
    <input
      type="email"
      placeholder="Invia referto via email..."
      value={emailUtente}
      onChange={(e) => setEmailUtente(e.target.value)}
      className={styles.input}
    />
    <button
      className={styles.sendBtn}
      disabled={emailLoading}
      onClick={async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailUtente || !emailRegex.test(emailUtente)) {
          alert("Inserisci un indirizzo email valido.");
          return;
        }
        setEmailLoading(true);
        const res = await fetch("/api/invia-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailUtente,
            report,
            appliance,
            brand,
            problem,
          }),
        });
        const data = await res.json();
        if (data.inviata) setEmailInviata(true);
        setEmailLoading(false);
      }}
    >
      {emailLoading ? "⏳ Invio..." : "✉️ Invia"}
    </button>
  </div>
) : (
  <p style={{ textAlign: "center", color: "#0F6E56", fontSize: "13px", marginTop: "12px" }}>
    ✅ Referto inviato a {emailUtente}!
  </p>
)}
{!feedbackInviato ? (
  <div style={{ marginTop: "16px", background: "#f5f5f3", borderRadius: "10px", padding: "14px" }}>
    <p style={{ fontSize: "13px", fontWeight: "500", marginBottom: "10px", textAlign: "center" }}>
      La diagnosi era utile?
    </p>
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "10px" }}>
      {[1,2,3,4,5].map((v) => (
        <button
          key={v}
          onClick={() => setFeedback(v)}
          style={{
            width: "36px", height: "36px", borderRadius: "50%", border: "2px solid",
            borderColor: feedback === v ? "#1D9E75" : "#e0e0de",
            background: feedback === v ? "#1D9E75" : "white",
            color: feedback === v ? "white" : "#333",
            fontWeight: "600", cursor: "pointer", fontSize: "14px"
          }}
        >
          {v}
        </button>
      ))}
    </div>
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "10px" }}>
      <button
        onClick={async () => {
          await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voto: feedback, risolto: true, appliance, brand, problem }),
          });
          setFeedbackInviato(true);
        }}
        style={{ background: "#1D9E75", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
      >
        ✅ Risolto da solo
      </button>
      <button
        onClick={async () => {
          await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voto: feedback, risolto: false, appliance, brand, problem }),
          });
          setFeedbackInviato(true);
        }}
        style={{ background: "#f5f5f3", color: "#333", border: "1px solid #e0e0de", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
      >
        ❌ Serve il tecnico
      </button>
    </div>
  </div>
) : (
  <p style={{ textAlign: "center", color: "#0F6E56", fontSize: "13px", marginTop: "12px" }}>
    Grazie per il feedback! 🙏
  </p>
)}
        </div>
      </div>
    );
  }

  // ── Fase sessione ────────────────────────────────────────────────
  return (
    <div className={styles.sessionContainer}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className={styles.sessionHeader}>
        <div className={styles.logo}>FixAI</div>
        <div className={styles.sessionInfo}>
          <span className={styles.sessionAppliance}>{brand} {appliance}</span>
          <button
            className={styles.endBtn}
            onClick={() => {
    const nuovoValore = !voceAttiva;
    setVoceAttiva(nuovoValore);
    voceAttivaRef.current = nuovoValore;
    window.speechSynthesis.cancel();
  }}
            title={voceAttiva ? "Silenzia voce" : "Attiva voce"}
          >
            {voceAttiva ? "🔊" : "🔇"}
          </button>
          <button
  className={styles.endBtn}
  onClick={() => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }}
  title={cameraActive ? "Disattiva camera" : "Attiva camera"}
>
  {cameraActive ? "📷" : "📷 Off"}
</button>
          <button
            className={styles.endBtn}
            onClick={async () => {
              const frame = captureFrame();
              if (!frame) {
                alert("Camera non attiva.");
                return;
              }
              await callAI("[FRAME_AUTO]", frame);
            }}
            disabled={loading}
            title="Analizza quello che inquadri ora"
          >
            📷 Analizza
          </button>
<button className={styles.endBtn} onClick={requestReport}>
  📋 Genera referto
</button>
        </div>
      </div>

      <div className={styles.sessionLayout}>
        <VideoPanel
          videoRef={videoRef}
          isActive={cameraActive}
          analysisActive={analysisActive}
        />

        <div className={styles.chatPanel}>
          <div className={styles.chatMessages}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            {loading && (
              <div className={`${styles.bubble} ${styles.assistant}`}>
                <div className={styles.aiLabel}>FixAI</div>
                <div className={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={styles.inputRow}>
  <button
    className={`${styles.micBtn} ${ascoltoAttivo ? styles.micAttivo : ""}`}
    onMouseDown={avviaAscolto}
    onMouseUp={() => { fermaAscolto(); setTimeout(handleSend, 600); }}
    onTouchStart={avviaAscolto}
    onTouchEnd={() => { fermaAscolto(); setTimeout(handleSend, 600); }}
    disabled={loading}
    title="Tieni premuto per parlare"
  >
    {ascoltoAttivo ? "🔴" : "🎤"}
  </button>
  <input
    id="chat-input"
    type="text"
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSend()}
    placeholder="Parla o scrivi..."
    className={styles.chatInput}
    disabled={loading}
  />
  <button
    className={styles.sendBtn}
    onClick={handleSend}
    disabled={loading || !inputText.trim()}
  >
    ➤
  </button>
</div>
        </div>
      </div>
    </div>
  );
}
