// pages/api/feedback.js
// Salva la sessione di diagnosi. Viene chiamata due volte:
//   1. appena il referto è pronto, senza voto → crea la riga e restituisce
//      un token
//   2. se l'utente dà il voto → aggiorna quella stessa riga tramite il token
// Così restano tracciate anche le diagnosi che nessuno valuta, e si può
// vedere quante persone arrivano al referto ma non lasciano un giudizio.

import crypto from "crypto";
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const {
    token,
    voto,
    risolto,
    appliance,
    brand,
    problem,
    report,
    messages,
    email_utente,
    durata_secondi,
  } = req.body || {};

  // L'endpoint è pubblico: non fidarsi di quello che arriva nel body
  const votoPulito = Number.isInteger(voto) && voto >= 1 && voto <= 5 ? voto : null;
  const risoltoPulito = typeof risolto === "boolean" ? risolto : null;
  const durataPulita =
    Number.isInteger(durata_secondi) && durata_secondi > 0 ? durata_secondi : null;

  try {
    // Con il token: è il voto su una sessione già salvata
    if (token) {
      const aggiornamento = {
        feedback_voto: votoPulito,
        feedback_risolto: risoltoPulito,
      };
      // Solo i campi valorizzati, per non cancellare quelli già salvati
      if (email_utente) aggiornamento.email_utente = email_utente;
      if (durataPulita) aggiornamento.durata_secondi = durataPulita;

      const { data, error } = await supabase
        .from("sessioni")
        .update(aggiornamento)
        .eq("token", token)
        .select("id");

      if (error) throw error;
      if (data?.length) return res.status(200).json({ ok: true });
      // Token sconosciuto: si prosegue e si salva come sessione nuova.
      // Meglio una riga in più che perdere il feedback.
    }

    const nuovoToken = crypto.randomBytes(24).toString("hex");
    const { error } = await supabase.from("sessioni").insert({
      token: nuovoToken,
      appliance,
      brand,
      problem,
      feedback_voto: votoPulito,
      feedback_risolto: risoltoPulito,
      report: report || null,
      messages: messages || null,
      email_utente: email_utente || null,
      durata_secondi: durataPulita,
    });

    if (error) throw error;

    return res.status(200).json({ ok: true, token: nuovoToken });
  } catch (err) {
    console.error("Errore salvataggio sessione:", err);
    return res.status(500).json({ error: err.message });
  }
}
