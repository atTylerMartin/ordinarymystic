# WP-9: retire the 15-minute live reading

Decided by Tyler on 2026-11-02. The live-over-Zoom ladder becomes two tiers: 30 minutes at
$100 and 60 minutes at $195. The 15-minute live tier ($40) comes off the site everywhere.
Recorded readings keep all three tiers ($35, $65, $125). Nothing else about prices changes.

Why (for the commit message, in these words or shorter): two 15-minute sessions cost less
than one 30 and carry twice the prep, the Zoom setup and the written synthesis. A private
reading is the room, the preparation and the write-up, and fifteen minutes does not carry
that. Tulsa Tarot Reader retired its private 15 on 2026-10-29 for the same reason.

## Read first

- `CLAUDE.md` (the static export, prices live in `src/lib/offerings.ts`, no em dashes)
- `src/lib/offerings.ts`: the `LIVE` array and the `Tier` type
- `src/lib/content/readings.ts`: `priceFrom`, `priceList`, `lengthList` and where they are used
- `src/components/booking-section.tsx`, `src/components/structured-data.tsx`,
  `src/lib/content/faq.ts`, `src/lib/routes.ts`: every consumer of `LIVE`
- `public/llms.txt` and `scripts/check-llms-txt.mjs` (the prebuild check: every price in
  `offerings.ts` must appear as literal text in `llms.txt`)
- `content/guides/online-tarot-reading-cost.md`

## Do

1. In `src/lib/offerings.ts`, delete the 15-minute object from `LIVE`. Leave `RECORDED`
   alone. Leave the `Minutes` type as it is (recorded still uses 15). Do not touch the
   Stripe URLs of the two remaining live tiers.
2. Check every place `LIVE` is rendered or read, and make sure it reads naturally with two
   tiers: the live cards in `booking-section.tsx`, the `Offer` nodes in
   `structured-data.tsx`, the pricing FAQ answer in `faq.ts` (`priceList(LIVE)` should now
   read "$100 for 30 minutes, or $195 for 60 minutes"), the live route description in
   `routes.ts` ("from $100"), and `lengthList(LIVE)` wherever it appears ("30 or 60
   minutes"). If any helper assumes three items, fix the helper, not the data.
3. `public/llms.txt`: remove the "Live over Zoom, 15 minutes: $40" line. Keep the other two
   live lines and all three recorded lines as they are. Run `node scripts/check-llms-txt.mjs`
   and make it pass.
4. `content/guides/online-tarot-reading-cost.md`: update every sentence that lists live
   prices (the FAQ answer near the top, the summary paragraph, and the "Live readings over
   Zoom" paragraph) to "$100 for 30 minutes, $195 for 60 minutes" phrasing, keeping the
   author's voice. The recorded prices and the Etsy comparison stay. Bump the guide's
   modified date if the frontmatter has one.
5. Grep the whole repo for `$40`, `15-minute`, `15 minutes` and `minutes: 15` and confirm
   every remaining hit is about recorded readings or someone else's prices.
6. Do not touch Stripe. The orchestrator deactivates the $40 Payment Link after the merge
   (never deleted).

## Verify

- `npm run build` passes (the prebuild llms check included).
- `/readings/live` shows two cards, 30 and 60, with the right prices and buttons.
- `/faq` pricing answer reads correctly. `/readings` overview says "30 or 60 minutes, from
  $100" for live.
- View source of `/readings/live`: the JSON-LD has two live `Offer` nodes, none at 40.
- `/guides/online-tarot-reading-cost` no longer mentions $40.

## Hand back

Commit on a branch named `retire-live-15` from `tiktok-landing`, one commit, using the repo's
own git identity. Do not merge or push. Paste the commit hash and the output of the grep in
step 5 back to the orchestrator.
