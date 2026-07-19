// pages/api/approva-tecnico.js
// Approva o rifiuta un tecnico (solo admin). All'approvazione genera il
// token di accesso personale e invia l'email di benvenuto con il link
// all'area tecnico.

import crypto from "crypto";
import { Resend } from "resend";
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";
import { verificaTokenAdmin } from "../../lib/admin-token";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function emailBenvenutoHtml(nome, linkArea) {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Benvenuto in Fixi</title></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0F6E56;padding:28px 36px;">
  <p style="margin:0;color:white;font-size:24px;font-weight:800;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">Sei dei nostri! 🎉</p>
</td></tr>
<tr><td style="padding:24px 36px;">
  <p style="margin:0 0 12px;font-size:15px;">Ciao <strong>${esc(nome)}</strong>,</p>
  <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.6;">
    la tua iscrizione a Fixi è stata <strong>approvata</strong>. Da ora riceverai
    via email i lavori disponibili nella tua zona, con la diagnosi già fatta.
  </p>
  <p style="margin:0 0 20px;font-size:14px;color:#444;line-height:1.6;">
    Questa è la tua <strong>area personale</strong>: qui trovi i lavori che hai accettato,
    i contatti dei clienti e il tuo profilo. Salva il link tra i preferiti — è personale, non condividerlo.
  </p>
  <a href="${linkArea}" style="display:inline-block;background:#0F6E56;color:white;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:600;">
    Apri la mia area tecnico →
  </a>
</td></tr>
</table></td></tr></table></body></html>`;
}

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
      const { data: tecnico } = await supabase
        .from("tecnici")
        .select("id, nome, email, accesso_token")
        .eq("id", id)
        .maybeSingle();
      if (!tecnico) {
        return res.status(404).json({ error: "Tecnico non trovato" });
      }

      const token = tecnico.accesso_token || crypto.randomBytes(24).toString("hex");
      const { error } = await supabase
        .from("tecnici")
        .update({ approvato: true, accesso_token: token })
        .eq("id", id);
      if (error) throw error;

      // Email di benvenuto con il link all'area personale
      const baseUrl = req.headers.origin || `https://${req.headers.host}`;
      try {
        const esito = await resend.emails.send({
          from: "Fixi <onboarding@resend.dev>",
          to: tecnico.email,
          subject: "Benvenuto in Fixi — la tua area tecnico",
          html: emailBenvenutoHtml(tecnico.nome, `${baseUrl}/area-tecnico?token=${token}`),
        });
        if (esito?.error) console.warn("Email benvenuto non inviata:", esito.error);
      } catch (e) {
        console.warn("Email benvenuto non inviata:", e.message);
      }
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
