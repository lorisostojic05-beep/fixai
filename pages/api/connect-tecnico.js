// pages/api/connect-tecnico.js
// POST { token } → il link su cui il tecnico configura i suoi pagamenti.
//
// Fa tre cose in una: crea il conto Stripe se non c'e', genera il link di
// configurazione, e rilegge lo stato salvandolo sul tecnico.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  IL TECNICO NON VEDE MAI LA PAROLA "STRIPE"                               │
// │                                                                           │
// │  Per lui e' "configura i pagamenti". Dietro c'e' Stripe, ma e' un         │
// │  dettaglio nostro: un artigiano che deve riparare lavatrici non deve      │
// │  imparare cos'e' un connected account per essere pagato.                   │
// │                                                                           │
// │  L'unica cosa che gli diciamo e' in che stato e': non configurato,        │
// │  incompleto, attivo.                                                      │
// └───────────────────────────────────────────────────────────────────────────┘

import { supabaseAdmin as db } from "../../lib/supabase-admin.js";
import { assicuraConto, linkConfigurazione, leggiStatoConto, comeStaIlConto } from "../../lib/stripe-connect.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body || {};
  if (!token) return res.status(403).json({ error: "Accesso non riconosciuto" });

  const { data: tecnico } = await db
    .from("tecnici")
    .select("id, nome, cognome, email, approvato, stripe_account_id, stripe_bonifici_attivi")
    .eq("accesso_token", token)
    .maybeSingle();

  // Solo i tecnici approvati: un'iscrizione in attesa non apre un conto
  // Stripe, che poi resterebbe li' vuoto per sempre.
  if (!tecnico?.approvato) return res.status(403).json({ error: "Accesso non riconosciuto" });

  try {
    const accountId = await assicuraConto(tecnico);

    // Si salva subito, prima ancora che compili: se il tecnico abbandona a
    // meta' e torna domani, si riprende il suo conto invece di crearne un
    // altro.
    if (accountId !== tecnico.stripe_account_id) {
      await db.from("tecnici").update({ stripe_account_id: accountId }).eq("id", tecnico.id);
    }

    const base = req.headers.origin || `https://${req.headers.host}`;
    const url = await linkConfigurazione(accountId, base, token);

    // Lo stato si rilegge e si salva: cosi' l'area tecnico e l'admin lo
    // mostrano aggiornato senza chiamare Stripe a ogni caricamento.
    const stato = await leggiStatoConto(accountId);
    await db.from("tecnici").update(stato).eq("id", tecnico.id);

    return res.status(200).json({ url, stato: comeStaIlConto(stato) });
  } catch (e) {
    console.error("Configurazione pagamenti non riuscita:", e.message);
    return res.status(500).json({ error: "Non sono riuscito ad aprire la configurazione" });
  }
}
