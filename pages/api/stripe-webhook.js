// pages/api/stripe-webhook.js
// L'unico posto in cui Fixi crede che un pagamento sia avvenuto.
//
// Questo file fa una cosa sola: stabilire che chi bussa e' davvero Stripe.
// Cosa comporta l'evento sta in lib/eventi-stripe.js, che si puo' provare
// senza rete.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' NON CI SI PUO' FIDARE DEL BROWSER                                │
// │                                                                           │
// │  Oggi la diagnosi funziona cosi': il cliente torna da Stripe, la pagina   │
// │  chiede "e' pagato?" e il server risponde interrogando Stripe. Per 9,90 € │
// │  regge. Per una riparazione da 120 € no, e per due motivi:                │
// │                                                                           │
// │   - se il cliente chiude il telefono un secondo dopo aver pagato, quella  │
// │     domanda non parte mai e il pagamento resta invisibile a Fixi;         │
// │   - una risposta che arriva dal browser e' una risposta che qualcuno      │
// │     puo' scrivere a mano.                                                 │
// │                                                                           │
// │  Il webhook arriva da Stripe direttamente al server, firmato. Se la firma │
// │  non torna, la richiesta si butta senza nemmeno guardarla.                │
// └───────────────────────────────────────────────────────────────────────────┘

import { stripe } from "../../lib/stripe.js";
import { supabaseAdmin as db } from "../../lib/supabase-admin.js";
import { prenota, mollaPrenotazione, segnaFatto, gestisciEvento } from "../../lib/eventi-stripe.js";

// La firma si calcola sui byte esatti che Stripe ha spedito. Se Next.js
// trasforma il corpo in oggetto, quei byte non esistono piu' e la verifica
// fallisce sempre — anche quando l'evento e' autentico.
export const config = { api: { bodyParser: false } };

function corpoGrezzo(req) {
  return new Promise((risolvi, rifiuta) => {
    const pezzi = [];
    req.on("data", (c) => pezzi.push(c));
    req.on("end", () => risolvi(Buffer.concat(pezzi)));
    req.on("error", rifiuta);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const segreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!segreto) {
    console.error("STRIPE_WEBHOOK_SECRET mancante: rifiuto tutto invece di fidarmi.");
    return res.status(500).json({ error: "webhook non configurato" });
  }

  let evento;
  try {
    const grezzo = await corpoGrezzo(req);
    evento = stripe.webhooks.constructEvent(grezzo, req.headers["stripe-signature"], segreto);
  } catch (e) {
    // Firma sbagliata: non e' Stripe, o e' stato manomesso per strada.
    console.warn("Webhook rifiutato:", e.message);
    return res.status(400).json({ error: "firma non valida" });
  }

  let nuovo;
  try {
    nuovo = await prenota(db, evento);
  } catch (e) {
    console.error("Non riesco a registrare l'evento:", e.message);
    // 500 → Stripe riprova. Meglio riprovare che perdere un pagamento.
    return res.status(500).json({ error: "registro non disponibile" });
  }
  if (!nuovo) return res.status(200).json({ ricevuto: true, nota: "gia' elaborato" });

  try {
    const esito = await gestisciEvento(db, evento);
    await segnaFatto(db, evento.id, esito);
    return res.status(200).json({ ricevuto: true, esito });
  } catch (e) {
    console.error(`Evento ${evento.id} (${evento.type}) fallito:`, e.message);
    // Si molla la prenotazione: se no il tentativo successivo di Stripe
    // verrebbe scartato come doppione e l'evento andrebbe perso per sempre.
    await mollaPrenotazione(db, evento.id).catch(() => {});
    return res.status(500).json({ error: "elaborazione fallita" });
  }
}
