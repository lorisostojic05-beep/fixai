// pages/api/admin-dati.js
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";
import { verificaTokenAdmin } from "../../lib/admin-token";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  if (!verificaTokenAdmin(req)) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  try {
    // Sessioni recenti
    const { data: tecniciInAttesa } = await supabase
  .from("tecnici")
  .select("*")
  .eq("approvato", false)
  .order("created_at", { ascending: false });
    // Elenco mostrato in dashboard: le ultime 20, complete di referto e chat
    const { data: sessioni } = await supabase
      .from("sessioni")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // Statistiche su tutte le sessioni, non solo le ultime 20. Si prendono
    // solo le colonne che servono per non trascinarsi dietro referti e chat.
    const { data: perStatistiche } = await supabase
      .from("sessioni")
      .select("appliance, problem, feedback_voto, feedback_risolto, durata_secondi")
      .order("created_at", { ascending: false })
      .limit(500);
    const stat = perStatistiche || [];

    // Richieste di intervento, con il nome del tecnico assegnato
    const { data: richiesteRaw } = await supabase
      .from("richieste_intervento")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    let richieste = richiesteRaw || [];
    const idTecnici = [...new Set(richieste.filter((r) => r.tecnico_id).map((r) => r.tecnico_id))];
    if (idTecnici.length > 0) {
      const { data: tecniciAssegnati } = await supabase
        .from("tecnici")
        .select("id, nome, cognome, telefono")
        .in("id", idTecnici);
      const mappa = Object.fromEntries((tecniciAssegnati || []).map((t) => [t.id, t]));
      richieste = richieste.map((r) => ({ ...r, tecnico: mappa[r.tecnico_id] || null }));
    }

    // Statistiche
    const totale = stat.length;

    // Chi ha dato il voto: da quando la sessione si salva col referto, le due
    // cose non coincidono più — la differenza dice quanti non hanno valutato.
    const conFeedback = stat.filter(s => s.feedback_voto);
    const votoMedio = conFeedback.length > 0
      ? conFeedback.reduce((acc, s) => acc + s.feedback_voto, 0) / conFeedback.length
      : null;

    const conEsito = stat.filter(s => typeof s.feedback_risolto === "boolean");
    const risolti = conEsito.filter(s => s.feedback_risolto === true).length;
    const risoltiPercent = conEsito.length > 0
      ? Math.round((risolti / conEsito.length) * 100)
      : 0;

    const conDurata = stat.filter(s => s.durata_secondi);
    const duratMedia = conDurata.length > 0
      ? conDurata.reduce((acc, s) => acc + s.durata_secondi, 0) / conDurata.length
      : null;

    // Problemi più comuni
    const problemiMap = {};
    stat.forEach(s => {
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
    stat.forEach(s => {
      if (s.appliance) {
        elettroMap[s.appliance] = (elettroMap[s.appliance] || 0) + 1;
      }
    });
    const perElettrodomestico = Object.entries(elettroMap)
      .sort((a, b) => b[1] - a[1])
      .map(([appliance, count]) => ({ appliance, count }));

    return res.status(200).json({
      totale,
      votate: conFeedback.length,
      votoMedio,
      risoltiPercent,
      duratMedia,
      problemiComuni,
      perElettrodomestico,
      sessioni: sessioni || [],
      tecniciInAttesa: tecniciInAttesa || [],
      richieste,
    });
  } catch (err) {
    console.error("Errore admin dati:", err);
    return res.status(500).json({ error: err.message });
  }
}