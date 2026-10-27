// pages/api/acquisto-apple.js
// POST { transactionId } → registra la diagnosi pagata con l'App Store.
//
// E' il gemello di verifica-pagamento.js per l'iPhone: l'app ha appena
// comprato con il pagamento Apple, e prima di aprire la diagnosi si chiede
// ad Apple se l'acquisto esiste davvero. I controlli stanno in
// lib/verifica-apple.js; qui si decide solo cosa rispondere.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  CHIAMARLA DUE VOLTE VA BENE                                              │
// │                                                                           │
// │  L'app chiude la transazione con Apple solo DOPO che questa rotta ha      │
// │  risposto ok. Se il telefono si spegne nel mezzo, al riavvio Apple la     │
// │  riconsegna e l'app la rimanda qui. La seconda volta la riga c'e' gia':   │
// │  si risponde ok con lo stesso codice, e la finestra di due ore resta      │
// │  quella di prima — non riparte.                                           │
// └───────────────────────────────────────────────────────────────────────────┘

import { supabaseAdmin as db } from "../../lib/supabase-admin";
import { chiediTransazione, controllaTransazione, credenzialiDaAmbiente } from "../../lib/verifica-apple";
import { idPagamentoApple } from "../../lib/pagamento-apple";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Gli identificativi Apple sono numeri. Qualsiasi altra cosa non viaggia
  // fino ad Apple.
  const transactionId = String(req.body?.transactionId || "");
  if (!/^\d{1,20}$/.test(transactionId)) {
    return res.status(400).json({ error: "Acquisto non riconosciuto" });
  }

  const credenziali = credenzialiDaAmbiente();
  if (!credenziali) {
    console.error("APPLE_IAP_KEY_ID / ISSUER_ID / PRIVATE_KEY mancanti: non posso verificare gli acquisti iPhone.");
    return res.status(500).json({ error: "Pagamenti App Store non configurati" });
  }

  let transazione;
  try {
    transazione = await chiediTransazione(transactionId, { credenziali });
  } catch (e) {
    // Apple non risponde o rifiuta la nostra chiave. Il cliente HA pagato: la
    // transazione resta aperta sul telefono e verra' ritentata. Va detto in
    // modo che non paghi una seconda volta.
    console.error(`Acquisto ${transactionId}: App Store non raggiungibile:`, e.message);
    return res.status(502).json({ error: "App Store non risponde adesso. Il pagamento non e' perso: riprova fra poco." });
  }

  const esito = controllaTransazione(transazione, transactionId);
  if (!esito.ok) {
    console.warn(`Acquisto ${transactionId} rifiutato: ${esito.motivo}`);
    return res.status(402).json({ error: "Acquisto non valido" });
  }

  const idPagamento = idPagamentoApple(transazione);
  const { error } = await db.from("pagamenti").insert({
    stripe_session_id: idPagamento,
    attivata_at: new Date().toISOString(),
    richieste: 0,
  });
  // 23505: la riga c'e' gia' — e' la seconda consegna della stessa
  // transazione. Non e' un errore: vedi il riquadro in cima.
  if (error && error.code !== "23505") {
    console.error(`Acquisto ${transactionId} verificato ma non registrato:`, error.message);
    return res.status(500).json({ error: "Non riesco a registrare il pagamento. Riprova fra poco: non e' perso." });
  }

  return res.status(200).json({ ok: true, idPagamento });
}
