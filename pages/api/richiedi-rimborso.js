// pages/api/richiedi-rimborso.js
// Riceve la richiesta di rimborso dal referto, la registra e avvisa Loris.
//
// NON rimborsa da sola, di proposito: il rimborso lo esegue una persona dal
// pannello Stripe. Ai volumi attuali costa niente ed è molto più sicuro —
// un rimborso automatico è il meccanismo che si fa spennare per primo.
//
// Qui si applicano solo i due controlli che possono essere fatti sui dati:
// la finestra dei 14 giorni e "un rimborso a persona". Il resto lo decide
// Loris leggendo il motivo.

import { Resend } from "resend";
import { MITTENTE, RISPOSTA_A, riferimento } from "../../lib/email-mittente";
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export const GIORNI_PER_CHIEDERE = 14;
const MOTIVO_MINIMO = 10; // due parole non spiegano niente, né a noi né a lui

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const emailValida = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || ""));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { email, motivo, stripeSessionId, sessioneToken, appliance, brand } = req.body || {};

  if (!emailValida(email)) {
    return res.status(400).json({ error: "Serve l'indirizzo email che hai usato per il pagamento." });
  }
  if (!motivo || String(motivo).trim().length < MOTIVO_MINIMO) {
    return res.status(400).json({
      error: "Scrivi in due righe cosa non ha funzionato: serve per decidere, e per non ripetere l'errore.",
    });
  }

  const emailPulita = String(email).trim().toLowerCase();
  const motivoPulito = String(motivo).trim().slice(0, 2000);

  try {
    // 1. Un rimborso a persona. È la regola che ferma l'abuso vero: fare la
    //    diagnosi, imparare cos'è rotto, farsi ridare i soldi e ricominciare
    //    il giorno dopo con un altro elettrodomestico.
    const { data: passati, error: erroreStorico } = await supabase
      .from("rimborsi")
      .select("id, stato, created_at")
      .eq("email", emailPulita)
      .in("stato", ["richiesto", "rimborsato"]);
    if (erroreStorico) throw erroreStorico;

    if (passati?.length) {
      const gia = passati.find((r) => r.stato === "rimborsato");
      return res.status(409).json({
        error: gia
          ? "Risulta già un rimborso su questo indirizzo. La garanzia vale una volta per persona: scrivici pure, ma la richiesta non parte da qui."
          : "Abbiamo già una tua richiesta in corso: ti rispondiamo al più presto.",
      });
    }

    // 2. La finestra dei 14 giorni, contata dal pagamento vero e non da quello
    //    che dichiara il browser. Se il pagamento non si trova non si blocca
    //    nulla: la richiesta si registra e decide Loris.
    let fuoriTempo = false;
    if (stripeSessionId) {
      const { data: pagamento } = await supabase
        .from("pagamenti")
        .select("created_at")
        .eq("stripe_session_id", stripeSessionId)
        .maybeSingle();
      if (pagamento?.created_at) {
        const giorni = (Date.now() - new Date(pagamento.created_at).getTime()) / 86400000;
        fuoriTempo = giorni > GIORNI_PER_CHIEDERE;
      }
    }
    if (fuoriTempo) {
      return res.status(409).json({
        error: `La garanzia vale entro ${GIORNI_PER_CHIEDERE} giorni dalla diagnosi. Se pensi ci sia un errore, scrivici: ${RISPOSTA_A}`,
      });
    }

    const { error: erroreInsert } = await supabase.from("rimborsi").insert({
      email: emailPulita,
      motivo: motivoPulito,
      stripe_session_id: stripeSessionId || null,
      sessione_token: sessioneToken || null,
      appliance: appliance || null,
      brand: brand || null,
      stato: "richiesto",
    });
    if (erroreInsert) {
      // L'indice unico su sessione_token: doppio invio dallo stesso referto
      if (erroreInsert.code === "23505") {
        return res.status(409).json({ error: "Abbiamo già ricevuto la richiesta per questa diagnosi." });
      }
      throw erroreInsert;
    }

    // L'email è l'unica cosa che fa succedere qualcosa: se salta, la richiesta
    // resta comunque salvata e visibile nella dashboard.
    try {
      await resend.emails.send({
        from: MITTENTE,
        replyTo: RISPOSTA_A,
        to: RISPOSTA_A,
        subject: `Rimborso richiesto #${riferimento(sessioneToken || emailPulita)} — ${brand ? brand + " " : ""}${appliance || "diagnosi"}`,
        html: `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="font-family:system-ui,sans-serif;color:#1C1C1A;">
  <h2 style="margin:0 0 12px;">Richiesta di rimborso</h2>
  <p style="margin:0 0 6px;"><strong>Cliente:</strong> ${esc(emailPulita)}</p>
  <p style="margin:0 0 6px;"><strong>Diagnosi:</strong> ${esc(brand || "")} ${esc(appliance || "")}</p>
  <p style="margin:0 0 16px;"><strong>Pagamento Stripe:</strong> ${esc(stripeSessionId || "non indicato")}</p>
  <div style="background:#f5f5f3;border-radius:10px;padding:14px 16px;">
    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#0F6E56;font-weight:700;">Motivo</p>
    <p style="margin:0;white-space:pre-wrap;">${esc(motivoPulito)}</p>
  </div>
  <p style="margin:18px 0 0;font-size:13px;color:#555;">
    Per rimborsare: pannello Stripe → Pagamenti → cerca la sessione qui sopra → Rimborsa.
    Poi segna la richiesta come rimborsata nella dashboard.
  </p>
</body></html>`,
      });
    } catch (e) {
      console.warn("Email di rimborso non inviata:", e?.message);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Errore richiesta rimborso:", err);
    return res.status(500).json({ error: "Non sono riuscito a registrare la richiesta. Riprova, oppure scrivici a " + RISPOSTA_A });
  }
}
