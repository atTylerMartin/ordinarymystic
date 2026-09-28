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

## Now (before or alongside WP-1 and WP-3)

- [ ] Recorded-reading facts for the readings page: turnaround in business days, how the
      video is delivered (private YouTube link, Dropbox, email attachment), how the question
      is collected after checkout today. Send these to the WP-3 session.
- [ ] Headshot for `/about` (face is allowed here) and a square crop for the schema image and
      `/links`. Drop them in `public/images/` and tell the session the filenames.
- [ ] Terms and Privacy: approve the plain boilerplate WP-1 drafts, or supply text.
- [ ] Google Search Console: domain property for `ordinarymysticreadings.com` (DNS TXT), submit
      `https://ordinarymysticreadings.com/sitemap.xml`, then URL Inspection on `/` and Request
      Indexing once WP-1 deploys, so the stale "Practical Spirituality" snapshot refreshes.
- [ ] Bing Webmaster Tools: sign in, "Import from Google Search Console". Bing is what
      ChatGPT reads.
- [ ] GA4: after WP-4 deploys, register the custom dimensions (`tier`, `mode`, `label`,
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
- [ ] Trustpilot: claim the free business profile (needs only the website). Save URL. Add the
      review link to the testimonial thank-you and the welcome email in a small follow-up prompt.
- [ ] Reddit: an account in the practice name whose profile links the site. Answer questions
      on r/tarot and r/astrology; never post links or promote. Reddit is the top Perplexity
      citation source and the subreddits ban advertising.
- [ ] Gumroad and GitHub profile descriptions match the identity line and link the site.
- [ ] Optional: one Etsy listing, "30-minute recorded tarot reading", $65, delivered as a
      video (Etsy requires a tangible deliverable and bans outcome claims), description ends
      with the site. Etsy takes about 6.5% plus payment fees. Only if you want the marketplace
      channel; it is a citation either way.

## Reviews

- [ ] On-site testimonials remain the primary flow (`/testimonials`, the leave-a-review button,
      moderation at `/admin`). Ask after every recorded delivery, in the delivery email.
- [ ] Trustpilot second, from the same email, once the profile exists.
- [ ] Clients who ask to review on Google: point them at the Tulsa Tarot Reader profile and ask
      them to describe what they actually did (an online reading with Tyler). Never solicit
      Yelp reviews.

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
