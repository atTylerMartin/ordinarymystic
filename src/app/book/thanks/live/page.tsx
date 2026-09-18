import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Thanks for booking",
  description: "Your live reading is confirmed. We'll be in touch to schedule your Zoom session.",
};

export default function ThanksLivePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Thanks for booking!
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Your <strong className="text-slate-900">live reading</strong> is
          confirmed. I&apos;ll follow up by email to set a time for our Zoom
          session and work out any details we need.
        </p>
        <p>
          We&apos;ll draw the cards together and talk it through as it unfolds.
          Afterward, once I&apos;ve had time to sit with the full reading,
          I&apos;ll send you a written synthesis you can keep.
        </p>
        <p>
          If you have questions before you hear from me, reach out at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
      <p>
        <Link
          href="/"
          className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
