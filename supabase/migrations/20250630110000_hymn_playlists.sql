-- Listas de reproducción de himnos con tonalidad transportada guardada

create table public.hymn_playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  creator_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hymn_playlist_items (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.hymn_playlists(id) on delete cascade,
  hymn_id uuid not null references public.hymns(id) on delete cascade,
  position integer not null,
  transpose_steps integer not null default 0,
  created_at timestamptz not null default now(),
  unique (playlist_id, hymn_id)
);

create index hymn_playlists_updated_at_idx on public.hymn_playlists (updated_at desc);
create index hymn_playlists_creator_id_idx on public.hymn_playlists (creator_id);
create index hymn_playlist_items_playlist_id_idx on public.hymn_playlist_items (playlist_id);
create index hymn_playlist_items_position_idx on public.hymn_playlist_items (playlist_id, position);

alter table public.hymn_playlists enable row level security;
alter table public.hymn_playlist_items enable row level security;

-- Lectura pública: cualquier usuario puede ver las listas
create policy "hymn_playlists_select" on public.hymn_playlists
  for select using (true);

create policy "hymn_playlists_insert" on public.hymn_playlists
  for insert with check (
    auth.uid() is not null
    and creator_id = auth.uid()::text
  );

create policy "hymn_playlists_update" on public.hymn_playlists
  for update using (
    auth.uid() is not null
    and creator_id = auth.uid()::text
  );

create policy "hymn_playlists_delete" on public.hymn_playlists
  for delete using (
    auth.uid() is not null
    and creator_id = auth.uid()::text
  );

create policy "hymn_playlist_items_select" on public.hymn_playlist_items
  for select using (true);

create policy "hymn_playlist_items_insert" on public.hymn_playlist_items
  for insert with check (
    exists (
      select 1 from public.hymn_playlists p
      where p.id = playlist_id
        and p.creator_id = auth.uid()::text
    )
  );

create policy "hymn_playlist_items_update" on public.hymn_playlist_items
  for update using (
    exists (
      select 1 from public.hymn_playlists p
      where p.id = playlist_id
        and p.creator_id = auth.uid()::text
    )
  );

create policy "hymn_playlist_items_delete" on public.hymn_playlist_items
  for delete using (
    exists (
      select 1 from public.hymn_playlists p
      where p.id = playlist_id
        and p.creator_id = auth.uid()::text
    )
  );
