import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { voto, risolto, appliance, brand, problem } = req.body;

  console.log("URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Dati ricevuti:", { voto, risolto, appliance, brand, problem });

  try {
    const { data, error } = await supabase.from("sessioni").insert({
      appliance,
      brand,
      problem,
      feedback_voto: voto,
      feedback_risolto: risolto,
    });

    console.log("Risultato:", data, "Errore:", error);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Errore salvataggio feedback:", err);
    return res.status(500).json({ error: err.message });
  }
}