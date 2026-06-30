-- Himnario: letras con acordes
create table if not exists public.hymns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  lyrics text not null,
  original_key text not null default 'C',
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hymns_title_idx on public.hymns (title);
create index if not exists hymns_updated_at_idx on public.hymns (updated_at desc);

alter table public.hymns enable row level security;

-- Lectura pública; escritura pública (ajustar con auth en fases futuras)
create policy "hymns_select" on public.hymns for select using (true);
create policy "hymns_insert" on public.hymns for insert with check (true);
create policy "hymns_update" on public.hymns for update using (true);
create policy "hymns_delete" on public.hymns for delete using (true);
