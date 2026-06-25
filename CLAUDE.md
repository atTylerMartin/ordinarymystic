# CLAUDE.md

## Branches

- **`tiktok-landing` is the production branch right now.** Treat it as the
  source of truth: commit, push, and deploy from `tiktok-landing`.
- **`main` is being ignored** for the time being — do not open PRs into it or
  merge `tiktok-landing` back into it unless explicitly asked.

## Architecture

- **This is a fully static site** (`output: "export"` in `next.config.ts`).
  There is no server runtime. **Do not** add Server Actions, API routes, route
  handlers, middleware, or request-time server fetching — they break the build
  ("Server Actions are not supported with static export"). All dynamic behavior
  must run client-side in the browser.
- **Supabase is called directly from the browser** with the publishable
  (`anon`) key, gated by Row Level Security. Reviews are the first such feature:
  see `src/lib/supabase.ts`, `src/lib/reviews.ts`, and `src/components/reviews-*`.
  Approving a review = set its `status` to `approved` in the Supabase dashboard.
- **Secrets:** only `NEXT_PUBLIC_*` env vars reach the browser/build. The
  service-role key must never be used in client code.
- **Reviews moderation** lives at `/admin` (Supabase Auth, email+password).
  Admins are identified by `role: "admin"` in their auth `app_metadata`
  (`is_admin()` in `supabase/admin-reviews.sql`). New reviews trigger an email
  via the `notify-review` Edge Function (Resend).

## Long-term plan

See [`plans/product-roadmap.md`](plans/product-roadmap.md) for the multi-phase
vision (direct Stripe, client accounts + dashboards, video/PDF reading delivery,
admin CRM, lifecycle automations). Key future decision noted there: **dropping
static export for a Next.js server runtime on Vercel** once the Stripe/dashboard
work begins.
