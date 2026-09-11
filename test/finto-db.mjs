// test/finto-db.mjs
// Un finto Supabase, quanto basta per provare le regole del credito.
//
// Serve perche' la difesa vera del credito e' la SCRITTURA CONDIZIONATA
// ("aggiorna solo se lo stato e' ancora questo"), e quella si puo' provare
// solo facendola davvero. Provarla sul database vero vorrebbe dire scrivere
// su righe di clienti veri per vedere se il codice funziona.
//
// Riproduce solo la catena che usiamo: from().select/update().eq()...maybeSingle()

export function fintoDb(tabelle) {
  const dati = JSON.parse(JSON.stringify(tabelle));

  const combacia = (riga, filtri) => filtri.every(([c, v]) => String(riga[c]) === String(v));

  return {
    dati,
    from(tabella) {
      const filtri = [];
      let modifica = null;

      const query = {
        select() { return query; },
        update(valori) { modifica = valori; return query; },
        eq(colonna, valore) { filtri.push([colonna, valore]); return query; },
        async maybeSingle() {
          const righe = (dati[tabella] || []).filter((r) => combacia(r, filtri));
          if (!modifica) return { data: righe[0] || null, error: null };
          // Come il database vero: se nessuna riga combacia, non aggiorna
          // niente e non torna niente. E' quel "niente" che dice al codice
          // che qualcun altro e' arrivato prima.
          if (!righe.length) return { data: null, error: null };
          Object.assign(righe[0], modifica);
          return { data: righe[0], error: null };
        },
      };
      return query;
    },
  };
}
