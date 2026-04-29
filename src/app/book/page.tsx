import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Video, ChevronRight } from "lucide-react";
import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { WrittenTarotCard } from "@/components/booking/written-tarot-card";
import {
  TAROT_QUICK_PULL_URL,
  TAROT_RECORDED_URL,
  ASTRO_WRITTEN_NATAL_URL,
  ASTRO_WRITTEN_TRANSIT_URL,
  ASTRO_ANNUAL_PROFECTIONS_URL,
} from "@/lib/config";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Reading",
  description:
    "One-on-one tarot and astrology readings — written reports and recorded video. Hellenistic astrology and tarot as structured thinking, not performance.",
  alternates: {
    canonical: `${SITE_URL}/book`,
  },
};

export default function BookingPage() {
  return (
    <div className="space-y-2">

      {/* Intro */}
      <section
        className="space-y-5 pb-12"
        style={{ borderBottom: "1px solid var(--color-rule)" }}
      >
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          Book a Reading
        </h1>
        <div className="space-y-4 text-sm leading-relaxed text-[var(--color-ink)] max-w-2xl">
          <p>
            Every reading is delivered as a written report or a recorded video. You send your
            question and context; you receive something concrete you can return to and revisit.
            No calls, no scheduling.
          </p>
          <p>
            Tarot and astrology are each offered as distinct services. Choose based on what fits
            your question.
          </p>
          <p>
            For astrology readings, an accurate birth time is required. If you don&apos;t have
            yours or it&apos;s only approximate, we&apos;ll work with tarot instead.
          </p>
        </div>
        <Link
          href="/faq"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline"
        >
          Have questions? Visit the FAQ
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      {/* Tarot Readings */}
      <section className="pt-12 pb-6 space-y-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            Service
          </p>
          <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-[var(--color-ink)]">
            Tarot Readings
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] max-w-xl">
            Structured, interpretive readings focused on a specific question or theme.
            No birth data required.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="space-y-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-rule)", color: "var(--color-ink)" }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Quick Pull</CardTitle>
              <CardDescription>
                A focused one-to-three card written reading on a single question.
                Low-pressure way to see what the cards bring to a theme you&apos;re sitting with.
              </CardDescription>
              <p className="text-sm font-medium text-[var(--color-ink)]">$25</p>
            </CardHeader>
            <CardFooter>
              <Link href={TAROT_QUICK_PULL_URL} target="_blank">
                <Button type="button" size="sm">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <WrittenTarotCard />

          <Card>
            <CardHeader className="space-y-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-rule)", color: "var(--color-ink)" }}
              >
                <Video className="h-5 w-5" />
              </div>
              <CardTitle>Recorded Reading</CardTitle>
              <CardDescription>
                A recorded video reading you can watch on your own time. Send your question
                and context; receive a private video and notes within 48 hours.
              </CardDescription>
              <p className="text-sm font-medium text-[var(--color-ink)]">$65</p>
            </CardHeader>
            <CardFooter>
              <Link href={TAROT_RECORDED_URL} target="_blank">
                <Button type="button" size="sm">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Astrology Readings */}
      <section
        className="pt-12 pb-6 space-y-8"
        style={{ borderTop: "1px solid var(--color-rule)" }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            Service
          </p>
          <h2 className="font-heading mt-1 text-2xl font-bold tracking-tight sm:text-3xl text-[var(--color-ink)]">
            Astrology Readings
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] max-w-xl">
            Hellenistic astrology, the original Greco-Roman tradition, working with whole sign
            houses, sect, and the seven classical planets. Natal chart interpretation and transit
            forecasting. An accurate birth time is required for all astrology sessions.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="space-y-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-rule)", color: "var(--color-ink)" }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Written Transit / Forecast Reading</CardTitle>
              <CardDescription>
                A written reading focused on current transits and what&apos;s active in your
                chart right now. Practical, time-specific, grounded in what the sky is
                actually doing.
              </CardDescription>
              <p className="text-sm font-medium text-[var(--color-ink)]">$65</p>
            </CardHeader>
            <CardFooter>
              <Link href={ASTRO_WRITTEN_TRANSIT_URL} target="_blank">
                <Button type="button" size="sm">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-rule)", color: "var(--color-ink)" }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Written Natal Chart Reading</CardTitle>
              <CardDescription>
                A full written interpretation of your natal chart, delivered by email. Covers
                major themes, planet placements, sect, and what the nativity says about your
                long-term patterns.
              </CardDescription>
              <p className="text-sm font-medium text-[var(--color-ink)]">$125</p>
            </CardHeader>
            <CardFooter>
              <Link href={ASTRO_WRITTEN_NATAL_URL} target="_blank">
                <Button type="button" size="sm">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-rule)", color: "var(--color-ink)" }}
              >
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Annual Profections Reading</CardTitle>
              <CardDescription>
                A 12-month Hellenistic profections walkthrough of your coming year, delivered
                as a written report. Maps the time lord, activated house, and key transits
                month by month.
              </CardDescription>
              <p className="text-sm font-medium text-[var(--color-ink)]">$95</p>
            </CardHeader>
            <CardFooter>
              <Link href={ASTRO_ANNUAL_PROFECTIONS_URL} target="_blank">
                <Button type="button" size="sm">Book Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Footer nav */}
      <div
        className="pt-10"
        style={{ borderTop: "1px solid var(--color-rule)" }}
      >
        <Link
          href="/faq"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline"
        >
          Have questions? Visit the FAQ
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

    </div>
  );
}
