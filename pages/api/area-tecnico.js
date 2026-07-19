// pages/api/area-tecnico.js
// Area personale del tecnico, raggiunta col suo token di accesso.
// GET  ?token=...                          → profilo + lavori assegnati
// POST { token, azione: "profilo", ... }   → aggiorna telefono/zona/specializzazioni
// POST { token, azione: "completa", richiestaId } → segna il lavoro completato
//                                            e invia al cliente il link recensione

import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function tecnicoDaToken(token) {
  if (!token) return null;
  const { data } = await supabase
    .from("tecnici")
    .select("id, nome, cognome, email, telefono, citta, cap, specializzazioni, approvato")
    .eq("accesso_token", token)
    .eq("approvato", true)
    .maybeSingle();
  return data;
}

function emailRecensioneHtml(nomeCliente, nomeTecnico, linkRecensione) {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Com'è andata?</title></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0F6E56;padding:28px 36px;">
  <p style="margin:0;color:white;font-size:24px;font-weight:800;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">Com'è andata la riparazione?</p>
</td></tr>
<tr><td style="padding:24px 36px;">
  <p style="margin:0 0 12px;font-size:15px;">Ciao <strong>${esc(nomeCliente)}</strong>,</p>
  <p style="margin:0 0 20px;font-size:14px;color:#444;line-height:1.6;">
    il tecnico <strong>${esc(nomeTecnico)}</strong> ha segnato il tuo intervento come completato.
    Ci racconti com'è andata? Bastano 30 secondi e aiuti gli altri clienti a scegliere bene.
  </p>
  <a href="${linkRecensione}" style="display:inline-block;background:#0F6E56;color:white;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:600;">
    Lascia una recensione →
  </a>
</td></tr>
</table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  // ── Profilo + lavori ────────────────────────────────────────────
  if (req.method === "GET") {
    const tecnico = await tecnicoDaToken(req.query.token);
    if (!tecnico) return res.status(401).json({ error: "Link non valido o tecnico non approvato" });

    const { data: lavori } = await supabase
      .from("richieste_intervento")
      .select("id, nome, telefono, email, citta, cap, appliance, brand, problem, report, stato, created_at, accettata_at, completata_at, recensione_voto, recensione_commento")
      .eq("tecnico_id", tecnico.id)
      .order("accettata_at", { ascending: false });

    const { approvato, ...profilo } = tecnico;
    return res.status(200).json({ tecnico: profilo, lavori: lavori || [] });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { token, azione } = req.body || {};
  const tecnico = await tecnicoDaToken(token);
  if (!tecnico) return res.status(401).json({ error: "Link non valido o tecnico non approvato" });

  try {
    // ── Aggiorna profilo ──────────────────────────────────────────
    if (azione === "profilo") {
      const { telefono, citta, cap, specializzazioni } = req.body;
      if (!telefono || !citta || !cap) {
        return res.status(400).json({ error: "Telefono, città e CAP sono obbligatori" });
      }
      if (!/^\d{5}$/.test(String(cap).trim())) {
        return res.status(400).json({ error: "Il CAP deve essere di 5 cifre" });
      }
      if (!Array.isArray(specializzazioni) || specializzazioni.length === 0) {
        return res.status(400).json({ error: "Seleziona almeno una specializzazione" });
      }
      const { error } = await supabase
        .from("tecnici")
        .update({ telefono, citta, cap: String(cap).trim(), specializzazioni })
        .eq("id", tecnico.id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    // ── Segna lavoro completato ───────────────────────────────────
    if (azione === "completa") {
      const { richiestaId } = req.body;
      if (!richiestaId) return res.status(400).json({ error: "richiestaId mancante" });

      const recensioneToken = crypto.randomBytes(24).toString("hex");
      // Aggiorna solo se il lavoro è suo ed è in stato "accettata"
      const { data: lavoro, error } = await supabase
        .from("richieste_intervento")
        .update({
          stato: "completata",
          completata_at: new Date().toISOString(),
          recensione_token: recensioneToken,
        })
        .eq("id", richiestaId)
        .eq("tecnico_id", tecnico.id)
        .eq("stato", "accettata")
        .select()
        .maybeSingle();
      if (error) throw error;
      if (!lavoro) {
        return res.status(400).json({ error: "Lavoro non trovato o già completato" });
      }

      // Invita il cliente a lasciare una recensione (se ha lasciato l'email)
      if (lavoro.email) {
        const baseUrl = req.headers.origin || `https://${req.headers.host}`;
        try {
          const esito = await resend.emails.send({
            from: "Fixi <onboarding@resend.dev>",
            to: lavoro.email,
            subject: "Com'è andata la riparazione? Lascia una recensione",
            html: emailRecensioneHtml(
              lavoro.nome,
              `${tecnico.nome} ${tecnico.cognome}`,
              `${baseUrl}/recensione?token=${recensioneToken}`
            ),
          });
          if (esito?.error) console.warn("Email recensione non inviata:", esito.error);
        } catch (e) {
          console.warn("Email recensione non inviata:", e.message);
        }
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Azione non riconosciuta" });
  } catch (err) {
    console.error("Errore area tecnico:", err);
    return res.status(500).json({ error: err.message });
  }
}
