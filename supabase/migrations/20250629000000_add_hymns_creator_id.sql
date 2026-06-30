-- Añade creador a himnos (ID local hasta autenticación)
alter table public.hymns
  add column if not exists creator_id text;

create index if not exists hymns_creator_id_idx on public.hymns (creator_id);
