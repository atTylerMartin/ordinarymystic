// GA4 events. The gtag snippet in the root layout defines `window.gtag`; every
// helper here no-ops when it is absent (blocked, not loaded, or a test), so a
// tap can never break because analytics did. Every event also carries
// `source`, the first-touch attribution string (see `attribution.ts`).
//
// GA4 Admin needs the custom dimensions `tier`, `mode`, `label`, `campaign`
// and `source` registered, and `book_click`, `pay_tap` and `pay_paid` marked
// as key events.

import { attributionSource, readAttribution } from "@/lib/attribution";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, string | number | boolean>;

export function trackEvent(name: string, params: Params = {}): void {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("event", name, { ...params, source: attributionSource() });
  } catch {
    // Analytics is never worth breaking the page for.
  }
}

export type PayLabel = "stream-3card" | "stream-full" | "cashapp" | "paypal";
export type SocialLabel = "tiktok" | "youtube" | "tulsa" | "email" | "cashapp" | "paypal";

/** The `utm_campaign` on the current address, else the stored first-touch one. */
export function currentCampaign(): string {
  if (typeof window === "undefined") return "";
  const fromUrl = new URLSearchParams(window.location.search).get("utm_campaign")?.trim();
  return (fromUrl || readAttribution()?.utm_campaign || "").slice(0, 100);
}

export function trackBookClick(p: { tier: 15 | 30 | 60; mode: "recorded" | "live" }): void {
  trackEvent("book_click", { tier: p.tier, mode: p.mode });
}

export function trackPayTap(p: { label: PayLabel; campaign?: string }): void {
  trackEvent("pay_tap", { label: p.label, campaign: p.campaign ?? currentCampaign() });
}

export function trackPayPaid(p: { campaign?: string } = {}): void {
  trackEvent("pay_paid", { campaign: p.campaign ?? currentCampaign() });
}

export function trackSocialTap(p: { label: SocialLabel }): void {
  trackEvent("social_tap", { label: p.label });
}

export function trackGuideCta(p: { slug: string; href: string }): void {
  trackEvent("guide_cta", { slug: p.slug, href: p.href });
}

export function trackReviewSubmit(p: { rating: number }): void {
  trackEvent("review_submit", { rating: p.rating });
}

export function trackLinkTap(p: { label: string }): void {
  trackEvent("link_tap", { label: p.label });
}

/** A serializable description of an event, so a server component can hand one
 * to `TrackedLink` (functions cannot cross the server/client boundary). */
export type TrackedEvent =
  | ({ type: "book_click" } & Parameters<typeof trackBookClick>[0])
  | ({ type: "pay_tap" } & Parameters<typeof trackPayTap>[0])
  | ({ type: "social_tap" } & Parameters<typeof trackSocialTap>[0])
  | ({ type: "guide_cta" } & Parameters<typeof trackGuideCta>[0])
  | ({ type: "link_tap" } & Parameters<typeof trackLinkTap>[0]);

export function fireTrackedEvent(event: TrackedEvent): void {
  switch (event.type) {
    case "book_click":
      return trackBookClick(event);
    case "pay_tap":
      return trackPayTap(event);
    case "social_tap":
      return trackSocialTap(event);
    case "guide_cta":
      return trackGuideCta(event);
    case "link_tap":
      return trackLinkTap(event);
  }
}
