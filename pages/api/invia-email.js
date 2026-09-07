import { Resend } from "resend";
import { MITTENTE, RISPOSTA_A } from "../../lib/email-mittente";
import { testiPer } from "../../lib/testi";
import { riempi } from "../../lib/frasi";
import { linguaValida, PREDEFINITA } from "../../lib/lingue";

const resend = new Resend(process.env.RESEND_API_KEY);

// Neutralizza HTML nei campi che finiscono nel template dell'email
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const {
    email,
    report: reportRaw,
    appliance: applianceRaw,
    brand: brandRaw,
    problem: problemRaw,
    lingua: linguaRaw,
  } = req.body;

  // La lingua arriva dal client e finisce dentro l'HTML dell'email: si accetta
  // solo se e' una delle nostre, se no si ripiega sull'italiano. Non e'
  // pignoleria — e' un valore che viene da fuori.
  const lingua = linguaValida(linguaRaw) ? linguaRaw : PREDEFINITA;
  const t = testiPer(lingua).email;

  if (!email || !reportRaw) {
    return res.status(400).json({ error: "Email e referto sono obbligatori" });
  }

  // applianceRaw e' la chiave italiana ("Lavatrice"): e' quella che gira nel
  // programma, non quella da mostrare. Nel referto ci va il nome nella lingua
  // di chi legge, se no un'email spagnola diceva "BOSCH — Lavatrice".
  const appliance = esc(testiPer(lingua).diagnosi.elettrodomestici[applianceRaw] || applianceRaw);
  const brand = esc(brandRaw);
  const problem = esc(problemRaw);
  const report = {
    ...reportRaw,
    diagnosis: esc(reportRaw.diagnosis),
    diyInstructions: esc(reportRaw.diyInstructions),
    technicianCost: esc(reportRaw.technicianCost),
    urgency: ["bassa", "media", "alta"].includes(reportRaw.urgency) ? reportRaw.urgency : null,
    sparePart: reportRaw.sparePart
      ? {
          name: esc(reportRaw.sparePart.name),
          code: esc(reportRaw.sparePart.code),
          price: esc(reportRaw.sparePart.price),
        }
      : null,
  };

  const refNum = `#${Date.now().toString().slice(-6)}`;
  const data = new Date().toLocaleDateString(lingua, { day: "numeric", month: "long", year: "numeric" });
  const urgenzaColore = { bassa: "#0F6E56", media: "#854F0B", alta: "#A01E1E" };
  const urgenzaColoreVal = urgenzaColore[report.urgency] || urgenzaColore.media;
  // "bassa/media/alta" restano etichette italiane anche quando il referto e'
  // in un'altra lingua (vedi lo schema nel prompt): qui si traducono le due
  // parti che si leggono.
  const urgenzaNome = { bassa: t.urgenzaBassa, media: t.urgenzaMedia, alta: t.urgenzaAlta };
  const urgenzaAzione = {
    bassa: t.urgenzaBassaCosaFare,
    media: t.urgenzaMediaCosaFare,
    alta: t.urgenzaAltaCosaFare,
  };

  const html = `<!DOCTYPE html>
<html lang="${lingua}">
<head><meta charset="UTF-8"><title>${esc(t.oggetto.replace("{numero}", refNum).replace(" — {macchina}", ""))}</title></head>
<body style="margin:0;padding:0;background:#f5f5f3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f3;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
<tr><td style="background:#0F6E56;padding:32px 40px;">
  <p style="margin:0;color:white;font-size:28px;font-weight:800;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">${esc(t.sottotitolo)}</p>
  <p style="margin:16px 0 0;color:#b4e6d2;font-size:12px;">${esc(riempi(t.intestazione, { numero: refNum, data }))}</p>
</td></tr>
<tr><td style="padding:24px 40px 0;">
  <div style="background:#f5f5f3;border-radius:10px;padding:14px 16px;">
    <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a18;">${brand ? brand.toUpperCase() + " — " : ""}${appliance}</p>
    <p style="margin:4px 0 0;font-size:12px;color:#666;">${esc(t.problema).replace("{problema}", problem)}</p>
  </div>
</td></tr>
<tr><td style="padding:16px 40px 0;">
  <div style="border-left:3px solid #0F6E56;background:#e8f5f0;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#0F6E56;text-transform:uppercase;">${esc(t.diagnosi)}</p>
    <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">${report.diagnosis}</p>
  </div>
</td></tr>
${report.diyPossible && report.diyInstructions ? `
<tr><td style="padding:12px 40px 0;">
  <div style="border-left:3px solid #1D9E75;background:#e8f5f0;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#0F6E56;text-transform:uppercase;">${esc(t.faiDaTe)}</p>
    <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">${report.diyInstructions}</p>
  </div>
</td></tr>` : ""}
${report.sparePart ? `
<tr><td style="padding:12px 40px 0;">
  <div style="border-left:3px solid #854F0B;background:#faeeda;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#854F0B;text-transform:uppercase;">${esc(t.pezzo)}</p>
    <p style="margin:0;font-size:13px;color:#333;"><strong>${report.sparePart.name}</strong></p>
    ${report.sparePart.code ? `<p style="margin:2px 0;font-size:12px;color:#666;">${esc(riempi(t.codice, { codice: report.sparePart.code }))}</p>` : ""}
    <p style="margin:2px 0;font-size:12px;color:#666;">${esc(riempi(t.prezzo, { prezzo: report.sparePart.price }))}</p>
  </div>
</td></tr>` : ""}
<tr><td style="padding:12px 40px 0;">
  <div style="border-left:3px solid #185FA5;background:#e6f1fb;border-radius:0 8px 8px 0;padding:14px 16px;">
    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#185FA5;text-transform:uppercase;">${esc(t.stima)}</p>
    <p style="margin:0;font-size:20px;font-weight:700;color:#0F6E56;">${report.technicianCost}</p>
    <p style="margin:4px 0 0;font-size:11px;color:#888;">${esc(t.mostraAlTecnico)}</p>
  </div>
</td></tr>
${report.urgency ? `
<tr><td style="padding:12px 40px 0;">
  <div style="background:#f5f5f3;border-radius:8px;padding:10px 14px;">
    <p style="margin:0;font-size:12px;font-weight:600;color:${urgenzaColoreVal};">
      ${esc(riempi(t.urgenza, { livello: urgenzaNome[report.urgency] || report.urgency, cosaFare: urgenzaAzione[report.urgency] || "" }))}
    </p>
  </div>
</td></tr>` : ""}
<tr><td style="height:24px;"></td></tr>
<tr><td style="background:#0F6E56;padding:20px 40px;">
  <p style="margin:0;color:white;font-size:13px;font-weight:600;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:11px;">${esc(t.piede)}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: MITTENTE,
      replyTo: RISPOSTA_A,
      to: email,
      // Il numero nell'oggetto è lo stesso stampato dentro il referto, e serve
      // anche a non far raggruppare due referti dello stesso elettrodomestico
      // in un'unica conversazione.
      subject: riempi(t.oggetto, { numero: refNum, macchina: `${brand ? brand + " " : ""}${appliance}` }),
      html,
    });
    return res.status(200).json({ inviata: true });
  } catch (err) {
    console.error("Errore invio email:", err);
    return res.status(500).json({ error: err.message });
  }
}