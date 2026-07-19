// pages/api/recensione.js
// Recensione del cliente sul lavoro completato, tramite il link ricevuto
// via email (token monouso legato alla richiesta).
// GET  ?token=...                 → info sul lavoro da recensire
// POST { token, voto, commento }  → salva la recensione (una sola volta)

import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "token mancante" });

    const { data: r, error } = await supabase
      .from("richieste_intervento")
      .select("appliance, brand, stato, recensione_voto, tecnico_id, tecnici:tecnico_id (nome, cognome)")
      .eq("recensione_token", token)
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!r) return res.status(404).json({ error: "Link non valido" });

    return res.status(200).json({
      appliance: r.appliance,
      brand: r.brand,
      tecnico: r.tecnici ? `${r.tecnici.nome} ${r.tecnici.cognome}` : "il tecnico",
      giaRecensito: r.recensione_voto != null,
    });
  }

  if (req.method === "POST") {
    const { token, voto, commento } = req.body || {};
    if (!token) return res.status(400).json({ error: "token mancante" });

    const votoNum = Number(voto);
    if (!Number.isInteger(votoNum) || votoNum < 1 || votoNum > 5) {
      return res.status(400).json({ error: "Il voto deve essere da 1 a 5" });
    }

    try {
      // Salva solo se non è già stata lasciata una recensione
      const { data: salvata, error } = await supabase
        .from("richieste_intervento")
        .update({
          recensione_voto: votoNum,
          recensione_commento: commento ? String(commento).slice(0, 500) : null,
          recensione_at: new Date().toISOString(),
        })
        .eq("recensione_token", token)
        .is("recensione_voto", null)
        .select()
        .maybeSingle();
      if (error) throw error;

      if (!salvata) {
        const { data: esiste } = await supabase
          .from("richieste_intervento")
          .select("recensione_voto")
          .eq("recensione_token", token)
          .maybeSingle();
        if (!esiste) return res.status(404).json({ error: "Link non valido" });
        return res.status(200).json({ ok: false, giaRecensito: true });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Errore salvataggio recensione:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Metodo non consentito" });
}
