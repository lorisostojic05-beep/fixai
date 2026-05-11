# FixAI — Diagnosi elettrodomestici via AI

Sessione di videodiagnosi con Claude Vision per lavatrici e lavastoviglie.

---

## Struttura del progetto

```
fixai/
├── pages/
│   ├── diagnosi.jsx          ← Interfaccia utente (setup + sessione + referto)
│   └── api/
│       └── diagnosi.js       ← Backend: chiama Claude con visione + history
├── styles/
│   └── diagnosi.module.css   ← Stili
├── .env.example              ← Template variabili d'ambiente
└── package.json
```

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

## Prossimi step (Fase 2)

- [ ] **Pagamenti Stripe** — €9,90 per sessione prima di avviare
- [ ] **PDF referto** — generazione con Puppeteer, invio via email
- [ ] **Autenticazione** — NextAuth per storico sessioni utente
- [ ] **Database** — Supabase per salvare sessioni e referti
- [ ] **Più elettrodomestici** — frigorifero, forno, asciugatrice
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
