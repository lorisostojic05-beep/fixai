// test/finto-db.mjs
// Un finto Supabase, quanto basta per provare le regole sui soldi.
//
// Serve perche' la difesa vera e' la SCRITTURA CONDIZIONATA ("aggiorna solo se
// lo stato e' ancora questo"), e quella si puo' provare solo facendola davvero.
// Provarla sul database vero vorrebbe dire scrivere su righe di clienti veri
// per vedere se il codice funziona.
//
// Riproduce solo quello che usiamo: from().select/update/insert/delete(),
// .eq(), .is(), .in(), .maybeSingle().

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

      const q = {
        select() { return q; },
        update(valori) { modifica = valori; return q; },
        insert(valori) { dati[tabella].push({ ...valori }); return q; },
        delete() { cancella = true; return q; },
        eq(c, v) { filtri.push(["eq", c, v]); return q; },
        is(c, v) { filtri.push(["is", c, v]); return q; },
        in(c, v) { filtri.push(["in", c, v]); return q; },
        async maybeSingle() {
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
