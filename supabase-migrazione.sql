-- Migrazione Fixi — da eseguire nel SQL Editor di Supabase.
-- Progetto giusto: l'URL della dashboard deve contenere "suugytykidjtjtnxsckw".
--
-- PRIMA di eseguirla: aggiungi SUPABASE_SERVICE_ROLE_KEY in .env.local
-- (Supabase → Project Settings → API → service_role key) e riavvia il server,
-- altrimenti le API non riusciranno più a leggere/scrivere le tabelle.

-- 1. Tabella tecnici: iscrizioni dal form /iscriviti-tecnico,
--    approvate dalla dashboard admin.
create table if not exists tecnici (
  id bigint generated always as identity primary key,
  nome text not null,
  cognome text not null,
  email text not null,
  telefono text not null,
  citta text not null,
  cap text not null,
  specializzazioni text[],
  anni_esperienza integer,
  descrizione text,
  approvato boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Tabella sessioni: diagnosi completate con feedback.
create table if not exists sessioni (
  id bigint generated always as identity primary key,
  appliance text,
  brand text,
  problem text,
  feedback_voto integer,
  feedback_risolto boolean,
  report jsonb,
  messages jsonb,
  email_utente text,
  durata_secondi integer,
  created_at timestamptz not null default now()
);

-- 3. Registro pagamenti: impedisce di riusare lo stesso pagamento Stripe
--    per più sessioni di diagnosi.
create table if not exists pagamenti (
  stripe_session_id text primary key,
  attivata_at timestamptz not null default now(),
  richieste integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Blocca l'accesso diretto con la chiave anon (pubblica) a tutte le tabelle.
--    RLS attive senza policy = nessun accesso anonimo; le API del sito
--    continuano a funzionare perché usano la service role key.
alter table pagamenti enable row level security;
alter table tecnici enable row level security;
alter table sessioni enable row level security;
