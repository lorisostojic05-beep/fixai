// lib/stripe.js
// Un solo client Stripe per tutto il progetto.
//
// Prima veniva creato con "new Stripe(...)" dentro checkout.js e dentro
// verifica-pagamento.js. Con due endpoint andava bene; adesso che ce ne sono
// sei e che uno di questi sposta soldi verso i conti dei tecnici, avere la
// configurazione in un posto solo smette di essere ordine e diventa sicurezza:
// la versione dell'API la si fissa qui, e vale ovunque.

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Meglio un errore chiaro all'avvio che un "cannot read property of
  // undefined" dentro un pagamento.
  console.warn("STRIPE_SECRET_KEY mancante: i pagamenti non funzioneranno.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Fissata di proposito. Senza, Stripe usa la versione del tuo account, che
  // cambia quando aggiorni dal pannello — e un campo rinominato in un webhook
  // si scopre in produzione, di sabato.
  apiVersion: "2024-06-20",
  appInfo: { name: "Fixi", url: "https://fixiai.it" },
});

/**
 * Una chiave di idempotenza costruita sui NOSTRI dati, non a caso.
 *
 * Serve a questo: se la stessa operazione parte due volte — doppio click,
 * webhook ripetuto, richiesta andata in timeout e rifatta — Stripe riconosce
 * la chiave e restituisce il PRIMO risultato invece di rifare l'operazione.
 *
 * Va costruita da qualcosa di stabile (l'id del lavoro), mai da Date.now():
 * una chiave diversa a ogni tentativo non protegge da niente.
 */
export function chiaveIdempotenza(...pezzi) {
  return ["fixi", ...pezzi.map((p) => String(p))].join(":");
}
