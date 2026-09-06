// components/SceltaLingua.jsx
// Il tasto 🌐 della barra in alto, piu' il rilevamento automatico dentro l'app.
//
// Due comportamenti diversi nello stesso componente, ed e' voluto:
//
//  - DENTRO L'APP si rileva la lingua del telefono e si va li' da soli, senza
//    chiedere niente. Chi ha appena scaricato l'app non deve rispondere a una
//    domanda prima ancora di aver visto cos'e' Fixi, e il telefono la risposta
//    ce l'ha gia'.
//
//  - SUL SITO non si rileva e non si rimanda da nessuna parte. Googlebot
//    scansiona dagli Stati Uniti dichiarando inglese: rimandarlo su /en
//    significherebbe togliere dall'indice le 81 pagine italiane che oggi si
//    posizionano. Sul sito la lingua si cambia solo a mano, con questo tasto.
//
// La scelta fatta a mano batte sempre il rilevamento: un romeno che vive in
// Italia ha il telefono in italiano, sceglie il rumeno una volta, e non deve
// rifarlo a ogni apertura.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { LINGUE, dettagliLingua, linguaDaMostrare, linguaRicordata, ricordaLingua } from "../lib/lingue";
import { dentroApp } from "../lib/versione-app";

export default function SceltaLingua({ testi }) {
  const router = useRouter();
  const [aperto, setAperto] = useState(false);
  const contenitore = useRef(null);

  const attuale = dettagliLingua(router.locale) || LINGUE[0];

  // Rilevamento all'apertura. Solo nell'app, e una volta sola.
  useEffect(() => {
    if (!dentroApp()) return;
    const scelta = linguaDaMostrare({
      ricordata: linguaRicordata(),
      telefono: typeof navigator === "undefined" ? null : navigator.language,
    });
    if (scelta && scelta !== router.locale) vaiA(scelta, { ricorda: false });
    // Solo al primo montaggio: rifarlo a ogni cambio di pagina significherebbe
    // riportare in italiano chi ha appena scelto lo spagnolo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chiude il menu se si clicca fuori.
  useEffect(() => {
    if (!aperto) return;
    const fuori = (e) => {
      if (contenitore.current && !contenitore.current.contains(e.target)) setAperto(false);
    };
    document.addEventListener("mousedown", fuori);
    return () => document.removeEventListener("mousedown", fuori);
  }, [aperto]);

  function vaiA(codice, { ricorda = true } = {}) {
    if (ricorda) ricordaLingua(codice);
    setAperto(false);
    // asPath come secondo argomento tiene l'indirizzo che l'utente vede: senza,
    // una pagina come /guida/lavatrice/non-scarica tornerebbe alla forma con i
    // segnaposto.
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, {
      locale: codice,
    });
  }

  return (
    <div ref={contenitore} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setAperto((a) => !a)}
        aria-label={testi?.scegli || "Scegli la lingua"}
        aria-expanded={aperto}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: "100px",
          padding: "6px 12px",
          font: "inherit",
          fontSize: "14px",
          cursor: "pointer",
          color: "inherit",
          lineHeight: 1.2,
        }}
      >
        {/* Un mappamondo e non la bandiera del paese, per due motivi.
            Tecnico: Windows non ha il carattere per le bandiere e disegna
            🇪🇸 come le lettere "ES" — accanto al codice diventava "ES ES".
            Di sostanza: le lingue non sono paesi. Il tedesco si parla in tre
            stati, il portoghese in due continenti, e a un austriaco mostrare
            la bandiera della Germania e' un modo di dirgli che non era
            previsto. Il mappamondo non offende nessuno. */}
        <span aria-hidden="true">🌐</span>
        <span style={{ textTransform: "uppercase" }}>{attuale.codice}</span>
      </button>

      {aperto && (
        <ul
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            margin: 0,
            padding: "6px",
            listStyle: "none",
            background: "white",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: "12px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
            minWidth: "180px",
            zIndex: 100,
          }}
        >
          {LINGUE.map((l) => (
            <li key={l.codice}>
              <button
                type="button"
                onClick={() => vaiA(l.codice)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  background: l.codice === router.locale ? "rgba(0,0,0,0.05)" : "none",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px 12px",
                  font: "inherit",
                  fontSize: "15px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#1a1a1a",
                }}
              >
                {/* Il nome di ogni lingua e' scritto NELLA lingua stessa
                    ("Deutsch", non "Tedesco"): chi cerca la sua deve poterla
                    riconoscere anche quando l'elenco e' in una lingua che non
                    capisce — che e' esattamente la situazione di chi apre
                    questo menu. */}
                <span>{l.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
