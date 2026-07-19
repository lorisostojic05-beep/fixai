-- Migrazione 2 — Funzione "contatta un tecnico"
-- Da eseguire nel SQL Editor di Supabase (progetto sokscyydhzpqitejzubs).

create table if not exists richieste_intervento (
  id bigint generated always as identity primary key,
  token text unique not null,
  -- dati del cliente
  nome text not null,
  telefono text not null,
  email text,
  citta text,
  cap text not null,
  -- dati del guasto
  appliance text,
  brand text,
  problem text,
  report jsonb,
  -- stato del flusso: nuova → inviata → accettata → chiusa
  stato text not null default 'nuova',
  -- uuid perché la tabella tecnici esistente usa id di tipo uuid
  tecnico_id uuid references tecnici(id),
  tecnici_contattati integer not null default 0,
  accettata_at timestamptz,
  created_at timestamptz not null default now()
);

-- Accesso solo tramite service role key (come le altre tabelle)
alter table richieste_intervento enable row level security;
