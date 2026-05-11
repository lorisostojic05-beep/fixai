import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { email, report, appliance, brand, problem } = req.body;

  if (!email || !report) {
    return res.status(400).json({ error: "Email e referto sono obbligatori" });
  }

  const refNum = `#${Date.now().toString().slice(-6)}`;
  const data = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  const urgenzaColore = { bassa: "#0F6E56", media: "#854F0B", alta: "#A01E1E" };
  const urgenzaColoreVal = urgenzaColore[report.urgency] || urgenzaColore.media;

  const html = `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8"><title>Referto FixAI</title></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f3;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
<tr><td style="background:#0F6E56;padding:32px 40px;">
  <p style="margin:0;color:white;font-size:28px;font-weight:800;">FixAI</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">Diagnosi elettrodomestici via videochiamata AI</p>
  <p style="margin:16px 0 0;color:#b4e6d2;font-size:12px;">Referto ${refNum} — ${data}</p>
</td></tr>
<tr><td style="padding:24px 40px 0;">
  <div style="background:#f5f5f3;border-radius:10px;padding:14px 16px;">
    <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a18;">${brand ? brand.toUpperCase() + " — " : ""}${appliance}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#666;">Problema riportato: "${problem}"</p>
  </div>
</td></tr>
<tr><td style="padding:16px 40px 0;">
  <div style="border-left:3px solid #0F6E56;background:#e8f5f0;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#0F6E56;text-transform:uppercase;">DIAGNOSI</p>
    <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">${report.diagnosis}</p>
  </div>
</td></tr>
${report.diyPossible && report.diyInstructions ? `
<tr><td style="padding:12px 40px 0;">
  <div style="border-left:3px solid #1D9E75;background:#e8f5f0;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#0F6E56;text-transform:uppercase;">SOLUZIONE FAI-DA-TE</p>
    <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">${report.diyInstructions}</p>
  </div>
</td></tr>` : ""}
${report.sparePart ? `
<tr><td style="padding:12px 40px 0;">
  <div style="border-left:3px solid #854F0B;background:#faeeda;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#854F0B;text-transform:uppercase;">PEZZO DA SOSTITUIRE</p>
    <p style="margin:0;font-size:13px;color:#333;"><strong>${report.sparePart.name}</strong></p>
    ${report.sparePart.code ? `<p style="margin:2px 0;font-size:12px;color:#666;">Codice: ${report.sparePart.code}</p>` : ""}
    <p style="margin:2px 0;font-size:12px;color:#666;">Prezzo: ${report.sparePart.price}</p>
  </div>
</td></tr>` : ""}
<tr><td style="padding:12px 40px 0;">
  <div style="border-left:3px solid #185FA5;background:#e6f1fb;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#185FA5;text-transform:uppercase;">STIMA INTERVENTO TECNICO</p>
    <p style="margin:0;font-size:20px;font-weight:700;color:#0F6E56;">${report.technicianCost}</p>
    <p style="margin:4px 0 0;font-size:11px;color:#888;">Mostra questo referto al tecnico per un prezzo equo.</p>
  </div>
</td></tr>
${report.urgency ? `
<tr><td style="padding:12px 40px 0;">
  <div style="background:#f5f5f3;border-radius:8px;padding:10px 14px;">
    <p style="margin:0;font-size:12px;font-weight:600;color:${urgenzaColoreVal};">
      Urgenza: ${report.urgency.toUpperCase()} — ${report.urgency === "bassa" ? "Nessuna fretta" : report.urgency === "media" ? "Intervieni entro qualche giorno" : "Intervieni il prima possibile"}
    </p>
  </div>
</td></tr>` : ""}
<tr><td style="height:24px;"></td></tr>
<tr><td style="background:#0F6E56;padding:20px 40px;">
  <p style="margin:0;color:white;font-size:13px;font-weight:600;">FixAI</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:11px;">Referto generato da sistema AI. Consultare sempre un tecnico qualificato.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: "FixAI <onboarding@resend.dev>",
      to: email,
      subject: `Il tuo referto FixAI — ${brand ? brand + " " : ""}${appliance}`,
      html,
    });
    return res.status(200).json({ inviata: true });
  } catch (err) {
    console.error("Errore invio email:", err);
    return res.status(500).json({ error: err.message });
  }
}