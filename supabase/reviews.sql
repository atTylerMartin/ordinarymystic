-- Reviews feature — run once in Supabase → SQL Editor.
-- Creates the reviews table, an enum-like status check, and RLS policies so
-- the public can submit pending reviews and read only approved ones.

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  rating     int  not null check (rating between 1 and 5),
  body       text not null check (char_length(body) between 10 and 1000),
  status     text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Fast lookups for the public, approved, newest-first query.
create index if not exists reviews_approved_created_idx
  on public.reviews (created_at desc)
  where status = 'approved';

alter table public.reviews enable row level security;

-- Anyone (publishable key → anon role) may read ONLY approved reviews.
drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
  on public.reviews
  for select
  to anon
  using (status = 'approved');

-- Anyone (publishable key → anon role) may submit, but only as a pending review.
drop policy if exists "Public can submit pending reviews" on public.reviews;
create policy "Public can submit pending reviews"
  on public.reviews
  for insert
  to anon
  with check (status = 'pending');

-- No public update/delete policies → moderation happens via the Supabase
-- dashboard (service role bypasses RLS). To approve a review, set its
-- status to 'approved' in the Table Editor.
