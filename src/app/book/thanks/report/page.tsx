import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/config";
import { NOINDEX } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Thanks for your order",
  description: "Your written report order is confirmed. You'll receive your PDF once it's ready.",
  ...NOINDEX,
};

export default function ThanksReportPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Thanks for your order!
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Your <strong className="text-slate-900">written report</strong> order
          is confirmed. I should have what I need; if I need any follow-up info,
          I&apos;ll get in touch.
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
