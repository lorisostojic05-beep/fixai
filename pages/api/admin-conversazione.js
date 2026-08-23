// pages/api/admin-conversazione.js
// Restituisce UNA conversazione intera, per leggerla dalla dashboard.
//
// Sta in un endpoint suo e non dentro admin-dati perché le conversazioni sono
// lunghe: spedirle tutte insieme a ogni caricamento della dashboard sarebbe
// spreco puro. Qui si chiede quella che serve, quando serve.
//
// Serve soprattutto a decidere sui rimborsi: davanti a "non mi è stata utile"
// l'unica prova che conta davvero è cosa Fixi ha risposto per davvero.

import { supabaseAdmin as supabase } from "../../lib/supabase-admin";
import { verificaTokenAdmin } from "../../lib/admin-token";

// I fotogrammi non vengono salvati (né i video): nella conversazione restano
// solo questi marcatori. Mostrarli grezzi confonderebbe chi legge.
const LEGGIBILE = {
  "[FRAME_AUTO]": "📷 (fotogramma osservato automaticamente)",
  "[FRAME_UTENTE]": "📷 (l'utente ha premuto «Analizza» e mostrato qualcosa)",
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
  if (!verificaTokenAdmin(req)) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const token = String(req.query.token || "").trim();
  if (!token) {
    return res.status(400).json({ error: "Manca il token della sessione" });
  }

  try {
    const { data: s, error } = await supabase
      .from("sessioni")
      .select("created_at, appliance, brand, problem, messages, report, feedback_voto, feedback_risolto, durata_secondi, email_utente")
      .eq("token", token)
      .maybeSingle();
    if (error) throw error;
    if (!s) return res.status(404).json({ error: "Conversazione non trovata" });

    const messaggi = (Array.isArray(s.messages) ? s.messages : []).map((m) => ({
      chi: m.role === "user" ? "utente" : "fixi",
      testo: LEGGIBILE[m.content] || String(m.content ?? ""),
    }));

    return res.status(200).json({
      quando: s.created_at,
      appliance: s.appliance,
      brand: s.brand,
      problem: s.problem,
      voto: s.feedback_voto,
      risolto: s.feedback_risolto,
      durataMin: s.durata_secondi ? Math.round(s.durata_secondi / 60) : null,
      emailUtente: s.email_utente,
      report: s.report || null,
      messaggi,
    });
  } catch (err) {
    console.error("Errore lettura conversazione:", err);
    return res.status(500).json({ error: err.message });
  }
}
