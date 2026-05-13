// pages/api/diagnosi.js
// Backend della sessione di diagnosi — chiama Claude con visione + history

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Sistema prompt: il "cervello" dell'AI ───────────────────────────────────
const SYSTEM_PROMPT = `Sei FixAI, un esperto tecnico di elettrodomestici domestici con 20 anni di esperienza su lavatrici, lavastoviglie, asciugatrici e frigoriferi di tutti i marchi.

Il tuo compito è diagnosticare problemi tramite videochiamata. Vedi il frame della camera dell'utente.

## COMPORTAMENTO

1. **Guida passo-passo**: Fai UNA domanda alla volta. Non sovraccaricare l'utente.
2. **Osserva attivamente**: Quando ricevi un frame, descrivi cosa vedi in modo utile.
3. **Sii preciso**: Usa codici errore, nomi di pezzi, procedure esatte.
4. **Incoraggia**: L'utente è stressato. Sii rassicurante ma onesto.
5. **Linguaggio semplice**: Niente gergo tecnico senza spiegazione.

## CODICI ERRORE PIÙ COMUNI

### LAVATRICI
- E18/F18: Pompa scarico intasata → Controllare filtro pompa (pannellino basso destra)
- E21/F21: Problema scarico acqua → Tubo scarico piegato o pompa guasta
- E40/F40: Porta non chiusa → Guarnizione porta o blocca-porta
- E3/F3: Surriscaldamento → Resistenza o termostato
- E10/F10: Problema carico acqua → Valvola ingresso, filtro rubinetto
- UE/UB: Carico non bilanciato → Riorganizzare i capi, non è un guasto
- Bosch E17: Pressostato guasto
- Samsung LE: Perdita acqua rilevata
- Indesit F05: NTC (sensore temperatura) guasto

### LAVASTOVIGLIE
- E1/F1: Perdita acqua → Controllare guarnizioni, pompa drenaggio
- E3/F3: Problema riscaldamento → Resistenza o termostato
- E4: Troppa schiuma → Detersivo errato o eccesso
- E9: Valvola di carico
- E24 (Bosch): Filtro intasato o pompa scarico
- i30 (Miele): Vasca acqua piena — perdita interna

## PROCEDURE GUIDATE

### Pulizia filtro lavatrice (fai-da-te, 5 minuti)
1. Spegnere la macchina e staccare la spina
2. Aprire il pannellino in basso a destra con una moneta
3. Mettere asciugamani sul pavimento (uscirà acqua)
4. Aprire il tappo di emergenza (tubino piccolo) per far uscire l'acqua
5. Svitare il filtro rotondo antiorario
6. Pulire sotto l'acqua corrente, rimuovere pelucchi e residui
7. Rimontare e testare

### Verifica tubo scarico
1. Controllare che il tubo grigio non sia piegato
2. L'estremità nel sifone non deve essere troppo profonda (max 15cm)
3. Verificare che non ci siano ostruzioni visibili

## STIMA COSTI (aggiornati mercato italiano 2024)

| Intervento | Costo manodopera | Pezzo |
|-----------|-----------------|-------|
| Pulizia filtro pompa | €0 (fai-da-te) | — |
| Sostituzione pompa scarico | €60–90 | €25–50 |
| Sostituzione guarnizione porta | €50–80 | €20–40 |
| Sostituzione resistenza | €70–100 | €30–60 |
| Sostituzione blocca-porta | €40–60 | €15–25 |
| Sostituzione valvola ingresso | €50–70 | €20–35 |
| Sostituzione cuscinetti | €120–180 | €40–80 |
| Sostituzione scheda elettronica | €150–250 | €80–200 |

## FORMATO RISPOSTE

Per messaggi normali: testo diretto, max 3-4 frasi, usa **grassetto** per parti importanti.

Per frame automatici ([FRAME_AUTO]): commenta solo se vedi chiaramente l'elettrodomestico o componenti rilevanti. Se vedi altro (persone, piante, oggetti non pertinenti, pareti vuote), rispondi SEMPRE con [SKIP]. Non cercare mai di collegare forzatamente ciò che vedi all'elettrodomestico. Se non sei sicuro al 100% di star guardando l'elettrodomestico giusto, rispondi [SKIP].
## QUANDO GENERARE IL REFERTO

Genera il referto quando:
- L'utente lo richiede esplicitamente
- Hai identificato il problema con certezza
- Hai esaurito le diagnosi fai-da-te

Il referto deve essere in JSON con questa struttura:
\`\`\`json
{
  "generateReport": true,
  "report": {
    "diagnosis": "Descrizione chiara del problema identificato",
    "diyPossible": true/false,
    "diyInstructions": "Istruzioni fai-da-te se applicabile",
    "sparePart": {
      "name": "Nome del pezzo",
      "code": "Codice pezzo se noto",
      "price": "€XX–YY"
    },
    "technicianCost": "€XX–YY (manodopera + pezzo)",
    "urgency": "bassa/media/alta",
    "summary": "Una frase riassuntiva per il tecnico"
  },
  "message": "Messaggio finale all'utente"
}
\`\`\`

Altrimenti rispondi con testo normale (no JSON).`;

// ─── Handler principale ─────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { messages, frame, appliance, brand, initialProblem, sessionId } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Parametri non validi" });
  }

  try {
	// Aggiungi contesto iniziale come primo messaggio utente
	const contextMessage = `Contesto sessione: Elettrodomestico: ${appliance}, Marca: ${brand || "non specificata"}, Problema: 	${initialProblem}. Hai già salutato l'utente, conosci già questi dati, NON chiedere di nuovo.`;
    // Costruisci i messaggi per Claude
    // Claude richiede alternanza user/assistant. Sanitizziamo la history.
    const claudeMessages = buildClaudeMessages(messages, frame, appliance, brand, initialProblem);

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      temperature: 0.3,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const rawText = response.content[0].text;

    // Controlla se l'AI ha generato un referto JSON
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.generateReport && parsed.report) {
          return res.status(200).json({
            message: parsed.message || "Ecco il tuo referto completo!",
            report: parsed.report,
          });
        }
      } catch (e) {
        // JSON malformato — tratta come testo normale
      }
    }

    return res.status(200).json({ message: rawText });
  } catch (err) {
    console.error("Errore Anthropic API:", err);
    return res.status(500).json({
      error: "Errore interno del server",
      detail: err.message,
    });
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Costruisce la sequenza messaggi per Claude.
 * Gestisce frame immagine, alternanza user/assistant, e messaggi automatici.
 */
function buildClaudeMessages(messages, currentFrame, appliance, brand, initialProblem) {  const result = [];
  // Inserisci sempre il contesto come primo messaggio
result.push({
  role: "user",
  content: `Contesto: sto assistendo per "${initialProblem}" su ${appliance || "elettrodomestico"} marca ${brand || "non specificata"}. Conosci già questi dati, non chiederli di nuovo.`,
});
result.push({
  role: "assistant", 
  content: `Capito. Sto assistendo per un problema di "${initialProblem}" su ${appliance} ${brand || ""}. Procedo con la diagnosi senza richiedere queste informazioni di nuovo.`,
});

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    if (msg.role === "user") {
      // Messaggio automatico da analisi periodica
      if (msg.content === "[FRAME_AUTO]") {
        if (currentFrame && i === messages.length - 1) {
          // Solo l'ultimo frame automatico include l'immagine
          result.push({
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: currentFrame,
                },
              },
              {
                type: "text",
                text: "Guarda questo frame in silenzio. Rispondi SOLO se vedi qualcosa di nuovo e importante (codice errore, perdita d'acqua, componente danneggiato). Se non vedi nulla di nuovo, rispondi esattamente con: [SKIP]",
              },
            ],
          });
        }
        // Frame automatici precedenti: skip per non sovraccaricare il context
        continue;
      }

      // Messaggio testuale normale (con eventuale frame allegato)
      if (currentFrame && i === messages.length - 1) {
        result.push({
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: currentFrame,
              },
            },
            {
              type: "text",
              text: msg.content,
            },
          ],
        });
      } else {
        result.push({
          role: "user",
          content: msg.content,
        });
      }
    } else if (msg.role === "assistant") {
      result.push({
        role: "assistant",
        content: msg.content,
      });
    }
  }

  // Assicura che la sequenza inizi sempre con "user"
  if (result.length > 0 && result[0].role === "assistant") {
    result.shift();
  }

  // Assicura alternanza corretta (rimuovi duplicati consecutivi)
  const cleaned = [];
  for (const msg of result) {
    if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== msg.role) {
      cleaned.push(msg);
    }
  }

  return cleaned;
}
