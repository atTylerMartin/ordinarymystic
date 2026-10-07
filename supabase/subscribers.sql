-- Newsletter subscribers: run once in Supabase -> SQL Editor.
-- Creates public.subscribers, a case-insensitive unique index on email, RLS so
-- the public can only INSERT (never read, update or delete), and a rate-limit
-- trigger. The browser inserts with the publishable (anon) key; see
-- src/lib/newsletter.ts. The table itself is the list of record; the Resend
-- audience is a copy kept in step by the subscribe-welcome Edge Function, which
-- a Database Webhook on INSERT calls (see
-- supabase/functions/subscribe-welcome/index.ts for the webhook setup).
--
-- A repeat signup is a unique violation (code 23505). The form shows it as
-- success, no second row is written, so the webhook does not fire and no second
-- email goes out.
--
-- Read, export or unsubscribe people from the dashboard (the service role
-- bypasses RLS): Table Editor -> subscribers.

create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null
               check (char_length(email) between 3 and 254 and email like '%_@_%._%'),
  first_name text
               check (first_name is null or char_length(first_name) between 1 and 80),
  brand      text not null default 'om',
  source     text check (source is null or char_length(source) <= 200),
  campaign   text check (campaign is null or char_length(campaign) <= 100),
  landing    text check (landing is null or char_length(landing) <= 200),
  created_at timestamptz not null default now()
);

-- One row per address, whatever the capitalization.
create unique index if not exists subscribers_email_lower_idx
  on public.subscribers (lower(email));

-- Supports the rate-limit count below.
create index if not exists subscribers_created_idx
  on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

-- Anyone, logged in or not, may sign up, and only as an Ordinary Mystic
-- subscriber. There is deliberately NO select, update or delete policy:
-- nobody can read the list through the API, and the form needs no read-back
-- (it inserts without asking for the row).
drop policy if exists "Public can subscribe" on public.subscribers;
create policy "Public can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (brand = 'om');

grant insert on public.subscribers to anon, authenticated;

-- Rate limit with no external state: refuse the insert when more than 30 rows
-- landed in the last ten minutes. SECURITY DEFINER because the caller has no
-- select access to count with.
create or replace function public.subscribers_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    select count(*) from public.subscribers
    where created_at > now() - interval '10 minutes'
  ) > 30 then
    raise exception 'Too many signups right now. Try again later.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists subscribers_rate_limit_trg on public.subscribers;
create trigger subscribers_rate_limit_trg
  before insert on public.subscribers
  for each row execute function public.subscribers_rate_limit();
