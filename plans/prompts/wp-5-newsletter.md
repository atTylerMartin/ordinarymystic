# WP-5: the newsletter (Supabase table + webhook + Edge Function + form + /newsletter)

Model: Sonnet. Branch `newsletter` from `tiktok-landing`. Builds everything in the repo; the
Supabase and Resend setup is a listed manual step and is NOT performed by this session.

## Read first
- `CLAUDE.md`: static export, no server code; Supabase from the browser with the anon key
  under RLS (reviews are the model: `src/lib/supabase.ts`, `src/lib/reviews.ts`,
  `src/components/review-form.tsx`, `supabase/reviews.sql`, `supabase/functions/notify-review/
  index.ts` with its header comments); every indexable page registered in `src/lib/routes.ts`
  with `pageMetadata()`; the "Attribution and analytics" section (WP-4 is merged:
  `src/lib/attribution.ts`, `src/lib/analytics.ts`, `TrackedLink`); `public/llms.txt` lists
  pages and must stay in sync (`scripts/check-llms-txt.mjs` runs as prebuild).
- `plans/om-seo-plan.md`, the section "Newsletter on static export" under Part 3: it is the
  spec. Follow it exactly.
- `src/app/links/page.tsx` and `src/lib/content/links.ts` (the newsletter placeholder card
  this replaces), `src/app/guides/[slug]/page.tsx` (where the form goes under the CTA),
  `src/lib/content/nav.ts` (the commented Newsletter slot), `src/components/site-footer.tsx`,
  `src/lib/content/home.ts` (a newsletter band on the hub).

## Build
1. `supabase/subscribers.sql`: table `public.subscribers (id, email, first_name, brand
   default 'om', source, campaign, landing, created_at)`, unique index on `lower(email)`,
   RLS on, insert-only policy for `anon` with `brand = 'om'`, no select policy, and a
   before-insert trigger that raises when more than 30 rows landed in the last ten minutes.
   Header comments in the style of `reviews.sql` saying how to run it.
2. `supabase/functions/subscribe-welcome/index.ts` (Deno), the `notify-review` pattern:
   called by a Database Webhook on INSERT, shared `x-webhook-secret`, "Verify JWT" off.
   It creates the Resend contact with properties `brand: "om"`, `source`, `campaign`,
   `landing` (retry without properties if the audience lacks them; "already exists" is
   success), then sends a one-line plain welcome from a verified OM address with
   `utm_source=newsletter&utm_medium=email&utm_campaign=welcome` on its links. Secrets:
   `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `SUBSCRIBE_WEBHOOK_SECRET`, optional
   `SUBSCRIBE_FROM`, `SUBSCRIBE_SITE_URL`. Same header-comment deployment notes as
   `notify-review`. Welcome text, plain: "Thanks for signing up. Twice a month you get one
   guide, one note on the sky, and one line about booking. If a question is already
   sitting with you, recorded readings are here: <link>. Tyler". No em dashes.
3. `src/lib/newsletter.ts`: `subscribe({ email, firstName, honeypot })` returns
   `"ok" | "duplicate" | "error"`; a filled honeypot returns `ok` without inserting; it
   reads `source`, `campaign`, `landing` from `readAttribution()`; a unique violation is
   `duplicate` (shown as success); it never throws.
4. `src/components/newsletter-form.tsx` (client): email, optional first name, honeypot,
   one button, inline success and error lines, fires `trackNewsletterSignup({ campaign,
   source })` (add `newsletter_signup` to `src/lib/analytics.ts`; every event carries
   `source`). Copy in `src/lib/content/newsletter.ts`: heading, body ("Twice a month: one
   guide, one note on the sky, one line about booking."), labels, success ("You're on the
   list. The first note comes with the next send."), duplicate (same success line), error
   ("That didn't go through. Try again, or email ordinarymysticreadings@gmail.com."),
   privacy line ("No sharing, no selling, unsubscribe in one tap.").
5. `/newsletter` page (`src/app/newsletter/page.tsx`): registered in `routes.ts` (parent
   `/`, audience `all`, title under 60 characters with the template), `pageMetadata`,
   breadcrumbs like the other registered pages, the form, what to expect, the privacy line.
6. Mount the form: it replaces the placeholder card on `/links`; it goes under `GuideCta`
   on every guide page; a band on the homepage hub (copy in `home.ts`); the footer gets a
   Newsletter link in the "The Practice" column; `nav.ts` turns the Newsletter slot on.
7. `public/llms.txt`: add `/newsletter` to the page list. `CLAUDE.md`: a short Newsletter
   section (table, webhook, function, secrets, the form's homes, the event).

## Rules
No server code. No em dashes (grep for the bytes e2 80 94 before every commit). Prices only
from `offerings.ts` (the form carries none). The form must degrade: when Supabase is not
configured or the insert fails, it shows the error line and the page still builds and
renders. Keep the review form's visual language (same `Card`, inputs, button).

## Verify (paste the output)
```bash
npm run build
grep -c "/newsletter" out/sitemap.xml            # 1
grep -c 'rel="canonical" href="https://ordinarymysticreadings.com/newsletter"' out/newsletter.html   # 1
grep -c "newsletter" out/links.html out/index.html out/guides/court-cards.html 2>/dev/null   # each > 0 (pick any real guide)
grep -c "newsletter_signup" out/_next/static/chunks/*.js | grep -v ":0" | wc -l   # at least 1
grep -rl $'\xe2\x80\x94' supabase src/lib/newsletter.ts src/components/newsletter-form.tsx src/lib/content/newsletter.ts src/app/newsletter   # nothing
```
Also run `node --check` is not applicable to Deno; instead `deno check` if available, else
state that the function was not type-checked locally.

## Commit and report
Small commits on `newsletter`. Never merge or push. Report: the verification output, files
changed, the exact manual steps in order for the orchestrator to run with Tyler's go (run the
SQL; deploy the function with Verify JWT off; set the secrets; create the Database Webhook on
INSERT into `public.subscribers` with the header; the Resend audience properties), and how to
test on production (one signup creates the row, the contact, one email; a second signup
shows success with no second row and no email; a filled honeypot inserts nothing).
