// First-touch attribution, captured once per session so an event fired from a
// page with no UTM params (a Book button reached through the nav) still
// credits whatever brought the visitor to the site in the first place.
// Client-side only: the site is a static export.

const STORAGE_KEY = "om_attribution";

export type AttributionRecord = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  landing?: string;
};

// TikTok strips referrers, so two pages that are only reached from TikTok
// arrive untagged. The Service+ URL carries its own utm_campaign=live, so an
// untagged /pay is the bio or a typed URL, not the live.
const LANDING_DEFAULTS: Record<string, AttributionRecord> = {
  "/links": { utm_source: "tiktok", utm_medium: "social", utm_campaign: "bio" },
  "/pay": { utm_source: "tiktok", utm_medium: "social", utm_campaign: "pay" },
};

function clean(value: string | null): string | undefined {
  return value?.trim().slice(0, 100) || undefined;
}

/** Call on every page view. No-ops once a record exists for this session:
 * first touch wins and later page views never overwrite it. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utm_source = clean(params.get("utm_source"));
    const utm_medium = clean(params.get("utm_medium"));
    const utm_campaign = clean(params.get("utm_campaign"));
    const path = window.location.pathname.replace(/(.)\/$/, "$1");

    let record: AttributionRecord = {};

    if (utm_source || utm_medium || utm_campaign) {
      record = { utm_source, utm_medium, utm_campaign };
    } else if (document.referrer) {
      const refHost = new URL(document.referrer).hostname;
      if (refHost && refHost !== window.location.hostname) {
        record = { referrer: refHost };
      }
    }

    const tagged = Object.keys(record).length > 0;
    if (!tagged && LANDING_DEFAULTS[path]) {
      record = { ...LANDING_DEFAULTS[path] };
    }

    // Always store the landing page, even for a direct visit: first touch is
    // the first page of the session, and later page views never overwrite it.
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...record, landing: path } satisfies AttributionRecord),
    );
  } catch {
    // sessionStorage unavailable (private mode, blocked), or a malformed
    // referrer. Attribution is never worth breaking the page for.
  }
}

export function readAttribution(): AttributionRecord | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttributionRecord) : null;
  } catch {
    return null;
  }
}

/** "tiktok / social / bio", "referral: google.com", or "direct". */
export function attributionSource(): string {
  const record = readAttribution();
  if (!record) return "direct";

  const utm = [record.utm_source, record.utm_medium, record.utm_campaign]
    .filter((v): v is string => Boolean(v))
    .join(" / ");
  if (utm) return utm.slice(0, 200);

  return record.referrer ? `referral: ${record.referrer}`.slice(0, 200) : "direct";
}
