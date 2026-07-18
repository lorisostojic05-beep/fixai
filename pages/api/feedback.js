import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { voto, risolto, appliance, brand, problem, report, messages, email_utente, durata_secondi } = req.body;

  try {
    const { error } = await supabase.from("sessioni").insert({
      appliance,
      brand,
      problem,
      feedback_voto: voto,
      feedback_risolto: risolto,
      report: report || null,
      messages: messages || null,
      email_utente: email_utente || null,
      durata_secondi: durata_secondi || null,
    });

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Errore salvataggio feedback:", err);
    return res.status(500).json({ error: err.message });
  }
}