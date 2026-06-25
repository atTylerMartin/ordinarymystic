-- Admin moderation policies — run once in Supabase → SQL Editor.
--
-- Lets the signed-in admin (matching the email below) read ALL reviews and
-- change their status, while the public still only sees approved ones.
--
-- Before running: create the admin user in Supabase → Authentication → Users →
-- "Add user" with email = the address below and a password (mark it confirmed).

-- The admin can read every review (pending, approved, rejected).
drop policy if exists "Admin can read all reviews" on public.reviews;
create policy "Admin can read all reviews"
  on public.reviews
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'ordinarymysticreadings@gmail.com');

-- The admin can change a review's status (approve / reject).
drop policy if exists "Admin can update reviews" on public.reviews;
create policy "Admin can update reviews"
  on public.reviews
  for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'ordinarymysticreadings@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ordinarymysticreadings@gmail.com');
