# WP-1: SEO hygiene and plumbing

Model: Sonnet. Branch: `seo-hygiene` from `tiktok-landing` (after `fix-params` has merged).
No new marketing pages in this package: it is the registry, the metadata helper, the schema
graph, the cleanup, and the files search engines and AI crawlers read. About, FAQ and the
readings pages come in WP-3 and will register themselves in what you build here.

## Read first
- `CLAUDE.md` and `plans/product-roadmap.md` (static export, no server code; prices and
  Stripe links only in `src/lib/offerings.ts`; production branch `tiktok-landing`)
- `plans/om-seo-plan.md`, sections "Part 1", "Part 3" and "WP-1" (the design you are building)
- `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/config.ts`,
  `src/lib/offerings.ts`, `src/lib/content.ts`
- `src/app/tulsa-tarot-reading/page.tsx` and `src/app/tulsa-astrology-reading/page.tsx`
  (inline `Service` schema you will replace)
- `src/app/page.tsx`, `src/components/booking-section.tsx`, `src/components/site-header.tsx`
- The sister repo's versions of what you are porting, for shape only (that site runs on a
  server; ours cannot):
  `C:/Users/tyler/Documents/My Files/03. Efforts/Code/tulsa-tarot/lib/routes.ts`,
  `lib/metadata.ts`, `components/StructuredData.tsx`, `public/llms.txt`
- Next docs in `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
  (metadata merges shallowly: a page that sets part of `openGraph` loses the rest)

## Questions (ask all of these in one message, then wait; if Tyler says "go", use the defaults)
1. Headshot: is there a file to use for the Person schema image now? Default: use
   `/images/profile-img.png` and leave a `TODO headshot` comment; WP-3 swaps it.
2. Terms and Privacy: draft plain boilerplate for review, or is text supplied? Default: draft
   plain, short, factual text (Stripe handles payment, Supabase stores testimonials and, later,
   newsletter subscribers, Resend sends email, Google Analytics 4 measures traffic, no accounts,
   readings are not medical, legal or financial advice). No "cute" copy.
3. OG default image: generate a stopgap 1200 x 630 PNG (profile image centered on the
   `#151326` to `#213752` gradient) or wait for a designed one? Default: generate the stopgap
   with a small Node script using `sharp` if it installs cleanly, otherwise commit a plain
   gradient PNG and note it.
4. Social profiles for `sameAs`: TikTok and YouTube are in the code. Any others to include now
   (Gumroad `ordinarymystic.gumroad.com`, GitHub)? Default: TikTok, YouTube, Gumroad.

## Build, in this order

### 1. Delete the placeholders, noindex the utility pages
- Delete `src/app/login/`, `src/app/account/` (all three pages). A hard 404 is correct; the
  roadmap rebuilds them behind auth later.
- Add `robots: { index: false, follow: false }` metadata to `src/app/thank-you/page.tsx`,
  the three `src/app/book/thanks/*/page.tsx`, and `src/app/resources/page.tsx` (it is a
  `"use client"` page with no metadata; give it a `layout.tsx` or convert the redirect so it
  can export metadata). Keep `/book` and `/resources` working for old inbound links.
- `/pay` and `/admin` already carry noindex. Leave them.

### 2. `src/lib/routes.ts` and `src/lib/metadata.ts`
```ts
export type RouteEntry = {
  path: string; label: string; title: string; description: string;
  priority: number; changeFrequency: "weekly" | "monthly" | "yearly";
  updated: string;                  // ISO date, hand-maintained; bump when content changes
  parent?: string;                  // breadcrumb parent, walks back to "/"
  absoluteTitle?: boolean;          // skip the " | Ordinary Mystic" suffix
  audience: "clients" | "students" | "readers" | "all";
};
export const routes: RouteEntry[];
export function getRoute(path: string): RouteEntry;   // throws for an unregistered path
```
Register: `/` (1.0), `/tools` (0.7), `/tulsa-tarot-reading` and `/tulsa-astrology-reading`
(0.7), `/terms` and `/privacy` (0.3, yearly), `/blog` (0.5, until WP-2 replaces it), plus
derived entries for `/tools/[slug]` from `getAllTools()` and `/blog/[slug]` from
`getAllBlogPosts()` (WP-2 swaps blog for guides). Index pages take `updated` = the newest
child. Never register `/pay`, `/links`, `/admin`, `/book`, `/resources`, the thanks pages.
`routes.ts` reads the filesystem through `content.ts`, so no client component may import it.

`pageMetadata(path, overrides?: { image?, article?: { publishedTime, modifiedTime } })`
returns `title` (absolute when flagged), `description`, `alternates.canonical: path`, the
whole `openGraph` block (type, locale, url `SITE_URL + path`, siteName, title, description,
images `[OG_DEFAULT]`) and the whole `twitter` block. Export `NOINDEX` for the utility pages.
Convert every registered page to `export const metadata = pageMetadata("/path")`
(`generateMetadata` for the two dynamic routes). Root layout: add `alternates.canonical: "/"`,
`openGraph.images`, `twitter`, and a `robots.googleBot` block; shorten the default title to
`Ordinary Mystic | Tarot and Astrology Readings` (under 60 characters with nothing appended)
and the homepage title to something under 60 characters total.

Rewrite `src/app/sitemap.ts` as `routes.map(...)` with `lastModified: route.updated`.

### 3. Footer and breadcrumbs
- Move the inline footer from `layout.tsx` into `src/components/site-footer.tsx` (server
  component). Add links to `/tools`, `/terms`, `/privacy` (now real) and keep the Tulsa
  Tarot Reader line and the socials. `/terms` and `/privacy` are new plain pages under
  `src/app/terms/page.tsx` and `src/app/privacy/page.tsx`, registered.
- `src/components/breadcrumbs.tsx`: a visible breadcrumb nav plus `BreadcrumbSchema`, both
  driven by `parent` links from the registry. Render on every registered page except `/`.

### 4. `src/components/structured-data.tsx`
One `JsonLd` helper that escapes `<` as `\u003c`. Constants:
`ORG_ID = ${SITE_URL}/#organization`, `WEBSITE_ID = ${SITE_URL}/#website`,
`PERSON_ID = ${SITE_URL}/about#tyler-martin`, `TULSA_ID = https://tulsatarotreader.com/#business`.
- `StructuredData()` in the root layout: `Organization` (name "Ordinary Mystic", alternateName
  "Ordinary Mystic Readings", url, logo `/images/profile-img.png`, email `CONTACT_EMAIL`,
  `sameAs` from a new `SOCIALS` list in `config.ts` with empty values omitted, `founder`
  `{ "@id": PERSON_ID }`, `subOrganization` `{ "@type": "ProfessionalService", "@id": TULSA_ID,
  name: "Tulsa Tarot Reader", url: TULSA_TAROT_READER_URL }`; no address, no city `areaServed`),
  `Person` (`@id` PERSON_ID, name "Tyler Martin", alternateName "Ordinary Mystic", jobTitle
  "Tarot and astrology reader", url `${SITE_URL}/about`, image, `worksFor` the org, `sameAs`
  the same list plus `https://tulsatarotreader.com/about`), `WebSite` (`publisher` the org,
  `inLanguage` en-US, no `SearchAction`). `/about` does not exist until WP-3; the `@id` is a
  URL fragment and does not need to resolve today.
- `ReadingServiceSchema({ kind: "recorded" | "live" })`: `Service` with `@id`
  `${SITE_URL}/#service-recorded|live`, name from `RECORDED_COPY.title` / `LIVE_COPY.title`,
  description the `lede`, `serviceType` "Tarot and astrology reading", `provider`
  `{ "@id": ORG_ID }`, `areaServed` Country US, `availableChannel.serviceUrl`
  `${SITE_URL}/#book`, `serviceOutput` for recorded only, and `offers` mapped from `RECORDED`
  / `LIVE` (`Offer`: name `${minutes}-minute ${kind} reading`, price as a string,
  priceCurrency USD, url the Stripe link or `/#book`, availability InStock). Never retype a
  price. Render both on `/`; replace the inline objects on the two Tulsa pages with these.
- No `AggregateRating`, no `Review`, no `FAQPage` in this package.

### 5. `public/llms.txt` and its check
Write `public/llms.txt` in the sister site's shape: one line on the practice, the person, the
three wings (clients, students later, readers), Services with the six reading prices and the
three live-stream sizes using the `explain` text from `LIVE_STREAM`, Pages with one line each,
the Tulsa sub-brand line, contact. Add `scripts/check-llms-txt.mjs`, wired as `"prebuild"` in
`package.json`, that reads every `price:` from `offerings.ts` with a regex and every tool slug
from `content/tools`, and exits non-zero naming what is missing from `llms.txt`. (WP-2 extends
it to guide slugs.)

### 6. `robots.ts` and `vercel.json`
- `robots.ts`: `{ userAgent: "*", allow: "/" }` plus an explicit allow rule for `GPTBot`,
  `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`,
  `CCBot`. No `disallow` for the noindex pages, with a comment saying why (a crawler can only
  honor `noindex` on a page it is allowed to fetch).
- `vercel.json` (new): `headers` for every path (`X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`) and
  `X-Robots-Tag: noindex, nofollow` on `/pay`, `/admin`, `/links`. Leave `redirects` out; WP-2
  adds the `/blog` ones.

### 7. `CLAUDE.md`
Add short sections: the registry rule ("every indexable page is registered in
`src/lib/routes.ts` and gets its metadata from `pageMetadata()`; never hand-write `openGraph`
in a page"), the schema map, the `llms.txt` check, and the noindex list. Keep it brief; WP-8
does the full rewrite.

## Verify (paste the output in your summary)
```bash
npm run build
test ! -e out/login.html && test ! -e out/account.html && echo "placeholders gone"
grep -c "<loc>" out/sitemap.xml; grep -c "<lastmod>" out/sitemap.xml   # equal, and equal to routes.length
for f in out/*.html out/tools/*.html out/blog/*.html; do grep -q 'rel="canonical"' "$f" || echo "no canonical: $f"; done
grep -o 'og:url" content="[^"]*"' out/tulsa-tarot-reading.html        # that page, not the homepage
grep -c 'name="robots" content="noindex' out/pay.html out/thank-you.html out/book/thanks/live.html out/resources.html   # 1 each
grep -rn "openGraph: {" src/app --include=*.tsx                        # nothing
grep -o '"@id":"[^"]*"' out/index.html | sort -u                       # #organization, #website, about#tyler-martin, #service-recorded, #service-live, tulsatarotreader.com/#business
grep -o '"price":"[0-9]*"' out/index.html | sort -u                    # exactly the six prices in offerings.ts
grep -c AggregateRating out/index.html                                 # 0
grep -o '<title>[^<]*' out/index.html | wc -c                          # under 70 (60 characters plus the tag)
grep -rnP "\x{2014}" src public/llms.txt vercel.json CLAUDE.md         # nothing (no em dashes)
node scripts/check-llms-txt.mjs && echo "llms ok"
```
Then paste `out/index.html` into https://validator.schema.org and confirm every `@id`
reference resolves and there are no errors.

## Commit
Small commits on `seo-hygiene` as you go (cleanup, registry and metadata, footer and
breadcrumbs, schema, llms and robots, CLAUDE.md). No em dashes in messages. Do not merge or
push. Reply with the verification output, the list of files changed, and anything you
deviated from and why.
