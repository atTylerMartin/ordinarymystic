# WP-2: Guides engine and the port of the twenty essays

Model: Sonnet. Branch: `guides` from `tiktok-landing` (WP-1 is merged; the registry,
`pageMetadata()`, the schema graph, breadcrumbs, `llms.txt` and its check all exist).
This package replaces `/blog` with `/guides`, ports twenty essays from the archived `main`
branch, and deletes the twenty-eight filler posts.

## Read first
- `CLAUDE.md` (static export, no server code; prices only in `src/lib/offerings.ts`;
  the registry rule; production branch `tiktok-landing`)
- `plans/om-seo-plan.md`, sections "Content engine", "Schema graph", "Part 4: Guides",
  and "WP-2"
- `src/lib/routes.ts`, `src/lib/metadata.ts`, `src/lib/content.ts`,
  `src/components/structured-data.tsx`, `src/components/breadcrumbs.tsx`
- `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` (what you are replacing)
- `scripts/check-llms-txt.mjs`, `public/llms.txt`
- The source essays, read-only from git: `git show origin/main:src/content/blog/<slug>.md`
  and `git show origin/main:src/data/authors.ts`. Never check out or merge `main`.
- The sister repo's guide meta line, for the "Updated" format only:
  `C:/Users/tyler/Documents/My Files/03. Efforts/Code/tulsa-tarot/components/sections/guides/GuideMeta.tsx`

## Questions (ask all in one message, then wait; on "go" use the defaults)
1. The two 250-word production posts (`clear-questions-grounded-tarot`,
   `astrology-without-horoscopes`): port them as guides or drop them? Default: drop; they are
   thin and the twenty essays cover the ground. Delete with the filler.
2. The two season forecasts (`aries-season-26`, `taurus-season-26`) are dated content. Keep
   them as guides under an "Archive" kicker with their original dates, or drop? Default:
   keep, kicker "Season archive", no Updated bump.
3. Featured images: four essays have one under `public/images/featured/` on `main`. Copy
   those four and let the rest use `OG_DEFAULT`, or generate placeholders? Default: copy
   the four, the rest fall back to `OG_DEFAULT`; no placeholder art.

## Build, in this order

### 1. Content engine (`src/lib/content.ts`)
- Add `npm i remark-gfm@^4` and use it in the remark chain (two essays have markdown tables).
- Replace the blog types and functions with guides:
```ts
export type GuideFrontmatter = {
  title: string; date: string; updated: string; description: string;
  category: "tarot" | "astrology" | "general-spirituality";
  kicker?: string;                 // e.g. "Season archive"; defaults to the category label
  subcategory?: string; tags?: string[];
  planets?: string[]; signs?: string[]; houses?: string[]; cards?: string[];  // keywords only
  image?: string; imageAlt?: string;
  ctaEyebrow?: string; ctaTitle?: string; ctaBody?: string; ctaLabel?: string; ctaUrl?: string;
  faq?: { question: string; answer: string }[];   // rendered visibly, never as schema
  sources?: string[];
  wing: "guides" | "lessons";      // lessons come in WP-7; the engine supports both now
};
export type Guide = { slug: string; frontmatter: GuideFrontmatter; readingMinutes: number };
export function listGuides(wing?: "guides" | "lessons"): Guide[];   // sync, gray-matter only, sorted by updated desc
export async function getGuide(slug: string): Promise<Guide & { contentHtml: string }>;
```
- `listGuides` is synchronous so `routes.ts` can build at import time (the same reason
  `getAllToolsSync` exists). Content lives in `content/guides/*.md` and `content/lessons/*.md`
  (create the lessons folder with a `.gitkeep`).
- `readingMinutes` = body words / 220, rounded up, computed, never typed.
- A `validateGuide(slug, data, body)` function throws at build with the slug and the reason
  when: title, date, updated or description is missing; a date is not `YYYY-MM-DD`;
  `updated < date`; the body is under 300 words; the body or frontmatter contains an em
  dash (U+2014). This is the only content check; do not add a CMS.

### 2. Routes
In `src/lib/routes.ts`, replace the `/blog` static entry and `blogRoutes` with:
- `/guides` (label "Guides", title "Guides to Tarot and Astrology", priority 0.7, weekly,
  `updated` = newest guide `updated`, audience "students", parent "/").
- One entry per guide: path `/guides/<slug>`, label and title from the frontmatter,
  priority 0.6, monthly, `updated` from the frontmatter, parent "/guides", audience "students".
- Reserve nothing for lessons yet; WP-7 adds `/for-readers`.

### 3. Pages and components
- `src/app/guides/page.tsx`: `pageMetadata("/guides")`, breadcrumbs, a short intro, then
  cards grouped by category (Tarot, Astrology, Getting started; the season archive last),
  each card: kicker, title, description, "Updated Month Year · N min read".
- `src/app/guides/[slug]/page.tsx`: `params` is a Promise; `generateStaticParams` from
  `listGuides("guides")`; `generateMetadata` = `pageMetadata("/guides/"+slug, { article:
  { publishedTime: fm.date, modifiedTime: fm.updated }, image })` where `image` is the
  frontmatter image as an `OG_DEFAULT`-shaped object when present. Renders: `Breadcrumbs`,
  kicker, H1, description, the meta line (`<time dateTime={fm.updated}>Updated Month Year</time>`
  and a smaller "Published Month Year" when the two differ, plus reading time), featured
  image if any, the body, the visible FAQ if any, `GuideCta`, `AuthorBox`, `ArticleSchema`.
  Format dates with `toLocaleDateString("en-US", { month: "long", year: "numeric",
  timeZone: "UTC" })`; the `timeZone` prevents a one-day shift at build.
- `src/components/guide-cta.tsx`: reads the five `cta*` fields with defaults (eyebrow
  "Want a personal reading?", title "Book a recorded reading", body one sentence from
  `RECORDED_COPY` in `offerings.ts`, label `RECORDED_COPY.cta`, url `/#book`). No UTM on
  internal links. WP-3 later points the default at `/readings/recorded`.
- `src/components/author-box.tsx` and `src/data/authors.ts`: port from `main`, name
  "Tyler Martin", the description trimmed to two sentences, image `/images/profile-img.png`
  (a `TODO headshot` comment), no socials list (the Person schema carries `sameAs`).
- `ArticleSchema({ guide })` in `src/components/structured-data.tsx`: `@type` "Article",
  `@id` `${url}#article`, headline, description, `datePublished` = date, `dateModified` =
  updated, `author: { "@id": PERSON_ID }`, `publisher: { "@id": ORG_ID }`,
  `mainEntityOfPage` the url, `image` absolute (frontmatter image or `OG_DEFAULT`),
  `keywords` from tags plus planets/signs/houses/cards, `articleSection` the category.
  No `FAQPage` anywhere in guides.
- Delete `src/app/blog/` entirely. Delete `content/blog/` entirely (all thirty files).
- `vercel.json`: add
  `"redirects": [{ "source": "/blog", "destination": "/guides", "permanent": true },
  { "source": "/blog/:slug", "destination": "/guides/:slug", "permanent": true }]`.
  The platform applies these in front of the static files; this is not a Next server feature.
- Update the footer link and any `/blog` reference in `src/` (grep) to `/guides`.

### 4. The port
For each of the twenty slugs below, `git show origin/main:src/content/blog/<slug>.md >
content/guides/<slug>.md`, then apply these rewrites and check them with grep:
- Add `updated:` using the dates in the table; keep `date:` as is. Add `wing: guides`.
- Drop `author:` (the author box is fixed) and `subcategory:` unless it is useful as a kicker.
- Links: `](/blog/<slug>)` becomes `](/guides/<slug>)`. `](/blog/planets/saturn)` and
  `](/blog/planets/jupiter)` (taxonomy pages that will not exist) become plain text with the
  link removed. `](/blog/how-to-get-started-with-astrology)` (broken on `main` too) becomes
  `](/guides/how-to-get-started)`. `](/book)`, `](/tools)` and `](/tulsa-tarot-reading)` stay.
- CTAs: every `ctaUrl` becomes `/#book`; `ctaTitle` "Book a tarot reading in Tulsa" becomes
  "Book a recorded reading"; `ctaBody` that mentions Tulsa or in person is rewritten to one
  sentence about a recorded reading (prepared privately, a video walkthrough plus a written
  synthesis). Astrology essays get `ctaTitle` "Book an astrology reading". No prices in CTAs.
- Season forecasts get `kicker: "Season archive"`.
- Copy the four featured images from `origin/main:public/images/featured/` into
  `public/images/featured/` and keep their `image:` lines; add `imageAlt` where missing.
- Do not edit the essay bodies beyond the link fixes. Copy edits are a later Opus pass.

| slug | date | updated |
|---|---|---|
| aries-season-26 | 2026-03-21 | 2026-04-19 |
| how-to-get-started | 2026-01-07 | 2026-04-19 |
| how-to-read-a-birth-chart | 2026-03-04 | 2026-04-19 |
| how-to-read-court-cards | 2026-02-04 | 2026-04-19 |
| natal-retrograde-planets | 2026-03-25 | 2026-04-19 |
| reading-tarot-for-yourself | 2026-03-11 | 2026-04-19 |
| tarot-journal | 2026-02-11 | 2026-04-19 |
| taurus-season-26 | 2026-04-19 | 2026-04-20 |
| the-case-for-one-card | 2026-02-25 | 2026-04-19 |
| the-conjunction-at-zero | 2026-01-31 | 2026-04-19 |
| the-last-degree | 2026-04-18 | 2026-04-20 |
| the-long-arrivals | 2026-01-02 | 2026-04-20 |
| the-scale-is-going-to-tip | 2026-04-22 | 2026-04-22 |
| the-two-malefics | 2026-04-19 | 2026-04-19 |
| what-a-tarot-deck-is-for | 2026-04-01 | 2026-04-19 |
| what-modalities-mean | 2026-04-08 | 2026-04-19 |
| what-reversals-actually-tell-you | 2026-01-14 | 2026-04-20 |
| what-the-houses-actually-describe | 2026-01-21 | 2026-04-20 |
| why-birth-time | 2026-01-28 | 2026-04-20 |
| why-sun-signs-arent-useless | 2026-02-18 | 2026-04-20 |

### 5. `llms.txt`
Replace the `/blog` line in the Pages section with `/guides`, add a `## Guides` section
listing every slug with its title on one line each, and extend `scripts/check-llms-txt.mjs`
to require every `content/guides` slug in the file.

### 6. `CLAUDE.md`
Replace the blog mention with a short "Guides" section: markdown in `content/guides`,
frontmatter fields, the validator, the Updated rule (bump `updated` only when copy changes),
Article schema, no FAQPage in guides, `vercel.json` redirects, `main` is archived source
material.

## Verify (paste the output in your summary)
```bash
npm run build                                  # the prebuild llms check runs first
test ! -d src/app/blog && test ! -d content/blog && echo "blog gone"
ls content/guides/*.md | wc -l                 # 20 (22 if the two production posts were kept)
grep -rn "](/blog" content/guides src           # nothing
grep -L '<h1' out/guides/*.html                # nothing: every guide has an H1
grep -c "<table" out/guides/taurus-season-26.html    # greater than 0
grep -o 'Updated [A-Z][a-z]* 2026' out/guides/the-case-for-one-card.html
grep -o '"@type":"Article"' out/guides/how-to-read-court-cards.html | wc -l   # 1
grep -o '"author":{"@id":"[^"]*"' out/guides/how-to-read-court-cards.html     # the Person id
grep -c '"FAQPage"' out/guides/*.html | grep -v ":0"   # nothing
grep -c "/blog/" out/sitemap.xml               # 0
grep -c "/guides/" out/sitemap.xml             # 20 (or 22)
grep -o 'og:type" content="[^"]*"' out/guides/why-birth-time.html   # article
grep -rl $'\xe2\x80\x94' content/guides src/app/guides src/components/guide-cta.tsx src/components/author-box.tsx   # nothing
```
After the branch deploys (Fable does this), `curl -sI https://ordinarymysticreadings.com/blog/tarot-journal`
should show a 308 to `/guides/tarot-journal`.

## Commit
Small commits on `guides` (engine, routes and pages, the port, redirects and llms, CLAUDE.md).
No em dashes in messages. Do not merge or push. Reply with the verification output, the list
of files changed, the answers you assumed, and anything you deviated from and why.
