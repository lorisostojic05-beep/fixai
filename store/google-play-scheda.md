# Scheda Google Play — Fixi

Testi pronti da copiare-incollare nella Play Console.
Aggiornato il 25/07/2026: 7 elettrodomestici, prezzo dichiarato, categoria corretta.

---

## Nome dell'app (max 30 caratteri)
```
Fixi — Diagnosi elettrodomestici
```
[Se il form lo rifiuta perché supera i 30 caratteri, usa `Fixi`. Attenzione: col
nome corto perdi la parola "elettrodomestici" nella ricerca, quindi diventa
ancora più importante averla nella descrizione breve.]

## Descrizione breve (max 80 caratteri) — 70 caratteri
```
Diagnosi elettrodomestici con l'AI: scopri il guasto prima del tecnico
```

Alternativa più discorsiva (73 caratteri), se preferisci partire da una scena
concreta invece che dalla parola chiave:
```
Lavatrice rotta? L'AI trova il guasto e ti dice se puoi ripararla da solo
```

## Descrizione completa (max 4000 caratteri) — circa 2.100
```
La lavatrice non scarica, il forno non scalda, il condizionatore soffia aria tiepida. E molti tecnici chiedono il diritto di chiamata — spesso tra i 40 e gli 80 euro — solo per venire a dare un'occhiata.

Fixi ti dice cos'ha il tuo elettrodomestico prima di quella telefonata.

COME FUNZIONA
1. Scegli l'elettrodomestico, indica la marca e descrivi il problema in poche parole
2. Parte la videodiagnosi: punta la camera sull'apparecchio
3. L'assistente ti guida passo passo, legge i codici errore, riconosce i componenti e ti fa fare le verifiche giuste, una alla volta
4. Alla fine ricevi un referto scritto, che puoi scaricare in PDF o farti mandare per email

COSA C'È NEL REFERTO
• La diagnosi: cosa non va e con quanta certezza
• Se puoi risolvere da solo, le istruzioni per farlo
• Il pezzo di ricambio, col codice quando è identificabile
• Una stima di quanto dovrebbe costarti l'intervento di un tecnico

Il referto puoi mostrarlo al tecnico: arrivare sapendo qual è il guasto e quanto dovrebbe costare cambia la conversazione.

ELETTRODOMESTICI SUPPORTATI
Lavatrice, lavastoviglie, asciugatrice, frigorifero, forno, piano cottura e condizionatore.

Tutte le marche principali: Bosch, Samsung, Whirlpool, Indesit, Miele, Siemens, Electrolux, Hotpoint, AEG, LG, Candy, Beko, Zanussi, Ariston, Daikin e altre.

QUANTO COSTA
9,90 € per una diagnosi completa. Pagamento singolo, nessun abbonamento e nessuna registrazione: non devi creare nessun account.

QUANDO FIXI TI DICE DI FERMARTI
Non tutto si ripara da soli, e Fixi te lo dice chiaramente invece di farti perdere tempo.

Sugli apparecchi a gas, sul circuito del gas refrigerante dei condizionatori e su qualunque situazione con rischio elettrico ti ferma e ti indirizza a un tecnico abilitato. Prima di ogni verifica ti ricorda di staccare la corrente e, dove serve, di chiudere acqua o gas.

Preferiamo dirti "questo non toccarlo" piuttosto che farti correre un rischio.

NON RIESCI DA SOLO?
Dal referto invii la richiesta ai tecnici della tua zona con un tocco. Ricevono già la diagnosi, quindi sanno cosa cercare prima ancora di arrivare. Il primo disponibile ti contatta direttamente.

Fixi non sostituisce un tecnico qualificato: ti fa capire cosa sta succedendo, così decidi tu se risolvere da solo o chi chiamare.
```

---

## Altre informazioni che Google ti chiede

**Categoria:** Casa e arredamento (House & Home)
[Non "Strumenti": è la categoria più affollata del Play Store e ci si diventa invisibili.]

**Tag:** massimo 5, scegliendo tra quelli proposti. Cercare: riparazioni,
manutenzione, fai-da-te, servizi per la casa. Meglio 3 azzeccati che 5 vaghi.

**Email di contatto:** lorisostojic05@gmail.com

**URL Privacy Policy:** https://fixai-svq7.vercel.app/privacy

**URL cancellazione dati:** https://fixai-svq7.vercel.app/cancellazione-dati

[Quando avrai il dominio, aggiorna entrambi con https://fixi.casa/...]

**Pubblico di destinazione:** 18 o più, con la limitazione ai minorenni attiva.

---

## Modulo "Sicurezza dei dati" — come è stato compilato (25/07/2026)

| Dato | Raccolto | Condiviso | Temporaneo | Obbligatorio | Scopo |
|---|---|---|---|---|---|
| Nome | Sì | Sì (al tecnico) | No | Facoltativo | Funzionalità |
| Email | Sì | Sì (al tecnico) | No | Facoltativo | Funzionalità |
| Telefono | Sì | Sì (al tecnico) | No | Facoltativo | Funzionalità |
| Indirizzo (città+CAP) | Sì | Sì (ai tecnici di zona) | No | Facoltativo | Funzionalità |
| Contenuti generati | Sì | Sì (ai tecnici) | No | Obbligatorio | Funzionalità + Analisi |
| Foto | Sì | No | **Sì** | Facoltativo | Funzionalità |
| Dati di pagamento | Sì | No | No | Obbligatorio | Funzionalità |
| Interazioni con l'app | Sì | No | No | Obbligatorio | Analisi |

Note che tengono in piedi queste risposte:
- Le foto sono "temporanee" perché i fotogrammi non vengono mai salvati: passano
  all'AI e vengono scartati. Per questo non compaiono nella scheda dello Store.
- Anthropic, Stripe, Supabase e Resend NON contano come condivisione: sono
  fornitori che elaborano per conto nostro. Il tecnico sì, perché è titolare
  autonomo dei dati che riceve.
- Nessun dato audio: l'audio della dettatura lo elabora il motore vocale di
  Android, a Fixi arriva solo il testo.

---

## Accesso all'app (per i revisori Google) — max 500 caratteri

Nome istruzione: `Video diagnosis (one-time payment)`. Nessun username/password.

```
No login or account. Only the AI diagnosis is paid (€9,90); Stripe is in TEST mode, no real charge.

1. Tap "Avvia diagnosi"
2. Pick an appliance, then fill "Marca" (brand) + "Descrivi il problema". Button stays grey until all 3 are set.
3. Tap "Paga €9,90 e avvia diagnosi"
4. Test card 4242 4242 4242 4242, any future date, any CVC
5. Tap "Avvia videodiagnosi"
6. ALLOW the camera - the AI works via live video

UI in Italian; AI replies in English too.
```

⚠️ **Da riscrivere il giorno del passaggio alle chiavi Stripe LIVE**: la carta di
test viene rifiutata in produzione e il revisore boccia l'app perché non riesce a
provarla. Servirà un codice riservato ai revisori che salta il pagamento.

---

## Materiali grafici
- Icona app 512×512 — generata (`assets/`)
- Immagine in evidenza 1024×500 — `store/feature-graphic.png`
- Almeno 2 screenshot del telefono — consigliati: la landing, la schermata di
  diagnosi con la camera attiva, il referto finale
