-- Migrazione 6 — quanto costa in AI ogni diagnosi
--
-- Fino a ora il consumo di token finiva solo nei log di Vercel: una riga
-- sciolta per ogni messaggio, non collegata a nessuna diagnosi e cancellata
-- dopo poco. Così si vedeva il totale a fine mese, mai il costo del singolo
-- caso — e quindi nemmeno i casi peggiori, che sono quelli che dicono se
-- €9,90 reggono.
--
-- Il posto giusto è `pagamenti`: c'è già una riga per ogni diagnosi pagata,
-- e conta già i messaggi.

alter table pagamenti add column if not exists token_input       bigint not null default 0;
alter table pagamenti add column if not exists token_cache_write bigint not null default 0;
alter table pagamenti add column if not exists token_cache_read  bigint not null default 0;
alter table pagamenti add column if not exists token_output      bigint not null default 0;

-- Somma atomica. Serve perché leggere-modificare-riscrivere da codice
-- perderebbe dei conteggi se due risposte finissero quasi insieme: qui
-- l'incremento lo fa il database in un colpo solo.
create or replace function somma_consumo(
  p_stripe_session_id text,
  p_input             bigint,
  p_cache_write       bigint,
  p_cache_read        bigint,
  p_output            bigint
) returns void
language sql
as $$
  update pagamenti
     set token_input       = token_input       + p_input,
         token_cache_write = token_cache_write + p_cache_write,
         token_cache_read  = token_cache_read  + p_cache_read,
         token_output      = token_output      + p_output
   where stripe_session_id = p_stripe_session_id;
$$;

-- La funzione la chiama solo il server con la service role key, come le
-- altre scritture: dal browser resta irraggiungibile.
revoke all on function somma_consumo(text, bigint, bigint, bigint, bigint)
  from public, anon, authenticated;
