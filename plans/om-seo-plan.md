# Ordinary Mystic: three-audience site, recorded-readings SEO, channels and off-site

Plan written 2026-09-28. Orchestrator: Fable. Implementers: Sonnet and Opus sessions from
the work packages below. Production branch: `tiktok-landing`. Static export stays.

## Context

### Why now
Tulsa Tarot Reader just got a full local SEO build in a week using this working model. Ordinary
Mystic is the practice and the platform under the full name Tyler Martin, and it gets the same
treatment, non-locally, structured for three audiences: clients (readings), students (teaching,
later), and readers (tools, Querent, lessons about craft). Consumer readings stay the front door
and the revenue; the other two wings grow beside them.

### What the repo and the live site actually are (found 2026-09-28)
- **Production is a stripped landing page.** One long homepage (recorded tiers, testimonials,
  live tiers, ongoing, Tulsa cross-link, three tool cards), `/tools`, two Tulsa hand-off pages,
  a `/blog` of 30 posts, and placeholders. No About page, no FAQ, no nav beyond one Book button,
  no Person, Organization or WebSite schema, no `llms.txt`, no newsletter, no analytics events.
- **28 of the 30 blog posts are filler** ("Filler content. Replace with your own post when
  ready."), all in the sitemap. Only two posts have real text (about 250 words).
- **Every `/blog/[slug]` and `/tools/[slug]` page on production is the 404 page.** Both page
  files read `params.slug` synchronously; in Next 16 `params` is a Promise, so the slug is
  undefined and `notFound()` fires at build time. The built HTML carries the 404 title and a
  `noindex` tag, and the pages return HTTP 200 with the 404 body. The build passes because
  Next's generated validator does not type-check the page's own prop annotation. Two
  consequences: none of the blog URLs were ever indexable (so tearing `/blog` down loses
  nothing), and the two Notion tool pages have been invisible since March. Hotfix first.
- **Pages that do not set their own `openGraph` inherit the homepage's**, so `og:url` on the
  Tulsa pages and the tool pages is the homepage and there is no canonical link. A
  `pageMetadata()` helper that always emits the whole block fixes this.
- **`/login`, `/account`, `/account/profile`, `/account/sessions` are "coming soon" placeholders
  and are in the sitemap.** `/terms` and `/privacy` are linked in the footer and 404.
- **The `main` branch (last touched 2026-04-29) is a bigger, better site that was dropped when
  `tiktok-landing` replaced production.** It holds 20 real essays of 800 to 6,700 words under
  `src/content/blog/` (court cards, birth charts, reversals, natal retrogrades, houses,
  malefics, two season forecasts), an About page under the full name with a five-question FAQ,
  a Person + WebSite schema, `llms.txt`, AI-crawler robots rules, a newsletter form, and GA4
  events. It runs on a server (API routes), so it cannot be merged; its content and patterns
  can be ported. The untracked `ACTION-PLAN.md` and `FULL-AUDIT-REPORT.md` at the repo root
  are April audits of `main`, not of production; most of their fixes were applied on `main`.
  They stay untracked and are superseded by this plan.
- **Google's snapshot of the homepage is stale**: the indexed title is "Ordinary Mystic:
  Practical Spirituality" with copy about "5 to 7 business days" delivery and in-person
  sessions in Tulsa. Nothing on the site tells Google what changed. The brand query also
  returns the public GitHub repo `atTylerMartin/ordinarymystic`, which is fine on this brand.
- **The `pay-page` branch** (two commits on top of `tiktok-landing`, dated today) is the Sonnet
  session's `/pay` work. It is unmerged. It merges first, before any package below touches
  `offerings.ts` or `CLAUDE.md`.
- **Reviews** are a Supabase table with RLS, moderated at `/admin`, fetched client-side, shown
  as "testimonials" on the homepage, with a Resend email via the `notify-review` Edge Function.
  There is no review schema and no link from the reviews to anything off-site.
- Stack: Next 16.1.6, React 19, Tailwind v4, `gray-matter` + `remark` already installed,
  Geist body face (the same face as Tulsa Tarot Reader), Montserrat headings, GA4 `G-XF047BLMG9`
  as a raw gtag snippet, Vercel hosting, Supabase anon client in the browser.

### What the research says (searches run 2026-09-28)
- **The head terms are not ours.** "online tarot reading" and "tarot reading online" return
  free and AI card-pullers (Labyrinthos, Tarotoo, Tarotap, ChatArot) and the big pay-per-minute
  platforms (Keen, Kasamba, Purple Garden, Psychic Source, California Psychics). Every "best
  online tarot reading sites 2026" listicle (MysticMag, 78tarot.cards, Medium) names platforms
  only, with affiliate links, ranked on "vetting, pricing clarity, usability, support". No solo
  reader is named in any of them. Chasing those terms or those lists is wasted effort.
- **The format terms are winnable.** "recorded tarot reading", "video tarot reading",
  "pre-recorded tarot reading", "tarot reading by email", "email tarot reading" return Etsy
  category pages and Fiverr gigs first, and then **individual readers on their own sites**:
  That Oracle Guy (thatoracleguy.com, $75 for 15 minutes, $150 for 30, private YouTube video in
  1 to 3 days, worksheet, FAQ, 10 years' experience, no reviews shown), Bobbie Reads, Darqprism,
  Moonlight, Expressive Tarot, Alison Spokes, plus Gumroad and Substack pages (Tarot by the
  Shore $25/15 min, Words With a Twist $15 to $65, Billie's Tarot). The pattern that ranks: one
  dedicated page per format, price on the page, turnaround stated, delivery format stated
  (private YouTube link or MP4), how the question is collected, an FAQ, and a person with a
  name and years of practice. Our recorded tiers ($35/$65/$125) sit under That Oracle Guy and
  above Etsy's $5 to $30, which is the right place for "prepared privately, video plus written
  synthesis".
- **Marketplaces are page one and are also a channel.** Etsy's "video tarot reading" market
  page and Fiverr's "tarot readings" gig index rank above any individual. Etsy's house rules
  allow tarot readings only when a tangible good is delivered (video, audio, photos of the
  spread, or text), which a recorded reading is by definition; "metaphysical services" and
  outcome claims are banned. A single Etsy listing for the 30-minute recorded reading, at the
  same price, is both a citation and a lead source, at the cost of Etsy's fees (about 6.5%
  plus payment processing). Recommended as optional off-site work, not as a dependency.
- **Trustpilot's free plan** (50 invitations a month, a profile page, a review-collector
  widget) needs only an active website, so it is the one public review surface open to an
  online-only reader.
- **How AI assistants answer "where can I get a good tarot reading online".** They name the
  platforms above, because that is what the listicles say. To be named as an individual, the
  2026 studies agree on the levers: a clearly identified entity (a Person and an Organization
  with the same facts everywhere), pages that answer a whole question in the first paragraph
  with the price visible, review volume with a rating (the studies put the floor for local
  queries around 25 reviews at 4.3+; for a solo online reader the bar is lower but the
  mechanism is the same), and **brand mentions on third-party surfaces**: YouTube (named as the
  strongest predictor of AI visibility in the 2026 SEO Sherpa data), Reddit (46.7% of
  Perplexity's top citations), review sites, and directories. ChatGPT reads Bing's index, not
  Google's, and the overlap between Google's top ten and AI citations fell under 40% in early
  2026, so a page that never reaches Google page one can still be the one an assistant cites.
  `llms.txt` is cheap and some crawlers read it.
- **Google Business Profile is not available to an online-only business** (Google's eligibility
  rules require in-person contact), and it would collide with Tulsa Tarot Reader's profile
  anyway. Reviews for Ordinary Mystic live on the site (with schema) and on Trustpilot, and OM
  clients who want to review on Google review the Tulsa profile honestly, as already planned.
- **Directories for online readers are thin.** Biddy Tarot's directory requires their
  certification; Tarot Hub and Moonlight are marketplaces with their own listings; the Tarot
  Association and Tarosophy lists are membership-based and low traffic. The useful "directory"
  surfaces for an online reader are YouTube, Reddit, Trustpilot, Etsy, and the brand's own
  profiles (TikTok, YouTube, Gumroad, GitHub for Querent).
- **Social for a solo practitioner in 2026**: Instagram alone can work; Facebook adds value
  mainly for local search and the 35 to 65 demographic, which is Tulsa Tarot Reader's job.
  The grid guidance that holds up is a strict alternation (photograph, designed tile) at
  1080 x 1350 for the new 3:4 profile view, three to five pillars each with a consistent
  treatment, previewed in a planner before posting. It is written down here so it is ready
  when an OM Instagram opens; it is not started now (see decisions).
- **Resend** now has one Audience per account, with Contacts, Properties, Segments and Topics.
  "One list with Tulsa as a segment" is the native shape once both brands are on one account.

### Static export: no migration for SEO
Everything in this plan is build-time HTML: metadata, canonicals, sitemap, JSON-LD, guides,
`llms.txt`, robots rules. The two things that look like they need a server do not:
- Newsletter signup inserts a row into a Supabase `subscribers` table from the browser (the
  same pattern as reviews); a database webhook calls an Edge Function that creates the Resend
  contact and sends the welcome email.
- Redirects and headers are not available in `next.config.ts` on static export, but
  `vercel.json` applies them at the platform in front of the static files, which is not a
  Next server feature. `/blog` and `/blog/:slug` redirect to `/guides` there, and the same
  file sets security headers and `X-Robots-Tag` on the noindex pages.
The roadmap's server switch stays tied to Phase 1 of the product work, not to SEO.

## Decisions recorded 2026-09-28
1. **Port all 20 `main` essays** into an evergreen guides section. Delete the 28 filler posts.
2. **Reader wing: routes reserved, one public page now.** `/for-readers` links Querent, the
   Notion tools and the digital deck, and carries the first lesson from the Tulsa build.
   Teaching for students is IA only until Tyler says go.
3. **No Ordinary Mystic Instagram or Facebook now.** OM runs on TikTok, YouTube and the email
   list. The existing OM Instagram goes private or dormant with a bio pointing at `/links`.
   A Facebook Page is created as a complete but silent placeholder for the Meta citation only.
   Revisit when the reader wing opens (an Instagram for the readers audience, not for clients).
4. **Resend: consolidate onto one account.** OM's and TTR's accounts are separate today. The
   practice list lives on OM's account (domain `ordinarymysticreadings.com` is verified there);
   `tulsatarotreader.com` gets verified on it too, TTR's subscribe route switches API key, and
   `brand` becomes a contact property with a saved Tulsa segment. Until that is done, OM's
   signup writes to OM's account and nothing breaks.
5. **Full name and a face on this brand.** `/about` is "Tyler Martin", with a headshot, and
   the Person schema carries the name. Tulsa Tarot Reader stays first-name-only; its Person
   node links to OM's by `sameAs`, never by name.
6. **Never frame recorded as budget live.** Recorded is "prepared privately, delivered as a
   video walkthrough plus a written synthesis"; live is premium for real-time interaction.
7. **Prices and Stripe links stay in `src/lib/offerings.ts` only.** Schema Offers read from it.
8. **`/pay` merges first**, then packages run in order.

## Part 1: Information architecture for three audiences

One site, one nav, three wings. Wings are folders, not subdomains, so the Organization and
Person entities accrue everything.

| Route | Audience | Purpose and primary query | Status |
|---|---|---|---|
| `/` | all | Hub: who this is, recorded readings first, live, proof, a row for each wing. "Ordinary Mystic" | rebuild as hub (slimmer) |
| `/readings` | clients | Readings overview: recorded vs live vs ongoing, how to choose. "online tarot reading with a real person" | new |
| `/readings/recorded` | clients | The money page. Price, turnaround, what arrives, how the question is collected, FAQ, testimonials. "recorded tarot reading", "video tarot reading", "tarot reading by email" | new |
| `/readings/live` | clients | Live over Zoom. "live tarot reading online zoom" | new |
| `/readings/astrology` | clients | Astrology readings (recorded or live), what a chart reading includes. "astrology reading online", "birth chart reading video" | new |
| `/faq` | clients | Every question on the site, grouped. The site's only FAQPage schema. | new |
| `/about` | all | Tyler Martin. Headshot, three years reading, Tulsa, the two brands, the three wings. Person schema lives here. | new |
| `/guides` and `/guides/[slug]` | clients, students | Evergreen, answer-first, visible Updated line, Article schema. The 20 ported essays plus the new recorded-reading guides. | new (replaces `/blog`) |
| `/testimonials` | clients | All approved reviews, the leave-a-review button. Homepage shows the latest few. | new |
| `/newsletter` | all | The one signup page. | new |
| `/for-readers` | readers | Querent, the Notion tools, the digital deck, and the first lesson. | new |
| `/for-readers/lessons/[slug]` | readers | Lessons about craft and practice from building Tulsa Tarot Reader. Same guide engine, different folder and kicker. | reserved; first one ships in WP-7 |
| `/tools` and `/tools/[slug]` | readers | Products. Stays at its URL; moves under the For Readers wing in nav and breadcrumbs. | keep |
| `/learn` | students | Teaching hub. Reserved, nothing public. | reserved |
| `/tulsa-tarot-reading`, `/tulsa-astrology-reading` | clients | Online readings for people searching Tulsa; hand local intent to TTR. | keep, register, tidy |
| `/links` | TikTok followers | The bio page. noindex, out of the sitemap. | new |
| `/pay` | live viewers | Existing. noindex. | keep |
| `/admin`, `/book/thanks/*`, `/thank-you` | none | noindex, out of the sitemap. | fix |
| `/login`, `/account/*` | none | Placeholders. Delete; the roadmap rebuilds them in Phase 1. | delete |
| `/blog`, `/blog/[slug]`, `/resources` | none | Retire. `/blog` becomes a one-line static page linking to `/guides`. `/resources` stays a client-side redirect to `/tools`. | retire |

**Nav** (five links plus Book): Readings, Guides, About, For Readers, Newsletter; Book goes to
`/readings/recorded`. Students get a slot when `/learn` opens.
**Footer** (three columns): Readings (Recorded, Live, Astrology, Ongoing, Testimonials, FAQ),
The Practice (About, Guides, For Readers, Newsletter, Tulsa Tarot Reader marked "in-person,
Tulsa"), Contact (email, TikTok, YouTube, Cash App, PayPal, Terms, Privacy).

**When the reader wing opens** (trigger: Querent has a public sign-up, or three lessons exist):
For Readers becomes a hub with Lessons, Tools, Querent; an OM Instagram for readers opens;
`/learn` opens only when there is a course to sell. Nothing on the reader side ever names a
client, a booking, or a reading; lessons are about craft, tooling and practice.

## Part 2: SEO for recorded readings

### Query map and the page that owns each
| Intent | Queries | Page |
|---|---|---|
| buy recorded | recorded tarot reading, video tarot reading, pre-recorded tarot reading, tarot reading by email, email tarot reading, personalized tarot reading video | `/readings/recorded` |
| buy live | live tarot reading online, zoom tarot reading, tarot reading video call | `/readings/live` |
| buy astrology | astrology reading online, birth chart reading online, recorded astrology reading | `/readings/astrology` |
| compare | recorded vs live tarot reading, email vs video tarot reading, are online tarot readings worth it | guide: Recorded, live, or written |
| price | how much does a tarot reading cost, tarot reading prices online | guide: What an online tarot reading costs (prices public) |
| choose a reader | how to find a good tarot reader online, how to tell if a tarot reader is legit, questions to ask | guide: How to choose an online tarot reader |
| prepare | what to ask a tarot reader, how to prepare for a tarot reading, good questions for tarot | guide: Asking a question the cards can answer (port of "the question behind the question" themes) |
| technique and astrology | court cards, reversals, birth chart, houses, retrogrades, season forecasts | the 20 ported essays |
| brand | ordinary mystic readings, ordinary mystic tarot, tyler martin tarot | `/`, `/about` |

Head terms ("online tarot reading", "tarot reading online") are covered by `/readings` and
the FAQ but are not a target; the SERP is apps and platforms.

### What the recorded page must contain (the pattern that ranks and that assistants quote)
Answer in the first 60 words (what it is, price from, turnaround), the three tiers from
`RECORDED` with the featured tier marked, what arrives (a private video walkthrough plus a
written synthesis; state the delivery mechanism and turnaround in days, Tyler supplies both),
how the question is collected after checkout, a short "how I prepare" section, three
testimonials from the reviews table, a visible FAQ (no FAQPage schema here), and the line that
recorded is its own product, not a cheaper live reading. Schema: `Service` with `Offer`s built
from `RECORDED`, `provider` the Organization, `serviceOutput`, `availableChannel`.

### What earns an AI mention (the off-site half, see Part 6)
A YouTube channel with the guides as videos and one public sample reading; a Trustpilot
profile that the testimonial flow points at; honest participation on r/tarot with no
self-promotion (the profile links to the site); an Etsy listing if Tyler wants the channel;
Bing indexing; `llms.txt`; the same name, description and prices on every profile.

### Missing on the site today and fixed by the packages
About, FAQ, dedicated readings pages, Person/Organization/WebSite/Service/Article/Breadcrumb
schema, review schema, `llms.txt`, AI-crawler rules, `lastModified` in the sitemap, titles
under 60 characters (the homepage title is about 88 with the template), placeholder routes out
of the sitemap, `/terms` and `/privacy`, Search Console and Bing verification, GA4 key events.

## Part 3: Technical design

### Routes registry and metadata (`src/lib/routes.ts`, `src/lib/metadata.ts`)
Port Tulsa's shape: `RouteEntry { path, label, title, description, priority, changeFrequency,
updated, parent?, absoluteTitle?, audience: "clients" | "students" | "readers" | "all" }`.
Guides and lessons derive their entries from their content index. `app/sitemap.ts` maps over
the registry with real `lastModified`. `pageMetadata(path, overrides?)` sets
`alternates.canonical`, full `openGraph` and `twitter` (Next merges metadata shallowly; a page
that skips this canonicalizes to `/`). Never register `/pay`, `/links`, `/admin`, thanks pages.

### Content engine (`src/lib/content.ts` stays markdown)
Keep markdown with `gray-matter` and `remark` (add `remark-gfm`: two season guides contain
markdown tables). The 20 essays are about 40,000 words of prose; transcribing them into
Tulsa's typed blocks would be a lossy week with no SEO payoff, and `git show origin/main:...`
is the whole migration. Type safety is recovered by a build-time frontmatter check that
throws. `GuideFrontmatter { title, date, updated, description, category: "tarot" |
"astrology" | "general-spirituality", subcategory?, tags?, planets?/signs?/houses?/cards?
(keywords only, no taxonomy pages), image?, imageAlt?, ctaEyebrow?, ctaTitle?, ctaBody?,
ctaLabel?, ctaUrl?, faq? (rendered visibly, no schema), sources?, wing: "guides" | "lessons" }`.
`listGuides()` is synchronous (gray-matter only) so the routes registry can build at import
time; `getGuide(slug)` renders HTML. The check fails the build on a missing title, date,
updated or description, a bad ISO date, an em dash, or a body under 300 words. Content lives
in `content/guides/` and `content/lessons/`; `content/blog/` and `src/app/blog/` are deleted;
`vercel.json` redirects `/blog` and `/blog/:slug` to `/guides`. The port: copy the 20 files
plus `origin/main:public/images/featured/*`, rewrite `](/blog/<slug>)` links to `/guides/`,
unlink the two taxonomy links (`/blog/planets/*`) or point them at the long-arrivals guide,
point the broken `how-to-get-started-with-astrology` link at `how-to-get-started`, rewrite
every CTA to `/readings/recorded` (astrology essays to `/readings/astrology`), keep `date`,
set `updated` from each file's last commit on `origin/main` (2026-04-19 to 04-22) and bump it
only where copy changes. The two 250-word production posts are flagged thin: expand or drop.
Render dates with `timeZone: "UTC"` so a date-only string does not shift a day at build.

### Schema graph (`src/components/structured-data.tsx`)
One `JsonLd` helper (escape `<` as `<`). Rendered once in the layout: `Organization`
(`@id` `${SITE_URL}/#organization`, name "Ordinary Mystic", alternateName "Ordinary Mystic
Readings", logo, email, `founder` the Person, `subOrganization` as a typed stub
`{ "@type": "ProfessionalService", "@id": "https://tulsatarotreader.com/#business", name,
url }` because a bare external `@id` is not dereferenced, `sameAs` from a `SOCIALS` list in
`config.ts` with empties omitted; no address and no city `areaServed`, so it never competes
with Tulsa's local signals), `Person` (`@id` `${SITE_URL}/about#tyler-martin`, which must be a
real anchor on `/about`; name "Tyler Martin", jobTitle "Tarot and astrology reader", image
the headshot, `worksFor` the Organization, `sameAs` TikTok, YouTube, Tulsa Tarot Reader's
`/about`, GitHub), `WebSite` (`publisher` the Organization; no `SearchAction`, there is no
site search). Per page: `Service` + `Offer` on the readings pages (`@id` `#service-recorded`,
`#service-live`; offers mapped from `RECORDED` and `LIVE`, prices never retyped; the two Tulsa
pages switch to the same components), `Article` on guides and lessons (not `BlogPosting`;
`author` and `publisher` by `@id`, `datePublished`, `dateModified`, `keywords` from tags),
`BreadcrumbList` from the registry, `FAQPage` on `/faq` only (for answer engines; Google
restricted FAQ rich results to government and health sites in 2023). **No `AggregateRating`
or `Review` nodes**: reviews are fetched in the browser so the static HTML cannot carry a
count, client-injected JSON-LD is unreliable, and Google excludes self-serving ratings on an
Organization from rich results anyway. Revisit for a Product node per tier after the server
switch.

### Newsletter on static export
The `notify-review` pattern, not a direct function call. `supabase/subscribers.sql`: table
`subscribers (id, email, first_name, brand default 'om', source, campaign, landing,
created_at)`, a unique index on `lower(email)`, insert-only RLS for anon (`brand = 'om'`),
no select policy, and a before-insert trigger that raises when more than 30 rows landed in
the last ten minutes (rate limiting with no external state). A Database Webhook on INSERT
calls `supabase/functions/subscribe-welcome` (Deno, shared `x-webhook-secret`, "Verify JWT"
off, same header comments as `notify-review`), which creates the Resend contact with
properties `brand: "om"`, `source`, `campaign`, `landing` (retry without properties if the
audience lacks them; "already exists" is success), then sends a one-line welcome from a
verified OM address with `utm_source=newsletter&utm_medium=email&utm_campaign=welcome` links.
Why this over a direct Edge Function: it is the pattern already deployed, supabase-js handles
CORS, the list is owned in Postgres and not only in Resend, duplicates are a unique violation
(shown as success), the form returns before any email is sent, and a failed Resend call leaves
a row to retry. `src/lib/newsletter.ts` (`subscribe()` returns ok | duplicate | error; a
filled honeypot returns ok without inserting) and one `NewsletterForm` component used on
`/newsletter`, `/links`, the footer or homepage band, and under every guide's CTA. Manual
steps (run the SQL, deploy the function, create the webhook and secrets) are listed in the
PR. Terms and Privacy exist before the form goes live.

### Attribution and analytics
Port Tulsa's `lib/attribution.ts` as `src/lib/attribution.ts` (sessionStorage key
`om_attribution`, first touch wins; defaults when no tags arrive: `/links` is
`tiktok / social / bio`, `/pay` is `tiktok / social / live`, since TikTok strips referrers),
mounted once from a client `Attribution` component in the layout. `src/lib/analytics.ts`
wraps the inline gtag (guard `window.gtag`): `book_click {tier, mode}`, `pay_tap {label,
campaign}`, `newsletter_signup {campaign, source}`, `review_submit {rating}`, `social_tap
{label}`, `guide_cta {slug, href}`, `link_tap {label}`. Server components keep their anchors
by swapping in a small client `TrackedLink`. GA4 needs the params registered as custom
dimensions and `book_click`, `pay_tap`, `newsletter_signup` marked as key events (manual).
UTM conventions: TikTok bio
`https://ordinarymysticreadings.com/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`;
Service+ messages `/pay?utm_source=tiktok&utm_medium=social&utm_campaign=live`; newsletter
links `utm_source=newsletter&utm_medium=email&utm_campaign=<send-slug>`; never on internal
links (that starts a new GA session). Stripe Payment Links cannot carry UTMs through checkout;
`book_click` is the conversion proxy until the roadmap's Stripe webhook exists.

### `llms.txt`, robots, headers, `/links`
`public/llms.txt`: the practice, the person, the three wings, the readings with prices and the
three stream sizes' canonical `explain` text, the page list, the guide list, the Tulsa
sub-brand line. Prices must be literal in a static file, so `scripts/check-llms-txt.mjs`
(wired into `prebuild`) reads the prices from `offerings.ts` and every guide slug from
`content/guides` and fails the build if `llms.txt` is out of date; that keeps the "no price
outside offerings.ts" rule honest. `robots.ts`: allow all plus explicit allow lines for
GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot;
no Disallow on the noindex pages (a crawler can only honor `noindex` on a page it may fetch).
`vercel.json`: security headers (`X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Frame-Options`), `X-Robots-Tag: noindex` on `/pay`, `/links`,
`/admin`, and the `/blog` redirects. `/links` (noindex, canonical itself, out of the
registry): single `max-w-md` column like `/pay`.

## Part 4: Content, and how each piece feeds the site, the list and bookings

### Guides (clients and students)
- **Ported (20)**, in three batches so `/guides` never appears as a dump: technique (court cards,
  reversals, one card, what a deck is for, reading for yourself, tarot journal, how to get
  started), birth chart basics (how to read a chart, houses, why birth time, modalities, sun
  signs, natal retrogrades, the two malefics, the last degree, the long arrivals, the
  conjunction at zero), and the two season forecasts plus "the scale is going to tip" refreshed
  with a current Updated line or left dated and moved under an "Archive" kicker.
- **New (5), one Opus prompt each, in this order**: What a recorded tarot reading is and who it
  is for; What an online tarot reading costs (our prices, the platforms' per-minute math,
  Etsy's range, all stated plainly); Recorded, live, or written: which to book; How to choose
  an online tarot reader; Asking a question the cards can answer. Each: answer in the first 60
  words, H2s as questions, a visible FAQ, the newsletter form, the recorded CTA.
- Every guide ends with the same two things: the newsletter form and a CTA to the readings
  page it serves. That is how a guide feeds the list and the bookings.

### Lessons (readers), from the Tulsa build
Source material: the Tulsa plan, `CLAUDE.md`, `OFFSITE-CHECKLIST.md`, the git log, the arcana
series rules. Rules: craft, tooling and practice only; never a client, a host, a venue's private
details, a booking, or a reading; the Tulsa brand is "my local practice" throughout; published
after the fact, never while a decision is live (the Google appeal lesson waits until it is
resolved). First three, in order:
1. One registry, one sitemap: how I stopped pages existing outside the map (routes registry,
   noindex vs Disallow, the calling-card page).
2. A card on the table: the QR calling card, the pay page, and first-touch attribution for a
   reader who works events.
3. Pricing a reading by the card: one card, three cards, a full spread, and why the dollar
   tier is wallets-only (reuses the three canonical `explain` paragraphs from `offerings.ts`).
Later: writing city pages that are not doorway pages; a 22-card series as a release schedule;
what a directory listing needs from a reader; running a drawing from a newsletter segment.

### Channels (OM owns TikTok and YouTube; TTR owns Instagram and Facebook)
Four pillars, each with one consistent visual treatment and one destination:
| Pillar | What it is | Destination |
|---|---|---|
| Readings in practice | Sample pulls, "the question behind the question", what a recorded walkthrough looks like (60 seconds of a real synthesis, client anonymised and consenting) | `/readings/recorded` |
| Astrology now | This week's transit, season openers, the forecast guides as talking-head videos | the matching guide, then the astrology page |
| Craft | Reader-facing: how I prepare a recorded reading, Querent, the Notion tools, a lesson | `/for-readers` |
| Proof and practice | A testimonial read aloud, behind the scenes, live announcements | `/testimonials`, `/pay` |

Sustainable cadence for one person on a week-on, week-off schedule: on an off week, batch
four TikToks and one YouTube video; every week, one TikTok live (the `/pay` flow) and two
posted TikToks; every two weeks, one YouTube video (a guide as a video, or the sample
walkthrough); twice a month, a newsletter (one guide, one transit note, one line about
booking). YouTube is not optional: it is the top brand-mention signal for AI answers and the
guides are already the scripts. TikTok Lives carry `/pay` in the bio and in Service+ messages
only, never on screen.

Instagram, when it opens for the reader wing: 3:4 tiles at 1080 x 1350, strict alternation
photograph / designed tile, each pillar one tile treatment (a single background colour per
pillar, one type style), photographs between them are the practice (deck, table, hands,
Tulsa), previewed in a planner before posting so the alternation holds as posts shift.

### Where the 3,000 TikTok followers go
The bio link is `/links`. Order on the page: Pay for your live reading (`/pay`), Book a
recorded reading, Newsletter (the form inline), Free tools (Querent, the digital deck), Tulsa
Tarot Reader (in person). A pinned TikTok explains the recorded reading in 30 seconds and says
"link in bio". The list is the asset; TikTok is rented.

## Part 5: Off-site for an online practice (Tyler's checklist, below)
Search Console and Bing (ChatGPT reads Bing); YouTube channel About and links section;
Trustpilot profile as the public review surface (free; the testimonial thank-you asks for it);
the on-site reviews stay the primary flow and feed the readings pages, `/testimonials`, the
newsletter and TikTok; Gumroad and GitHub profiles named consistently; Reddit account in the
brand name that answers questions on r/tarot and r/astrology without links in posts (profile
carries the site); optional Etsy listing; Facebook placeholder Page; Nextdoor no (local, TTR's).
OM clients asked for a Google review review the Tulsa profile, describing an online reading
with Tyler, as already agreed.

## Part 6: Structural ties to the sister brand
- **Person**: OM's `Person` (`/about#tyler-martin`, full name) is the canonical node. TTR's
  `Person` stays `name: "Tyler"` and adds `sameAs: https://ordinarymysticreadings.com/about`.
  OM's Person `sameAs` includes `https://tulsatarotreader.com/about`. The surname never
  appears on a TTR page; the link is by URL only.
- **Organization**: OM `Organization` lists TTR as `subOrganization`; TTR's `ProfessionalService`
  gains `parentOrganization: { "@id": "https://ordinarymysticreadings.com/#organization" }`
  and its footer sentence becomes "the in-person side of Ordinary Mystic". Queued in TTR's
  checklist; Tyler triggers it there.
- **Resend**: one account (OM's), one audience, `brand` property (`om` | `ttr`), saved segments
  "Tulsa" and "Ordinary Mystic". TTR's `/api/subscribe` switches to the shared key and sends
  `brand: "ttr"`. Welcome emails stay per brand.

## Work packages (each is a self-contained prompt; run in order within a phase)

Common rules in every prompt: read `CLAUDE.md` and `plans/product-roadmap.md` first; static
export, no server code; prices only from `offerings.ts`; no em dashes anywhere (grep before
commit); ask every question in one message up front, proceed on the stated defaults if Tyler
says "go"; `npm run build` passes; commit on the named branch; never merge or push.

**WP-0 Merge `/pay`** (Fable). Review `pay-page` against `tiktok-landing`, build, check the
two Payment Links redirect to `/pay?paid=1`, fast-forward, push.

**WP-0b Hotfix the 404 pages** (Sonnet, branch `fix-params`, ships alone). In
`src/app/blog/[slug]/page.tsx` and `src/app/tools/[slug]/page.tsx`, type `params` as a
`Promise` and `await` it in both `generateMetadata` and the page. Verify: `npm run build`,
then `grep -L "This page could not be found" out/tools/*.html` lists every tool page and
`grep -o '<h1[^>]*>[^<]*' out/tools/everyday-checkin-notion-dashboard.html` shows the title.

**WP-1 Hygiene and plumbing** (Sonnet, branch `seo-hygiene`). Delete `/login` and
`/account/*` (hard 404 is the right signal; Phase 1 rebuilds them); `NOINDEX` metadata on
`/book/thanks/*`, `/thank-you`, `/resources` (keep `/book` and `/resources` for old inbound
links); `/terms` and `/privacy` (short real text: Stripe handles payment, Supabase stores
reviews and subscribers, Resend sends email, GA4 analytics; Tyler approves); homepage title
under 60 characters; `src/lib/routes.ts` + `src/lib/metadata.ts` (`pageMetadata()` always
emits canonical, full `openGraph`, `twitter`; `OG_DEFAULT` image, a stopgap 1200 x 630 made
from `profile-img.png` on the brand gradient, proper image as a follow-up) + sitemap from the
registry with `lastModified`; root layout gains canonical, images, `twitter`, `googleBot`;
every registered page converts to `pageMetadata`; footer extracted to `SiteFooter`;
`structured-data.tsx` with Organization, Person (headshot path supplied), WebSite, Service
components replacing the inline Tulsa-page objects; visible breadcrumbs plus
`BreadcrumbSchema`; `public/llms.txt` plus the prebuild check; `robots.ts` AI rules;
`vercel.json` headers and `X-Robots-Tag`. Verify: build; `<loc>` count in `out/sitemap.xml`
equals `routes.length` and every entry has `lastmod`; no `out/login.html` or
`out/account.html`; every registered page has its own canonical and `og:url`; `noindex` on
`out/pay.html`, `out/thank-you.html`, `out/book/thanks/*.html`, `out/resources.html`;
`grep -rn "openGraph: {" src/app` returns nothing outside `metadata.ts`; the homepage graph's
`@id` references resolve in the Schema Markup Validator; Rich Results test on `/`; no em
dashes.

**WP-2 Guides engine and the port** (Sonnet, branch `guides`). `content/guides/`,
`GuideFrontmatter`, sync `listGuides()`, `remark-gfm`, the build-time check, `/guides` index
(by category, "Updated Month Year", reading time), `/guides/[slug]` (breadcrumbs, Updated and
Published lines, body, visible FAQ if present, `GuideCta` from the `cta*` fields with defaults,
author box ported from main with the name "Tyler Martin", `ArticleSchema`, newsletter slot as a
placeholder until WP-4), delete `src/app/blog/` and `content/blog/`, `vercel.json` redirects
for `/blog` and `/blog/:slug`. Port the 20 essays and the four featured images from
`origin/main` with the link and CTA rewrites in Part 3. Verify: no `src/app/blog` or
`content/blog`; `ls content/guides | wc -l` is 22; `grep -rn "](/blog" content/guides` is
empty; `<table` appears in `out/guides/taurus-season-26.html`; each guide has one Article node
whose `author` is the Person `@id`; no `/blog/` in the sitemap; after deploy,
`curl -sI .../blog/clear-questions-grounded-tarot` shows a 308 to `/guides/...`.

**WP-3 About, FAQ, readings pages, nav, footer, homepage hub** (Opus, branch `core-pages`).
`/about` (full name, headshot, three years, Tulsa, the two brands in one paragraph, the three
wings, FAQ teaser), `/faq` (every question, grouped, FAQPage schema), `/readings`,
`/readings/recorded`, `/readings/live`, `/readings/astrology` (Service + Offer from
`offerings.ts`; the recorded page per Part 2), `/testimonials`, new `SiteNav` and
`SiteFooter` components (footer out of the layout), homepage rebuilt as a hub with anchors
`#book`, `#live`, `#reviews` kept working. Copy in typed modules under `src/lib/content/`
(one file per page), prices imported never retyped. Humanizer pass on all copy. Verify: build,
every new route in the registry and sitemap, canonical on each page is itself, Rich Results
on `/readings/recorded` and `/faq`, `grep` for `$35|$65|$125|$40|$100|$195` outside
`offerings.ts` returns nothing.

**WP-4 Attribution, analytics, `/links`** (Sonnet, branch `links`). `src/lib/attribution.ts`
+ `Attribution` mount, `src/lib/analytics.ts`, `TrackedLink`, events wired on the booking
buttons, `/pay` buttons (`paid=1` fires `pay_paid`), footer socials, the review form, and the
guide CTA; `/links` per Part 4 (noindex, out of the registry, `link_tap`). Runs before the
newsletter because the form consumes attribution. Verify: build; in GA4 DebugView a book
click, a pay tap, a review submit and a link tap each arrive with their params;
`sessionStorage.om_attribution` is set on landing at `/links?utm_source=tiktok...` and
unchanged after navigating to `/`; `noindex` in `out/links.html`; `/links` absent from the
sitemap.

**WP-5 Newsletter** (Sonnet, branch `newsletter`). `supabase/subscribers.sql`,
`supabase/functions/subscribe-welcome/index.ts` with its welcome template, `src/lib/newsletter.ts`,
`NewsletterForm`, `/newsletter` page, the form on `/links`, the footer or homepage band, and
the guide slot; `newsletter_signup` event; welcome text supplied by Tyler or drafted plain;
the manual Supabase and Resend steps listed in the PR. Verify: on the deployed site a test
signup creates the row, the Resend contact with `brand: "om"` and the right `source`, and one
welcome email; a second signup shows success with no second row and no email; a filled
honeypot inserts nothing; 31 rapid inserts by SQL trip the trigger.

**WP-6 New recorded-reading guides** (Opus, one branch and one prompt per guide, in the Part 4
order). Each prompt carries the query list, the first-60-words rule, the FAQ, and the CTA.

**WP-7 For Readers page and the first lesson** (Opus, branch `for-readers`). `/for-readers`,
`content/lessons/`, `/for-readers/lessons/[slug]` on the guides engine with the "Lessons"
kicker, lesson 1 written from the Tulsa sources under the rules in Part 4, `/tools` moved under
the wing in nav and breadcrumbs, the `learn` route reserved in the registry as unpublished.
Verify: the lesson names no client, host or venue detail; grep for surnames other than the
reader's returns nothing.

**WP-8 CLAUDE.md and README** (Sonnet, small). Route list, the three wings, the guides and
lessons rules, the schema map, the newsletter, the analytics events, the no-em-dash grep, the
"main is archived source material" note, the stale GitHub Pages workflow removed.

**Tulsa side** (queued in TTR's checklist, Tyler triggers): `parentOrganization`, Person
`sameAs`, footer sentence, Resend key switch and `brand: "ttr"`.

### Phasing
| Phase | When | Packages |
|---|---|---|
| 0 | this week | WP-0, WP-0b, WP-1, Search Console + Bing, YouTube About |
| 1 | weeks 1 to 2 | WP-2, WP-3 |
| 2 | weeks 2 to 4 | WP-4, WP-5, WP-6 guides one and two, Trustpilot, `/links` in the TikTok bio |
| 3 | weeks 4 to 8 | WP-6 guides three to five (one a week), WP-7, WP-8, first YouTube videos |
| ongoing | | one new guide or lesson every two weeks, refresh Updated dates only when copy changes, monthly AI citation log |

## Tyler's checklist (outside the repo)

Identity, character for character: `Ordinary Mystic` (alternate: Ordinary Mystic Readings) ·
`Tyler Martin` · `ordinarymysticreadings@gmail.com` (or a domain address once Resend sends from
it) · `https://ordinarymysticreadings.com` · online, United States · handles `ordinarymysticreadings`.

Now
- [ ] Recorded-reading facts for WP-3: turnaround in business days, delivery mechanism (private
      YouTube link, Dropbox, email), how the question is collected today.
- [ ] Headshot for `/about` (face allowed here) and a square version for schema and `/links`.
- [ ] Terms and Privacy text, or approve plain boilerplate.
- [ ] Google Search Console: domain property, submit `/sitemap.xml`, request indexing on `/`
      after WP-1 so the stale snapshot refreshes.
- [ ] Bing Webmaster Tools: import from Search Console.
- [ ] GA4: mark `book_click`, `pay_tap`, `newsletter_signup` as key events after WP-1 and WP-4.
- [ ] Resend: verify `tulsatarotreader.com` on OM's account; create the `brand`, `source`,
      `campaign`, `landing` properties; save the two segments. Give the TTR session the go.
- [ ] Set the existing OM Instagram to private (or leave dormant with the `/links` URL in the bio).
- [ ] Create the Facebook placeholder Page (complete profile, website with UTM, no posting).

After WP-5
- [ ] TikTok bio link to `/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`;
      pinned video explaining the recorded reading.
- [ ] YouTube: channel About with the description, links to `/readings/recorded`, `/about`,
      `/newsletter`; first video is the recorded-reading explainer.
- [ ] Trustpilot: claim the free profile; add the link to the review thank-you and the welcome email.
- [ ] Reddit: brand account, profile links the site, answer threads on r/tarot and r/astrology
      without posting links.
- [ ] Optional: one Etsy listing for the 30-minute recorded reading at $65, linking to the site.
- [ ] Gumroad and GitHub profile descriptions match the identity line.

Monthly
- [ ] Ask ChatGPT, Google AI Mode and Claude "where can I get a good recorded tarot reading
      online" and "best online tarot reader for a video reading"; log the sources cited.
- [ ] One newsletter per two weeks, one YouTube video per two weeks, the TikTok cadence above.

## Verification (Fable, per merge)
- `npm run build` on the branch; `npx serve out` and curl the built HTML.
- `grep -rnP "\x{2014}" src content public/llms.txt` (the em dash) returns nothing.
- `grep -rnE '\$(35|65|125|40|100|195)\b' src --include=*.ts --include=*.tsx | grep -v offerings.ts` returns nothing.
- `out/sitemap.xml`: no `/login`, `/account`, `/blog/`, `/pay`, `/links`, `/admin`; every
  entry has `lastmod`; `<loc>` count equals `routes.length`.
- `grep -L "This page could not be found" out/tools/*.html out/guides/*.html` lists every
  file (no page silently prerendered as the 404).
- `grep -o '"price":"[0-9]*"' out/readings/recorded.html | sort -u` matches `RECORDED` exactly;
  `grep -c AggregateRating out/index.html` is 0; `FAQPage` appears in `out/faq.html` only.
- Each new page: `<link rel="canonical">` is its own URL; one `BreadcrumbList`; the title is
  under 60 characters with the template.
- Rich Results test on `/`, `/about`, `/readings/recorded`, `/faq`, one guide, one lesson.
- `/pay`, `/links`, `/admin` return `X-Robots-Tag: noindex` from Vercel and carry the meta tag.
- Newsletter: a test signup appears in Resend with `brand: om`; a second signup with the same
  address returns success and sends nothing.
- GA4 DebugView shows `book_click`, `pay_tap`, `newsletter_signup`, `link_tap`.
- Production curl after each deploy: `/`, `/readings/recorded`, `/about`, `/guides`, one guide.
- Search Console: request indexing on each new page the day it ships (about ten a day).
