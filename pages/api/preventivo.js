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

const CAMPI_CLIENTE =
  "id, stato, appliance, brand, problem, preventivo_centesimi, prezzo_finale_centesimi, " +
  "credito_applicato_centesimi, saldo_cliente_centesimi, diagnosi_stripe_session_id, lingua";

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
