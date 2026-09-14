# Fixi — diagnosi elettrodomestici via AI

Il tuo elettrodomestico si rompe. Invece di chiamare un tecnico a 70 € di sola
uscita, fai una videochiamata da 9,90 € con un'AI che guarda attraverso la
camera del telefono, ti chiede le cose giuste e ti dice cos'è rotto.

Se poi serve un tecnico, Fixi te lo trova — e i 9,90 € già pagati diventano
uno sconto sulla riparazione.

**In linea su [fixiai.it](https://fixiai.it)** e su Google Play come app
Android.

---

## Cosa fa, in concreto

### 1. La videodiagnosi — 9,90 €

```
/diagnosi → scegli l'elettrodomestico e descrivi il problema
          → paghi 9,90 € (Stripe)
          → si apre la camera
          → ogni 4 secondi un fotogramma va a Claude Vision
          → l'AI chiede, tu rispondi, si arriva alla diagnosi
          → referto: guasto, gravità, soluzione, costo previsto
          → il referto te lo porti via in PDF o via email
```

Sette elettrodomestici: lavatrice, lavastoviglie, asciugatrice, frigorifero,
forno, piano cottura, condizionatore.

I fotogrammi non vengono mai salvati: passano in memoria e si scartano.

### 2. Il mercato delle riparazioni

```
dal referto → "trova un tecnico"
            → i tecnici della zona ricevono un'email; il primo che accetta vince
            → il tecnico manda un preventivo (poniamo 120 €)
            → il cliente vede 120,00 − 9,90 di credito = 110,10 da pagare
            → paga, il tecnico lavora, segna "finito"
            → partono 108 € al tecnico; Fixi trattiene 12 €
```

La commissione è il **10% del totale**, non del saldo. E il bonifico parte
solo a lavoro finito: fino a quel momento i soldi restano fermi su Fixi, ed è
l'unica cosa che permette di rimborsare un intervento mai fatto.

### 3. Le guide

70 guide ai sintomi più comuni (`/guida/lavatrice/non-scarica` e compagnia),
generate dai dati in `lib/guide.js`. Sono il canale per farsi trovare su
Google senza pagare pubblicità.

---

## Sette lingue

Italiano, inglese, spagnolo, francese, tedesco, portoghese, rumeno — sito,
diagnosi, email e referto.

Le parole stanno fuori dal codice, in `testi/<lingua>.js`. L'italiano è
l'originale e si scrive a mano; le altre sei si rigenerano:

```bash
node scripts/traduci.mjs          # solo quelle che mancano
node scripts/traduci.mjs de       # una sola
```

Prezzi e codici postali seguono il paese, non solo la lingua
(`lib/mercati.js`, `lib/prezzi.js`).

Sette frasi per lingua parlano di corrente, acqua e gas a qualcuno che ha
l'elettrodomestico davanti e le mani libere. Quelle si ricontrollano
traducendole all'indietro in italiano:

```bash
node scripts/ricontrolla-sicurezza.mjs
```

---

## Partire da zero

```bash
npm install
cp .env.example .env.local     # poi compila i valori
npm run dev
```

Apri http://localhost:3000

Su Supabase vanno eseguite le migrazioni in `migrazioni/` (SQL editor,
incolla e lancia). Creano le tabelle e attivano le RLS.

**Per provare davvero usa `npm run build && npm start`.** In `npm run dev`
diverse pagine restano ferme su "Caricamento...".

Per provare i pagamenti serve la modalità test di Stripe (carta
`4242 4242 4242 4242`) e, per i webhook, Stripe CLI:

```bash
stripe listen --api-key <sk_test> --forward-to http://localhost:3000/api/stripe-webhook
```

Stampa un `whsec_` da mettere in `.env.local`.

---

## Prove

```bash
npm test                          # tutte
node --test test/soldi.test.mjs   # una sola
```

79 prove sul test runner di Node, senza dipendenze aggiunte. Coprono i conti,
gli stati, il credito, il bonifico, le metriche, e un giro completo
dall'inizio alla fine (`test/e2e.test.mjs`).

Attenzione a cosa **non** coprono: le regole sui soldi sì, cosa fa una pagina
quando si preme un pulsante no. Un percorso che passa da una schermata va
percorso nel browser.

---

## Com'è fatto

**Next.js (pages router)** — sito e API nello stesso progetto.
**Claude Opus 5** con visione per la diagnosi.
**Stripe** per i pagamenti e Connect per i bonifici ai tecnici.
**Supabase** per i dati. **Resend** per le email.
**Capacitor** per l'app Android: è un guscio nativo che carica il sito, quindi
una correzione al sito arriva sui telefoni senza ricompilare niente.

```
pages/          le schermate e le API
lib/            i conti, gli stati, le lingue, le guide — provabile senza rete
testi/          le parole, una lingua per file
test/           le prove
migrazioni/     SQL da eseguire a mano su Supabase
components/     i pochi pezzi condivisi
android/        il progetto Capacitor
```

Il ragionamento sui soldi vive tutto in `lib/`, senza rete e senza database:
le rotte in `pages/api/` controllano chi sta chiamando e poi delegano. È
quello che rende provabile un mercato che muove denaro vero.

Chi ci lavora con Claude Code trovi in [CLAUDE.md](CLAUDE.md) le regole che
questo progetto ha imparato a sue spese.

---

## Non c'è il login

E non è una mancanza: non esiste un account utente. Tutto gira su
collegamenti con un segreto dentro — il tecnico ha il suo, il cliente ha il
suo, ogni lavoro ha il suo. Meno password da dimenticare, meno password da
rubare.

---

## Cosa manca

- **Tecnici veri.** Il meccanismo c'è, le persone no: oggi è il vero collo di
  bottiglia.
- **Lo storico delle diagnosi.** Chi chiude la pagina senza salvare il referto
  ha pagato e non gli resta niente. Il dato però esiste già.
- **Un sistema di analisi.** Oggi c'è solo un diario di bordo per il debug.
