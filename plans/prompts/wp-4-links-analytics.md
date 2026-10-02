# WP-4: First-touch attribution, GA4 events, and the `/links` bio page

Model: Sonnet. Branch: `links` from `tiktok-landing`. Runs before the newsletter (WP-5)
because the newsletter form will consume the attribution and the event helper built here.

## Read first
- `CLAUDE.md` (static export, no server code; the registry rule; `/pay` rules: the URL is
  never on screen; prices only in `src/lib/offerings.ts`)
- `plans/om-seo-plan.md`: "Attribution and analytics", "Where the 3,000 TikTok followers go",
  the `/links` row in the route table, and "WP-4"
- `src/app/layout.tsx` (the inline gtag snippet for `G-XF047BLMG9`), `src/lib/config.ts`,
  `src/lib/offerings.ts` (`LIVE_STREAM`, `STREAM_COPY`, `WALLETS`, `RECORDED`, `LIVE`)
- `src/app/pay/page.tsx` and `src/app/pay/paid-notice.tsx` (the buttons you will instrument;
  this page is the model for `/links`: noindex, `max-w-md`, out of the registry)
- `src/components/booking-section.tsx` (`RecordedTiers`, `LiveTiers`, `OngoingCard`,
  `WalletNote`, `TulsaCrosslink`), `src/components/site-footer.tsx`,
  `src/components/review-form.tsx`, `src/components/guide-cta.tsx`,
  `src/components/leave-review-button.tsx`, `src/lib/content/nav.ts`
- `src/lib/content.ts` (`listGuides`) for the three newest guides on `/links`
- `vercel.json` (already has the `X-Robots-Tag` rule for `/links`)
- The sister repo's versions, for shape only (that site runs on a server):
  `C:/Users/tyler/Documents/My Files/03. Efforts/Code/tulsa-tarot/lib/attribution.ts`,
  `lib/analytics.ts`, `components/Attribution.tsx`, `app/links/page.tsx`,
  `lib/content/links.ts`

## Questions (one message, then wait; on "go" use the defaults)
1. `/links` row order. Default, top to bottom: Pay for your live reading (`/pay`), Book a
   recorded reading (`/readings/recorded`), Newsletter (a placeholder card with one line of
   copy and no form until WP-5), Free tools (Querent at `https://querent.app`, the digital
   deck at `DIGITAL_TAROT_APP_URL`), three newest guides, Tulsa Tarot Reader (in person),
   then TikTok and YouTube.
2. Headshot on `/links`. Default: `/images/profile-img.png`, ringed, above the name, like
   `/pay`'s masthead.
3. Anything else on the bio page? Default: no.

## Build, in this order

### 1. Attribution (`src/lib/attribution.ts`, `src/components/attribution.tsx`)
Port the sister file. `sessionStorage` key `om_attribution`. On the first page view of a
session store `{ utm_source, utm_medium, utm_campaign }` from the URL, else
`{ referrer: hostname }` when the referrer is another host, and always `landing: pathname`.
Later page views never overwrite. When no tags and no referrer arrive, defaults by landing
path: `/links` is `{ utm_source: "tiktok", utm_medium: "social", utm_campaign: "bio" }`
and `/pay` is `{ utm_source: "tiktok", utm_medium: "social", utm_campaign: "pay" }` (TikTok
strips referrers; the Service+ URL carries its own `utm_campaign=live`, so untagged `/pay`
is the bio or a typed URL, not the live). Export `captureAttribution()`, `readAttribution()`
and `attributionSource()` (a `source / medium / campaign` string, or `referral: host`, or
`direct`). `Attribution` is a client component with one `useEffect`, rendered once in the
root layout.

### 2. Analytics (`src/lib/analytics.ts`, `src/components/tracked-link.tsx`)
`trackEvent(name, params)` guards `window.gtag` and no-ops when absent. Typed wrappers:
- `trackBookClick({ tier: 15 | 30 | 60, mode: "recorded" | "live" })`
- `trackPayTap({ label: "stream-3card" | "stream-full" | "cashapp" | "paypal", campaign })`
  where `campaign` is the current `utm_campaign` or the stored one
- `trackPayPaid({ campaign })` fired once by `paid-notice.tsx` when `?paid=1` is present
- `trackSocialTap({ label: "tiktok" | "youtube" | "tulsa" | "email" | "cashapp" | "paypal" })`
- `trackGuideCta({ slug, href })`
- `trackReviewSubmit({ rating })`
- `trackLinkTap({ label })` for every row on `/links`
Every event also carries `source: attributionSource()`.
`TrackedLink` is a small client component rendering an `<a>` (or `Link` for internal hrefs)
that fires a supplied event on click, so the server components keep their markup: swap the
anchors in `RecordedTiers`, `LiveTiers` (the Stripe buttons: `book_click`), every button on
`/pay` (`pay_tap`), the footer socials and email (`social_tap`), `GuideCta` (`guide_cta`),
and the `/links` rows (`link_tap`). `review-form.tsx` calls `trackReviewSubmit` after a
successful insert. Never add UTM parameters to internal links; that starts a new GA session.

### 3. `/links` (`src/app/links/page.tsx`, `src/lib/content/links.ts`)
Metadata: title "Links", `robots: NOINDEX` from `metadata.ts`, `alternates.canonical`
`/links`. Not registered in `routes.ts`, not in the sitemap. Same column, paper ground and
card primitives as `/pay`; a short masthead (headshot, "Ordinary Mystic", one line: "Tarot
and astrology readings, recorded for you or live over Zoom."); the rows from question 1 as
full-width tap targets with one line of copy each; every row fires `link_tap`; the three
guides come from `listGuides("guides").slice(0, 3)`. All strings live in `links.ts`. No
prices on this page except through `offerings.ts` imports (the recorded row may say
"from $35" via `RECORDED[0].price`). The newsletter card says "Twice a month: one guide,
one note on the sky, one line about booking. Signup opens soon." and nothing else; WP-5
replaces it with the form.

### 4. Docs
`CLAUDE.md`: a short "Attribution and analytics" section (the storage key, the first-touch
rule, the event names and params, the UTM conventions: TikTok bio
`/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`, Service+ messages
`/pay?utm_source=tiktok&utm_medium=social&utm_campaign=live`, newsletter
`utm_source=newsletter&utm_medium=email&utm_campaign=<send-slug>`, never on internal
links), and `/links` added to the noindex list beside `/pay`. `public/llms.txt`: do not
list `/links` (it is noindex).

## Verify (paste the output)
```bash
npm run build
grep -c 'name="robots" content="noindex' out/links.html        # 1
grep -c "/links" out/sitemap.xml                                # 0
grep -o 'href="[^"]*"' out/links.html | grep -c "utm_"          # 0 (no UTMs on internal links)
grep -c "om_attribution" out/_next/static/chunks/*.js | grep -v ":0" | wc -l   # at least 1
grep -rnE '\$(35|65|125|40|100|195|1|5|15)\b' src/app/links src/lib/content/links.ts | grep -v offerings   # nothing
grep -rl $'\xe2\x80\x94' src/app/links src/lib/attribution.ts src/lib/analytics.ts src/components/tracked-link.tsx src/lib/content/links.ts   # nothing
```
Then in the browser preview with the GA4 DebugView open (append `?debug_mode=1` or use the
GA debugger extension): land on `/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`,
confirm `sessionStorage.om_attribution` holds those three values plus `landing: "/links"`,
navigate to `/` and confirm it is unchanged; tap a `/links` row (`link_tap`), a recorded
Book button (`book_click` with `tier` and `mode`), a `/pay` wallet button (`pay_tap`), and
load `/pay?paid=1` (`pay_paid`). Each event must show `source`. Check `/links` at 375px.

## Commit
Small commits on `links` (attribution, analytics and tracked links, the `/links` page,
docs). No em dashes in messages. Do not merge or push. Reply with the verification output,
the files changed, the defaults you assumed, and the one manual step for Tyler: in GA4
Admin, register the custom dimensions `tier`, `mode`, `label`, `campaign`, `source` and
mark `book_click`, `pay_tap` and `pay_paid` as key events (`newsletter_signup` comes with
WP-5).
