-- TAPS MZA · Supabase schema
-- Run once in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.links (
  code      text primary key,
  url       text not null,
  name      text not null default '',
  clicks    integer not null default 0,
  qr_clicks integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The app only touches this table through the server (secret key). RLS is on
-- with no public policies, so the publishable key can neither read nor write.
alter table public.links enable row level security;

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists links_set_updated_at on public.links;
create trigger links_set_updated_at
  before update on public.links
  for each row execute function public.set_updated_at();

-- Atomic counter increment so concurrent taps don't lose counts (read-modify-write
-- in application code would race). SECURITY DEFINER lets it run past RLS.
create or replace function public.increment_link_counter(p_code text, p_qr boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.links
     set clicks    = clicks + case when p_qr then 0 else 1 end,
         qr_clicks = qr_clicks + case when p_qr then 1 else 0 end
   where code = p_code;
end $$;

grant execute on function public.increment_link_counter(text, boolean) to anon, authenticated, service_role;
