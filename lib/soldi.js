// lib/soldi.js
// Tutti i conti del marketplace, in un posto solo.
//
// Nessun import: e' matematica pura. Si puo' provare da riga di comando senza
// database, senza Stripe e senza browser — ed e' il motivo per cui sta qui
// invece che sparsa dentro gli endpoint.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  TUTTO IN CENTESIMI, SEMPRE                                               │
// │                                                                           │
// │  9,90 € si scrive 990. Mai 9.90.                                          │
// │  In virgola mobile 0.1 + 0.2 non fa 0.3, e su dei soldi che passano da    │
// │  un conto all'altro un centesimo perso e' un conto che non torna.         │
// └───────────────────────────────────────────────────────────────────────────┘

/** Quanto costa la videodiagnosi. E' anche il tetto massimo del credito. */
export const PREZZO_DIAGNOSI = 990;

/**
 * La fetta che trattiene Fixi sul valore totale dell'intervento.
 *
 * Sta scritta QUI e in nessun altro posto: se un giorno diventa il 12%, si
 * cambia questa riga e cambia ovunque — preventivo del tecnico, schermata del
 * cliente, riepilogo in admin, bonifico. Ripeterla altrove significherebbe
 * poterla cambiare in quattro punti su cinque.
 */
export const COMMISSIONE = 0.1;

const intero = (v) => Number.isInteger(v) && v >= 0;

/**
 * I quattro numeri di una riparazione, calcolati dal prezzo totale.
 *
 * ┌─ LA TRAPPOLA ─────────────────────────────────────────────────────────────┐
 * │ La commissione si calcola sul PREZZO TOTALE, non sul saldo che il cliente │
 * │ paga adesso.                                                             │
 * │                                                                          │
 * │ Intervento da 120 €, credito 9,90 €, saldo 110,10 €:                     │
 * │   commissione giusta     = 10% di 120,00 = 12,00 €  → tecnico 108,00 €   │
 * │   commissione sbagliata  = 10% di 110,10 = 11,01 €  → tecnico  99,09 €   │
 * │                                                                          │
 * │ Sbagliando, il tecnico ci rimetterebbe quasi 9 € per colpa di uno sconto │
 * │ che non ha fatto lui. I 9,90 del cliente fanno parte del valore          │
 * │ dell'intervento: li ha gia' incassati Fixi, ma sono soldi di quel lavoro.│
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Il credito NON tocca ne' la commissione ne' il netto del tecnico: serve solo
 * ad abbassare quanto resta da pagare al cliente.
 *
 * @param prezzoFinale  centesimi, il totale approvato dal cliente
 * @param credito       centesimi gia' pagati per la diagnosi (0 se non spendibile)
 * @param commissione   frazione, default COMMISSIONE
 */
export function contiRiparazione(prezzoFinale, { credito = PREZZO_DIAGNOSI, commissione = COMMISSIONE } = {}) {
  if (!intero(prezzoFinale) || prezzoFinale <= 0) {
    throw new Error(`Prezzo intervento non valido: ${prezzoFinale} (servono centesimi interi > 0)`);
  }
  if (!intero(credito)) {
    throw new Error(`Credito non valido: ${credito} (servono centesimi interi >= 0)`);
  }
  if (typeof commissione !== "number" || commissione < 0 || commissione >= 1) {
    throw new Error(`Commissione non valida: ${commissione} (serve una frazione fra 0 e 1)`);
  }

  // Il credito non puo' superare il prezzo: su un intervento da 5 € non si
  // scalano 9,90 € e si danno 4,90 € di resto.
  const creditoApplicato = Math.min(credito, PREZZO_DIAGNOSI, prezzoFinale);
  const saldoCliente = prezzoFinale - creditoApplicato;

  const commissioneFixi = Math.round(prezzoFinale * commissione);
  const nettoTecnico = prezzoFinale - commissioneFixi;

  return {
    prezzoFinale,
    creditoApplicato,
    saldoCliente,
    commissioneFixi,
    nettoTecnico,
    // Si salva insieme al resto: se domani la percentuale cambia, i lavori
    // vecchi devono restare leggibili con quella che avevano al momento.
    commissione,
  };
}

/** "12,00 €" da 1200. Per le schermate e le email, mai per i conti. */
export function inEuro(centesimi, lingua = "it") {
  return new Intl.NumberFormat(lingua, { style: "currency", currency: "EUR" }).format(
    (Number(centesimi) || 0) / 100
  );
}

/** Da "120", "120,50", "120.50" ai centesimi. null se non e' un prezzo valido. */
export function inCentesimi(testo) {
  const pulito = String(testo ?? "").trim().replace(/\s|€/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(pulito)) return null;
  return Math.round(parseFloat(pulito) * 100);
}
