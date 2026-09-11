-- migrazioni/2026-09-11-token-cliente.sql
-- Seconda migrazione, corta. Da incollare nell'SQL Editor di Supabase.
-- Come la prima: aggiunge, non toglie, e si puo' rilanciare senza danni.
--
-- ─── PERCHE' SERVE ──────────────────────────────────────────────────────────
-- Oggi richieste_intervento.token e' il segreto con cui un TECNICO apre il
-- lavoro e lo accetta. Viene spedito a tutti i tecnici della zona.
--
-- Col preventivo, anche il CLIENTE deve poter aprire la sua richiesta: vedere
-- il prezzo, accettarlo, pagare. Riusare lo stesso token vorrebbe dire dare
-- alle due parti la stessa chiave — e chi ha ricevuto l'email da tecnico
-- potrebbe agire dal lato cliente, e viceversa.
--
-- Un segreto, un destinatario.

alter table richieste_intervento add column if not exists cliente_token text;

create unique index if not exists richieste_cliente_token_unico
  on richieste_intervento (cliente_token) where cliente_token is not null;
