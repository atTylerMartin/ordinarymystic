# Ordinary Mystic — Product Roadmap (long-term)

A living plan for evolving the link-in-bio site into a client platform:
direct payments, client accounts + dashboards, reading delivery (video + PDFs),
an admin CRM, and lifecycle automations. Capture decisions here; revisit each
phase before building it.

---

## Vision

A client books and pays for a reading on the site, automatically gets an
account (passwordless), and lands in a dashboard showing their past and
upcoming readings. Recorded readings are delivered there as video + downloadable
PDF notes. Clients can manage their birth info, book again, and leave a
testimonial. On the admin side, the same data becomes a lightweight CRM: every
client, their birth data, and their full reading history in one place — plus
automated emails (e.g. a testimonial request a day or two after delivery).

---

## The pivotal architecture decision: static export → server runtime

The site is currently a **static export** (`output: "export"` in
`next.config.ts`, deployed on Vercel, originally for GitHub Pages). No server
runtime: no API routes, server actions, middleware, or request-time fetching.
We've worked around this with client-side Supabase + Edge Functions (reviews,
admin, notifications).

Most of this roadmap — direct Stripe, payment webhooks, auth-gated dashboards,
signed video URLs, CRM mutations — wants real server endpoints. Forcing it all
through Edge Functions works but gets awkward at scale.

**Decision:** drop `output: "export"` and run Next.js in its normal server mode
on Vercel **at the start of Phase 1**. It unlocks:

- API routes / server actions for Stripe (secret key stays server-side).
- Middleware to properly protect `/account` and `/admin` (today `/admin` is a
  public page guarded only by client-side checks + RLS).
- Server-side data loading where it's cleaner than client fetching.

### What "going to a server" actually means

It is **not** a new server to rent or manage, and **not** a move away from
Vercel + Supabase. Same Vercel, same Supabase. The only change is how Vercel
runs the Next.js build:

- **Static export (now):** `next build` emits plain HTML/JS; Vercel serves it
  like a CDN. None of our code runs per request → no API routes/actions.
- **Server mode (default Next):** `next build` emits static pages **plus**
  serverless functions for the dynamic parts, which Vercel runs automatically
  on each request. Nothing to provision or patch.

The switch is mechanically small: remove `output: "export"` (and the
GitHub-Pages `basePath`/`assetPrefix` leftovers) from `next.config.ts`, then
redeploy. Existing pages keep working — server mode is a superset of static.
Cost stays ~free at this scale (Vercel free/Pro tiers include serverless
execution). Supabase's role is unchanged.

Until Phase 1 begins, **stay static**. (See `CLAUDE.md` for current constraints.)

---

## Building blocks

| Concern | Tool | Notes |
|---|---|---|
| Auth | Supabase Auth (magic link for clients, password for admin) | Configure **custom SMTP via Resend** so auth emails are branded and don't hit rate limits / spam. |
| Database | Supabase Postgres + RLS | Role-based: `is_admin()` already exists; clients gated by `user_id = auth.uid()`. |
| Files (PDFs) | Supabase Storage | Per-client folders, RLS so clients see only their own. |
| Video | **Unlisted YouTube** (decided) | Watch-only in the dashboard; no in-app downloads. If a client wants the file, share ad-hoc via Dropbox. Store `provider + id` per reading. |
| Payments | Stripe Checkout Sessions + webhook | Replaces the static payment links. Needs a server endpoint. |
| Scheduling | **Cal.com** (decided) — embed + webhook | Don't hand-build timezones/availability/reminders. |
| Transactional email | Resend (verified domain `ordinarymysticreadings.com`) | Already wired for review notifications. |
| Scheduled jobs | Supabase `pg_cron` + Edge Function | For automated testimonial-request emails, reminders. |

---

## Data model (sketch)

RLS pattern: clients access rows where `user_id = auth.uid()`; admin accesses
all via `is_admin()`. Refine when building each table.

- **profiles** — `id` (= `auth.users.id`), `full_name`, `email`, `role`
  (default `client`), `created_at`. Auto-created on signup via trigger.
- **birth_data** — `user_id`, `birth_date`, `birth_time`, `birth_location`,
  `lat`, `lng`, `tz`, `created_at`. (Supports the free birth-chart feature.)
- **readings** — `id`, `user_id`, `type` (15/30/60), `mode` (live/recorded),
  `status` (pending → paid → scheduled → completed → delivered), `price`,
  `stripe_payment_id`, `booking_ref` (Cal.com/Calendly), `scheduled_at`,
  `created_at`.
- **reading_files** — `id`, `reading_id`, `kind` (`pdf` | `video`),
  `storage_path` (for PDFs) or `video_provider` + `video_id`, `created_at`.
- **reviews** — exists today. Add optional `user_id` and `reading_id` links so
  a testimonial can tie back to a specific client/reading.

---

## Feature notes & tradeoffs

### Direct Stripe (replaces payment links)
Checkout Session created server-side per reading type; on `checkout.session.completed`
webhook, fulfill: create the `readings` row, create/find the Supabase user by
email, send the magic link. Keep Stripe products mapped to the 15/30/60 ×
live/recorded matrix. Test mode keys already in `.env.local`.

### Client accounts (magic link)
On first successful booking, create the auth user and email a magic link to
their dashboard. Passwordless avoids password support burden. Admin stays on
password (or also magic link).

### Booking — DECIDED: Cal.com
Embed Cal.com (open source, good embed + webhooks). The webhook ties a booking
to a reading and sets `scheduled_at`. Revisit native scheduling only if the
embed ever limits us.

### Video delivery — DECIDED
- **Unlisted YouTube embeds**, watch-only in the dashboard. Free, reliable,
  hour-long fine; "unlisted" is effectively private for this use.
- **No in-app downloads.** If a client specifically wants the video file, share
  it ad-hoc via Dropbox (or similar) — not worth building a download feature.
- Schema still stores `provider + id`, so a future move to private streaming
  (Cloudflare Stream / Mux) stays possible without a rewrite.
- **Avoid** raw uploads to Supabase Storage for hour-long video.

### PDF notes
Supabase Storage, one folder per client (or per reading). RLS + signed URLs so
only the owning client (and admin) can download.

### Admin CRM
Extend the existing `/admin` area: client list, per-client birth data + reading
history, upload PDF/attach video per reading, change reading status. All CRUD
over the tables above, gated by `is_admin()`.

### Free birth chart
Needs ephemeris math — Swiss Ephemeris (self-hosted compute) or an API
(Prokerala, Astro-Seek). Later phase; external dependency. Could be a
client-facing freebie that also captures birth data for the CRM.

### Lifecycle automations
`pg_cron` daily job → Edge Function → Resend:
- Testimonial request N days after a reading is `delivered`/`completed` and the
  client hasn't reviewed.
- Optional: booking reminders, "your recording is ready" emails.

---

## Phased plan

Each phase is shippable on its own; reassess scope before starting.

- **Phase 0 — done.** Public testimonials, admin moderation, role-based auth
  (`is_admin()`), Resend notifications.
- **Phase 1 — Server switch + client accounts + dashboard skeleton.** First,
  **drop static export** (remove `output: "export"`; redeploy). Then magic-link
  login, `profiles` + `birth_data`, middleware-protected `/account` dashboard
  listing readings (entered manually by admin at first).
- **Phase 2 — Direct Stripe + Cal.com booking.** Replace payment links with
  Checkout + webhook fulfillment; booking creates a reading and the user.
  Embed Cal.com.
- **Phase 3 — Reading delivery.** Video (unlisted YouTube) + PDF (Supabase
  Storage) per reading, shown in the client dashboard.
- **Phase 4 — Admin CRM.** Full client/reading/file management in `/admin`.
- **Phase 5 — Automations.** `pg_cron` + Resend for testimonial requests and
  reminders.
- **Phase 6 — Extras.** Free birth chart generation; "update my birth info"
  self-service.

---

## Decisions made

- **Video:** unlisted YouTube, watch-only; downloads handled ad-hoc via Dropbox.
- **Scheduling:** Cal.com (embed + webhook).
- **Static → server:** switch at the start of Phase 1.

## Open questions / decisions to revisit

- **Birth chart:** self-hosted ephemeris (Swiss Ephemeris) vs paid API
  (Prokerala/Astro-Seek).
- **Data retention:** how long to keep PDFs; storage cost ceiling. (Video lives
  on YouTube, so not a storage concern.)
- **One reading ↔ one client** vs gift/third-party readings (someone books for
  someone else).
