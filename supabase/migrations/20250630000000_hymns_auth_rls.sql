-- Políticas RLS con autenticación: lectura pública, escritura solo del creador

drop policy if exists "hymns_select" on public.hymns;
drop policy if exists "hymns_insert" on public.hymns;
drop policy if exists "hymns_update" on public.hymns;
drop policy if exists "hymns_delete" on public.hymns;

create policy "hymns_select" on public.hymns
  for select using (true);

create policy "hymns_insert" on public.hymns
  for insert with check (
    auth.uid() is not null
    and creator_id = auth.uid()::text
  );

create policy "hymns_update" on public.hymns
  for update using (
    auth.uid() is not null
    and creator_id = auth.uid()::text
  );

create policy "hymns_delete" on public.hymns
  for delete using (
    auth.uid() is not null
    and creator_id = auth.uid()::text
  );
