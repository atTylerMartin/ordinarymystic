import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { buttonVariants } from "@/components/button";
import { Card } from "@/components/card";
import { TIKTOK_URL } from "@/lib/config";
import { LIVE_STREAM, STREAM_COPY, WALLETS } from "@/lib/offerings";
import { cn } from "@/lib/utils";
import { PaidNotice } from "./paid-notice";

// Linked from the TikTok bio and Service+ messages only. Kept out of search
// and out of the sitemap.
export const metadata: Metadata = {
  title: "Pay for your reading",
  robots: { index: false, follow: false },
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function PayPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <Image
            src="/images/profile-img.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            {STREAM_COPY.brand}
          </span>
        </div>
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900">
          {STREAM_COPY.title}
        </h1>
        <p className="text-base leading-relaxed text-slate-700">
          {STREAM_COPY.lede}
        </p>
      </header>

      <Suspense fallback={null}>
        <PaidNotice />
      </Suspense>

      {/* ── Tiers ────────────────────────────────────────────────────────── */}
      {LIVE_STREAM.map((tier) => (
        <Card
          key={tier.key}
          className={cn(
            "flex flex-col gap-3",
            tier.featured && "border-2 border-[#213752] shadow-lg",
          )}
        >
          {tier.featured ? (
            <div>
              <Badge className="border-[#213752] bg-[#213752] text-white">
                {STREAM_COPY.featuredBadge}
              </Badge>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-heading text-xl font-black tracking-tight text-slate-900">
              {tier.name}
            </h2>
            <p className="font-heading text-2xl font-black tracking-tight text-slate-900">
              ${tier.price}
            </p>
          </div>
          <p className="-mt-2 text-sm font-medium text-slate-600">
            {tier.blurb}
          </p>
          <p className="text-sm leading-relaxed text-slate-700">
            {tier.explain}
          </p>
          <p className="text-xs text-slate-500">
            {STREAM_COPY.coinsLine(tier.coins)}
          </p>
          {tier.url ? (
            <a
              href={tier.url}
              {...external}
              className={cn(
                buttonVariants({
                  variant: tier.featured ? "primary" : "outline",
                  size: "md",
                }),
                "w-full",
              )}
            >
              {STREAM_COPY.cardCta}
            </a>
          ) : null}
        </Card>
      ))}

      {/* ── Wallets ──────────────────────────────────────────────────────── */}
      <Card className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          {STREAM_COPY.walletsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={WALLETS.cashApp}
            {...external}
            className={cn(buttonVariants({ size: "md" }), "w-full")}
          >
            {STREAM_COPY.cashAppCta}
          </a>
          <a
            href={WALLETS.paypal}
            {...external}
            className={cn(buttonVariants({ size: "md" }), "w-full")}
          >
            {STREAM_COPY.paypalCta}
          </a>
        </div>
        <p className="text-sm text-slate-600">{STREAM_COPY.walletsNote}</p>
      </Card>

      {/* ── Longer readings ──────────────────────────────────────────────── */}
      <Card className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          {STREAM_COPY.longerTitle}
        </h2>
        <div className="flex flex-col gap-2">
          <Link
            href="/#book"
            className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
          >
            {STREAM_COPY.recordedCta}
          </Link>
          <Link
            href="/#live"
            className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
          >
            {STREAM_COPY.liveCta}
          </Link>
        </div>
      </Card>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <Card className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-slate-900">
          {STREAM_COPY.reviewTitle}
        </h2>
        <Link
          href="/#reviews"
          className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
        >
          {STREAM_COPY.reviewCta}
        </Link>
      </Card>

      {/* ── Follow ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          {STREAM_COPY.followTitle}
        </p>
        <a
          href={TIKTOK_URL}
          {...external}
          className="text-sm font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
        >
          {STREAM_COPY.tiktokCta}
        </a>
      </div>
    </div>
  );
}
