// pages/api/preventivo.js
// Il giro del preventivo, dal lato rete.
//
// GET  ?cliente=TOKEN                      → cosa vede il cliente
// POST { azione: "proponi", token, richiestaId, prezzo }  → il tecnico
// POST { azione: "accetta", clienteToken }                → il cliente
// POST { azione: "rifiuta", clienteToken }                → il cliente
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  DUE SEGRETI DIVERSI, E NON E' PEDANTERIA                                 │
// │                                                                           │
// │  "token" e' il segreto del TECNICO: gli arriva per email e vale per la    │
// │  sua area. "clienteToken" e' quello del CLIENTE, e vale solo per la sua   │
// │  richiesta.                                                               │
// │                                                                           │
// │  Uno solo per tutti e due avrebbe voluto dire che chi ha ricevuto l'email │
// │  da tecnico poteva accettare il preventivo al posto del cliente — cioe'   │
// │  decidere da solo che il cliente deve pagare.                             │
// └───────────────────────────────────────────────────────────────────────────┘
//
// Qui dentro NON si calcola niente: i conti stanno in lib/preventivo.js e in
// lib/soldi.js. Questo file controlla solo chi sta chiamando.

import { supabaseAdmin as db } from "../../lib/supabase-admin.js";
import { proponi, perIlCliente, accetta } from "../../lib/preventivo.js";
import { STATI } from "../../lib/stati-riparazione.js";
import { liberaCredito } from "../../lib/credito.js";
import { Resend } from "resend";
import { MITTENTE, RISPOSTA_A } from "../../lib/email-mittente.js";
import { testiPer } from "../../lib/testi.js";
import { riempi } from "../../lib/frasi.js";
import { inEuro } from "../../lib/soldi.js";
import { linguaValida, PREDEFINITA, prefissoDi } from "../../lib/lingue.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const CAMPI_CLIENTE =
  "id, stato, appliance, brand, problem, preventivo_centesimi, prezzo_finale_centesimi, " +
  "credito_applicato_centesimi, saldo_cliente_centesimi, diagnosi_stripe_session_id, lingua, email";

/** Il tecnico dietro un token di accesso, o null. */
async function tecnicoDa(token) {
  if (!token) return null;
  const { data } = await db
    .from("tecnici")
    .select("id, nome, cognome, approvato")
    .eq("accesso_token", token)
    .maybeSingle();
  return data?.approvato ? data : null;
}

/** La richiesta dietro il token del cliente, o null. */
async function richiestaDa(clienteToken) {
  if (!clienteToken) return null;
  const { data } = await db
    .from("richieste_intervento")
    .select(CAMPI_CLIENTE)
    .eq("cliente_token", clienteToken)
    .maybeSingle();
  return data || null;
}

// Manda al cliente il link al suo preventivo.
// Sta qui e non dentro lib/preventivo.js perche' quel modulo e' solo conti:
// deve restare provabile senza rete.
async function avvisaCliente(req, richiestaId, tecnico) {
  const { data: r } = await db
    .from("richieste_intervento")
    .select(CAMPI_CLIENTE + ", nome, cliente_token")
    .eq("id", richiestaId)
    .maybeSingle();

  if (!r?.email || !r.cliente_token) return;

  const conti = await perIlCliente(db, r);
  if (!conti) return;

  const lingua = linguaValida(r.lingua) ? r.lingua : PREDEFINITA;
  const tutti = testiPer(lingua);
  const t = tutti.emailPreventivo;
  const soldi = (c) => inEuro(c, lingua);
  const macchina = [r.brand, tutti.diagnosi.elettrodomestici[r.appliance] || r.appliance]
    .filter(Boolean)
    .join(" ");

  const base = req.headers.origin || `https://${req.headers.host}`;
  const link = `${base}${prefissoDi(lingua)}/riparazione?c=${encodeURIComponent(r.cliente_token)}`;
  const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  await resend.emails.send({
    from: MITTENTE,
    replyTo: RISPOSTA_A,
    to: r.email,
    subject: riempi(t.oggetto, { macchina }),
    html: `<!DOCTYPE html>
<html lang="${lingua}"><head><meta charset="UTF-8"><title>${esc(t.intestazione)}</title></head>
<body style="margin:0;padding:0;background:#FAF8F3;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;">
<tr><td style="background:#1A6B50;padding:26px 34px;">
  <p style="margin:0;color:white;font-size:24px;font-weight:800;">Fixi</p>
  <p style="margin:4px 0 0;color:#b4e6d2;font-size:13px;">${esc(t.intestazione)}</p>
</td></tr>
<tr><td style="padding:26px 34px;">
  <p style="margin:0 0 12px;font-size:15px;">${esc(riempi(t.saluto, { nome: r.nome }))}</p>
  <p style="margin:0 0 8px;font-size:14px;color:#444;line-height:1.6;">
    ${esc(riempi(t.testo, { tecnico: `${tecnico.nome} ${tecnico.cognome}`, prezzo: soldi(conti.prezzo) }))}
  </p>
  ${
    conti.credito > 0
      ? `<p style="margin:0 0 20px;font-size:14px;color:#1A6B50;line-height:1.6;font-weight:600;">
           ${esc(riempi(t.credito, { credito: soldi(conti.credito), daPagare: soldi(conti.daPagare) }))}
         </p>`
      : ""
  }
  <a href="${link}" style="display:inline-block;background:#1A6B50;color:white;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:600;">
    ${esc(t.pulsante)}
  </a>
  <p style="margin:18px 0 0;font-size:12px;color:#888;line-height:1.6;">${esc(t.piede)}</p>
</td></tr>
</table></td></tr></table></body></html>`,
  });
}

export default async function handler(req, res) {
  // ── Il cliente guarda il suo preventivo ───────────────────────────────────
  if (req.method === "GET") {
    const r = await richiestaDa(req.query.cliente);
    if (!r) return res.status(404).json({ error: "Richiesta non trovata" });

    const conti = await perIlCliente(db, r);
    return res.status(200).json({
      stato: r.stato,
      appliance: r.appliance,
      brand: r.brand,
      problem: r.problem,
      lingua: r.lingua,
      // null finche' il tecnico non ha proposto un prezzo.
      conti,
    });
  }

  if (req.method !== "POST") return res.status(405).end();

  const { azione } = req.body || {};

  // ── Il tecnico propone o corregge il prezzo ───────────────────────────────
  if (azione === "proponi") {
    const tecnico = await tecnicoDa(req.body.token);
    if (!tecnico) return res.status(403).json({ error: "Accesso non riconosciuto" });

    const esito = await proponi(db, {
      richiestaId: req.body.richiestaId,
      tecnicoId: tecnico.id,
      prezzo: req.body.prezzo,
    });
    if (!esito.ok) return res.status(400).json({ error: esito.motivo });

    // ── Avvisare il cliente ───────────────────────────────────────────────
    // E' l'anello che tiene in piedi tutto il giro: senza questa email il
    // tecnico manda il prezzo e il cliente non lo scopre mai.
    //
    // Se l'invio fallisce NON si annulla il preventivo: il prezzo resta
    // valido e il cliente lo trovera' riaprendo il suo link. Perdere il
    // lavoro perche' e' caduta un'email sarebbe sproporzionato.
    avvisaCliente(req, req.body.richiestaId, tecnico).catch((e) =>
      console.warn("Email preventivo non inviata:", e?.message)
    );

    // Al tecnico si risponde con la SUA economia: quanto ha chiesto, quanto
    // trattiene Fixi, quanto gli resta. Del credito del cliente non gli
    // serve sapere niente.
    return res.status(200).json({
      prezzo: esito.prezzo,
      commissione: esito.commissione,
      netto: esito.netto,
    });
  }

  // ── Il cliente accetta ────────────────────────────────────────────────────
  if (azione === "accetta") {
    const r = await richiestaDa(req.body.clienteToken);
    if (!r) return res.status(403).json({ error: "Accesso non riconosciuto" });

    const esito = await accetta(db, r.id);
    if (!esito.ok) return res.status(400).json({ error: esito.motivo });

    // Si risponde con i numeri congelati: sono quelli che il cliente
    // paghera', e devono coincidere con quelli che ha appena visto.
    return res.status(200).json({
      prezzo: esito.prezzoFinale,
      credito: esito.creditoApplicato,
      daPagare: esito.saldoCliente,
    });
  }

  // ── Il cliente rifiuta ────────────────────────────────────────────────────
  // Non si annulla la richiesta: il cliente conserva il referto che ha pagato
  // e puo' farsi fare un altro preventivo da un altro tecnico. Si libera solo
  // il credito, se era stato prenotato.
  if (azione === "rifiuta") {
    const r = await richiestaDa(req.body.clienteToken);
    if (!r) return res.status(403).json({ error: "Accesso non riconosciuto" });

    const { data } = await db
      .from("richieste_intervento")
      .update({ stato: STATI.ANNULLATA, annullata_at: new Date().toISOString(), annullata_da: "cliente" })
      .eq("id", r.id)
      .in("stato", [STATI.PREVENTIVO, STATI.PREVENTIVO_ACCETTATO])
      .select("id")
      .maybeSingle();

    if (!data) return res.status(400).json({ error: "Il lavoro non e' piu' in questo stato" });

    await liberaCredito(db, r.id);
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: "Azione sconosciuta" });
}
