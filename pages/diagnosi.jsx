import { useState, useRef, useEffect, useCallback } from "react";
import styles from "../styles/diagnosi.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { refertoPDF } from "../lib/generaPDF";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ─── Configurazione ────────────────────────────────────────────────
const SCREENSHOT_INTERVAL_MS = 25000; // cattura frame ogni 25 secondi
const MAX_HISTORY = 20;              // massimo messaggi nella history
const TAGLIO_STORICO = 6;            // quanti se ne tolgono in una volta quando sfora

// Quando la cronologia sfora si tagliano più messaggi in un colpo solo invece
// di uno per volta: così l'inizio della conversazione resta identico per
// diverse richieste di fila e la cache di Anthropic continua a valere
// (rileggere dalla cache costa un decimo del prezzo pieno).
const tagliaStorico = (arr) =>
  arr.length > MAX_HISTORY ? arr.slice(arr.length - (MAX_HISTORY - TAGLIO_STORICO)) : arr;

// Sceglie la voce più naturale tra quelle disponibili per la lingua richiesta.
// Le voci "Google"/"Natural" suonano molto meglio della predefinita robotica.
function scegliVoceNaturale(voci, lang) {
  const base = (lang || "it-IT").split("-")[0].toLowerCase();
  const candidati = (voci || []).filter((v) => v.lang && v.lang.toLowerCase().startsWith(base));
  if (candidati.length === 0) return null;
  const punteggio = (v) => {
    const n = (v.name || "").toLowerCase();
    let s = 0;
    if (n.includes("google")) s += 6;
    if (/natural|enhanced|premium|neural|wavenet/.test(n)) s += 5;
    if (!v.localService) s += 2; // le voci di rete sono spesso più naturali
    if (v.lang.toLowerCase() === (lang || "").toLowerCase()) s += 1;
    return s;
  };
  return candidati.slice().sort((a, b) => punteggio(b) - punteggio(a))[0];
}

// ─── Componenti UI ─────────────────────────────────────────────────
function ChatBubble({ message }) {
  const htmlSicuro = message.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  return (
    <div className={`${styles.bubble} ${styles[message.role]}`}>
      {message.role === "assistant" && (
        <div className={styles.aiLabel}>Fixi</div>
      )}
      <p dangerouslySetInnerHTML={{ __html: htmlSicuro }} />
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
  const voicesRef = useRef([]);
  // Lingua in cui sta andando avanti la conversazione. Serve in due punti:
  // per leggere ad alta voce con la pronuncia giusta e per impostare il
  // microfono, altrimenti l'utente risponde in inglese a un orecchio italiano.
  const linguaConversazioneRef = useRef("it-IT");

  const [phase, setPhase] = useState("setup");       // setup | session | report
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisActive, setAnalysisActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [appliance, setAppliance] = useState("");
  const [brand, setBrand] = useState("");
  const [problem, setProblem] = useState("");
  const [report, setReport] = useState(null);
  const [emailUtente, setEmailUtente] = useState("");
  const [emailInviata, setEmailInviata] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackInviato, setFeedbackInviato] = useState(false);
  // Richiesta tecnico dal referto
  const [tecForm, setTecForm] = useState({ nome: "", telefono: "", email: "", citta: "", cap: "" });
  const [tecLoading, setTecLoading] = useState(false);
  const [tecEsito, setTecEsito] = useState(null); // { tecniciContattati } dopo l'invio
  const sessionStartRef = useRef(null);
  const sessioneTokenRef = useRef(null); // token della riga salvata col referto: il voto aggiorna quella
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
  const stripeSessionRef = useRef(null); // id sessione Stripe: il server lo verifica a ogni messaggio

  // Da quanti secondi è in corso questa diagnosi
  const durataSessione = () =>
    sessionStartRef.current ? Math.round((Date.now() - sessionStartRef.current) / 1000) : null;

  // Aggiunge il voto alla sessione salvata col referto. Manda comunque tutti i
  // dati: se il salvataggio di prima non era riuscito, il server crea la riga ora.
  const inviaFeedback = async (risolto) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: sessioneTokenRef.current,
          voto: feedback,
          risolto,
          appliance,
          brand,
          problem,
          report,
          messages: messagesRef.current,
          email_utente: emailUtente || null,
          durata_secondi: durataSessione(),
        }),
      });
    } catch {
      // Il voto è un di più: se non parte, la sessione resta comunque salvata
    }
    setFeedbackInviato(true);
  };

  // Dentro l'app il PDF si scrive davvero sul telefono e si passa al menù di
  // condivisione di Android: da lì si salva nei File, si manda su WhatsApp o
  // per email. I plugin si importano solo qui, così dal browser non vengono
  // nemmeno scaricati.
  const salvaNativo = async (blob, nomeFile) => {
    const [{ Filesystem, Directory }, { Share }] = await Promise.all([
      import("@capacitor/filesystem"),
      import("@capacitor/share"),
    ]);
    const base64 = await new Promise((risolvi, rifiuta) => {
      const lettore = new FileReader();
      lettore.onerror = () => rifiuta(lettore.error);
      // readAsDataURL restituisce "data:application/pdf;base64,XXXX":
      // al plugin serve solo quello che viene dopo la virgola.
      lettore.onload = () => risolvi(String(lettore.result).split(",")[1]);
      lettore.readAsDataURL(blob);
    });
    const scritto = await Filesystem.writeFile({
      path: nomeFile,
      data: base64,
      directory: Directory.Cache, // file temporaneo: lo tiene l'app che lo riceve
    });
    await Share.share({ title: "Referto Fixi", files: [scritto.uri] });
  };

  // Il referto si consegna in modi diversi a seconda di dove gira l'app.
  // Dentro l'app Android il download del browser NON esiste: doc.save() non
  // dà errore, semplicemente non fa niente — ed è per questo che una diagnosi
  // finita bene sembrava rotta. Qui si prova prima la condivisione di sistema
  // (sul telefono è pure più comoda: salva o inoltra in un passaggio) e, se
  // non c'è, si dice all'utente cosa fare invece di lasciarlo in silenzio.
  const scaricaReferto = async () => {
    const a = sessionStorage.getItem("Fixi_report_appliance") || appliance;
    const b = sessionStorage.getItem("Fixi_report_brand") || brand;
    const p = sessionStorage.getItem("Fixi_report_problem") || problem;

    let blob, nomeFile;
    try {
      ({ blob, nomeFile } = refertoPDF(report, a, b, p));
    } catch (e) {
      console.error("Referto PDF non generato:", e);
      alert("Non sono riuscito a preparare il PDF. Fattelo mandare per email qui sotto: il referto è identico.");
      return;
    }

    const nellApp = typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.() === true;
    if (nellApp) {
      try {
        await salvaNativo(blob, nomeFile);
      } catch (e) {
        // Chiudere il menù di condivisione senza scegliere non è un errore
        if (/cancel|abort|dismiss/i.test(e?.message || "")) return;
        console.error("Salvataggio nativo non riuscito:", e);
        alert("Non sono riuscito a salvare il PDF sul telefono. Fattelo mandare per email qui sotto: il referto è identico.");
      }
      return;
    }

    // Browser del telefono: qui il foglio di condivisione esiste davvero
    try {
      const file = new File([blob], nomeFile, { type: "application/pdf" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Referto Fixi" });
        return;
      }
    } catch (e) {
      if (e?.name === "AbortError") return;
      console.warn("Condivisione non riuscita, ripiego sul download:", e);
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeFile;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Scroll automatico
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Carica le voci disponibili per la sintesi vocale (arrivano in modo asincrono)
useEffect(() => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const carica = () => {
    const v = window.speechSynthesis.getVoices() || [];
    if (v.length) voicesRef.current = v;
  };
  carica();
  window.speechSynthesis.onvoiceschanged = carica;
  return () => { window.speechSynthesis.onvoiceschanged = null; };
}, []);

// Ripristina pagamento se utente ricarica la pagina
useEffect(() => {
  const sid = sessionStorage.getItem("Fixi_stripe_session");
  if (sid) {
    stripeSessionRef.current = sid;
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
          stripeSessionRef.current = stripeSessionId;
          sessionStorage.setItem("Fixi_stripe_session", stripeSessionId);
          setPhase("confermaPagamento");
          setTimeout(() => startSession(urlAppliance, urlBrand, urlProblem), 3000);
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
        // HD: fondamentale per leggere targhette modello e codici errore
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
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
        alert("⚠️ Hai negato l'accesso alla camera. Per usare Fixi devi consentire l'accesso alla camera nelle impostazioni del browser.");
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

    // Usa la risoluzione reale della camera, con lato lungo max 1568px
    // (il punto ottimale per l'analisi visiva dell'AI)
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    const scala = Math.min(1, 1568 / Math.max(w, h));
    canvas.width = Math.round(w * scala);
    canvas.height = Math.round(h * scala);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Ritorna base64 senza il prefisso "data:image/jpeg;base64,"
    return canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
  }, []);

  // ── Chiama l'API backend ────────────────────────────────────────
  const callAI = useCallback(
    async (userMessage, frameBase64 = null) => {
      if (userMessage === "[FRAME_AUTO]" && loading) return;
      setLoading(true);
      setAnalysisActive(!!frameBase64);

      const newUserMsg = { role: "user", content: userMessage };
      const updatedMessages = tagliaStorico([...messagesRef.current, newUserMsg]);
      
      if (userMessage !== "[FRAME_AUTO]") {
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);
      }

      try {
        const isFrame = userMessage === "[FRAME_AUTO]";

        // Timeout d'inattività: annulla solo se non arriva nulla per 60s
        const controller = new AbortController();
        let timeoutId;
        const resetTimeout = () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => controller.abort(), 60000);
        };
        resetTimeout();

        let res;
        try {
          res = await fetch("/api/diagnosi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              stripeSessionId: stripeSessionRef.current,
              messages: updatedMessages,
              frame: frameBase64,
              appliance,
              brand,
              initialProblem: problem,
            }),
            signal: controller.signal,
          });
        } catch (e) {
          clearTimeout(timeoutId);
          throw e;
        }

        // Pagamento non valido: risposta JSON, non stream
        if (res.status === 402) {
          clearTimeout(timeoutId);
          const d = await res.json().catch(() => ({}));
          setMessages([
            ...messagesRef.current,
            { role: "assistant", content: `⚠️ ${d.error || "Pagamento non valido."}` },
          ]);
          return;
        }
        if (!res.ok || !res.body) {
          clearTimeout(timeoutId);
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || `HTTP ${res.status}`);
        }

        // Bolla "in diretta": base pulita + testo che cresce. Per i frame non
        // mostriamo nulla finché non sappiamo se è un'osservazione utile o SKIP.
        const mostraLive = (contenuto) => {
          if (isFrame) return;
          setStreaming(true);
          setMessages([
            ...messagesRef.current,
            { role: "assistant", content: contenuto, streaming: true },
          ]);
        };

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let testoLive = "";
        let finalMessage = "";
        let report = null;
        let serverError = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          resetTimeout();
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop();
          for (const part of parts) {
            const riga = part.trim();
            if (!riga.startsWith("data:")) continue;
            let evt;
            try { evt = JSON.parse(riga.slice(5).trim()); } catch { continue; }
            if (evt.type === "delta") {
              testoLive += evt.text;
              mostraLive(testoLive);
            } else if (evt.type === "report_start") {
              mostraLive("📋 Sto preparando il referto…");
            } else if (evt.type === "done") {
              finalMessage = evt.message || "";
              report = evt.report || null;
            } else if (evt.type === "error") {
              serverError = evt.error || "Errore del servizio.";
            }
          }
        }
        clearTimeout(timeoutId);
        setStreaming(false);

        if (serverError) throw new Error(serverError);

        const testoFinale = (finalMessage || testoLive || "").trim();

        // messagesRef è la fonte di verità (senza la bolla "in diretta")
        let finali = messagesRef.current;
        if (testoFinale && !testoFinale.includes("SKIP")) {
          finali = [...messagesRef.current, { role: "assistant", content: testoFinale }];
          messagesRef.current = finali;
          leggiAd(testoFinale);
        }
        setMessages(finali); // rimuove la bolla live e mostra lo stato pulito

        if (report) {
          setReport(report);
          // La sessione si salva qui, non quando arriva il voto: così restano
          // tracciate anche le diagnosi che l'utente chiude senza valutarle.
          fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appliance,
              brand,
              problem,
              report,
              messages: messagesRef.current,
              durata_secondi: durataSessione(),
            }),
          })
            .then((r) => r.json())
            .then((d) => {
              if (d?.token) sessioneTokenRef.current = d.token;
            })
            .catch(() => {
              // Se non riesce, ci penserà il voto a salvare la sessione
            });
          setTimeout(() => setPhase("report"), 1200);
        }
      } catch (err) {
        console.error("Errore API:", err);
        let errMsg = "⚠️ Qualcosa è andato storto. Riprova, oppure clicca 📋 Genera referto per salvare la diagnosi raccolta finora.";
        if (err.name === "AbortError") {
          errMsg = "⚠️ La risposta ci sta mettendo troppo. Controlla la connessione e riprova tra un momento.";
        } else if (err.message && /network|fetch|failed to fetch/i.test(err.message)) {
          errMsg = "⚠️ Problema di rete. Controlla la connessione a internet e riprova.";
        } else if (err.message && /50\d|503|non disponibile|richiesto/i.test(err.message)) {
          errMsg = "⚠️ Servizio AI momentaneamente sovraccarico. Riprova tra qualche secondo.";
        }
        // Rimuovi eventuale bolla "in diretta" e mostra l'errore
        setMessages([...messagesRef.current, { role: "assistant", content: errMsg }]);

      } finally {
        setLoading(false);
        setAnalysisActive(false);
        setStreaming(false);
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
  sessionStorage.setItem("Fixi_appliance", appliance);
sessionStorage.setItem("Fixi_brand", brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase());  sessionStorage.setItem("Fixi_problem", problem);

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
    await startCamera();
    setPhase("session");

    const welcomeMsg = {
      role: "assistant",
      content: `Ciao! Sono Fixi. Vedo che hai un problema con la tua **${currentBrand ? currentBrand + " " : ""}${currentAppliance}**: *"${currentProblem}"*.\n\n⚠️ **Prima di tutto:** assicurati che l'elettrodomestico sia **spento e staccato dalla presa elettrica**. Se lavora con l'acqua, chiudi il rubinetto dell'acqua. Se è a **gas** (piano cottura o forno a gas) e senti **odore di gas**, chiudi subito il rubinetto del gas, non accendere nulla e apri le finestre.\n\nPer darti una diagnosi più precisa, cerca la **targhetta del modello** — di solito si trova:\n- Lavatrice/Lavastoviglie: **dentro lo sportello**, sul bordo\n- Frigorifero: **dentro il vano**, sulla parete laterale\n- Forno: **sul bordo della porta** aprendo lo sportello\n- Piano cottura: **sotto il piano** o sul **libretto di istruzioni**\n- Condizionatore: **sollevando il pannello frontale** dell'unità interna, oppure sul **fianco dell'unità esterna**\n\nClicca **📷 Analizza** puntando sulla targhetta. Se non riesci a trovarla, scrivi pure e iniziamo lo stesso!\n\n*(You can also write in English, Spanish, French or German — I'll reply in your language)*`,
    };
    sessionStartRef.current = Date.now();
    sessioneTokenRef.current = null;
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

  // ── Richiesta tecnico dal referto ───────────────────────────────
  const richiediTecnico = async () => {
    if (!tecForm.nome.trim() || !tecForm.telefono.trim()) {
      alert("Inserisci nome e telefono: servono al tecnico per contattarti.");
      return;
    }
    if (!/^\d{5}$/.test(tecForm.cap.trim())) {
      alert("Inserisci un CAP valido di 5 cifre.");
      return;
    }
    setTecLoading(true);
    try {
      const res = await fetch("/api/richiedi-tecnico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tecForm,
          email: tecForm.email || emailUtente || null,
          appliance: sessionStorage.getItem("Fixi_report_appliance") || appliance,
          brand: sessionStorage.getItem("Fixi_report_brand") || brand,
          problem: sessionStorage.getItem("Fixi_report_problem") || problem,
          report,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(`⚠️ ${data.error}`);
      } else {
        setTecEsito(data);
      }
    } catch {
      alert("⚠️ Problema di rete. Riprova.");
    } finally {
      setTecLoading(false);
    }
  };

  // ── Genera referto manuale ──────────────────────────────────────
  const requestReport = async () => {
    stopPeriodicAnalysis();
    // Salva appliance e brand prima di generare il referto
    sessionStorage.setItem("Fixi_report_appliance", appliance);
    sessionStorage.setItem("Fixi_report_brand", brand);
    sessionStorage.setItem("Fixi_report_problem", problem);
    await callAI("Genera ora il referto finale con diagnosi, soluzione e stima costi.");
  };

  // ── Rendering ──────────────────────────────────────────────────
// Sintesi vocale — legge il messaggio AI
// Prima qui si cercava solo "questo NON è italiano?", e servivano almeno due
// parole tipo "the" o "your" per accorgersene. Le frasi di Fixi sono corte e
// imperative ("Open the bottom panel") e spesso non ne contengono nessuna:
// il testo finiva letto in inglese ma con la pronuncia italiana.
// Adesso ogni lingua prende un punteggio e vince la più votata.
const rilevaLingua = (testo, predefinita = "it-IT") => {
  const lingue = [
    // L'italiano è primo: a pari punteggio vince lui, che è la lingua di casa.
    {
      codice: "it-IT",
      parole: /\b(che|non|per|con|una|sono|questo|questa|quello|della|dello|nella|sulla|anche|sotto|sopra|dietro|davanti|adesso|quindi|deve|devi|puoi|serve|controlla|apri|chiudi|stacca|prova|guarda|mostrami|premi|spegni|accendi|ruota|vediamo|proviamo)\b/gi,
      forti: /(\bgli\b|\bè\b|\bc'è\b|\bperché\b|\bpiù\b|\bposso\b)/gi,
    },
    {
      codice: "en-GB",
      parole: /\b(check|open|close|unplug|try|look|show|turn|press|remove|make|sure|first|then|back|bottom|filter|water|power|button|door|need|will|should|from|into|about)\b/gi,
      forti: /(th|n't\b|'s\b|'re\b|\byou\b)/gi,
    },
    {
      codice: "es-ES",
      parole: /\b(comprueba|abre|cierra|desenchufa|prueba|mira|gira|pulsa|quita|puerta|agua|botón|primero|luego|abajo|arriba|detrás|delante|tiene|puede|debe|vamos|está|están|también|porque|después|siempre|mucho)\b/gi,
      forti: /[ñ¿¡]|\b(el|los|las|qué|muéstrame)\b/gi,
    },
    {
      codice: "fr-FR",
      parole: /\b(vérifie|ouvre|ferme|débranche|essaie|regarde|montre|tourne|appuie|retire|porte|eau|bouton|filtre|panneau|abord|ensuite|dessous|dessus|derrière|devant|peut|doit|nous)\b/gi,
      forti: /[çœ]|\b(les|vous|c'est|très|aussi|donc|est)\b/gi,
    },
    {
      codice: "de-DE",
      parole: /\b(prüfe|öffne|schließe|ziehen|versuche|schau|zeige|drehe|drücke|entferne|tür|wasser|knopf|zuerst|dann|unten|oben|hinten|vorne|kann|muss|wir)\b/gi,
      forti: /[ßäöü]|\b(der|die|das|nicht|und|ist|sind|ein|eine|mit|auf)\b/gi,
    },
    // Le tre qui sotto mancavano, ma il prompt di Fixi le dichiara: senza di
    // loro il portoghese passava per spagnolo e l'arabo per italiano.
    {
      codice: "pt-PT",
      parole: /\b(verifique|abra|feche|desligue|tente|olhe|mostre|gire|pressione|remova|porta|botão|primeiro|depois|embaixo|atrás|pode|deve|vamos|máquina|filtro)\b/gi,
      forti: /[ãõ]|ção|\b(não|você|vocês|então|também|é)\b/gi,
    },
    {
      codice: "ro-RO",
      // ă, ș, ț non esistono in nessun'altra lingua dell'elenco: bastano da sole.
      parole: /\b(verifică|deschide|închide|scoate|încearcă|arată|rotește|apasă|ușa|apă|buton|întâi|apoi|spate|poate|trebuie|mașina)\b/gi,
      forti: /[ășțşţ]|\b(și|este|să|dacă|pentru|nu)\b/gi,
    },
    {
      codice: "ar-SA",
      // L'arabo si riconosce dalla scrittura, non dalle parole: se compaiono
      // quei caratteri non può essere nient'altro.
      parole: /[؀-ۿ]/g,
      forti: /[؀-ۿ]{3,}/g,
    },
  ];

  let vincitrice = null;
  let migliore = 0;
  for (const l of lingue) {
    // I segni "forti" sono quelli che praticamente solo quella lingua usa
    // (la ñ spagnola, la ß tedesca, il "th" inglese): pesano il triplo.
    const punti =
      (testo.match(l.parole) || []).length + 3 * (testo.match(l.forti) || []).length;
    if (punti > migliore) {
      migliore = punti;
      vincitrice = l.codice;
    }
  }

  // Sotto i 2 punti il messaggio è troppo corto o neutro ("Ok!", "Perfetto"):
  // in quel caso si tira dritto con la lingua in cui si stava già parlando.
  return migliore >= 2 ? vincitrice : predefinita;
};

const leggiAd = (testo) => {
 if (!voceAttivaRef.current) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return; // browser senza sintesi vocale
  window.speechSynthesis.cancel();
  const pulito = testo
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u2600-\u27FF]/g, "")
    .replace(/⚠️|✅|🔧|📋|⏱️|💰|🔍/g, "");
  const utterance = new SpeechSynthesisUtterance(pulito);
  // La lingua trovata resta in memoria: serve al microfono per la risposta
  // e fa da rete di sicurezza sul messaggio corto che viene dopo.
  const lingua = rilevaLingua(pulito, linguaConversazioneRef.current);
  linguaConversazioneRef.current = lingua;
  utterance.lang = lingua;
  const voci = voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices();
  const voce = scegliVoceNaturale(voci, utterance.lang);
  // Se sul telefono manca la voce di quella lingua si lascia scegliere al
  // motore di Android partendo da utterance.lang, invece di imporgli quella
  // italiana: sarebbe di nuovo il testo straniero letto con l'accento nostro.
  if (voce) {
    utterance.voice = voce;
  } else if (lingua !== "it-IT") {
    // Se compare questo, il codice ha fatto la sua parte: al telefono mancano
    // i dati vocali di quella lingua (si scaricano dalle impostazioni Android).
    console.warn(`Nessuna voce installata per ${lingua}: la pronuncia sarà quella predefinita.`);
  }
  utterance.rate = 1.0;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
};

// Nell'app Android il riconoscimento vocale del browser
// (webkitSpeechRecognition) non esiste: la WebView non lo implementa. Lì si
// usa il motore vocale nativo di Android tramite il plugin Capacitor.
const dettaturaNativa = () =>
  typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.() === true;

// Il plugin si carica solo quando serve: dal browser non viene nemmeno toccato.
const pluginVocale = async () =>
  (await import("@capacitor-community/speech-recognition")).SpeechRecognition;

// Avvia riconoscimento vocale
const avviaAscolto = async () => {
  if (dettaturaNativa()) {
    try {
      const SR = await pluginVocale();
      const { available } = await SR.available();
      if (!available) {
        alert("Il riconoscimento vocale non è disponibile su questo telefono. Puoi scrivere il messaggio.");
        return;
      }
      let stato = await SR.checkPermissions();
      if (stato.speechRecognition !== "granted") {
        stato = await SR.requestPermissions();
      }
      if (stato.speechRecognition !== "granted") {
        alert("Per dettare serve il permesso del microfono: puoi attivarlo dalle impostazioni del telefono.");
        return;
      }
      // Si ascolta nella lingua in cui Fixi ha appena parlato, ma solo se il
      // telefono la conosce davvero: chiederne una non installata fa fallire
      // start(). Nel dubbio si torna all'italiano, che è sempre meglio di un
      // pulsante che non fa niente.
      let lingua = linguaConversazioneRef.current;
      try {
        const { languages } = await SR.getSupportedLanguages();
        if (Array.isArray(languages) && languages.length > 0 && !languages.includes(lingua)) {
          const base = lingua.split("-")[0];
          lingua = languages.find((l) => String(l).startsWith(base)) || "it-IT";
        }
      } catch {
        // Telefono che non sa elencare le sue lingue: si prova lo stesso
      }

      setAscoltoAttivo(true);
      const esito = await SR.start({
        language: lingua,
        maxResults: 1,
        partialResults: false,
        popup: false,
      });
      setAscoltoAttivo(false);
      // Il testo arriva quando il riconoscimento finisce: si invia subito,
      // senza passare dalla casella di testo e dalle attese a tempo.
      const testo = (esito?.matches?.[0] || "").trim();
      if (testo) {
        setInputText("");
        await callAI(testo, null);
      }
    } catch (err) {
      setAscoltoAttivo(false);
      console.error("Dettatura nativa non riuscita:", err);
      // Prima qui c'era solo il console.error: per chi usa l'app il pulsante
      // sembrava rotto e non c'era modo di capire perché. Il messaggio tecnico
      // si porta dietro il motivo vero, che è quello che serve per aggiustare.
      alert(
        "Non sono riuscito ad avviare la dettatura. Puoi scrivere il messaggio nella casella.\n\n" +
          `Dettaglio: ${err?.message || err}`
      );
    }
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Il tuo browser non supporta il riconoscimento vocale. Usa Chrome.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = linguaConversazioneRef.current;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = (e) => {
    // Come nel percorso nativo: il testo riconosciuto parte subito, senza
    // passare dalla casella e da attese a tempo.
    const testo = (e.results[0][0].transcript || "").trim();
    if (testo) {
      setInputText("");
      callAI(testo, null);
    }
  };
  recognition.onend = () => setAscoltoAttivo(false);
  recognition.onerror = (e) => {
    setAscoltoAttivo(false);
    // "no-speech" e "aborted" capitano di continuo (l'utente non parla o
    // annulla): avvisare lì sarebbe solo fastidioso. Gli altri no.
    if (e?.error === "no-speech" || e?.error === "aborted") return;
    const spiegazione =
      e?.error === "not-allowed"
        ? "Il permesso del microfono è stato negato: puoi darlo dalle impostazioni del browser."
        : `Dettatura non riuscita (${e?.error || "motivo sconosciuto"}). Puoi scrivere il messaggio.`;
    alert(spiegazione);
  };
  recognitionRef.current = recognition;
  recognition.start();
  setAscoltoAttivo(true);
};

const fermaAscolto = async () => {
  if (dettaturaNativa()) {
    try {
      const SR = await pluginVocale();
      await SR.stop();
    } catch {
      // già fermo o mai partito: non c'è nulla da fare
    }
    return;
  }
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
};
if (phase === "confermaPagamento") {
  return (
    <div className={styles.container}>
      <div className={styles.setupCard} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <div className={styles.logo}>Fixi</div>
        <h1 style={{ marginTop: "8px" }}>Pagamento confermato!</h1>
        <p className={styles.subtitle}>
          Ottimo! Tra pochi secondi inizia la tua sessione di videodiagnosi.
        </p>
        <div style={{ 
          background: "#e8f5f0", 
          borderRadius: "10px", 
          padding: "14px", 
          marginTop: "16px",
          fontSize: "13px",
          color: "#0F6E56"
        }}>
          <p><strong>Preparati:</strong></p>
          <p>⚠️ Stacca la spina dell'elettrodomestico</p>
          <p>💡 Assicurati di avere buona illuminazione</p>
          <p>📷 Tieni il telefono pronto per inquadrare</p>
        </div>
        <div style={{ marginTop: "16px", color: "#999", fontSize: "13px" }}>
          La sessione inizia automaticamente...
        </div>
      </div>
    </div>
  );
}
  if (phase === "setup") {
    return (
      <div className={styles.container}>
        <div className={styles.setupCard}>
          <div className={styles.logo}>Fixi</div>
          <h1>Diagnosi elettrodomestico</h1>
          <p className={styles.subtitle}>
            Risparmia fino a €70 sulla visita del tecnico. La nostra AI diagnostica il problema via videochiamata.
          </p>

          <div className={styles.formGroup}>
            <label>Che elettrodomestico?</label>
            <div className={styles.applianceGrid}>
              {[
                { nome: "Lavatrice", icona: "🫧" },
                { nome: "Lavastoviglie", icona: "🍽️" },
                { nome: "Asciugatrice", icona: "🌀" },
                { nome: "Frigorifero", icona: "🧊" },
                { nome: "Forno", icona: "🔥" },
                { nome: "Piano cottura", icona: "🍳" },
                { nome: "Condizionatore", icona: "❄️" },
              ].map(({ nome, icona }) => (
                <button
                  key={nome}
                  className={`${styles.applianceBtn} ${appliance === nome ? styles.selected : ""}`}
                  onClick={() => setAppliance(nome)}
                >
                  {icona} {nome}
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
            <div className={styles.logo}>Fixi</div>
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
onClick={scaricaReferto}  >
    {/* "Salva" è vero in tutti e due i casi: nel browser scarica, nell'app
        apre la condivisione di Android, da cui si salva nei File. "Scarica"
        invece prometteva un file nei Download, che nell'app non arriva. */}
    📄 Salva il referto
  </button>
  <button
    className={styles.restartBtn}
    onClick={() => {
      setPhase("setup");
      setMessages([]);
      setReport(null);
      // Senza questo la seconda diagnosi mostrerebbe già "Grazie per il feedback"
      setFeedback(null);
      setFeedbackInviato(false);
      setEmailInviata(false);
      setTecEsito(null);
      sessioneTokenRef.current = null;
      stopCamera();
      // Una diagnosi = un pagamento: la nuova sessione richiede un nuovo checkout
      sessionStorage.removeItem("Fixi_stripe_session");
      stripeSessionRef.current = null;
      setPagamentoVerificato(false);
    }}
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
        try {
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
          const data = await res.json().catch(() => ({}));
          if (data.inviata) setEmailInviata(true);
          else alert("Non è stato possibile inviare l'email. Riprova, oppure scarica il PDF.");
        } catch {
          alert("⚠️ Problema di rete: email non inviata. Controlla la connessione e riprova.");
        } finally {
          setEmailLoading(false);
        }
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
        onClick={() => inviaFeedback(true)}
        style={{ background: "#1D9E75", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}
      >
        ✅ Risolto da solo
      </button>
      <button
        onClick={() => inviaFeedback(false)}
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

{/* Richiedi un tecnico della zona */}
<div style={{ marginTop: "16px", background: "#e6f1fb", borderRadius: "10px", padding: "16px" }}>
  {tecEsito ? (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
        ✅ Richiesta inviata!
      </p>
      <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6 }}>
        {tecEsito.tecniciContattati > 0
          ? `Abbiamo avvisato ${tecEsito.tecniciContattati} tecnic${tecEsito.tecniciContattati === 1 ? "o" : "i"} della tua zona con il referto già pronto. Il primo disponibile ti chiamerà al numero che hai lasciato.`
          : "Al momento non ci sono tecnici attivi nella tua zona: abbiamo registrato la richiesta e ti contatteremo appena ne troviamo uno."}
      </p>
    </div>
  ) : (
    <>
      <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>
        🔧 Preferisci un tecnico?
      </p>
      <p style={{ fontSize: "12px", color: "#555", marginBottom: "12px" }}>
        Inviamo il referto ai tecnici della tua zona: il primo disponibile ti contatta. Gratis e senza impegno.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        <input
          type="text"
          placeholder="Nome *"
          value={tecForm.nome}
          onChange={(e) => setTecForm({ ...tecForm, nome: e.target.value })}
          className={styles.input}
        />
        <input
          type="tel"
          placeholder="Telefono *"
          value={tecForm.telefono}
          onChange={(e) => setTecForm({ ...tecForm, telefono: e.target.value })}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Città"
          value={tecForm.citta}
          onChange={(e) => setTecForm({ ...tecForm, citta: e.target.value })}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="CAP *"
          maxLength={5}
          value={tecForm.cap}
          onChange={(e) => setTecForm({ ...tecForm, cap: e.target.value.replace(/\D/g, "") })}
          className={styles.input}
        />
      </div>
      <button
        onClick={richiediTecnico}
        disabled={tecLoading}
        style={{
          width: "100%", background: "#185FA5", color: "white", border: "none",
          borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: 600,
          cursor: "pointer", opacity: tecLoading ? 0.7 : 1,
        }}
      >
        {tecLoading ? "⏳ Invio in corso..." : "📨 Trova un tecnico nella mia zona"}
      </button>
    </>
  )}
</div>
        </div>
      </div>
    );
  }

  // ── Fase sessione ────────────────────────────────────────────────
  return (
    <div className={styles.sessionContainer}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className={styles.sessionHeader}>
        <div className={styles.logo}>Fixi</div>
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
            {loading && !streaming && (
              <div className={`${styles.bubble} ${styles.assistant}`}>
                <div className={styles.aiLabel}>Fixi</div>
                <div className={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={styles.inputRow}>
  {/* Prima era "tieni premuto", ma l'unico posto dove c'era scritto era il
      title, che su un telefono non compare mai: chi toccava avviava e fermava
      l'ascolto nello stesso istante, senza registrare niente e senza vedere un
      messaggio. Ora si tocca per parlare e si tocca per smettere — e comunque
      il riconoscimento si ferma da solo quando finisci di parlare. */}
  <button
    className={`${styles.micBtn} ${ascoltoAttivo ? styles.micAttivo : ""}`}
    onClick={() => (ascoltoAttivo ? fermaAscolto() : avviaAscolto())}
    disabled={loading}
    title={ascoltoAttivo ? "Tocca per smettere" : "Tocca e parla"}
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
