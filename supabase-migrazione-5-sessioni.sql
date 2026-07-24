-- Migrazione 5 — La sessione si salva quando arriva il referto
-- Da eseguire nel SQL Editor di Supabase (progetto sokscyydhzpqitejzubs).
--
-- Prima: la riga in "sessioni" nasceva solo se l'utente dava il voto, quindi
-- chi chiudeva senza votare spariva del tutto e non si poteva sapere quante
-- diagnosi fossero state fatte davvero.
-- Adesso: la riga nasce appena il referto è pronto (con feedback_voto vuoto)
-- e il voto, se arriva, aggiorna quella stessa riga.
--
-- Il token serve a collegare il voto alla sessione giusta: l'id è un numero
-- progressivo e quindi indovinabile, il token no.

alter table sessioni add column if not exists token text;

create unique index if not exists sessioni_token_idx on sessioni (token);

-- Nota: le sessioni salvate prima di questa migrazione restano senza token
-- (l'indice unique ammette più righe con valore vuoto). Vanno bene così:
-- hanno già il loro voto.
