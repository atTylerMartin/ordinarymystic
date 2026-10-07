# WP-6: the five recorded-reading guides (one Opus session per guide)

Model: Opus. Branch `guide-<slug>` from `tiktok-landing`, one guide per session. The guide is
a markdown file in `content/guides/<slug>.md`; the engine registers the route, the sitemap
entry, the Article schema, the CTA and the newsletter slot. The session also adds one line to
`public/llms.txt` or the build fails.

## Read first
- `CLAUDE.md`: the Guides section (frontmatter fields, `validateGuide`, the Updated rule,
  no FAQPage in guides, no em dashes), the Pricing section, "Two brands, one reader".
- `src/lib/content.ts` (`GuideFrontmatter`, `validateGuide`), two ported guides for shape
  (`content/guides/court-cards.md` or any tarot one, and `content/guides/reading-for-yourself.md`
  if present; pick two `category: tarot` files), `public/llms.txt` (the `## Guides` list
  format: `- <slug> : <Title>`), `scripts/check-llms-txt.mjs`.
- For voice: `src/lib/content/readings.ts`, `faq.ts`, `about.ts`, `home.ts`. The reader is
  Tyler Martin; the register is plain, grounded, conversational, "closer to a strategic
  advisor than a mystical oracle". Never "energy", "vibes", "the universe". Astrology is a
  lens he sometimes reads through, never the product (decided 2026-10-07); these five guides
  are about tarot readings.
- `plans/om-seo-plan.md`: Part 2 (the query map and "What the recorded page must contain")
  and Part 4 "New (5)". The facts that must not drift: recorded readings are prepared
  privately and delivered within three business days as a private YouTube link plus a
  written synthesis; the question is collected at checkout (a required field on the Stripe
  Payment Link) and clarified by email; live readings are one-on-one over Zoom; recorded is
  its own product, never "budget live".

## The five guides (slug, working title, the queries it owns, what it must contain)
1. `what-is-a-recorded-tarot-reading` "What a Recorded Tarot Reading Is, and Who It Is For".
   Queries: recorded tarot reading, video tarot reading, pre-recorded tarot reading,
   personalized tarot reading video, tarot reading by email. Contains: the first-60-words
   answer (what it is, what arrives, the turnaround); how the question is collected; how he
   prepares; what the video and the synthesis each do; who it suits (and who should book
   live instead); what it is not.
2. `online-tarot-reading-cost` "What an Online Tarot Reading Costs". Queries: how much does a
   tarot reading cost, tarot reading prices online, tarot reading cost per minute. Contains:
   his prices stated plainly (recorded 15/30/60 minutes $35/$65/$125; live 15/30/60 $40/$100/
   $195; the TikTok LIVE sizes $1/$5/$15), the per-minute math of the big platforms (Keen,
   Kasamba, Purple Garden, Psychic Source, California Psychics) with a live-checked source
   for each figure, Etsy's range with a source, what drives price (time, preparation,
   delivery format, the reader's experience), and what a fair price buys. Because the
   markdown cannot import `offerings.ts`, put this comment at the top of the body:
   `<!-- Prices below are literal and must match src/lib/offerings.ts; this file is on the
   price-change list in CLAUDE.md. -->` and add the file to that list in `CLAUDE.md` rule 5
   (the Pricing section).
3. `recorded-live-or-written-tarot-reading` "Recorded, Live, or Written: Which Reading to
   Book". Queries: recorded vs live tarot reading, email vs video tarot reading, are online
   tarot readings worth it. Contains: a plain comparison of the three formats (what you get,
   when it suits, the trade-offs), a short decision list, the honest case for each; no
   format is "budget".
4. `how-to-choose-an-online-tarot-reader` "How to Choose an Online Tarot Reader". Queries:
   how to find a good tarot reader online, how to tell if a tarot reader is legit, questions
   to ask a tarot reader. Contains: the signs of a sound practice (public prices, stated
   turnaround and delivery, a named person with a history, reviews on the reader's own site
   or a third-party profile, no outcome promises, clear limits on health, legal and money
   questions), the red flags (curse removal, escalating fees, urgency), five questions to
   ask before booking, and what a first reading should feel like.
5. `asking-a-question-the-cards-can-answer` "Asking a Question the Cards Can Answer".
   Queries: what to ask a tarot reader, how to prepare for a tarot reading, good questions
   for tarot. Contains: why "will he come back" is a weaker question than "what is this
   relationship asking of me", the question under the question, how he rewrites questions
   with clients, ten example questions by life area, what not to ask (and why), and how
   the question is collected for a recorded reading.

## Each guide
- Frontmatter: `title`, `date` and `updated` (today, `YYYY-MM-DD`), `description` (under 160
  characters, answer-first), `category: tarot`, `wing: guides`, `tags` (five to eight, the
  queries as slugs), `faq` (three to five visible items; no schema), `sources` (for every
  external figure or claim; the cost guide needs at least six), the `cta*` fields left at
  their defaults (they point at recorded readings).
- Body: 1,200 to 1,800 words. The answer in the first 60 words. H2s phrased as questions.
  Short paragraphs. Internal links as markdown to `/readings/recorded`, `/readings/live`,
  `/faq`, `/about` and to the other four guides by their slugs (`/guides/<slug>`), even if
  they are not merged yet. No em dashes anywhere in the file. No prices except in guide 2.
- `public/llms.txt`: one line under `## Guides`: `- <slug> : <Title>`.
- Every figure about another business or platform is checked on the web in this session
  and cited in `sources`. Nothing invented about competitors.

## Verify (paste the output)
```bash
npm run build                                           # prebuild llms check and validateGuide both pass
grep -c "/guides/<slug>" out/sitemap.xml                # 1
grep -c '"@type":"Article"' out/guides/<slug>.html      # 1
grep -c "FAQPage" out/guides/<slug>.html                # 0
grep -c $'\xe2\x80\x94' content/guides/<slug>.md         # 0
wc -w content/guides/<slug>.md
```

## Commit and report
Small commits on `guide-<slug>`. Never merge or push. Report: the first 60 words, the H2
list, the FAQ questions, the sources, the word count, the verify output, and any figure you
could not confirm.
