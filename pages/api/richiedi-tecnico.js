// pages/api/richiedi-tecnico.js
// Riceve la richiesta di intervento dal referto, trova i tecnici approvati
// della zona e manda a ciascuno un'email con il referto e un link di
// accettazione. Il primo tecnico che accetta si prende il lavoro.

import crypto from "crypto";
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

// La diagnosi usa il singolare, le specializzazioni dei tecnici il plurale
const SPEC_PER_APPLIANCE = {
  Lavatrice: "Lavatrici",
  Lavastoviglie: "Lavastoviglie",
  Asciugatrice: "Asciugatrici",
  Frigorifero: "Frigoriferi",
  Forno: "Forni",
  "Piano cottura": "Piani cottura",
  Condizionatore: "Climatizzatori",
};

async function trovaTecnici(appliance, cap) {
  const base = () =>
    supabase
      .from("tecnici")
      .select("id, nome, cognome, email, citta, cap, specializzazioni")
      .eq("approvato", true);

  const spec = SPEC_PER_APPLIANCE[appliance];
  const zona = cap.slice(0, 2); // prime 2 cifre del CAP ≈ provincia

  // 1° tentativo: stessa zona + specializzazione giusta
  if (spec) {
    const { data } = await base().contains("specializzazioni", [spec]).like("cap", `${zona}%`);
    if (data?.length) return data;
    // 2°: specializzazione giusta ovunque
    const { data: ovunque } = await base().contains("specializzazioni", [spec]);
    if (ovunque?.length) return ovunque;
  }
  // 3°: qualsiasi tecnico approvato della zona
  const { data: zonaQualsiasi } = await base().like("cap", `${zona}%`);
  if (zonaQualsiasi?.length) return zonaQualsiasi;
  // 4°: qualsiasi tecnico approvato
  const { data: tutti } = await base();
  return tutti || [];
}

function emailTecnicoHtml({ tecnico, richiesta, report, linkAccetta }) {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Nuovo lavoro Fixi</title></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0F6E56;padding:28px 36px;">
  <p style="margin:0;color:white;font-size:24px;font-weight:800;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">Nuovo lavoro nella tua zona</p>
</td></tr>
<tr><td style="padding:24px 36px;">
  <p style="margin:0 0 4px;font-size:15px;">Ciao <strong>${esc(tecnico.nome)}</strong>,</p>
  <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.6;">
    un cliente in zona <strong>${esc(richiesta.citta || "")} (CAP ${esc(richiesta.cap)})</strong> cerca un tecnico.
    La diagnosi è già fatta — ecco il quadro:
  </p>
  <div style="background:#f5f5f3;border-radius:10px;padding:14px 16px;margin-bottom:12px;">
    <p style="margin:0;font-size:14px;font-weight:600;">${esc(richiesta.brand || "")} ${esc(richiesta.appliance || "")}</p>
    <p style="margin:4px 0 0;font-size:13px;color:#555;">Problema: "${esc(richiesta.problem || "")}"</p>
  </div>
  ${report?.diagnosis ? `
  <div style="border-left:3px solid #0F6E56;background:#e8f5f0;border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:12px;">
    <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#0F6E56;text-transform:uppercase;">Diagnosi AI</p>
    <p style="margin:0;font-size:13px;color:#333;line-height:1.5;">${esc(report.diagnosis)}</p>
  </div>` : ""}
  ${report?.sparePart?.name ? `
  <p style="margin:0 0 12px;font-size:13px;color:#555;">Pezzo indicato: <strong>${esc(report.sparePart.name)}</strong>${report.sparePart.code ? " (cod. " + esc(report.sparePart.code) + ")" : ""}</p>` : ""}
  ${report?.technicianCost ? `
  <p style="margin:0 0 20px;font-size:13px;color:#555;">Stima intervento mostrata al cliente: <strong>${esc(report.technicianCost)}</strong></p>` : ""}
  <a href="${linkAccetta}" style="display:inline-block;background:#0F6E56;color:white;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:600;">
    Accetta il lavoro →
  </a>
  <p style="margin:16px 0 0;font-size:12px;color:#888;">
    Il lavoro viene assegnato al primo tecnico che accetta. Dopo l'accettazione ricevi subito i contatti del cliente.
  </p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { nome, telefono, email, citta, cap, appliance, brand, problem, report } = req.body || {};

  if (!nome || !telefono || !cap) {
    return res.status(400).json({ error: "Nome, telefono e CAP sono obbligatori" });
  }
  if (!/^\d{5}$/.test(String(cap).trim())) {
    return res.status(400).json({ error: "Il CAP deve essere di 5 cifre" });
  }

  try {
    const capPulito = String(cap).trim();
    const tecnici = await trovaTecnici(appliance, capPulito);
    const token = crypto.randomBytes(24).toString("hex");
    const stato = tecnici.length > 0 ? "inviata" : "nuova";

    const { error } = await supabase.from("richieste_intervento").insert({
      token,
      nome,
      telefono,
      email: email || null,
      citta: citta || null,
      cap: capPulito,
      appliance: appliance || null,
      brand: brand || null,
      problem: problem || null,
      report: report || null,
      stato,
      tecnici_contattati: tecnici.length,
    });
    if (error) throw error;

    if (tecnici.length > 0) {
      const baseUrl = req.headers.origin || `https://${req.headers.host}`;
      const richiesta = { citta, cap: capPulito, appliance, brand, problem };
      const invii = await Promise.allSettled(
        tecnici.map((t) =>
          resend.emails.send({
            from: MITTENTE,
            replyTo: RISPOSTA_A,
            to: t.email,
            subject: `Nuovo lavoro Fixi — ${brand ? brand + " " : ""}${appliance || "elettrodomestico"} a ${citta || "CAP " + capPulito}`,
            html: emailTecnicoHtml({
              tecnico: t,
              richiesta,
              report,
              linkAccetta: `${baseUrl}/accetta-lavoro?token=${token}&t=${t.id}`,
            }),
          })
        )
      );
      const falliti = invii.filter((i) => i.status === "rejected" || i.value?.error);
      if (falliti.length > 0) {
        console.warn(`Richiesta ${token}: ${falliti.length}/${tecnici.length} email non inviate`);
      }
    }

    return res.status(200).json({ ok: true, tecniciContattati: tecnici.length });
  } catch (err) {
    console.error("Errore richiesta tecnico:", err);
    return res.status(500).json({ error: err.message });
  }
}
