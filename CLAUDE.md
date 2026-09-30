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

- **The six reading Payment Links collect two custom fields at checkout** (set 2026-09-29
  with `--set-fields` in the same script, in place, URLs unchanged): `question` (required,
  255 characters) and `birth_data` (optional; needed for astrology). The stream links carry
  none. `/book/thanks/recorded` asks for context by email; the three business days start
  when the question is in hand.

## The pay page

- **`/pay` is where TikTok live viewers pay for a reading directly** instead of
  through TikTok coins. Tiers, copy and wallet links are `LIVE_STREAM`,
  `STREAM_COPY` and `WALLETS` in `src/lib/offerings.ts`. The page is noindex
  and stays out of the sitemap.
- **The one-card ($1) tier is wallets-only on purpose**: Stripe's fee would take
  a third of a dollar. Only three cards and full spread get Payment Links
  (`om_tier` `stream-3card` / `stream-full`), and those links redirect to
  `/pay?paid=1`, which shows a thank-you line.
- **The three `explain` paragraphs are the canonical description** of the three
  reading sizes (one card, three cards, full spread). Reuse them; do not
  rewrite them elsewhere.
- **The URL goes in the TikTok bio and Service+ messages only.** It is never
  read aloud or shown on screen during a live.

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

## SEO plumbing

- **Every indexable page is registered in `src/lib/routes.ts`** and gets its
  metadata from `pageMetadata(path)` in `src/lib/metadata.ts`. Never
  hand-write `openGraph` in a page: Next merges metadata shallowly, so a page
  that skips this silently canonicalizes to `/`. `src/app/sitemap.ts` maps
  over the registry; a page cannot appear in the sitemap without a registry
  entry, and a page cannot get its own canonical without one either.
- **Never register `/pay`, `/links`, `/admin`, `/book`, `/resources`, or a
  `thanks` page.** Those carry `NOINDEX` from `src/lib/metadata.ts` instead
  and stay live for old inbound links or their noindex purpose (`/pay`,
  `/admin`).
- **Schema map**: `src/components/structured-data.tsx` renders `Organization`,
  `Person`, and `WebSite` once, in the root layout. `ReadingServiceSchema`
  (`kind: "recorded" | "live"`) renders on `/` and the two Tulsa hand-off
  pages, built from `RECORDED`/`LIVE` in `offerings.ts` so a price is never
  retyped. `BreadcrumbSchema` and the visible `Breadcrumbs` component
  (`src/components/breadcrumbs.tsx`) walk the registry's `parent` links and
  render on every registered page except `/`.
- **`public/llms.txt`** states prices, tool slugs, and guide slugs as literal
  text, so `scripts/check-llms-txt.mjs` (wired as `prebuild`) fails the build
  if a price in `offerings.ts`, a tool in `content/tools`, or a guide in
  `content/guides` is not reflected there.
- **No em dashes** anywhere in this repo (grep for `\x{2014}` before
  committing). Plain punctuation only.
- `main` is archived source material from the previous build. Its content and
  patterns get ported deliberately (see `plans/om-seo-plan.md`); it does not
  merge.

## Guides

- **Guides are markdown in `content/guides/*.md`** (lessons, from WP-7, go in
  `content/lessons/`). `listGuides()` and `getGuide()` in `src/lib/content.ts`
  read them; `routes.ts` registers `/guides` and one entry per guide
  automatically. There is no CMS.
- **Frontmatter** (`GuideFrontmatter`): required `title`, `date`, `updated`,
  `description`, `category` (`tarot` | `astrology` | `general-spirituality`),
  `wing` (`guides` | `lessons`). Optional `kicker` (defaults to the category
  label; the season forecasts use "Season archive"), `tags`, `planets`,
  `signs`, `houses`, `cards` (keywords only, no taxonomy pages), `image` +
  `imageAlt`, the five `cta*` fields (defaults point at recorded readings, no
  prices), a visible `faq`, and `sources`.
- **`validateGuide()` fails the build** on a missing required field, a date
  that is not `YYYY-MM-DD`, `updated` earlier than `date`, a body under 300
  words, or an em dash anywhere in the file.
- **The Updated rule**: bump `updated` only when the copy changes. It drives
  the visible "Updated Month Year" line, `dateModified`, and the sitemap.
- **Schema**: every guide renders `ArticleSchema` (author and publisher by
  `@id`). **No `FAQPage` in guides**, even with a visible FAQ.
- `/blog` and `/blog/:slug` 308 to `/guides` via `redirects` in
  `vercel.json` (a platform rule, not Next server code).
- The twenty guides were ported from the archived `main` branch
  (`git show origin/main:src/content/blog/<slug>.md`); `main` is source
  material only and never merges.

## Long-term plan

See [`plans/product-roadmap.md`](plans/product-roadmap.md) for the multi-phase
vision (direct Stripe, client accounts + dashboards, video/PDF reading delivery,
admin CRM, lifecycle automations). Key future decision noted there: **dropping
static export for a Next.js server runtime on Vercel** once the Stripe/dashboard
work begins.
