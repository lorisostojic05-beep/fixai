// lib/pagamento-apple.js
// I nomi dei pagamenti fatti con l'App Store.
//
// Questo file non importa niente, apposta: lo usa anche la pagina della
// diagnosi nel browser, e un import di node:crypto finirebbe nel pacchetto
// scaricato da ogni telefono. La verifica vera sta in lib/verifica-apple.js,
// che gira solo sul server.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' UN PAGAMENTO APPLE STA IN UNA COLONNA CHE SI CHIAMA STRIPE       │
// │                                                                           │
// │  Tutto il sistema riconosce una diagnosi pagata da un solo codice:        │
// │  pagamenti.stripe_session_id. Da li' dipendono la finestra di due ore,    │
// │  il tetto dei messaggi, il credito da 9,90 € sulla riparazione e il       │
// │  legame con richieste_intervento.diagnosi_stripe_session_id.              │
// │                                                                           │
// │  Rinominare la colonna voleva dire una migrazione da far eseguire a mano  │
// │  e una dozzina di punti da toccare. Invece un pagamento Apple usa la      │
// │  stessa colonna con un prefisso che non puo' confondersi con Stripe       │
// │  (i suoi codici cominciano per "cs_"):                                    │
// │                                                                           │
// │     apple:2000000123456789           acquisto vero                        │
// │     apple-sandbox:2000000123456789   acquisto di prova (TestFlight,       │
// │                                      revisione Apple): non e' un incasso  │
// │                                                                           │
// │  Il nome della colonna resta sbagliato. Questo commento e' il prezzo.     │
// └───────────────────────────────────────────────────────────────────────────┘

export const BUNDLE_ID = "casa.fixi.app";

// Va creato identico in App Store Connect, come acquisto "consumabile": ogni
// diagnosi si compra di nuovo, come con Stripe.
export const PRODOTTO_DIAGNOSI = "casa.fixi.app.diagnosi";

export const ePagamentoApple = (id) => /^apple(-sandbox)?:\d+$/.test(String(id || ""));

/** Acquisti fatti in TestFlight o durante la revisione: soldi finti. */
export const ePagamentoDiProva = (id) => /^apple-sandbox:\d+$/.test(String(id || ""));

/** Il codice con cui l'acquisto entra in pagamenti.stripe_session_id. */
export function idPagamentoApple(transazione) {
  const prefisso = transazione.environment === "Sandbox" ? "apple-sandbox" : "apple";
  return `${prefisso}:${transazione.transactionId}`;
}
