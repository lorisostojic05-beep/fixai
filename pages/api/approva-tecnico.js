// pages/api/approva-tecnico.js
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";
import { verificaTokenAdmin } from "../../lib/admin-token";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  if (!verificaTokenAdmin(req)) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const { id, approva } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: "id mancante" });
  }

  try {
    if (approva) {
      const { error } = await supabase.from("tecnici").update({ approvato: true }).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("tecnici").delete().eq("id", id);
      if (error) throw error;
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Errore approvazione tecnico:", err);
    return res.status(500).json({ error: err.message });
  }
}
