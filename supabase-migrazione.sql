-- Migrazione sicurezza Fixi — da eseguire nel SQL Editor di Supabase.
--
-- PRIMA di eseguirla: aggiungi SUPABASE_SERVICE_ROLE_KEY in .env.local
-- (Supabase → Project Settings → API → service_role key) e riavvia il server,
-- altrimenti le API non riusciranno più a leggere/scrivere le tabelle.

-- 1. Registro pagamenti: impedisce di riusare lo stesso pagamento Stripe
--    per più sessioni di diagnosi.
create table if not exists pagamenti (
  stripe_session_id text primary key,
  attivata_at timestamptz not null default now(),
  richieste integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Blocca l'accesso diretto con la chiave anon (pubblica) a tutte le tabelle.
--    RLS attive senza policy = nessun accesso anonimo; le API del sito
--    continuano a funzionare perché usano la service role key.
alter table pagamenti enable row level security;
alter table tecnici enable row level security;
alter table sessioni enable row level security;
