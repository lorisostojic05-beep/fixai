// test/finto-db.mjs
// Un finto Supabase, quanto basta per provare le regole sui soldi.
//
// Serve perche' la difesa vera e' la SCRITTURA CONDIZIONATA ("aggiorna solo se
// lo stato e' ancora questo"), e quella si puo' provare solo facendola davvero.
// Provarla sul database vero vorrebbe dire scrivere su righe di clienti veri
// per vedere se il codice funziona.
//
// Riproduce solo quello che usiamo: from().select/update/insert/upsert/delete(),
// .eq(), .is(), .in(), .maybeSingle() — piu' la chiave primaria, che rifiuta
// il secondo inserimento con lo stesso id. Quel rifiuto non e' un dettaglio:
// e' il primo dei tre strati che impediscono a un evento Stripe ripetuto di
// diventare due bonifici, e senza riprodurlo non lo si potrebbe provare.

export function fintoDb(tabelle) {
  const dati = JSON.parse(JSON.stringify(tabelle));

  const passa = (riga, filtri) =>
    filtri.every(([tipo, colonna, valore]) => {
      if (tipo === "eq") return String(riga[colonna]) === String(valore);
      if (tipo === "is") return (riga[colonna] ?? null) === valore;
      if (tipo === "in") return valore.map(String).includes(String(riga[colonna]));
      return true;
    });

  return {
    dati,
    from(tabella) {
      dati[tabella] = dati[tabella] || [];
      const filtri = [];
      let modifica = null;
      let cancella = false;
      let errore = null;

      const q = {
        select() { return q; },
        update(valori) { modifica = valori; return q; },
        insert(valori) {
          // La chiave primaria del database vero: lo stesso id non entra due
          // volte, e il codice chiamante riconosce proprio questo codice.
          const gia = valori.id != null && dati[tabella].some((r) => String(r.id) === String(valori.id));
          if (gia) errore = { code: "23505", message: "duplicate key value violates unique constraint" };
          else dati[tabella].push({ ...valori });
          return q;
        },
        upsert(valori) {
          const esistente = dati[tabella].find((r) => String(r.id) === String(valori.id));
          if (esistente) Object.assign(esistente, valori);
          else dati[tabella].push({ ...valori });
          return q;
        },
        delete() { cancella = true; return q; },
        eq(c, v) { filtri.push(["eq", c, v]); return q; },
        is(c, v) { filtri.push(["is", c, v]); return q; },
        in(c, v) { filtri.push(["in", c, v]); return q; },
        async maybeSingle() {
          if (errore) return { data: null, error: errore };
          const righe = dati[tabella].filter((r) => passa(r, filtri));
          if (cancella) {
            dati[tabella] = dati[tabella].filter((r) => !passa(r, filtri));
            return { data: righe[0] || null, error: null };
          }
          if (!modifica) return { data: righe[0] || null, error: null };
          // Come il database vero: se nessuna riga combacia non aggiorna
          // niente e non torna niente. E' quel "niente" che dice al codice
          // che qualcun altro e' arrivato prima.
          if (!righe.length) return { data: null, error: null };
          Object.assign(righe[0], modifica);
          return { data: righe[0], error: null };
        },
        // Le chiamate senza maybeSingle finale (update semplici) si risolvono
        // da sole quando qualcuno le attende.
        then(risolvi, rifiuta) {
          if (errore) return Promise.resolve({ data: null, error: errore }).then(risolvi, rifiuta);
          const righe = dati[tabella].filter((r) => passa(r, filtri));
          if (cancella) dati[tabella] = dati[tabella].filter((r) => !passa(r, filtri));
          else if (modifica) righe.forEach((r) => Object.assign(r, modifica));
          return Promise.resolve({ data: righe, error: null }).then(risolvi, rifiuta);
        },
      };
      return q;
    },
  };
}
