import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Breadcrumbs path="/privacy" />
      <header className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Last updated September 2026</p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          This site does not require an account and does not sell your data.
          Here is what is collected and why.
        </p>
        <p>
          <strong className="text-slate-900">Payments.</strong> Booking a
          reading takes you to Stripe, which processes your payment and
          collects the billing details it needs to do that. Ordinary Mystic
          never sees or stores your card number.
        </p>
        <p>
          <strong className="text-slate-900">Reviews and newsletter
          subscribers.</strong> If you leave a review, it is stored in a
          database managed by Supabase and shown publicly only after approval.
          If you sign up for the newsletter, your email address, your first
          name if you give it, and the page and source you arrived from are
          stored the same way, and your address is added to a mailing list at
          Resend. They are used to send the newsletter you asked for and
          nothing else. Every email carries an unsubscribe link.
        </p>
        <p>
          <strong className="text-slate-900">Email.</strong> Booking
          confirmations, review notifications and the newsletter are sent
          through Resend.
        </p>
        <p>
          <strong className="text-slate-900">Analytics.</strong> Google
          Analytics 4 measures site traffic in aggregate. It is not used to
          identify you personally.
        </p>
        <p>
          Questions about this policy or a request to remove your data can go
          to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
