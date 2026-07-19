-- Migrazione 4 — Area tecnico e recensioni (progetto sokscyydhzpqitejzubs)
--
-- Aggiunge:
--  - il token di accesso personale del tecnico (link alla sua area)
--  - i campi del ciclo di vita del lavoro (completamento) e della recensione
-- Non tocca dati esistenti. Le RLS restano attive come da migrazione 3.

alter table tecnici
  add column if not exists accesso_token text unique;

alter table richieste_intervento
  add column if not exists completata_at timestamptz,
  add column if not exists recensione_token text unique,
  add column if not exists recensione_voto integer,
  add column if not exists recensione_commento text,
  add column if not exists recensione_at timestamptz;
