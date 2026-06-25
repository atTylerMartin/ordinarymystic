-- Role-based admin moderation — run once in Supabase → SQL Editor.
--
-- Admins are identified by a "role" claim in their auth app_metadata, which is
-- only settable server-side (never by the user), so it's safe for authorization.
-- This scales: future client accounts simply won't have role = 'admin', and
-- their own data will be gated by `user_id = auth.uid()` policies instead.
--
-- SETUP
-- 1) Create the admin user: Authentication → Users → Add user, with
--    "Auto Confirm User" checked.
-- 2) Grant them admin by running the GRANT block below (adjust the email).
-- 3) The admin must sign out and back in so the new claim lands in their token.

-- ── Helper: is the current request from an admin? ────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ── Reviews: admin can read everything and change status ─────────────────────
drop policy if exists "Admin can read all reviews" on public.reviews;
create policy "Admin can read all reviews"
  on public.reviews for select to authenticated
  using (public.is_admin());

drop policy if exists "Admin can update reviews" on public.reviews;
create policy "Admin can update reviews"
  on public.reviews for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── GRANT admin (run once; re-run for any additional admins) ─────────────────
-- update auth.users
-- set raw_app_meta_data =
--       coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'ordinarymysticreadings@gmail.com';

-- ── VERIFY the claim was set ─────────────────────────────────────────────────
-- select email, raw_app_meta_data ->> 'role' as role
-- from auth.users
-- where email = 'ordinarymysticreadings@gmail.com';
