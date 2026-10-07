# Site copy: tarot readings, with astrology as a lens (decided 2026-10-07)

Model: Sonnet. Branch `tarot-copy` from `tiktok-landing`. Small, exact, no design changes.

## Read first
`CLAUDE.md` (copy lives in `src/lib/content/*`; metadata from `routes.ts` and `metadata.ts`;
no em dashes; `public/llms.txt` must stay in sync with prices and slugs). The decision: the
practice is tarot readings; astrology is a lens Tyler sometimes reads through (a LIVE built
around a transit, a collective reading by rising sign), never a product, a content track or a
second noun in the brand line. The `/readings/astrology` page stays as built and is not
touched.

## Change
Everywhere the site says "tarot and astrology readings" (or "tarot and astrology" as what the
practice sells), say "tarot readings". Known sites, verify with a grep for `astrology` across
`src/lib/content/*.ts`, `src/lib/routes.ts`, `src/app/layout.tsx`, `src/components/structured-
data.tsx`, `public/llms.txt`:
- `src/app/layout.tsx`: the default title "Ordinary Mystic | Tarot Readings", the description
  "Online tarot readings for thoughtful skeptics. Recorded readings delivered as a
  personalized video walkthrough plus a written synthesis, and live one-on-one sessions
  over Zoom."
- `src/lib/routes.ts`: `/` title "Ordinary Mystic: Tarot Readings" and description;
  `/readings`, `/testimonials`, `/tools`, `/guides` descriptions; the `/guides` title
  "Guides to Tarot and Astrology" may stay, since ten of the guides are astrology essays.
  Leave the two Tulsa pages and `/readings/astrology` alone.
- `src/lib/content/home.ts`: the hero "Grounded tarot readings with Tyler Martin, recorded
  for you or live over Zoom." The guides card title may stay.
- `src/lib/content/nav.ts`: `FOOTER_TAGLINE` becomes "Ordinary Mystic Readings: grounded
  tarot, no theatrics".
- `src/lib/content/about.ts`: "I read tarot, and sometimes through an astrological lens, and
  Ordinary Mystic is where I do that work online..."; the pattern-recognition sentence
  becomes "I use tarot as a pattern-recognition tool..., and astrology when a chart or a
  transit frames the question." The "three kinds of people" sentence: "Students come to
  understand tarot for themselves".
- `src/lib/content/readings.ts`: keep the astrology card on `/readings` (it links the page)
  but its blurb should read as a way of reading, not a parallel service.
- `public/llms.txt`: the practice line and the guides line to match.
- `src/components/structured-data.tsx`: the Person `jobTitle` becomes "Tarot reader";
  Organization description to match if it names astrology.
Keep every title under 60 characters with the template. Do not touch prices, routes, or any
file outside the list.

## Verify (paste the output)
```bash
npm run build
grep -rn -i "tarot and astrology readings" src public/llms.txt     # nothing
grep -rn -i "astrology" src/lib/content/home.ts src/lib/content/nav.ts src/app/layout.tsx   # only what the list above allows
grep -rl $'\xe2\x80\x94' src public/llms.txt                       # nothing
```
Commit on `tarot-copy`; never merge or push. Report the diff summary and the verify output.
