import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/button";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Booking Confirmed — Ordinary Mystic",
  description: "Your reading has been booked. I'll be in touch soon.",
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-xl space-y-8 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <CheckCircle className="h-6 w-6 text-slate-900" />
      </div>

      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          You&apos;re booked.
        </h1>
        <p className="text-sm leading-relaxed text-slate-700">
          Thank you for booking a reading. I&apos;ll be in touch shortly with next steps,
          timing, and anything else I need from you based on the reading you chose.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          If you have anything to add before we begin, feel free to reply to your
          confirmation email or reach out at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>

      <div className="space-y-1 border-l-2 border-slate-200 pl-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">What happens next</p>
        <p>You&apos;ll receive a payment receipt from Stripe.</p>
        <p>I&apos;ll follow up within 24–48 hours with details specific to your reading.</p>
      </div>

      <Link href="/">
        <Button type="button" variant="outline" size="md">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
