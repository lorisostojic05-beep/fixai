# Fixi — Diagnosi elettrodomestici via AI

Sessione di videodiagnosi con Claude Vision per lavatrici e lavastoviglie.

---

## Struttura del progetto

```
Fixi/
├── pages/
│   ├── index.jsx             ← Landing page
│   ├── diagnosi.jsx          ← Interfaccia utente (setup + sessione + referto)
│   ├── iscriviti-tecnico.jsx ← Form iscrizione tecnici
│   ├── admin.jsx             ← Dashboard admin (statistiche + approvazione tecnici)
│   └── api/
│       ├── diagnosi.js       ← Backend AI: Claude con visione + verifica pagamento
│       ├── checkout.js       ← Crea sessione Stripe Checkout
│       ├── verifica-pagamento.js
│       ├── invia-email.js    ← Referto via email (Resend)
│       ├── feedback.js       ← Salva sessione + feedback su Supabase
│       ├── iscriviti-tecnico.js
│       ├── admin-auth.js     ← Login admin → token firmato
│       ├── admin-dati.js     ← Dati dashboard (richiede token)
│       └── approva-tecnico.js← Approva/rifiuta tecnici (richiede token)
├── lib/
│   ├── supabase-admin.js     ← Client Supabase server-side (service role)
│   ├── admin-token.js        ← Crea/verifica token admin
│   └── generaPDF.js          ← Referto PDF client-side
├── styles/
│   └── diagnosi.module.css   ← Stili
├── supabase-migrazione.sql   ← Tabella pagamenti + RLS (da eseguire su Supabase)
├── .env.example              ← Template variabili d'ambiente
└── package.json
```

---

## Setup sicurezza (obbligatorio)

1. Aggiungi in `.env.local` la `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API).
2. Esegui `supabase-migrazione.sql` nel SQL Editor di Supabase: crea la tabella `pagamenti` (anti-riuso dei pagamenti Stripe) e attiva le RLS su tutte le tabelle.
3. In sviluppo locale puoi saltare la verifica pagamento con `SKIP_PAYMENT_CHECK=true` in `.env.local` (mai in produzione).

---

## Setup in 5 minuti

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura la chiave API

```bash
cp .env.example .env.local
```

Apri `.env.local` e inserisci la tua chiave da https://console.anthropic.com

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Avvia in locale

```bash
npm run dev
```

Apri http://localhost:3000/diagnosi

---

## Come funziona

```
Utente apre /diagnosi
  ↓
Seleziona elettrodomestico + descrive problema
  ↓
Avvia sessione → accesso camera
  ↓
Ogni 4s: screenshot → base64 → /api/diagnosi
  ↓
Backend: costruisce messaggi Claude (testo + immagine)
  ↓
Claude Vision: analizza frame + dialoga
  ↓
Utente risponde via chat
  ↓
AI guida verso diagnosi → genera referto JSON
  ↓
Frontend mostra referto con diagnosi, soluzione, costi
```

---

## Prossimi step

- [x] **Pagamenti Stripe** — €9,90 per sessione, verificati server-side
- [x] **PDF referto** — jsPDF client-side + invio via email (Resend)
- [x] **Database** — Supabase per sessioni, feedback e tecnici
- [x] **Iscrizione tecnici** — form + approvazione da dashboard admin
- [ ] **Contatta un tecnico** — richiesta intervento con referto ai tecnici di zona
- [ ] **Autenticazione utenti** — storico sessioni
- [ ] **Più elettrodomestici** — forno, piano cottura, ecc.
- [ ] **App mobile** — React Native con Expo per accesso camera migliore

---

## Deploy su Vercel

```bash
npm install -g vercel
vercel
```

Aggiungi `ANTHROPIC_API_KEY` nelle variabili d'ambiente del progetto Vercel.

---

## Note tecniche

- Il backend non salva mai i frame video — sono processati in memoria e scartati
- La history viene troncata agli ultimi 20 messaggi per non superare il context window
- I frame automatici ([FRAME_AUTO]) vengono inviati ogni 4s solo se la camera è attiva
- Il referto viene generato come JSON embedded nel testo di Claude e poi parsato
