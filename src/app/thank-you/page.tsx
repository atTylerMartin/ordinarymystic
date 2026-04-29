import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Booking Confirmed — Ordinary Mystic",
  description: "Your reading has been booked. I'll be in touch soon.",
};

export default function ThankYouPage() {
  return (
    <div className="space-y-2">
      <section className="space-y-8 py-16 max-w-xl">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-rule)" }}
        >
          <CheckCircle className="h-6 w-6 text-[var(--color-ink)]" />
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            You&apos;re booked.
          </h1>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            Thank you for booking a reading. I&apos;ll be in touch shortly with next steps,
            timing, and anything else I need from you based on the reading you chose.
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            If you have anything to add to your question or context before we begin,
            feel free to reply to your confirmation email.
          </p>
        </div>

        <div
          className="space-y-1 border-l-2 pl-4 text-sm text-[var(--color-muted)]"
          style={{ borderColor: "var(--color-rule)" }}
        >
          <p className="font-medium text-[var(--color-ink)]">What happens next</p>
          <p>You&apos;ll receive a payment receipt from Stripe.</p>
          <p>I&apos;ll follow up within 24–48 hours with details specific to your reading.</p>
          <p>Your written report or recorded video will be delivered by email.</p>
        </div>

        <Link href="/">
          <Button type="button" variant="outline" size="md">
            Back to home
          </Button>
        </Link>
      </section>
    </div>
  );
}
