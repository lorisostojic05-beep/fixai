-- Migrazione 3 — Sicurezza definitiva (progetto sokscyydhzpqitejzubs)
--
-- Rimuove eventuali vecchie policy permissive e attiva le RLS su tutte
-- le tabelle: da qui in poi solo il sito (service role key) può leggere
-- e scrivere. La chiave pubblica (anon) viene bloccata del tutto.
--
-- PREREQUISITO: SUPABASE_SERVICE_ROLE_KEY presente in .env.local (già fatto).

-- 1. Elimina tutte le policy esistenti sulle nostre tabelle
do $$
declare p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('tecnici', 'sessioni', 'pagamenti', 'richieste_intervento')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- 2. Attiva le RLS (senza policy = nessun accesso con la chiave pubblica)
alter table tecnici enable row level security;
alter table sessioni enable row level security;
alter table pagamenti enable row level security;
alter table richieste_intervento enable row level security;
