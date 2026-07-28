// pages/api/accetta-lavoro.js
// GET  ?token=...          → dettagli del lavoro (senza contatti del cliente)
// POST { token, tecnicoId } → accetta il lavoro: il primo che accetta vince.
//                             All'accettazione partono le email con i contatti.

import { Resend } from "resend";
import { MITTENTE, RISPOSTA_A } from "../../lib/email-mittente";
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function emailContatti({ titolo, sottotitolo, righe, linkArea }) {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${esc(titolo)}</title></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0F6E56;padding:28px 36px;">
  <p style="margin:0;color:white;font-size:24px;font-weight:800;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">${esc(titolo)}</p>
</td></tr>
<tr><td style="padding:24px 36px;">
  <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.6;">${sottotitolo}</p>
  <div style="background:#e8f5f0;border-radius:10px;padding:16px;">
    ${righe.map((r) => `<p style="margin:0 0 6px;font-size:14px;"><strong>${esc(r[0])}:</strong> ${esc(r[1])}</p>`).join("")}
  </div>
  <p style="margin:16px 0 0;font-size:12px;color:#888;">Vi consigliamo di accordarvi telefonicamente su orario e sopralluogo.</p>
  ${linkArea ? `<p style="margin:12px 0 0;font-size:13px;"><a href="${linkArea}" style="color:#0F6E56;">Gestisci questo lavoro dalla tua area tecnico →</a></p>` : ""}
</td></tr>
</table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  // ── Dettagli lavoro (per la pagina di accettazione) ──────────────
  if (req.method === "GET") {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "token mancante" });

    const { data: r, error } = await supabase
      .from("richieste_intervento")
      .select("stato, citta, cap, appliance, brand, problem, report, created_at")
      .eq("token", token)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!r) return res.status(404).json({ error: "Richiesta non trovata" });

    return res.status(200).json({
      stato: r.stato,
      citta: r.citta,
      cap: r.cap,
      appliance: r.appliance,
      brand: r.brand,
      problem: r.problem,
      diagnosis: r.report?.diagnosis || null,
      technicianCost: r.report?.technicianCost || null,
      urgency: r.report?.urgency || null,
      created_at: r.created_at,
    });
  }

  // ── Accettazione ────────────────────────────────────────────────
  if (req.method === "POST") {
    const { token, tecnicoId } = req.body || {};
    if (!token || !tecnicoId) {
      return res.status(400).json({ error: "token o tecnicoId mancante" });
    }

    try {
      const { data: tecnico } = await supabase
        .from("tecnici")
        .select("id, nome, cognome, email, telefono, citta, accesso_token")
        .eq("id", tecnicoId)
        .eq("approvato", true)
        .maybeSingle();
      if (!tecnico) {
        return res.status(403).json({ error: "Tecnico non riconosciuto" });
      }

      // Assegnazione atomica: aggiorna solo se ancora in stato "inviata".
      // Se un altro tecnico ha già accettato, l'update non tocca righe.
      const { data: assegnata, error } = await supabase
        .from("richieste_intervento")
        .update({
          stato: "accettata",
          tecnico_id: tecnico.id,
          accettata_at: new Date().toISOString(),
        })
        .eq("token", token)
        .eq("stato", "inviata")
        .select()
        .maybeSingle();
      if (error) throw error;

      if (!assegnata) {
        const { data: esistente } = await supabase
          .from("richieste_intervento")
          .select("stato")
          .eq("token", token)
          .maybeSingle();
        if (!esistente) return res.status(404).json({ error: "Richiesta non trovata" });
        return res.status(200).json({ ok: false, giaAssegnata: true });
      }

      // Email al tecnico con i contatti del cliente
      const baseUrl = req.headers.origin || `https://${req.headers.host}`;
      const emailPromises = [
        resend.emails.send({
          from: MITTENTE,
          replyTo: RISPOSTA_A,
          to: tecnico.email,
          subject: `Lavoro confermato — contatti del cliente (${assegnata.brand || ""} ${assegnata.appliance || ""})`,
          html: emailContatti({
            titolo: "Lavoro confermato ✅",
            sottotitolo: `Il lavoro è tuo, ${esc(tecnico.nome)}! Ecco i contatti del cliente:`,
            righe: [
              ["Nome", assegnata.nome],
              ["Telefono", assegnata.telefono],
              ["Email", assegnata.email || "non fornita"],
              ["Zona", `${assegnata.citta || ""} (CAP ${assegnata.cap})`],
              ["Guasto", `${assegnata.brand || ""} ${assegnata.appliance || ""} — ${assegnata.problem || ""}`],
            ],
            linkArea: tecnico.accesso_token
              ? `${baseUrl}/area-tecnico?token=${tecnico.accesso_token}`
              : null,
          }),
        }),
      ];

      // Email al cliente con i contatti del tecnico (se ha lasciato l'email)
      if (assegnata.email) {
        emailPromises.push(
          resend.emails.send({
            from: MITTENTE,
            replyTo: RISPOSTA_A,
            to: assegnata.email,
            subject: "Abbiamo trovato il tuo tecnico! 🔧",
            html: emailContatti({
              titolo: "Tecnico trovato ✅",
              sottotitolo: `Ciao ${esc(assegnata.nome)}, un tecnico ha accettato la tua richiesta e ti contatterà a breve. Ecco i suoi riferimenti:`,
              righe: [
                ["Nome", `${tecnico.nome} ${tecnico.cognome}`],
                ["Telefono", tecnico.telefono],
                ["Email", tecnico.email],
                ["Zona", tecnico.citta || ""],
              ],
            }),
          })
        );
      }
      const esiti = await Promise.allSettled(emailPromises);
      esiti.forEach((e) => {
        if (e.status === "rejected" || e.value?.error) {
          console.warn("Email contatti non inviata:", e.reason || e.value?.error);
        }
      });

      return res.status(200).json({
        ok: true,
        cliente: {
          nome: assegnata.nome,
          telefono: assegnata.telefono,
          email: assegnata.email,
          citta: assegnata.citta,
          cap: assegnata.cap,
        },
      });
    } catch (err) {
      console.error("Errore accettazione lavoro:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Metodo non consentito" });
}
