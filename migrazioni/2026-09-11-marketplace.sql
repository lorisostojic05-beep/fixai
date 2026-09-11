-- migrazioni/2026-09-11-marketplace.sql
-- Da incollare nell'SQL Editor di Supabase. Si puo' rilanciare senza danni:
-- ogni riga e' "if not exists".
--
-- NON cancella e NON ricrea niente. Aggiunge soltanto colonne alle tabelle che
-- esistono gia', piu' due tabelle nuove.

-- ─── 1. I TECNICI RICEVONO SOLDI ──────────────────────────────────────────
-- Senza un conto Stripe collegato e attivo, un tecnico non puo' essere pagato.
-- Le tre colonne di stato arrivano da Stripe e non si scrivono a mano.
alter table tecnici add column if not exists stripe_account_id text;
alter table tecnici add column if not exists stripe_incassi_attivi boolean not null default false;
alter table tecnici add column if not exists stripe_bonifici_attivi boolean not null default false;
alter table tecnici add column if not exists stripe_requisiti jsonb;
alter table tecnici add column if not exists stripe_aggiornato_at timestamptz;

-- Un conto Stripe appartiene a un tecnico solo.
create unique index if not exists tecnici_stripe_account_unico
  on tecnici (stripe_account_id) where stripe_account_id is not null;

-- ─── 2. LA RICHIESTA DIVENTA ANCHE LA RIPARAZIONE ─────────────────────────
-- Si estende la tabella che c'e' gia' invece di crearne una nuova: qui dentro
-- ci sono gia' cliente, elettrodomestico, referto, tecnico e stato.

-- L'ANCORA DEL CREDITO. Oggi sessioni e richieste si collegano solo per email
-- (sta scritto nei commenti di admin-dati.js), e sull'email non si possono
-- far girare dei soldi: due persone in casa, due indirizzi, e il credito
-- finisce sulla riparazione sbagliata.
alter table richieste_intervento add column if not exists diagnosi_stripe_session_id text;
alter table richieste_intervento add column if not exists sessione_token text;

-- Il preventivo del tecnico
alter table richieste_intervento add column if not exists preventivo_centesimi integer;
alter table richieste_intervento add column if not exists preventivo_at timestamptz;
alter table richieste_intervento add column if not exists preventivo_accettato_at timestamptz;

-- I conti, congelati al momento dell'accettazione. Si salvano tutti e cinque
-- anche se quattro si potrebbero ricalcolare: fra un anno la percentuale
-- potrebbe essere cambiata, e un lavoro vecchio deve restare leggibile con
-- quella che aveva addosso quel giorno.
alter table richieste_intervento add column if not exists prezzo_finale_centesimi integer;
alter table richieste_intervento add column if not exists credito_applicato_centesimi integer;
alter table richieste_intervento add column if not exists saldo_cliente_centesimi integer;
alter table richieste_intervento add column if not exists commissione_frazione numeric(5,4);
alter table richieste_intervento add column if not exists commissione_centesimi integer;
alter table richieste_intervento add column if not exists netto_tecnico_centesimi integer;

-- I riferimenti Stripe, ciascuno nel suo campo: mescolarli renderebbe
-- impossibile ricostruire chi ha pagato cosa.
alter table richieste_intervento add column if not exists saldo_stripe_session_id text;
alter table richieste_intervento add column if not exists saldo_payment_intent_id text;
alter table richieste_intervento add column if not exists saldo_pagato_at timestamptz;
alter table richieste_intervento add column if not exists transfer_id text;
alter table richieste_intervento add column if not exists transfer_at timestamptz;
alter table richieste_intervento add column if not exists rimborso_id text;
alter table richieste_intervento add column if not exists rimborsato_at timestamptz;

-- Tappe del lavoro
alter table richieste_intervento add column if not exists appuntamento_at timestamptz;
alter table richieste_intervento add column if not exists iniziata_at timestamptz;
alter table richieste_intervento add column if not exists annullata_at timestamptz;
alter table richieste_intervento add column if not exists annullata_da text;
alter table richieste_intervento add column if not exists contestata_at timestamptz;

-- ┌─────────────────────────────────────────────────────────────────────────┐
-- │  I DUE INDICI CHE IMPEDISCONO DI PAGARE DUE VOLTE                       │
-- │                                                                         │
-- │  Non sono un'ottimizzazione: sono il freno finale. Anche se il codice   │
-- │  sbagliasse, anche se Stripe rispedisse lo stesso webhook dieci volte,  │
-- │  il database rifiuta il secondo bonifico sullo stesso lavoro.           │
-- └─────────────────────────────────────────────────────────────────────────┘
create unique index if not exists richieste_transfer_unico
  on richieste_intervento (transfer_id) where transfer_id is not null;
create unique index if not exists richieste_saldo_pagamento_unico
  on richieste_intervento (saldo_payment_intent_id) where saldo_payment_intent_id is not null;

-- ─── 3. LO STATO DEL CREDITO STA SUL PAGAMENTO DELLA DIAGNOSI ─────────────
-- Il credito appartiene a QUELLA diagnosi, non al cliente: non e' un
-- portafoglio, non si accumula e non si preleva.
--   disponibile → riservato → usato
-- "riservato" serve perche' fra l'accettazione del preventivo e il pagamento
-- passano dei minuti, e in quei minuti il credito non deve poter finire su
-- una seconda riparazione.
alter table pagamenti add column if not exists credito_stato text not null default 'disponibile';
alter table pagamenti add column if not exists credito_richiesta_id bigint;
alter table pagamenti add column if not exists credito_usato_at timestamptz;

alter table pagamenti drop constraint if exists pagamenti_credito_stato_valido;
alter table pagamenti add constraint pagamenti_credito_stato_valido
  check (credito_stato in ('disponibile', 'riservato', 'usato'));

-- Un credito non puo' essere riservato da due riparazioni insieme.
create unique index if not exists pagamenti_credito_prenotato_unico
  on pagamenti (credito_richiesta_id) where credito_richiesta_id is not null;

-- ─── 4. GLI EVENTI STRIPE GIA' VISTI ──────────────────────────────────────
-- Stripe rispedisce lo stesso evento piu' volte, di proposito. La chiave
-- primaria e' l'id dell'evento: il secondo inserimento fallisce, e quel
-- fallimento e' la difesa. Senza, un webhook ripetuto farebbe un secondo
-- bonifico.
create table if not exists eventi_stripe (
  id text primary key,
  tipo text,
  ricevuto_at timestamptz not null default now(),
  elaborato_at timestamptz,
  esito text,
  errore text
);

-- ─── 5. LE CONTESTAZIONI ──────────────────────────────────────────────────
-- Tabella a parte e non una colonna: una contestazione puo' riguardare anche
-- i 9,90 € di una diagnosi senza riparazione, che non ha nessuna riga in
-- richieste_intervento a cui attaccarsi.
create table if not exists contestazioni (
  id text primary key,
  creata_at timestamptz not null default now(),
  aggiornata_at timestamptz,
  stripe_payment_intent_id text,
  stripe_charge_id text,
  importo_centesimi integer,
  motivo text,
  stato text,
  richiesta_id bigint,
  diagnosi_stripe_session_id text,
  chiusa_at timestamptz
);

create index if not exists contestazioni_richiesta on contestazioni (richiesta_id);
