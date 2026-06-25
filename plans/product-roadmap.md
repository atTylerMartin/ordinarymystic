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

**Recommendation:** when **Phase 2 (Stripe/dashboards)** begins, drop
`output: "export"` and run Next.js as a standard server app on Vercel. We're
already on Vercel, so this is a config change, not a migration. It unlocks:

- API routes / server actions for Stripe (secret key stays server-side).
- Middleware to protect `/account` and `/admin`.
- Server-side data loading where it's cleaner than client fetching.

Until Phase 2, **stay static** — it's simpler and the current features don't
need a server. (See `CLAUDE.md` for the current static-export constraints.)

---

## Building blocks

| Concern | Tool | Notes |
|---|---|---|
| Auth | Supabase Auth (magic link for clients, password for admin) | Configure **custom SMTP via Resend** so auth emails are branded and don't hit rate limits / spam. |
| Database | Supabase Postgres + RLS | Role-based: `is_admin()` already exists; clients gated by `user_id = auth.uid()`. |
| Files (PDFs) | Supabase Storage | Per-client folders, RLS so clients see only their own. |
| Video | Unlisted YouTube → later Cloudflare Stream / Mux | Store `provider + id` per reading so the source can change without schema churn. |
| Payments | Stripe Checkout Sessions + webhook | Replaces the static payment links. Needs a server endpoint. |
| Scheduling | Cal.com or Calendly (embed + webhook) first; native later | Don't hand-build timezones/availability/reminders early. |
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

### Booking
Start embedded (Cal.com recommended — open source, good embed + webhooks). The
webhook ties a booking to a reading and sets `scheduled_at`. Revisit native
scheduling only if the embed limits us.

### Video delivery
- **Phase 1 source: unlisted YouTube.** Free, reliable streaming, hour-long
  fine. Embed per reading. "Unlisted" is effectively private for this use.
- **Upgrade path: Cloudflare Stream or Mux** for private, signed, branded
  playback (paid, ~per-minute). Schema already abstracts the provider.
- **Avoid** raw uploads to Supabase Storage for hour-long video (no adaptive
  streaming, bandwidth cost, small free tier).

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
- **Phase 1 — Client accounts + dashboard skeleton.** Magic-link login,
  `profiles` + `birth_data`, `/account` dashboard listing readings (entered
  manually by admin at first). Decide static-vs-server here or defer to Phase 2.
- **Phase 2 — Direct Stripe + booking.** Replace payment links with Checkout +
  webhook fulfillment; booking creates a reading and the user. Likely **migrate
  off static export** now. Add Cal.com/Calendly.
- **Phase 3 — Reading delivery.** Video (unlisted YouTube) + PDF (Supabase
  Storage) per reading, shown in the client dashboard.
- **Phase 4 — Admin CRM.** Full client/reading/file management in `/admin`.
- **Phase 5 — Automations.** `pg_cron` + Resend for testimonial requests and
  reminders.
- **Phase 6 — Extras.** Free birth chart generation; "update my birth info"
  self-service.

---

## Open questions / decisions to revisit

- **Video privacy bar:** is unlisted YouTube acceptable long-term, or is
  signed/private streaming (Cloudflare Stream/Mux) worth the cost sooner?
- **Scheduling:** Cal.com vs Calendly vs native — which fits the booking flow
  and budget?
- **When exactly to drop static export** — at Phase 1 or Phase 2?
- **Birth chart:** self-hosted ephemeris vs paid API.
- **Data retention:** how long to keep recordings/PDFs; storage cost ceiling.
- **One reading ↔ one client** vs gift/third-party readings (someone books for
  someone else).
