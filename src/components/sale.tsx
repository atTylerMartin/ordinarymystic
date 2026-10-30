"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Ghost } from "lucide-react";
import { SALE, SALE_ENDS_MS } from "@/lib/sale";
import { cn } from "@/lib/utils";

// The static export renders the sale as on; the browser turns it off once the
// clock passes SALE.ends, so a stale build never advertises a dead code.
export function useSaleActive() {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const left = Math.max(0, SALE_ENDS_MS - Date.now());
    const t = setTimeout(() => setActive(false), Math.min(left, 2 ** 31 - 1));
    return () => clearTimeout(t);
  }, []);
  return active;
}

function CodeChip() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SALE.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code is still on screen to type.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-orange-500 bg-orange-50 px-3 py-1.5 font-mono text-base font-bold tracking-wider text-orange-700 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      aria-label={`Copy the code ${SALE.code}`}
    >
      {SALE.code}
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

/** The sale card: headline, the code (tap to copy), the deadline. */
export function SaleBanner({ className, href }: { className?: string; href?: string }) {
  const active = useSaleActive();
  if (!active) return null;
  return (
    <div
      className={cn(
        "rounded-2xl border border-orange-200 bg-white px-5 py-4 text-center shadow-md",
        className,
      )}
    >
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-orange-600">
        <Ghost className="h-4 w-4" aria-hidden />
        {SALE.label}
      </p>
      <p className="mt-1 font-heading text-xl font-black tracking-tight text-slate-900">
        {href ? (
          <Link href={href} className="hover:underline">
            {SALE.headline}
          </Link>
        ) : (
          SALE.headline
        )}
      </p>
      <div className="mt-3 flex justify-center">
        <CodeChip />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {SALE.howTo} {SALE.endsLabel}
      </p>
    </div>
  );
}

/** A small pill for the dark hero, linking down to the tiers. */
export function SalePill({ href }: { href: string }) {
  const active = useSaleActive();
  if (!active) return null;
  return (
    <Link
      href={href}
      className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-400/15 px-3 py-1.5 text-sm font-medium text-orange-100 hover:bg-orange-400/25"
    >
      <Ghost className="h-4 w-4" aria-hidden />
      ${SALE.amountOff} off recorded readings: {SALE.code}
    </Link>
  );
}

/** "Sale" badge for a tier card. */
export function SaleBadge() {
  const active = useSaleActive();
  if (!active) return null;
  return (
    <span className="inline-flex items-center rounded-full border border-orange-500 bg-orange-500 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
      Sale
    </span>
  );
}

/** The tier price, struck through beside the sale price while the sale runs. */
export function SalePrice({ price, className }: { price: number; className?: string }) {
  const active = useSaleActive();
  if (!active) return <p className={className}>${price}</p>;
  return (
    <p className={cn(className, "flex items-baseline gap-2")}>
      <span>${price - SALE.amountOff}</span>
      <s className="text-lg font-semibold text-slate-400" aria-label={`was $${price}`}>
        ${price}
      </s>
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-orange-600">
        with {SALE.code}
      </span>
    </p>
  );
}

/** Swaps in the Halloween text while the sale runs. */
export function Seasonal({ normal, halloween }: { normal: string; halloween?: string }) {
  const active = useSaleActive();
  return <>{active && halloween ? halloween : normal}</>;
}

/** The pay page's Halloween header line, a pill above the title. */
export function SaleKicker() {
  const active = useSaleActive();
  if (!active) return null;
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
      <Ghost className="h-3.5 w-3.5" aria-hidden />
      Halloween weekend
    </p>
  );
}
