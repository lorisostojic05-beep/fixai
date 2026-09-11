// lib/stati-riparazione.js
// Da quale stato si puo' passare a quale, e da nessun altro.
//
// I nomi restano quelli che il database usa gia' — "nuova", "inviata",
// "accettata" ci sono da luglio e stanno scritti su righe vere. Rinominarli
// avrebbe voluto dire migrare dati esistenti per un guadagno estetico.
//
// L'appuntamento NON e' uno stato ma una data (appuntamento_at): un lavoro
// fissato per giovedi' e' comunque "pagato", e tenere due cose diverse nello
// stesso campo e' il modo piu' rapido per non sapere piu' in che stato sei.

export const STATI = {
  NUOVA: "nuova",                           // nessun tecnico in zona: resta in attesa
  INVIATA: "inviata",                       // mandata ai tecnici, nessuno ha ancora preso
  ACCETTATA: "accettata",                   // un tecnico l'ha presa
  PREVENTIVO: "preventivo",                 // il tecnico ha proposto un prezzo
  PREVENTIVO_ACCETTATO: "preventivo_accettato", // il cliente ha detto si', deve pagare
  PAGATA: "pagata",                         // saldo incassato, soldi fermi su Fixi
  IN_CORSO: "in_corso",                     // il tecnico e' al lavoro
  COMPLETATA: "completata",                 // finito: qui parte il bonifico
  ANNULLATA: "annullata",
  CONTESTATA: "contestata",
};

// Da dove si puo' andare dove. Tutto cio' che non e' scritto qui e' vietato:
// "nuova → completata" non esiste, e senza questa tabella basterebbe una
// chiamata sbagliata per far partire un bonifico su un lavoro mai pagato.
const PASSAGGI = {
  [STATI.NUOVA]: [STATI.INVIATA, STATI.ACCETTATA, STATI.ANNULLATA],
  [STATI.INVIATA]: [STATI.ACCETTATA, STATI.ANNULLATA],
  [STATI.ACCETTATA]: [STATI.PREVENTIVO, STATI.ANNULLATA],
  // Il preventivo si puo' correggere finche' il cliente non ha accettato:
  // percio' PREVENTIVO torna su se stesso.
  [STATI.PREVENTIVO]: [STATI.PREVENTIVO, STATI.PREVENTIVO_ACCETTATO, STATI.ANNULLATA],
  // Da "accettato" si torna a "preventivo" se il pagamento non va a buon fine:
  // il cliente resta con un preventivo valido da ripagare, non in un limbo.
  [STATI.PREVENTIVO_ACCETTATO]: [STATI.PAGATA, STATI.PREVENTIVO, STATI.ANNULLATA],
  [STATI.PAGATA]: [STATI.IN_CORSO, STATI.ANNULLATA, STATI.CONTESTATA],
  [STATI.IN_CORSO]: [STATI.COMPLETATA, STATI.ANNULLATA, STATI.CONTESTATA],
  // Dopo "completata" si puo' solo contestare. Non si torna indietro: il
  // bonifico al tecnico e' gia' partito.
  [STATI.COMPLETATA]: [STATI.CONTESTATA],
  [STATI.ANNULLATA]: [],
  [STATI.CONTESTATA]: [STATI.COMPLETATA, STATI.ANNULLATA],
};

/** Gli stati in cui il cliente ha gia' pagato il saldo. */
export const CON_SOLDI_INCASSATI = [STATI.PAGATA, STATI.IN_CORSO, STATI.COMPLETATA, STATI.CONTESTATA];

export function statoValido(stato) {
  return Object.values(STATI).includes(stato);
}

export function puoiPassare(da, a) {
  if (!statoValido(da) || !statoValido(a)) return false;
  return (PASSAGGI[da] || []).includes(a);
}

/**
 * Come puoiPassare, ma spiega perche' no.
 * Si usa negli endpoint: il messaggio finisce nei log, e "da accettata non si
 * va a completata" fa capire il problema molto prima di un 400 muto.
 */
export function verificaPassaggio(da, a) {
  if (!statoValido(da)) return { ok: false, perche: `Stato di partenza sconosciuto: "${da}"` };
  if (!statoValido(a)) return { ok: false, perche: `Stato di arrivo sconosciuto: "${a}"` };
  if (!puoiPassare(da, a)) {
    const possibili = (PASSAGGI[da] || []).join(", ") || "nessuno";
    return { ok: false, perche: `Da "${da}" non si puo' andare a "${a}". Possibili: ${possibili}` };
  }
  return { ok: true };
}
