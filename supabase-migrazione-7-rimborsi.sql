-- Migrazione 7 — richieste di rimborso
--
-- Nasce dalla garanzia "se la diagnosi non ti è stata utile, ti rimborsiamo".
-- Serve a vendere fiducia a chi non ci conosce: chi non si fida non compra
-- nemmeno a €5, quindi l'ostacolo da togliere è quello, non il prezzo.
--
-- Le richieste NON rimborsano da sole: si registrano qui e il rimborso lo
-- esegue Loris dal pannello Stripe. Un rimborso automatico è esattamente il
-- meccanismo che si fa spennare, e ai volumi attuali il manuale costa niente.
--
-- Il campo `motivo` è obbligatorio di proposito: filtra le richieste per
-- curiosità e regala il dato più prezioso, cioè PERCHÉ non è servita.

create table if not exists rimborsi (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  email              text not null,
  motivo             text not null,
  stripe_session_id  text,
  sessione_token     text,
  appliance          text,
  brand              text,
  -- richiesto -> in attesa che Loris decida
  -- rimborsato -> soldi restituiti da Stripe
  -- rifiutato  -> fuori dai 14 giorni, oppure secondo rimborso della stessa persona
  stato              text not null default 'richiesto',
  nota_admin         text
);

-- Serve per la regola "un rimborso a persona": la ricerca è per email
-- normalizzata, se no Mario@x.it e mario@x.it sarebbero due persone diverse.
create index if not exists rimborsi_email_idx on rimborsi (lower(email));
create index if not exists rimborsi_stato_idx on rimborsi (stato, created_at desc);

-- Una richiesta per diagnosi: premere due volte il pulsante non deve creare
-- due pratiche da smaltire a mano.
create unique index if not exists rimborsi_sessione_idx
  on rimborsi (sessione_token) where sessione_token is not null;

-- Stesse regole delle altre tabelle: ci arriva solo il server con la service
-- role key. Dal browser la tabella è irraggiungibile, in lettura e scrittura —
-- qui dentro ci sono indirizzi email e motivi di lamentela.
alter table rimborsi enable row level security;
