# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Il codice, i commenti, i nomi delle colonne e i messaggi di commit sono in
italiano. Continua così: un file in inglese in mezzo si nota e stona.

## Comandi

```bash
npm run dev            # sviluppo
npm run build          # build di produzione
npm start              # serve la build (vedi nota qui sotto)
npm test               # tutte le prove
node --test test/soldi.test.mjs        # una sola
node scripts/traduci.mjs --prova       # cosa tradurrebbe e quanti token: non chiama l'API
node scripts/traduci.mjs               # solo le frasi cambiate, in tutte le lingue
node scripts/traduci.mjs es            # solo le frasi cambiate, in una lingua
node scripts/traduci.mjs --tutte       # tutto da capo: ~330 mila token, quasi mai serve
node scripts/ricontrolla-sicurezza.mjs # ritraduce all'indietro le frasi su gas e corrente
```

**Per provare a mano, usa `npm run build && npm start`, non `npm run dev`.**
In sviluppo diverse pagine restano ferme su "Caricamento..."; in produzione
funzionano. Ci si è già persi del tempo a cercare un guasto che non c'era.

Le prove girano sul test runner di Node, senza dipendenze. Il progetto non ne
aggiunge: se serve una libreria, prima chiedi.

## Due prodotti in una sola applicazione

**1. La videodiagnosi (€9,90).** Il cliente paga, si apre una sessione con la
camera, Claude Vision guida la diagnosi e produce un referto.

**2. Il mercato delle riparazioni.** Dal referto il cliente chiama un tecnico.
Il tecnico fa un preventivo, il cliente paga il saldo, il tecnico lavora, e a
lavoro finito parte il bonifico.

I due prodotti si toccano in un punto solo, ed è quello delicato: **i €9,90
della diagnosi diventano un credito sulla riparazione.** Su un lavoro da 120 €
il cliente paga 110,10 €, il tecnico prende 108 € e Fixi trattiene 12 € —
cioè il **10% del TOTALE, non del saldo**. Quei €9,90 smettono di essere
ricavo della diagnosi e diventano parte del valore della riparazione: per
questo `lib/metriche.js` tiene due voci separate e c'è una prova che verifica
che non si contino due volte.

## Dove stanno i soldi

Tutto il ragionamento sul denaro vive in `lib/`, senza rete e senza database,
così si può provare davvero:

| File | Cosa tiene |
|---|---|
| `soldi.js` | i conti, puri, senza import |
| `stati-riparazione.js` | i 10 stati e i passaggi ammessi |
| `credito.js` | i €9,90: disponibile → riservato → usato |
| `preventivo.js` | proponi / accetta, e il congelamento dei numeri |
| `bonifico.js` | il bonifico al tecnico, con sei controlli prima |
| `eventi-stripe.js` | cosa comporta ogni evento Stripe |
| `metriche.js` | i numeri dell'admin |

Le rotte in `pages/api/` controllano **solo chi sta chiamando**, poi delegano.
Quando aggiungi logica sui soldi, mettila in `lib/` e provala lì.

### Regole che non si negoziano

- **Gli importi non arrivano mai dal browser.** `paga-saldo` riceve un token e
  nient'altro: legge il prezzo dalla riga. `accetta()` prende due argomenti e
  c'è una prova che lo verifica, così non ci si può infilare un prezzo.
- **I numeri si congelano quando il cliente accetta**, e da lì non si
  ricalcolano: paga quello che ha visto, e un lavoro vecchio resta leggibile
  con la commissione che aveva quel giorno.
- **Il bonifico parte solo da `completata`**, mai dal pagamento.
- **Le difese sono scritture condizionate**, non controlli prima della
  scrittura: `.eq("stato", statoAtteso)` dentro l'update. Fra un controllo e
  una scrittura ci passa una seconda richiesta.

## Stripe

- **Accounts v2** (`/v2/core/accounts`): la v1 è rifiutata. Lo stato dei
  bonifici si legge in
  `configuration.recipient.capabilities.stripe_balance.stripe_transfers`, non
  da `payouts_enabled`.
- **Addebiti separati e bonifici separati**: la piattaforma incassa tutto e
  trasferisce meno di quanto ha incassato. `application_fee_amount` è
  **vietato** con questo schema.
- Il bonifico **non** usa `source_transaction`: su un lavoro da 60 € il netto
  (54 €) supera il saldo incassato (50,10 €), perché i €9,90 erano arrivati
  settimane prima. I due movimenti restano legati da `transfer_group`.
- Versione API fissata a `2026-08-26.dahlia` in `lib/stripe.js`.
- Le chiavi di idempotenza si costruiscono sull'id della riparazione, **mai**
  su `Date.now()`.
- Il webhook ha bisogno del corpo grezzo: `export const config = { api: {
  bodyParser: false } }`. Se lo togli, la firma non torna più.

Contro i doppioni ci sono tre strati: l'id evento come chiave primaria in
`eventi_stripe`, le scritture condizionate, e due indici unici sul database
(`transfer_id`, `saldo_payment_intent_id`).

## Le sette lingue

Le parole stanno in `testi/<lingua>.js` — **solo testo**, niente `<br>`,
niente `className`, niente href. `testi/it.js` è l'originale e l'unico che si
scrive a mano: le altre sei si rigenerano con `scripts/traduci.mjs`. Non
correggerle a mano, il giro dopo si perde.

**Lo script usa la chiave API di Loris, e costa.** Prima di lanciarlo, fai
girare `--prova` e diglielo con la stima dei token. Il 25/09/2026 un
`--tutte` lanciato per cinque frasi ha consumato ~330 mila token, e se n'è
accorto dalla console. Il giro normale ritraduce solo le frasi la cui impronta
in `testi/.impronte.json` non torna: cinque frasi sono una richiesta per
lingua, qualche migliaio di token.

**Ogni `--tutte` riscrive anche le frasi di sicurezza** su gas, acqua e
corrente, con parole nuove. Dopo va sempre lanciato
`ricontrolla-sicurezza.mjs` e vanno lette le coppie: contano le azioni, il loro
ordine e i divieti. Fra il 06/09 e il 25/09 sono state riscritte sei volte
senza che nessuno le ricontrollasse.

- `testiPer(locale)` si usa **solo dentro `getStaticProps`**. Importarlo in un
  componente trascina tutte e sette le lingue nel browser.
- `riempi()` e `grassetto()` stanno in `lib/frasi.js`, che non importa niente:
  quelle servono anche mentre la pagina si disegna.
- I `{segnaposto}` restano identici in tutte le lingue. Il `**grassetto**`
  diventa nodi React, mai HTML.
- Se manca una frase, `lib/testi.js` mostra l'italiano e scrive in console cosa
  lanciare. Il build non si rompe.

**Nei collegamenti usa href col prefisso della lingua, non `<Link>`.** È una
scelta, non una dimenticanza: `<Link>` cambia come si impila la cronologia e
il tasto indietro smette di funzionare come ci si aspetta.

**I nomi degli elettrodomestici sono chiavi, non testo.** `appliance` vale
`"Lavatrice"` anche in tedesco: va sempre passato per
`testi.diagnosi.elettrodomestici[appliance]`. È l'errore che in questo
progetto è già stato fatto tre volte — referto, PDF, email.

Per i paesi: `lib/mercati.js` (codici postali, valuta) e `lib/prezzi.js`
(listino per il prompt, in un blocco separato dal manuale per non spaccare la
cache).

## Chi può fare cosa

Non esiste login utente. Tutto gira su collegamenti con un segreto dentro:

| Segreto | Di chi | Dove |
|---|---|---|
| token HMAC | admin | `lib/admin-token.js` |
| `tecnici.accesso_token` | tecnico | `/area-tecnico` |
| `richieste_intervento.token` | un lavoro | `/accetta-lavoro` |
| `richieste_intervento.cliente_token` | cliente | `/riparazione` |

**Il token del tecnico e quello del cliente devono restare due cose diverse.**
Con uno solo, chi ha ricevuto l'email da tecnico potrebbe accettare il
preventivo al posto del cliente — cioè decidere da solo che il cliente paga.

## Prove

`test/finto-db.mjs` è un finto Supabase che riproduce quello che conta: le
scritture condizionate e la chiave primaria che rifiuta il secondo
inserimento. `test/e2e.test.mjs` percorre il giro intero facendo parlare i
moduli veri fra loro.

**Le prove coprono le regole sui soldi, non cosa fa la pagina quando si preme
il pulsante.** L'11/09/2026 tutte e 79 erano verdi mentre "Paga e conferma"
non confermava, e nessuna riparazione si sarebbe potuta pagare. Se tocchi un
percorso che passa da una pagina, percorrilo nel browser.

Per provare i webhook in locale serve Stripe CLI:

```bash
stripe listen --api-key <sk_test> --forward-to http://localhost:3000/api/stripe-webhook
```

Stampa un `whsec_` da mettere in `.env.local`. Serve anche
`EMAIL_MITTENTE=Fixi <assistenza@fixiai.it>`, altrimenti si ripiega sul
mittente di prova che consegna a un solo indirizzo e le email spariscono
**senza errore visibile**.

## Database

Supabase, progetto `sokscyydhzpqitejzubs`. Le migrazioni stanno in
`migrazioni/` e **le esegue Loris a mano** nel SQL editor: preparagli il file
e digli cosa incollare. Lo schema vero può non coincidere col file `.sql`
(`sessioni.id` è un uuid, non un bigint): verifica prima di dare per buono.

## Cose da non toccare

- **`localeDetection: false`** in `next.config.js`. Acceso, Googlebot — che
  scansiona dagli Stati Uniti dichiarando inglese — verrebbe spedito su `/en`
  e le 81 pagine italiane sparirebbero dall'indice.
- **Il meta `google-site-verification`** in `pages/_app.jsx`: toglierlo revoca
  la verifica Search Console.
- **`SEDE` vuota** in `pages/privacy.jsx`: è l'indirizzo di casa e la pagina è
  indicizzata. È vuota di proposito.
- **`fixai-svq7.vercel.app`**: è `server.url` in `capacitor.config.json`, cioè
  l'indirizzo da cui l'app pubblicata carica il sito. Se muore, Fixi si spegne
  su ogni telefono installato.
- **Le chiavi segrete non si scrivono in chat.** Vanno da Stripe a Vercel e
  basta. `admin-dati` ne espone i primi 7 caratteri, mai il valore.

## Dettagli che fanno perdere tempo

- In un modulo ESM di `lib/` importato dalle prove servono le estensioni
  `.js`: Next.js le indovina, Node no.
- Dentro una **stringa JavaScript** le entità HTML non si decodificano:
  `"l&#39;intervento"` finisce a schermo così com'è. Fra i tag JSX invece sì.
- Dopo aver cambiato `.env.local` serve un rebuild per le `NEXT_PUBLIC_*`.
- Su Windows gli heredoc di bash falliscono con certi contenuti: usa gli
  strumenti Write/Edit.
