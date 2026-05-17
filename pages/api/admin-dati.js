// pages/api/admin-dati.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    // Sessioni recenti
    const { data: sessioni } = await supabase
      .from("sessioni")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // Statistiche
    const totale = sessioni?.length || 0;

    const conFeedback = sessioni?.filter(s => s.feedback_voto) || [];
    const votoMedio = conFeedback.length > 0
      ? conFeedback.reduce((acc, s) => acc + s.feedback_voto, 0) / conFeedback.length
      : null;

    const risolti = sessioni?.filter(s => s.feedback_risolto === true).length || 0;
    const risoltiPercent = conFeedback.length > 0
      ? Math.round((risolti / conFeedback.length) * 100)
      : 0;

    const conDurata = sessioni?.filter(s => s.durata_secondi) || [];
    const duratMedia = conDurata.length > 0
      ? conDurata.reduce((acc, s) => acc + s.durata_secondi, 0) / conDurata.length
      : null;

    // Problemi più comuni
    const problemiMap = {};
    sessioni?.forEach(s => {
      if (s.problem) {
        const key = s.problem.toLowerCase().trim();
        problemiMap[key] = (problemiMap[key] || 0) + 1;
      }
    });
    const problemiComuni = Object.entries(problemiMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([problema, count]) => ({ problema, count }));

    // Per elettrodomestico
    const elettroMap = {};
    sessioni?.forEach(s => {
      if (s.appliance) {
        elettroMap[s.appliance] = (elettroMap[s.appliance] || 0) + 1;
      }
    });
    const perElettrodomestico = Object.entries(elettroMap)
      .sort((a, b) => b[1] - a[1])
      .map(([appliance, count]) => ({ appliance, count }));

    return res.status(200).json({
      totale,
      votoMedio,
      risoltiPercent,
      duratMedia,
      problemiComuni,
      perElettrodomestico,
      sessioni: sessioni || [],
    });
  } catch (err) {
    console.error("Errore admin dati:", err);
    return res.status(500).json({ error: err.message });
  }
}