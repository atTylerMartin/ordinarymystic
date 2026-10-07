# CLAUDE.md

**Orchestrating rather than implementing?** Open Claude Code in `~/Documents/code/ordinary-mystic`,
the business folder beside this repo, and read its `CLAUDE.md`, `STATE.md` and `START.md`
first. Implementing sessions start here. Nothing personal or financial goes in this repo: it is public.

## Branches

- **`tiktok-landing` is the production branch right now.** Treat it as the
  source of truth: commit, push, and deploy from `tiktok-landing`.
- **`main` is being ignored** for the time being; do not open PRs into it or
  merge `tiktok-landing` back into it unless explicitly asked.

## Architecture

- **This is a fully static site** (`output: "export"` in `next.config.ts`).
  There is no server runtime. **Do not** add Server Actions, API routes, route
  handlers, middleware, or request-time server fetching; they break the build
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
  none. `/book/thanks/recorded` thanks the client, asks for any context by reply to the
  Stripe receipt or a prefilled `mailto:` (subject "Context for my recorded reading"),
  states delivery (private YouTube link plus written synthesis, within three business
  days), and asks astrology clients who left birth data blank to send it; the clock starts
  when the question (and birth data) is in hand. `/book/thanks/live` says "I'll email
  within two business days to schedule." Both stay `NOINDEX`.

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

## The links page

- **`/links` is the TikTok bio page.** Rows, copy and the `link_tap` labels are in
  `src/lib/content/links.ts` (prices only through `offerings.ts` imports). Like `/pay` it is
  noindex, not in `routes.ts`, not in the sitemap and not in `public/llms.txt`. The newsletter
  card is a placeholder until WP-5 swaps in the form.

## Attribution and analytics

- **First touch, per session.** `src/lib/attribution.ts` stores `om_attribution` in
  `sessionStorage` on the first page view of a session: `{ utm_source, utm_medium,
  utm_campaign }` from the URL, else `{ referrer: hostname }` when the referrer is another
  host, plus `landing: pathname`. Later page views never overwrite it. With no tags and no
  referrer, `/links` defaults to `tiktok / social / bio` and `/pay` to `tiktok / social / pay`
  (TikTok strips referrers; the Service+ URL carries its own `utm_campaign=live`). The
  `Attribution` component runs it once from the root layout. `attributionSource()` returns
  `source / medium / campaign`, `referral: host`, or `direct`.
- **Events** (`src/lib/analytics.ts`, GA4 via the inline gtag snippet; every helper no-ops
  when `window.gtag` is absent, and every event carries `source`): `book_click` (`tier`,
  `mode`), `pay_tap` (`label`: `stream-3card`, `stream-full`, `cashapp`, `paypal`; `campaign`),
  `pay_paid` (`campaign`, once, from `?paid=1`), `social_tap` (`label`), `guide_cta` (`slug`,
  `href`), `review_submit` (`rating`), `link_tap` (`label`). Server components fire them
  through `TrackedLink` (`src/components/tracked-link.tsx`), passing the event as plain data.
  GA4 Admin needs the custom dimensions `tier`, `mode`, `label`, `campaign`, `source`, and
  `book_click`, `pay_tap`, `pay_paid` marked as key events.
- **UTM conventions.** TikTok bio: `/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`.
  Service+ messages: `/pay?utm_source=tiktok&utm_medium=social&utm_campaign=live`. Newsletter:
  `utm_source=newsletter&utm_medium=email&utm_campaign=<send-slug>`. **Never put UTMs on
  internal links**; that starts a new GA session.

## Two brands, one reader (Tyler Martin)

- **Ordinary Mystic is the online practice**: recorded readings (prepared
  privately, delivered as a personalized video walkthrough plus a written
  synthesis), live one-on-one over Zoom, ongoing readings, written syntheses,
  digital products, TikTok.
- **[Tulsa Tarot Reader](https://tulsatarotreader.com) is the in-person
  practice**: private sittings in Tulsa, parties, weddings, corporate, school
  and community events, festivals, markets, venue pop-ups.
- Cross-link, never duplicate. Do not add in-person or event offerings here, and
  do not chase local in-person search intent. The Tulsa pages here exist for
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
  `/links`, `/admin`).
- **Schema map**: `src/components/structured-data.tsx` renders `Organization`,
  `Person`, and `WebSite` once, in the root layout. `ReadingServiceSchema`
  (`kind: "recorded" | "live"`) renders on `/`, `/readings`, the matching `/readings/*` page, and the two Tulsa hand-off
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

## Core pages and copy

- **Page copy lives in `src/lib/content/*`** (`readings.ts`, `faq.ts`, `about.ts`,
  `testimonials.ts`, `home.ts`, `nav.ts`), one typed module per page. Prices, tiers,
  blurbs and ledes are imported from `offerings.ts` and turned into text with
  `priceFrom`, `priceList` and `lengthList` in `readings.ts`; never type a price into a
  sentence. `RECORDED_TURNAROUND` ("three business days") and `LIVE_SCHEDULING` ("two
  business days") are the only statements of the two timelines.
- **Routes**: `/readings` (overview and chooser), `/readings/recorded` (the money page,
  keeps `#book`), `/readings/live` (keeps `#live`, ongoing card at `#ongoing`),
  `/readings/astrology`, `/faq`, `/about` (`<section id="tyler-martin">` so `PERSON_ID`
  resolves), `/testimonials`. The homepage is a hub and still carries `#book`, `#live` and
  `#reviews` for old links and `/pay`. `/book` redirects to `/readings/recorded`.
- **`FaqSchema` renders on `/faq` only**, built from every item in `faq.ts`; it is the
  site's one `FAQPage`. Other pages show a visible FAQ with `FaqList` and
  `faqItems(ids)`, and no schema. Add a question to `faq.ts` and reference its `id`.
- **Nav and footer** render from `nav.ts`: Readings, Guides, About, For Readers (points at
  `/tools` until `/for-readers` exists), a commented Newsletter slot, and the Book button
  to `/readings/recorded`. Below `lg` the links sit in `MobileNav`.
- **Testimonials** load client-side (`ReviewsSection`, with `limit`, `fullBleed` and
  `moreHref`); no review schema anywhere.

## IndexNow

- **Bing is notified automatically after every Production deploy.**
  `.github/workflows/indexnow.yml` runs on Vercel's GitHub deployment status
  (success, environment `Production`), then runs
  `node scripts/indexnow.mjs --sitemap --since 3`, which submits only the
  sitemap routes whose `updated` date (from `routes.ts`) falls in the last
  three days. To notify by hand, `npm run indexnow -- /the/path`. The first
  run after this ships should be `npm run indexnow -- --sitemap` with no
  `--since`, so Bing sees every route once. Google has no equivalent: Request
  Indexing in Search Console stays manual, and is worth doing only for new
  pages.
- The three pieces: the key file `public/<key>.txt` (public by design, so it
  is fine to commit), `scripts/indexnow.mjs` (the submission script, house
  style borrowed from `scripts/stripe-payment-links.mjs`), and
  `.github/workflows/indexnow.yml` (the Action).
- **`INDEXNOW_KEY`**: a repository secret for the Action (Tyler adds it in
  GitHub Settings > Secrets and variables > Actions), and the same value in
  `.env.local` for local runs (see `.env.example`). The key itself is public
  (it lives in `public/<key>.txt`), so there is nothing sensitive about it
  leaking, but the Action still reads it from a secret rather than hardcoding
  it in the workflow file.

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
  `imageAlt`, the five `cta*` fields (defaults point at recorded readings and
  `/readings/recorded`, no prices; astrology guides set `ctaUrl` to
  `/readings/astrology`), a visible `faq`, and `sources`.
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
