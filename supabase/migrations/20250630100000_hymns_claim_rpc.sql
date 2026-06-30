-- Reclamar canciones con ID local de dispositivo al vincularlas al usuario autenticado

create or replace function public.claim_local_hymns(local_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed integer;
begin
  if auth.uid() is null or local_id is null or local_id = auth.uid()::text then
    return 0;
  end if;

  with updated as (
    update public.hymns
    set creator_id = auth.uid()::text,
        updated_at = now()
    where creator_id = local_id
    returning id
  )
  select count(*)::integer into claimed from updated;

  return coalesce(claimed, 0);
end;
$$;

revoke all on function public.claim_local_hymns(text) from public;
grant execute on function public.claim_local_hymns(text) to authenticated;
