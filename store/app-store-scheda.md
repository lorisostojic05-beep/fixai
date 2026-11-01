# Scheda App Store — Fixi

Testi pronti da copiare-incollare in App Store Connect, e le risposte ai
questionari. Scritto il 01/11/2026, per la versione 1.0.

Accanto a ogni campo c'è il limite di Apple e la lunghezza del testo.

---

## 1. Pagina della versione — "1.0 Preparazione per l'invio"

### Screenshot iPhone 6,9"

Trascinali in quest'ordine (1290×2796, Apple li accetta per il 6,9"):

1. `store/ios/01-home.png` — la home
2. `store/ios/02-come-funziona.png` — i quattro passi, col pagamento Apple
3. `store/ios/03-referto.png` — cosa c'è nel referto
4. `store/ios/04-pagamento.png` — il modulo compilato, pulsante col prezzo
5. `store/ios/05-guida.png` — una guida ai guasti

Si rifanno con `scripts/screenshot-iphone.mjs` (istruzioni dentro il file).
L'app è solo per iPhone: gli screenshot iPad non servono.

`store/ios/revisione-acquisto.png` non va qui: è lo screenshot che Apple
chiede **dentro l'acquisto in-app**, nel campo "Informazioni per la revisione".

### Testo promozionale (max 170) — 164

```
Lavatrice che non scarica? Forno che non scalda? Inquadralo con la camera: l'AI trova il guasto, ti guida passo passo e ti lascia un referto da mostrare al tecnico.
```

### Descrizione (max 4000) — circa 2.200

Rispetto a quella di Google Play mancano due cose, di proposito:
- **il prezzo**: lo mostra l'App Store accanto all'acquisto in-app, e in ogni
  paese nella sua forma. Scritto qui potrebbe non coincidere;
- **l'elenco delle marche**: sono marchi di altri, e Apple boccia i testi che
  li usano. Nella descrizione dell'App Store non portano ricerche comunque.

```
La lavatrice non scarica, il forno non scalda, il condizionatore soffia aria tiepida. E molti tecnici chiedono il diritto di chiamata — spesso tra i 40 e gli 80 euro — solo per venire a dare un'occhiata.

Fixi ti dice cos'ha il tuo elettrodomestico prima di quella telefonata.

COME FUNZIONA
1. Scegli l'elettrodomestico, indica la marca e descrivi il problema in poche parole
2. Parte la videodiagnosi: punta la camera sull'apparecchio
3. L'assistente ti guida passo passo, legge i codici errore, riconosce i componenti e ti fa fare le verifiche giuste, una alla volta. Puoi scrivere o dettare a voce
4. Alla fine ricevi un referto scritto, che puoi salvare in PDF o farti mandare per email

COSA C'È NEL REFERTO
• La diagnosi: cosa non va e con quanta certezza
• Se puoi risolvere da solo, le istruzioni per farlo
• Il pezzo di ricambio, col codice quando è identificabile
• Una stima di quanto dovrebbe costarti l'intervento di un tecnico

Il referto puoi mostrarlo al tecnico: arrivare sapendo qual è il guasto e quanto dovrebbe costare cambia la conversazione.

ELETTRODOMESTICI SUPPORTATI
Lavatrice, lavastoviglie, asciugatrice, frigorifero, forno, piano cottura e condizionatore, di tutte le marche principali.

QUANTO COSTA
L'app è gratuita. Ogni diagnosi completa si acquista con un singolo acquisto in-app: nessun abbonamento e nessuna registrazione, non devi creare nessun account.

QUANDO FIXI TI DICE DI FERMARTI
Non tutto si ripara da soli, e Fixi te lo dice chiaramente invece di farti perdere tempo.

Sugli apparecchi a gas, sul circuito del gas refrigerante dei condizionatori e su qualunque situazione con rischio elettrico ti ferma e ti indirizza a un tecnico abilitato. Prima di ogni verifica ti ricorda di staccare la corrente e, dove serve, di chiudere acqua o gas.

Preferiamo dirti "questo non toccarlo" piuttosto che farti correre un rischio.

NON RIESCI DA SOLO?
In Italia, dal referto puoi chiedere un intervento ai tecnici della rete Fixi della tua zona. Ricevono già la diagnosi, quindi sanno cosa cercare prima ancora di arrivare.

Fixi non sostituisce un tecnico qualificato: ti fa capire cosa sta succedendo, così decidi tu se risolvere da solo o chi chiamare.
```

### Parole chiave (max 100, separate da virgola, senza spazi) — 96

Non ripetono il nome né il sottotitolo: Apple li indicizza già.

```
lavatrice,lavastoviglie,frigorifero,forno,asciugatrice,condizionatore,guasto,riparazione,tecnico
```

### URL

- **URL assistenza**: `https://fixiai.it/privacy` (in fondo c'è l'email per i
  contatti: Apple vuole un modo per raggiungerti)
- **URL marketing**: `https://fixiai.it`

### Copyright

```
2026 Loris Ostojic
```

### Build

Quando Apple ha finito di elaborarlo: **Fixi 1.0 (1)**.

### Acquisti in-app e abbonamenti

Aggiungi **casa.fixi.app.diagnosi**. Il primo acquisto in-app di un'app si
può mandare in revisione solo insieme a una versione: se non lo aggiungi qui,
l'app viene approvata senza il pagamento e nessuno può comprare la diagnosi.

### Informazioni per la revisione dell'app

- **Accesso richiesto**: NO (togli la spunta). Non ci sono account.
- **Contatto**: nome, telefono ed email li scrivi tu. Li vede solo Apple.
- **Note** (in inglese, i revisori lavorano in inglese):

```
No account or login. The app is free; the AI video diagnosis is a consumable in-app purchase (casa.fixi.app.diagnosi).

How to test:
1. Optional: switch the language to English with the "IT" button at the top of the home page.
2. Tap "Avvia diagnosi" (Start diagnosis).
3. Pick an appliance, type a brand and describe a problem. The pay button stays grey until all three are filled in.
4. Tap the pay button and buy with your sandbox account.
5. Tap "Avvia videodiagnosi" and ALLOW the camera: the AI looks at the appliance through the live camera and guides the user step by step. You can type or dictate by voice. Any object works for a test: the AI says what it sees.
6. At the end the app writes a report, which can be saved as a PDF through the share sheet.

Repairs: from the report, users in Italy can ask a local technician to come and fix the appliance. That is a physical service carried out at the customer's home, paid outside the app (guideline 3.1.3(e)). It is not needed to test the diagnosis.
```

### Rilascio della versione

**Rilascia manualmente questa versione.** Quando Apple approva, la pubblichi
tu con un clic. Serve per esserci al momento giusto: la verifica degli
acquisti con l'ambiente vero di Apple (oggi risponde 401, vedi
`lib/verifica-apple.js`) va provata appena l'app è pubblica, prima che arrivi
il primo cliente vero.

---

## 2. Informazioni sull'app

### Sottotitolo (max 30) — 28

```
Diagnosi elettrodomestici AI
```

### Categoria

- **Principale**: Stile di vita (è dove stanno le app di servizi per la casa)
- **Secondaria**: Utilità

### Diritti sui contenuti

"L'app contiene, mostra o accede a contenuti di terze parti?" → **No**.

### Classificazione per età

Risposte al questionario. Il risultato atteso è **4+**.

| Domanda | Risposta |
|---|---|
| Violenza, contenuti sessuali, linguaggio volgare, temi per adulti o horror | Nessuno |
| Alcol, tabacco, droghe | Nessuno |
| Contenuti medici o sul benessere | No |
| Gioco d'azzardo, simulato o con soldi veri | No |
| Concorsi | No |
| Accesso al web senza restrizioni | No: l'app apre solo il sito di Fixi e la cassa di Stripe |
| Contenuti creati dagli utenti e visibili ad altri | No: la chat con l'AI la vede solo chi la fa |
| Messaggi o chat fra utenti | No |
| Pubblicità | No |
| Controlli parentali, verifica dell'età | No |

Se il questionario chiede di un **assistente AI o un chatbot**: Sì. È la
diagnosi, e risponde solo di elettrodomestici.

---

## 3. Privacy dell'app

**URL dell'informativa**: `https://fixiai.it/privacy`

"Tu o i tuoi partner raccogliete dati da questa app?" → **Sì**.

| Tipo di dati (nome Apple) | Collegato all'identità | Tracciamento | Scopo |
|---|---|---|---|
| Informazioni di contatto → Nome | Sì | No | Funzionalità dell'app |
| Informazioni di contatto → Indirizzo email | Sì | No | Funzionalità dell'app |
| Informazioni di contatto → Numero di telefono | Sì | No | Funzionalità dell'app |
| Informazioni di contatto → Indirizzo fisico (città e CAP) | Sì | No | Funzionalità dell'app |
| Contenuti utente → Foto o video | No | No | Funzionalità dell'app |
| Contenuti utente → Altri contenuti utente (problema, chat, referto) | Sì | No | Funzionalità dell'app, Analisi |
| Acquisti → Cronologia acquisti | Sì | No | Funzionalità dell'app |

**Tracciamento: No** per tutto. Fixi non usa pubblicità né strumenti che
seguono l'utente fra app e siti diversi.

Perché queste risposte, e non altre:
- **Nome, email, telefono, città e CAP** li scrive l'utente quando chiede il
  referto per email o un tecnico. Sono facoltativi, ma Apple vuole comunque
  che si dichiarino.
- **Foto o video**: i fotogrammi non si salvano mai, ma escono dal telefono
  verso l'AI. Dichiararli è la scelta prudente: Apple boccia chi dichiara meno
  di quello che fa, mai chi dichiara di più. Non collegati all'identità,
  perché spariscono.
- **Dati di pagamento: NON si dichiarano.** La carta la vede solo Stripe (o
  Apple), mai Fixi: è il caso in cui Apple dice esplicitamente di non
  dichiararli. Si dichiara la **cronologia acquisti**, perché Fixi tiene
  traccia di cosa è stato pagato.
- **Audio: no.** La dettatura la trasforma in testo il riconoscimento vocale
  di Apple; a Fixi arriva solo il testo, che sta in "Altri contenuti utente".
- **Diagnostica: no.** Il registro dell'app (`lib/registro.js`) resta nel
  telefono e non viene mai inviato.

---

## 4. Prezzi e disponibilità

- **Prezzo dell'app**: Gratis (si paga solo la diagnosi, con l'acquisto in-app)
- **Disponibilità**: i paesi dell'euro, così il €9,90 scritto nelle pagine
  è lo stesso che Apple addebita. Austria, Belgio, Cipro, Croazia, Estonia,
  Finlandia, Francia, Germania, Grecia, Irlanda, Italia, Lettonia, Lituania,
  Lussemburgo, Malta, Paesi Bassi, Portogallo, Slovacchia, Slovenia, Spagna.

Prima di confermare, controlla nel prezzo dell'acquisto in-app ("Vedi tutti i
prezzi") che in questi paesi Apple mostri davvero 9,90 €.

---

## 5. Digital Services Act

Chi vende nell'Unione Europea come impresa deve mostrare nella scheda
**indirizzo, telefono ed email**. Con la P.IVA, Fixi è un "trader": senza
questi dati l'app non si distribuisce in nessun paese UE.

**Da decidere**: quale indirizzo e quale telefono. Compaiono pubblicamente
sull'App Store.
