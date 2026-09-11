// lib/credito.js
// I 9,90 € della diagnosi, quando diventano un acconto sulla riparazione.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  NON E' UN PORTAFOGLIO                                                    │
// │                                                                           │
// │  Il credito appartiene a UNA diagnosi, non al cliente. Non si accumula,   │
// │  non si preleva, non si passa a un'altra persona e non vale su una        │
// │  riparazione nata da un'altra diagnosi. Per questo vive come tre colonne  │
// │  sulla riga del pagamento e non come una tabella "saldo utenti": un       │
// │  portafoglio vero avrebbe richiesto account, movimenti e riconciliazione  │
// │  per un caso d'uso che non esiste.                                        │
// └───────────────────────────────────────────────────────────────────────────┘
//
// Tre stati, e il passaggio di mezzo e' quello che salva:
//
//   disponibile ──riserva──> riservato ──usa──> usato
//                     ^          |
//                     └──libera──┘
//
// "riservato" esiste perche' fra "il cliente accetta il preventivo" e "il
// cliente paga" passano dei minuti. In quei minuti, senza prenotazione, lo
// stesso credito potrebbe essere scalato da una seconda riparazione aperta
// in un'altra scheda.
//
// La difesa non e' un controllo prima della scrittura — fra il controllo e la
// scrittura ci passa una seconda richiesta. E' la scrittura stessa a essere
// condizionata: si aggiorna SOLO se lo stato e' ancora quello che ci
// aspettavamo, ed e' il database a decidere chi arriva primo. E' lo stesso
// trucco con cui accetta-lavoro.js assegna il lavoro al primo tecnico.

import { PREZZO_DIAGNOSI } from "./soldi.js";

export const CREDITO = {
  DISPONIBILE: "disponibile",
  RISERVATO: "riservato",
  USATO: "usato",
};

/**
 * Quanto credito puo' portarsi dietro questa diagnosi.
 * Torna 0 — e non un errore — se la diagnosi non ha un pagamento tracciato:
 * una riparazione senza credito e' comunque una riparazione valida.
 */
export async function creditoDisponibile(db, stripeSessionId, richiestaId = null) {
  if (!stripeSessionId) return 0;

  const { data, error } = await db
    .from("pagamenti")
    .select("credito_stato, credito_richiesta_id")
    .eq("stripe_session_id", stripeSessionId)
    .maybeSingle();

  if (error || !data) return 0;
  if (data.credito_stato === CREDITO.USATO) return 0;
  // Gia' riservato da un'ALTRA riparazione: per questa non c'e'.
  if (
    data.credito_stato === CREDITO.RISERVATO &&
    richiestaId != null &&
    String(data.credito_richiesta_id) !== String(richiestaId)
  ) {
    return 0;
  }
  return PREZZO_DIAGNOSI;
}

/**
 * Mette il credito da parte per questa riparazione.
 * Torna true se adesso e' suo — anche se lo era gia': chiamarla due volte non
 * e' un errore, e' quello che succede quando un cliente tocca due volte.
 */
export async function riservaCredito(db, stripeSessionId, richiestaId) {
  if (!stripeSessionId || richiestaId == null) return false;

  const { data } = await db
    .from("pagamenti")
    .update({ credito_stato: CREDITO.RISERVATO, credito_richiesta_id: richiestaId })
    .eq("stripe_session_id", stripeSessionId)
    .eq("credito_stato", CREDITO.DISPONIBILE)
    .select("stripe_session_id")
    .maybeSingle();

  if (data) return true;

  // Non ha aggiornato niente: o l'ha preso un altro, o era gia' nostro.
  const { data: attuale } = await db
    .from("pagamenti")
    .select("credito_stato, credito_richiesta_id")
    .eq("stripe_session_id", stripeSessionId)
    .maybeSingle();

  return (
    attuale?.credito_stato === CREDITO.RISERVATO &&
    String(attuale?.credito_richiesta_id) === String(richiestaId)
  );
}

/**
 * Rimette il credito a disposizione: la riparazione e' saltata.
 * Libera solo se era riservato PROPRIO da quella richiesta, se no una
 * cancellazione vecchia potrebbe sfilare il credito a una nuova.
 */
export async function liberaCredito(db, richiestaId) {
  if (richiestaId == null) return false;
  const { data } = await db
    .from("pagamenti")
    .update({ credito_stato: CREDITO.DISPONIBILE, credito_richiesta_id: null })
    .eq("credito_richiesta_id", richiestaId)
    .eq("credito_stato", CREDITO.RISERVATO)
    .select("stripe_session_id")
    .maybeSingle();
  return !!data;
}

/**
 * Il credito e' stato speso: l'intervento e' finito.
 * Da qui non si torna indietro, ed e' voluto — da questo momento i 9,90 €
 * non sono piu' ricavo della diagnosi ma parte del valore della riparazione.
 */
export async function usaCredito(db, richiestaId) {
  if (richiestaId == null) return false;
  const { data } = await db
    .from("pagamenti")
    .update({ credito_stato: CREDITO.USATO, credito_usato_at: new Date().toISOString() })
    .eq("credito_richiesta_id", richiestaId)
    .eq("credito_stato", CREDITO.RISERVATO)
    .select("stripe_session_id")
    .maybeSingle();

  if (data) return true;

  // Gia' usato da una chiamata precedente: va bene, non e' un errore.
  const { data: attuale } = await db
    .from("pagamenti")
    .select("credito_stato")
    .eq("credito_richiesta_id", richiestaId)
    .maybeSingle();
  return attuale?.credito_stato === CREDITO.USATO;
}
