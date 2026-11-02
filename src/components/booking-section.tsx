import { Check, Clock, Mail } from "lucide-react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { TrackedLink } from "@/components/tracked-link";
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
  WALLETS,
  type Tier,
} from "@/lib/offerings";
import { cn } from "@/lib/utils";

// A Payment Link with no URL yet falls back to email, so a new price is never
// shown behind an old link.
function bookingHref(tier: Tier, kind: "recorded" | "live") {
  if (tier.url) return tier.url;
  const subject = `${kind === "recorded" ? "Recorded" : "Live"} reading, ${tier.minutes} minutes`;
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
    <TrackedLink
      href={bookingHref(tier, kind)}
      event={{ type: "book_click", tier: tier.minutes, mode: kind }}
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
        {pending ? "Email to book" : label}
      </Button>
    </TrackedLink>
  );
}

/** The four recorded-reading bullets from offerings.ts. */
export function RecordedBullets({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-2 text-left sm:grid-cols-2", className)}>
      {RECORDED_COPY.bullets.map((bullet) => (
        <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#213752]" aria-hidden />
          {bullet}
        </li>
      ))}
    </ul>
  );
}

/** The three recorded tiers with the featured one marked, and Stripe buttons. */
export function RecordedTiers({ className }: { className?: string }) {
  const recordedFeatured = RECORDED.find((t) => t.featured) ?? RECORDED[1];

  return (
    <div className={className}>
      <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-3">
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
              <h3 className="text-base font-semibold text-slate-900">
                {tier.minutes} minutes
              </h3>
              <p className="font-heading text-2xl font-black tracking-tight text-slate-900">
                ${tier.price}
              </p>
              <p className="text-sm text-slate-600">{tier.blurb}</p>
            </div>
            <div className="mt-auto pt-2">
              <BookButton
                tier={tier}
                kind="recorded"
                label={RECORDED_COPY.cta}
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
    </div>
  );
}

/** The three live tiers, with the featured one marked, and Stripe buttons. */
export function LiveTiers({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto grid max-w-5xl gap-4 md:grid-cols-3", className)}>
      {LIVE.map((tier) => (
        <div
          key={tier.minutes}
          className={cn(
            "flex flex-col gap-2 rounded-2xl border bg-white p-5",
            tier.featured ? "border-2 border-[#213752]" : "border-slate-200/80",
          )}
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {tier.minutes} minutes
            </h3>
            <span className="font-heading text-lg font-black tracking-tight text-slate-900">
              ${tier.price}
            </span>
          </div>
          {tier.featured ? (
            <p className="text-xs font-medium uppercase tracking-wide text-[#213752]">
              Most popular
            </p>
          ) : null}
          <p className="text-sm text-slate-600">{tier.blurb}</p>
          <div className="mt-auto pt-3">
            <BookButton
              tier={tier}
              kind="live"
              label={LIVE_COPY.cta}
              variant={tier.featured ? "primary" : "outline"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Ongoing readings: no checkout, an email CTA. */
export function OngoingCard({ id, className }: { id?: string; className?: string }) {
  return (
    <Card className={cn("mx-auto max-w-5xl scroll-mt-24", className)}>
      <h2 id={id} className="scroll-mt-24 font-heading text-xl font-black tracking-tight text-slate-900">
        {ONGOING_COPY.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{ONGOING_COPY.body}</p>
      <div className="mt-5">
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Ongoing readings")}`}>
          <Button type="button" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
            {ONGOING_COPY.cta}
          </Button>
        </a>
      </div>
    </Card>
  );
}

const inlineLink =
  "font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900";

/** Cash App and PayPal, for anyone who would rather not use a card. */
export function WalletNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-sm text-slate-600", className)}>
      Prefer{" "}
      <a href={WALLETS.cashApp} target="_blank" rel="noopener noreferrer" className={inlineLink}>
        Cash App
      </a>{" "}
      or{" "}
      <a href={WALLETS.paypal} target="_blank" rel="noopener noreferrer" className={inlineLink}>
        PayPal
      </a>
      ? That&apos;s fine too. Just{" "}
      <a href={`mailto:${CONTACT_EMAIL}`} className={inlineLink}>
        email me
      </a>{" "}
      your question and which reading you paid for.
    </p>
  );
}

/** The hand-off to Tulsa Tarot Reader. */
export function TulsaCrosslink({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/70 px-6 py-5 text-center",
        className,
      )}
    >
      <p className="text-sm font-semibold text-slate-900">{TULSA_CROSSLINK.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{TULSA_CROSSLINK.body}</p>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm">
        <a href={TULSA_TAROT_READER_URL} target="_blank" rel="noopener noreferrer" className={inlineLink}>
          {TULSA_CROSSLINK.cta}
        </a>
        <a
          href={TULSA_TAROT_READER_EVENTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLink}
        >
          {TULSA_CROSSLINK.eventsCta}
        </a>
      </p>
    </div>
  );
}
