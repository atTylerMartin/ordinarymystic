import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Breadcrumbs path="/terms" />
      <header className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">Last updated September 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Ordinary Mystic offers tarot and astrology readings for
          entertainment and reflective purposes. Readings are not medical,
          legal, or financial advice, and no outcome is guaranteed. Use your
          own judgment before acting on anything discussed in a reading.
        </p>
        <p>
          Payment for recorded and live readings is processed by Stripe.
          Ordinary Mystic never sees or stores your card details. A completed
          purchase confirms your booking; if you need to reschedule or cancel
          a live session, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <p>
          Recorded readings are prepared privately and delivered as a video
          walkthrough plus a written synthesis. Live readings happen over Zoom
          at a scheduled time.
        </p>
        <p>
          There are no accounts on this site. Reviews you submit are stored in
          a database managed by Supabase and are shown publicly only after
          approval. Email is sent through Resend for booking confirmations and
          review notifications. Google Analytics measures site traffic.
        </p>
        <p>
          These terms may change as the site changes. The version posted here
          is the one in effect.
        </p>
      </section>
    </div>
  );
}
