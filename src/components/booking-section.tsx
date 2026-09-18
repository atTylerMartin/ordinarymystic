import Link from "next/link";
import { Check, Clock, Mail } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { CONTACT_EMAIL } from "@/lib/config";
import {
  LIVE,
  LIVE_COPY,
  ONGOING_COPY,
  RECORDED,
  RECORDED_COPY,
  TULSA_CROSSLINK,
  TULSA_TAROT_READER_EVENTS_URL,
  TULSA_TAROT_READER_URL,
  type Tier,
} from "@/lib/offerings";

// A Payment Link with no URL yet falls back to email, so a new price is never
// shown behind an old link.
function bookingHref(tier: Tier, kind: "recorded" | "live") {
  if (tier.url) return tier.url;
  const subject = `${kind === "recorded" ? "Recorded" : "Live"} reading — ${tier.minutes} minutes`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

function BookButton({
  tier,
  kind,
  label,
  variant,
  className,
}: {
  tier: Tier;
  kind: "recorded" | "live";
  label: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const pending = !tier.url;
  return (
    <Link
      href={bookingHref(tier, kind)}
      {...(pending ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="w-full"
    >
      <Button
        type="button"
        size="sm"
        variant={variant}
        className={`w-full ${className ?? ""}`}
        leftIcon={pending ? <Mail className="h-4 w-4" /> : undefined}
      >
        {pending ? `Email to book · $${tier.price}` : label}
      </Button>
    </Link>
  );
}

export function BookingSection() {
  const recordedFeatured = RECORDED.find((t) => t.featured) ?? RECORDED[1];

  return (
    <section
      id="book"
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-16 sm:py-20"
      style={{ backgroundColor: "#faf8f6" }}
    >
      <Container className="px-4 sm:px-6">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-slate-500">
          Offerings
        </p>
        <h2 className="mt-2 font-heading text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Book a Reading
        </h2>

        {/* ── Recorded: the primary offering ─────────────────────────────── */}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[#213752]">
            {RECORDED_COPY.kicker}
          </p>
          <h3 className="mt-2 font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {RECORDED_COPY.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            {RECORDED_COPY.lede}
          </p>
          <ul className="mx-auto mt-6 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
            {RECORDED_COPY.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#213752]"
                  aria-hidden
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl items-start gap-6 md:grid-cols-3">
          {RECORDED.map((tier) => (
            <Card
              key={tier.minutes}
              className={
                tier.featured
                  ? "flex flex-col border-2 border-[#213752] shadow-lg md:-mt-3 md:pb-8"
                  : "flex flex-col"
              }
            >
              <div className="mb-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d2a4a] text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  {tier.featured ? (
                    <Badge className="border-[#213752] bg-[#213752] text-white">
                      Most popular
                    </Badge>
                  ) : null}
                </div>
                <h4 className="text-base font-semibold text-slate-900">
                  {tier.minutes} minutes
                </h4>
                <p className="font-heading text-2xl font-black tracking-tight text-slate-900">
                  ${tier.price}
                </p>
                <p className="text-sm text-slate-600">{tier.blurb}</p>
              </div>
              <div className="mt-auto pt-2">
                <BookButton
                  tier={tier}
                  kind="recorded"
                  label={RECORDED_COPY.cta(tier)}
                  variant={tier.featured ? "primary" : "outline"}
                />
              </div>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-slate-600">
          Most people start with the {recordedFeatured.minutes}-minute recorded
          reading.
        </p>

        {/* ── Live: secondary ────────────────────────────────────────────── */}
        <div className="mx-auto mt-16 max-w-3xl border-t border-slate-200 pt-12 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
            {LIVE_COPY.kicker}
          </p>
          <h3 className="mt-2 font-heading text-2xl font-black tracking-tight text-slate-900">
            {LIVE_COPY.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            {LIVE_COPY.lede}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {LIVE_COPY.premium} {LIVE_COPY.standard}
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
          {LIVE.map((tier) => (
            <div
              key={tier.minutes}
              className={`flex flex-col gap-2 rounded-2xl border bg-white p-5 ${
                tier.featured ? "border-slate-300" : "border-slate-200/80"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {tier.minutes} minutes
                </span>
                <span className="font-heading text-lg font-black tracking-tight text-slate-900">
                  ${tier.price}
                </span>
              </div>
              <p className="text-sm text-slate-600">{tier.blurb}</p>
              <div className="mt-auto pt-3">
                <BookButton
                  tier={tier}
                  kind="live"
                  label={LIVE_COPY.cta(tier)}
                  variant="outline"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Ongoing ────────────────────────────────────────────────────── */}
        <Card className="mx-auto mt-12 max-w-3xl">
          <h3 className="font-heading text-xl font-black tracking-tight text-slate-900">
            {ONGOING_COPY.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            {ONGOING_COPY.body}
          </p>
          <div className="mt-5">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                "Ongoing readings"
              )}`}
            >
              <Button
                type="button"
                size="sm"
                leftIcon={<Mail className="h-4 w-4" />}
              >
                {ONGOING_COPY.cta}
              </Button>
            </a>
          </div>
        </Card>

        {/* ── Payment note (unchanged) ───────────────────────────────────── */}
        <p className="mt-8 text-center text-sm text-slate-600">
          Prefer{" "}
          <a
            href="https://cash.app/$ordinarymystic"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
          >
            Cash App
          </a>{" "}
          or{" "}
          <a
            href="https://paypal.me/ordinarymystic"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
          >
            PayPal
          </a>
          ? That&apos;s fine too. Just{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
          >
            email me
          </a>{" "}
          your details after you submit a payment.
        </p>

        {/* ── Sibling brand ──────────────────────────────────────────────── */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-200 bg-white/70 px-6 py-5 text-center">
          <p className="text-sm font-semibold text-slate-900">
            {TULSA_CROSSLINK.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            {TULSA_CROSSLINK.body}
          </p>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
            <a
              href={TULSA_TAROT_READER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
            >
              {TULSA_CROSSLINK.cta}
            </a>
            <a
              href={TULSA_TAROT_READER_EVENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
            >
              {TULSA_CROSSLINK.eventsCta}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
