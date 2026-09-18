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

## Pricing

- **All reading prices and Stripe Payment Links live in `src/lib/offerings.ts`.**
  Nothing else may hardcode a price or a checkout URL. `src/lib/config.ts` holds
  non-pricing config only.
- **Stripe Payment Links are fixed-amount.** A link's price cannot be edited, so
  every price change requires a brand-new Product + Price + Payment Link. Use
  `scripts/stripe-payment-links.mjs` (idempotent on product `metadata.om_tier`),
  paste the new URLs into `offerings.ts`, verify each button, and only then
  deactivate the old links with `--deactivate-old`. **Never delete Stripe
  Products or Prices**, and never print a secret key.
- A tier with an empty `url` renders an "Email to book" mailto fallback, so the
  site never shows a new price behind an old link.

## Two brands, one reader (Tyler Martin)

- **Ordinary Mystic is the online practice**: recorded readings (prepared
  privately, delivered as a personalized video walkthrough plus a written
  synthesis), live one-on-one over Zoom, ongoing readings, written syntheses,
  digital products, TikTok.
- **[Tulsa Tarot Reader](https://tulsatarotreader.com) is the in-person
  practice**: private sittings in Tulsa, parties, weddings, corporate, school
  and community events, festivals, markets, venue pop-ups.
- Cross-link, never duplicate. Do not add in-person or event offerings here, and
  do not chase local in-person search intent — the Tulsa pages here exist for
  *online* readings and hand local intent off to Tulsa Tarot Reader.
- Never frame recorded readings as "budget live tarot". Recorded is its own
  product; live is premium because of real-time access and interaction.

## Long-term plan

See [`plans/product-roadmap.md`](plans/product-roadmap.md) for the multi-phase
vision (direct Stripe, client accounts + dashboards, video/PDF reading delivery,
admin CRM, lifecycle automations). Key future decision noted there: **dropping
static export for a Next.js server runtime on Vercel** once the Stripe/dashboard
work begins.
