// pages/api/iscriviti-tecnico.js
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { nome, cognome, email, telefono, citta, cap, specializzazioni, anni_esperienza, descrizione } = req.body;

  if (!nome || !cognome || !email || !telefono || !citta || !cap) {
    return res.status(400).json({ error: "Campi obbligatori mancanti" });
  }

  try {
    const { error } = await supabase.from("tecnici").insert({
      nome,
      cognome,
      email,
      telefono,
      citta,
      cap,
      specializzazioni,
      anni_esperienza: anni_esperienza ? parseInt(anni_esperienza) : null,
      descrizione,
      approvato: false,
    });

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Errore iscrizione tecnico:", err);
    return res.status(500).json({ error: err.message });
  }
}