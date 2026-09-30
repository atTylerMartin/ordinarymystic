# WP-3: About, FAQ, readings pages, testimonials, nav, footer, homepage hub

Model: Opus (this package is mostly copy and page structure). Branch: `core-pages` from
`tiktok-landing`, after WP-2 (`guides`) has merged. If `guides` is not merged when you
start, ask before proceeding; the nav and footer link to `/guides`.

## Read first
- `CLAUDE.md` and `plans/product-roadmap.md` (static export, no server code; prices and
  Stripe links only in `src/lib/offerings.ts`; the registry rule; production branch
  `tiktok-landing`)
- `plans/om-seo-plan.md`: "Part 1" (the route table, nav and footer), "Part 2" (the query
  map, what the recorded page must contain, the recorded-reading facts), "Decisions",
  and "WP-3"
- `src/lib/offerings.ts` (every price, tier, blurb and lede you will reuse; `RECORDED_COPY`,
  `LIVE_COPY`, `ONGOING_COPY`, `TULSA_CROSSLINK`)
- `src/lib/routes.ts`, `src/lib/metadata.ts`, `src/components/structured-data.tsx`
  (`StructuredData`, `ReadingServiceSchema`, `BreadcrumbSchema`, `PERSON_ID`, `ORG_ID`),
  `src/components/breadcrumbs.tsx`
- `src/app/page.tsx`, `src/components/booking-section.tsx`, `src/components/site-header.tsx`,
  `src/components/site-footer.tsx`, `src/components/reviews-section.tsx`,
  `src/components/leave-review-button.tsx`, `src/app/book/thanks/recorded/page.tsx`
- `src/app/tulsa-tarot-reading/page.tsx` (tone and the online-only framing to keep)
- For the About copy: `git show origin/main:src/app/about/page.tsx` and
  `git show origin/main:src/data/authors.ts` (an earlier About under the full name; reuse the
  good sentences, drop "no call, no scheduling", which conflicts with live readings). Never
  check out or merge `main`.
- The sister site's About, for the two-brand sentence and the reader's voice:
  `C:/Users/tyler/Documents/My Files/03. Efforts/Code/tulsa-tarot/lib/content/about.ts`

## Facts to state plainly (do not soften them)
- Recorded readings: prepared privately, off camera; delivered within three business days of
  receiving the question; delivered as a private YouTube link to the video walkthrough plus
  the written synthesis, by email. Three tiers from `RECORDED`. The question is collected
  right after checkout; clarifications by email.
- Live readings: one on one over Zoom, scheduled within two business days of booking, three
  tiers from `LIVE`, a written synthesis afterward.
- Ongoing readings: a standing arrangement, priced by cadence, starts with an email.
- Astrology readings use the same tiers and formats; a chart reading needs date, time and
  place of birth, collected the same way as the question.
- Recorded is its own product. Never describe it as the cheaper or faster version of live.
  Live is premium because of real-time interaction.
- The reader is Tyler Martin, three years into the practice, in Tulsa, Oklahoma. The full
  name is allowed on this site. In-person readings and events are Tulsa Tarot Reader, "the
  in-person side of the practice"; link it, never duplicate it, never list local offerings.
- The practice has three audiences: clients (readings), students (guides, teaching later),
  readers (tools, Querent). About names all three in a paragraph; nothing else about
  students or readers ships in this package.

## Questions (one message, then wait; on "go" use the defaults)
1. Headshot filename in `public/images/` for `/about`. Default: reuse
   `/images/profile-img.png` and leave a `TODO headshot` comment.
2. Live scheduling: "within two business days" is the default line. Confirm or replace.
3. Any FAQ you want included beyond the ones drafted from the site copy? Default: none.

## Build, in this order

### 1. Copy modules
Create `src/lib/content/` with one typed module per page: `about.ts`, `faq.ts`,
`readings.ts` (shared by the four readings pages), `testimonials.ts`, `home.ts`,
`nav.ts` (nav links and footer columns). Every price, tier, blurb and lede is imported from
`offerings.ts`, never retyped. Write in plain, direct prose; run a humanizer pass; no em
dashes anywhere (grep before each commit). No "cute" copy.

### 2. Routes
Register in `src/lib/routes.ts`: `/readings` (0.9, weekly, "clients"), `/readings/recorded`
(0.9), `/readings/live` (0.8), `/readings/astrology` (0.8), `/faq` (0.7), `/about` (0.8,
"all"), `/testimonials` (0.6). Titles under 60 characters with the template; descriptions
120 to 155 characters carrying the page's query from the plan's query map.

### 3. Pages
- `/readings`: overview and chooser. One paragraph each on recorded, live, ongoing, astrology,
  with the tier grid from `offerings.ts` for recorded and live, and "how to choose" in three
  sentences. `ReadingServiceSchema` for both kinds.
- `/readings/recorded` (the money page): answer in the first 60 words (what it is, from
  $35 read from `RECORDED[0].price`, three business days); the three tiers with the featured
  one marked and the Stripe buttons (reuse `RecordedSection` or its pieces from
  `booking-section.tsx`; keep the `#book` anchor on this page too); what arrives; how the
  question is collected; "how I prepare" (four or five sentences, first person); three
  testimonials pulled by `ReviewsSection` or a compact variant; a visible FAQ of six to eight
  questions (no FAQPage schema here); the recorded-is-its-own-product paragraph; the
  `ReadingServiceSchema kind="recorded"`; a Tulsa cross-link line at the bottom.
- `/readings/live`: the same shape for live, `LIVE` tiers, `#live` anchor,
  `ReadingServiceSchema kind="live"`, the ongoing-readings card with the email CTA.
- `/readings/astrology`: what a chart reading includes, what to send (date, time, place),
  recorded or live, links to both tier grids rather than a third set of buttons.
- `/about`: `<section id="tyler-martin">` wrapping the bio so `PERSON_ID` resolves.
  Headshot, "I'm Tyler Martin", three years reading, Tulsa, how he reads (grounded,
  conversational, not predictive), the two brands in one paragraph with the Tulsa link, the
  three audiences in one paragraph, a four-question FAQ teaser linking to `/faq`.
- `/faq`: every question on the site grouped (Booking, Recorded readings, Live readings,
  Astrology, About the reader, Tulsa and in person), 18 to 25 questions, answers of two to
  four sentences, the site's only `FaqSchema` (add it to `structured-data.tsx`, questions
  and answers from `faq.ts`).
- `/testimonials`: all approved reviews via the existing client-side fetch, the
  `LeaveReviewButton`, a line on how testimonials are collected and moderated. No review
  schema.
- `/book/thanks/recorded`: rewrite. It currently says "I should have everything I need from
  you." New copy: thank you; send your question now (a prefilled `mailto:` button with
  subject "My recorded reading question" and a body prompt for the question and any
  context); the three business days start when the question arrives; what arrives and how.
  Keep `NOINDEX`. `/book/thanks/live`: add "I'll email within two business days to schedule."

### 4. Nav, footer, header, homepage
- `src/components/site-nav.tsx` (server): Readings, Guides, About, For Readers (points at
  `/tools` until WP-7 creates `/for-readers`), Newsletter (omit until WP-5; leave a
  commented slot), plus the Book button to `/readings/recorded`. Mobile: a simple disclosure
  menu; no icon library beyond the existing lucide imports. Replace the header's single
  button with the nav.
- `site-footer.tsx`: three columns from `nav.ts`: Readings (Recorded, Live, Astrology,
  Ongoing, Testimonials, FAQ), The Practice (About, Guides, Tools, Tulsa Tarot Reader
  marked "in person, Tulsa"), Contact (email, TikTok, YouTube, Cash App, PayPal, Terms,
  Privacy).
- Homepage becomes a hub: hero (one sentence, two buttons: Book a recorded reading, See
  live readings), a recorded-readings teaser with the three tiers and a link to
  `/readings/recorded`, a testimonials strip (three) linking to `/testimonials`, a live
  teaser linking to `/readings/live`, a guides row (three newest from `listGuides`), a For
  Readers row (Querent, the digital deck, Notion tools), the Tulsa cross-link. Anchors
  `#book`, `#live`, `#reviews` must still resolve on `/` (old links and `/pay` use them):
  keep them on the teaser sections. Remove the Cash App and PayPal hero buttons (they belong
  to `/pay`); keep the wallet links in the footer.
- Retire `/tulsa-tarot-reading` and `/tulsa-astrology-reading`? No. Keep them; add a link
  from each to the matching readings page and switch their in-page CTAs to it.

### 5. Guides CTA default
Change `guide-cta.tsx`'s default URL from `/#book` to `/readings/recorded`, and
`sed` every `ctaUrl: "/#book"` in `content/guides/*.md` to `/readings/recorded` (astrology
guides to `/readings/astrology`; decide by `category`).

### 6. `llms.txt` and `CLAUDE.md`
Add the new pages to the Pages section of `public/llms.txt` (the check script only guards
prices and slugs; keep the page list accurate by hand). In `CLAUDE.md`: the copy-module
rule (`src/lib/content/*`, prices imported), the route list, the FAQPage-only-on-`/faq`
rule, the thanks-page question flow.

## Verify (paste the output)
```bash
npm run build
for p in readings readings/recorded readings/live readings/astrology faq about testimonials; do grep -o '<title>[^<]*' out/$p.html; done
grep -c "<loc>" out/sitemap.xml                       # equals routes.length
grep -o '"price":"[0-9]*"' out/readings/recorded.html | sort -u | tr '\n' ' '   # 35 65 125 only
grep -o '"price":"[0-9]*"' out/readings/live.html | sort -u | tr '\n' ' '       # 40 100 195 only
grep -c '"FAQPage"' out/faq.html                       # 1
grep -rl '"FAQPage"' out --include=*.html              # out/faq.html only
grep -c 'id="tyler-martin"' out/about.html             # 1
grep -o 'id="book"\|id="live"\|id="reviews"' out/index.html | sort -u   # all three
grep -rnE '\$(35|65|125|40|100|195)\b' src --include=*.ts --include=*.tsx | grep -v offerings.ts   # nothing
grep -rn "budget\|cheaper\|cheap " src/lib/content      # nothing
grep -rl $'\xe2\x80\x94' src/lib/content src/app src/components public/llms.txt   # nothing
grep -c "mailto:" out/book/thanks/recorded.html        # at least 1
grep -o 'three business days' out/readings/recorded.html | head -1
```
Then the Rich Results test on `out/readings/recorded.html` (Service with Offers, Breadcrumb)
and `out/faq.html` (FAQPage). Check `/` renders at 375px wide with the new nav open.

## Commit
Small commits on `core-pages` (copy modules, routes, readings pages, about and faq,
testimonials and thanks pages, nav footer home, guides CTA, llms and CLAUDE.md). No em
dashes in messages. Do not merge or push. Reply with the verification output, the files
changed, the defaults you assumed, and anything you deviated from and why.
