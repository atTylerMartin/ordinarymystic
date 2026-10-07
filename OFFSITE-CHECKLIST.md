# Off-site checklist (Ordinary Mystic)

Everything in `plans/om-seo-plan.md` that happens outside this repo. Tick items here as
they are done; where a line says "Save URL", paste it into the table at the bottom. A coding
session copies that table into `SOCIALS` in `src/lib/config.ts` so the `sameAs` schema and
the footer links turn on.

## Identity to use everywhere, character for character

| Field    | Value                                                            |
|----------|------------------------------------------------------------------|
| Practice | Ordinary Mystic (alternate: Ordinary Mystic Readings)            |
| Person   | Tyler Martin (the full name is allowed on this brand)            |
| Email    | ordinarymysticreadings@gmail.com                                 |
| Website  | https://ordinarymysticreadings.com                               |
| Where    | Online, United States. No address, no service area.              |
| Handles  | ordinarymysticreadings (TikTok, YouTube), ordinarymystic (Cash App, PayPal, Gumroad) |

Never list Ordinary Mystic as a local business anywhere. Local is Tulsa Tarot Reader, and it
keeps the first-name-only rule; on that brand the surname never goes on a public page or
listing.

Canonical description (write once, paste verbatim; keep it factual and about the practice):

> Ordinary Mystic is Tyler Martin's online tarot and astrology practice. Recorded readings
> are prepared privately and delivered as a personal video walkthrough plus a written
> synthesis; live readings are one on one over Zoom. Readings are practical and
> conversational, built around your question rather than a prediction. Prices are public,
> from $35 for a recorded reading and $40 for a live one, and booking is on the site. The
> in-person side of the practice in Tulsa, Oklahoma is Tulsa Tarot Reader.

## TikTok (decided 2026-09-28 and 09-29)

Profile
- [x] Name field: `Ordinary Mystic Tarot Readings`.
- [x] Bio: practical and grounded / live at 8pm CT on my on weeks, recorded on off weeks /
      direct pay and bookings in the link.
- [ ] Bio link: `https://ordinarymysticreadings.com/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`
      (WP-4 live 2026-10-07; `/links` leads with booking because the LIVE is discovery and
      the recorded reading is the offer; live viewers get `/pay` through Service+).
- [ ] Profile photo: reshoot for this brand. Same face, deck in hand or on the table, plain
      dark background, warm light. Not the downtown Tulsa shot. Reuse on YouTube, `/about`
      and `/links`.
- [ ] Privatize (do not delete) any old video that mentions an old offer, an old price, a dead
      link, or is not about tarot or astrology. Keep the craft posts; keep the view counts.
- [ ] Film the pinned explainer: thirty seconds, to camera, what a recorded reading is, what
      arrives, "link in bio". Film it the day of the photo reshoot, same setup.
- [ ] Pin three, in order: the explainer, one reading in practice, one live highlight. Do this
      only after five new videos are posted so the top of the grid is the new direction.

Live setup
- [x] Viewer Wishes: One card 100, Three cards 500, Full spread 1,500.
- [x] Overlay, two lines: the Viewer Wishes tiers, then "Direct pay also available. DM me."
      Never PayPal, Cash App, "link", "bio" or the URL on screen or out loud.
- [x] Live title "Live tarot readings, pick your size" and the description from the session
      notes.
- [x] Service+ card "Pay for a live reading", the auto message with the `/pay` URL, and the
      four FAQs (direct pay, the three sizes, private readings, recorded readings). The FAQs
      hold prices, so they are on the price-change list along with `llms.txt`.
Habit, not a checkbox: open every live with sixty seconds on the sky this week (the
Astrology clip), then questions, and download the replay the same night.

Content flow
- [ ] Buckets: live highlights 50%, pop culture 20%, collective readings 20%, education 10%.
      Rotation: highlight, pop culture, highlight, collective. Tarot Tip Tuesday breaks the
      pattern every Tuesday. About three posts a week, cut from replays.
- [ ] Collective readings end with the recorded-reading line and run on off weeks.
- [ ] Tarot Tip Tuesday also goes to the TTR Instagram as a still and caption in TTR's voice,
      no OM watermark, no surname.
- [ ] One pop-culture pull about twice a month, read the situation, never the winner; skip the
      midterms.

## Now (before or alongside WP-1 and WP-3)

- [x] Recorded-reading facts (2026-09-29): delivered within three business days as a private
      YouTube link plus the written synthesis; the question is collected right after checkout
      and clarified by email. Recorded in `plans/om-seo-plan.md` for WP-3.
- [ ] Headshot: the downtown Tulsa photo is the interim `/about` image (face allowed, same
      reader on both brands); never the SS&Si LinkedIn one. Replace with the OM reshoot when it
      exists. Drop the file in `public/images/` and tell the session the filename.
- [x] Terms and Privacy: plain boilerplate approved 2026-09-29.
- [x] Google Search Console set up, sitemap submitted, indexing requested (2026-09-29).
- [x] Bing Webmaster Tools: imported from Search Console (2026-09-29).
- [ ] WP-1b (IndexNow) merged 2026-10-02 and the full sitemap was submitted once by hand. Add the
      `INDEXNOW_KEY` repository secret in GitHub so the Action can run
      (Settings, Secrets and variables, Actions). From then on Bing is notified on every
      push; Google indexing requests stay manual and only for new pages.
- [ ] GA4 (`G-XF047BLMG9` is already installed): after WP-4 deploys, register the custom dimensions (`tier`, `mode`, `label`,
      `campaign`, `source`) and mark `book_click`, `pay_tap`, `newsletter_signup` as key events.
- [ ] Resend: on the Ordinary Mystic account, verify `tulsatarotreader.com` as a second
      domain; on the audience create text properties `brand`, `source`, `campaign`, `landing`;
      save two segments, "Ordinary Mystic" (`brand = om`) and "Tulsa" (`brand = ttr`). Then
      give the Tulsa session the go to switch its API key and send `brand: "ttr"`.
- [ ] Existing Ordinary Mystic Instagram: set to private, or leave it with only the `/links`
      URL in the bio. No posting. (Decided 2026-09-28: no OM Instagram or Facebook until the
      reader wing opens.)
- [ ] Facebook: create a complete but silent Page named Ordinary Mystic (category Astrologer
      or Psychic, the description above, website
      `https://ordinarymysticreadings.com/?utm_source=facebook&utm_medium=social`, profile
      image the logo). No posts. It exists for the Meta citation only. Save URL.

## After WP-4 (`/links` live) and WP-5 (newsletter live)

- [ ] TikTok bio link: `https://ordinarymysticreadings.com/links?utm_source=tiktok&utm_medium=social&utm_campaign=bio`.
      Service+ and live messages use `https://ordinarymysticreadings.com/pay?utm_source=tiktok&utm_medium=social&utm_campaign=live`.
      The `/pay` URL is never read aloud or shown on screen.
- [ ] Pinned TikTok: thirty seconds on what a recorded reading is, ending in "link in bio".
- [ ] YouTube: channel About uses the description above; links section points to
      `/readings/recorded`, `/about`, `/newsletter`. First video is the recorded-reading
      explainer; then one guide as a video every two weeks. Save the channel URL.
- [ ] Trustpilot: see Reviews below.
- [ ] Reddit: an account in the practice name whose profile links the site. Answer questions
      on r/tarot and r/astrology; never post links or promote. Reddit is the top Perplexity
      citation source and the subreddits ban advertising.
- [ ] Gumroad and GitHub profile descriptions match the identity line and link the site.
- [ ] Optional: one Etsy listing, "30-minute recorded tarot reading", $65, delivered as a
      video (Etsy requires a tangible deliverable and bans outcome claims), description ends
      with the site. Etsy takes about 6.5% plus payment fees. Only if you want the marketplace
      channel; it is a citation either way.

## Reviews (decided 2026-09-29: Ordinary Mystic clients review Ordinary Mystic only)

Ordinary Mystic is ineligible for a Google Business Profile (online only) and its clients
are not sent to Tulsa Tarot Reader's Google, Facebook, Yelp or marketplace profiles: a review
of an online reading does not describe that business and would put a profile already under
appeal at risk. Only someone who sat with you in person reviews Tulsa Tarot Reader.

- [ ] On-site testimonials are the primary ask (`/testimonials`, the leave-a-review button,
      moderation at `/admin`). Ask in the delivery email of every recorded reading and after
      every live one on one.
- [ ] Trustpilot is the third-party surface. Claim the free profile (needs only the website),
      then add its link as the second line of the same email. Save URL.
- [ ] Drop the line in the Tulsa repo's `OFFSITE-CHECKLIST.md` that asks five Ordinary Mystic
      clients to review on Google. Superseded.
- [ ] No Facebook or Yelp reviews for Ordinary Mystic.

## Monthly

- [ ] Ask ChatGPT, Google AI Mode and Claude: "where can I get a good recorded tarot reading
      online" and "best online tarot reader for a video reading". Log the sources below.
- [ ] Newsletter twice a month; one YouTube video every two weeks; TikTok: one live and two
      posts a week, batched on off weeks.
- [ ] Refresh a guide's Updated date only when its copy changed.

## Saved URLs

| Key        | URL                                              |
|------------|--------------------------------------------------|
| tiktok     | https://www.tiktok.com/@ordinarymysticreadings   |
| youtube    | https://www.youtube.com/@OrdinaryMysticReadings  |
| gumroad    | https://ordinarymystic.gumroad.com               |
| github     |                                                  |
| facebook   |                                                  |
| trustpilot |                                                  |
| etsy       |                                                  |
| reddit     |                                                  |

## AI citation log

| Date | Engine | Query | Sources cited | Were we named? |
|------|--------|-------|---------------|----------------|
|      |        |       |               |                |
