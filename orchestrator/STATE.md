# State of the work

Updated 2026-10-05 by the orchestrator. Production branch `tiktok-landing`. The newest
commit on it when this was written is the one that added this folder.

## Merged and live

| Package | What | Merged |
|---|---|---|
| WP-0 | `/pay` for TikTok live readings (stream tiers, wallets, two Payment Links) | 2026-09-28 |
| WP-0b | Hotfix: dynamic pages prerendered as the 404 (`await params` in Next 16) | 2026-09-28 |
| WP-1 | Routes registry, `pageMetadata()`, schema graph (Organization, Person, WebSite, Service), breadcrumbs, `llms.txt` with prebuild check, AI-crawler robots rules, `vercel.json` headers, placeholders deleted, Terms and Privacy | 2026-09-29 |
| WP-2 | Guides engine (markdown, validator, Article schema) and the port of twenty essays from `main`; `/blog` redirects to `/guides` | 2026-09-29 |
| WP-3 | `/readings`, `/readings/recorded`, `/readings/live`, `/readings/astrology`, `/about`, `/faq` (the only FAQPage), `/testimonials`, nav, footer, homepage hub, thanks pages | 2026-09-30 |
| WP-1b | IndexNow: key file, script, GitHub Action on Vercel's Production deployment status; full sitemap submitted once by hand | 2026-10-02 |
| Stripe | The six reading Payment Links collect a required question and optional birth data at checkout (`--set-fields`) | 2026-09-29 |
| Docs | `BRAND.md` (kit, four cover templates), the plan's channel sections, this folder | 2026-10-03 to 10-05 |

## In flight

- **WP-4** (attribution, GA4 events, `/links` bio page): prompt at
  `plans/prompts/wp-4-links-analytics.md`, released to a Sonnet session on 2026-10-02.
  No summary received yet. Review when it arrives: build, the checks in the prompt,
  then fast-forward from the docs worktree.

## Next prompts to write, in order

1. **WP-5 newsletter**: Supabase `subscribers` table + DB webhook + `subscribe-welcome`
   Edge Function + `NewsletterForm` + `/newsletter`; the form replaces the placeholder
   card on `/links` and fills the slot under every guide. Needs WP-4 merged.
2. **WP-6 guides**, one Opus prompt each, in this order: What a recorded tarot reading is;
   What an online tarot reading costs; Recorded, live or written; How to choose an online
   tarot reader; Asking a question the cards can answer. Each doubles as a YouTube script
   and a Tarot Tip Tuesday source.
3. **WP-7 For Readers page and the first lesson** from the Tulsa build (rules in the plan).
4. **WP-8 CLAUDE.md and README rewrite**, last.

## Tyler owes (also on OFFSITE-CHECKLIST.md)

- `INDEXNOW_KEY` repository secret in GitHub (the Action fails until it exists).
- Search Console: Request Indexing on the seven WP-3 pages.
- GA4 Admin after WP-4 merges: custom dimensions `tier`, `mode`, `label`, `campaign`,
  `source`; key events `book_click`, `pay_tap`, `pay_paid`.
- Resend consolidation (verify `tulsatarotreader.com` on the OM account, properties,
  segments), then the go to the TTR session.
- OM photo reshoot and the pinned recorded-reading explainer video.
- Privatize off-direction TikTok videos; five new posts, then pin three.
- Trustpilot profile; Reddit account; the silent Facebook placeholder Page.

## Content operations (decided, running)

- TikTok buckets and rotation: live highlights 50%, pop culture 20%, collective readings
  20%, education 10%; highlight, pop, highlight, collective; Tarot Tip Tuesday breaks the
  pattern every Tuesday. One post a day as of the week of 2026-10-03.
- Covers: four templates, one band color per bucket, in `BRAND.md`.
- Hashtags: three to five, a fixed set per bucket plus one or two specific; no trend
  hunting; captions carry the search words.
- Cross-posting to the TTR Instagram: Tarot Tip Tuesday and at most one reading-in-practice
  clip a week, in TTR's kit and voice, first name only, no OM mark or CTA.
- Live setup: Viewer Wishes 100/500/1,500; overlay says "Direct pay also available. DM me";
  Service+ card "Pay for a live reading" with the `/pay` auto message and four FAQs. The
  URL is never on screen or read aloud.
- Weekly content plan is written in chat on request; the last one covered 2026-10-03 to
  10-09 (Survivor pull Thursday, "the question under the question" Tuesday, "deciding
  whether to stay" collective Sunday).

## Open conflicts to resolve with Tyler

- The business plan written 2026-09-30 (branch `business-plan`, another orchestrator) says
  astrology is to be removed from the OM site (its chapter 29 checklist). WP-3 built
  `/readings/astrology` the same day and the Stripe links collect birth data. Nobody has
  reconciled these. Ask before writing any astrology guide or removing the page.
- The business plan's operating principle, "play the game before teaching the game",
  means WP-7 (the reader wing) is the lowest priority and may be deferred past the
  revenue rungs. Confirm before releasing it.

## Numbers worth knowing

- About 3,100 TikTok followers. Recorded tiers $35/$65/$125; live $40/$100/$195; stream
  $1/$5/$15. Every price is in `src/lib/offerings.ts`.
- Google's index of the homepage was stale on 2026-09-28 ("Practical Spirituality");
  indexing was requested after WP-1. Check Search Console for the refresh.
