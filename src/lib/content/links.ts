// Strings and row data for /links, the TikTok bio page. Prices come from
// `offerings.ts` and are never typed here. The page is noindex and is not in
// the route registry.

import { DIGITAL_TAROT_APP_URL, SOCIALS, TIKTOK_URL } from "@/lib/config";
import { RECORDED, TULSA_TAROT_READER_URL } from "@/lib/offerings";

export const QUERENT_URL = "https://querent.app";

export const LINKS_COPY = {
  brand: "Ordinary Mystic",
  lede: "Tarot readings, recorded for you or live over Zoom.",
  guidesHeading: "Newest guides",
  toolsHeading: "Free tools",
  moreHeading: "More",
};

export type LinkRow = {
  /** The `link_tap` label. */
  label: string;
  title: string;
  /** One line of copy under the title. */
  body: string;
  href: string;
  external?: boolean;
};

/** The rows above the newsletter card, in order. */
export const BOOKING_ROWS: LinkRow[] = [
  {
    label: "book-recorded",
    title: "Book a recorded reading",
    body: `A video walkthrough and a written synthesis, from $${RECORDED[0].price}.`,
    href: "/readings/recorded",
  },
  {
    label: "book-live",
    title: "Live one-on-one over Zoom",
    body: "A real-time reading, cards out while you watch.",
    href: "/readings/live",
  },
  {
    label: "pay",
    title: "Pay for your live reading",
    body: "Had a reading on a TikTok Live? Pay here.",
    href: "/pay",
  },
];

export const TOOL_ROWS: LinkRow[] = [
  {
    label: "tool-querent",
    title: "Querent",
    body: "A journal for your tarot readings.",
    href: QUERENT_URL,
    external: true,
  },
  {
    label: "tool-deck",
    title: "Digital tarot deck",
    body: "Pull a card in your browser.",
    href: DIGITAL_TAROT_APP_URL,
    external: true,
  },
];

export const TULSA_ROW: LinkRow = {
  label: "tulsa",
  title: "Tulsa Tarot Reader",
  body: "In person, in Tulsa: private sittings, parties and events.",
  href: TULSA_TAROT_READER_URL,
  external: true,
};

export const SOCIAL_ROWS: LinkRow[] = [
  {
    label: "tiktok",
    title: "TikTok",
    body: "Live readings and short clips.",
    href: TIKTOK_URL,
    external: true,
  },
  {
    label: "youtube",
    title: "YouTube",
    body: "Longer readings and walkthroughs.",
    href: SOCIALS.youtube,
    external: true,
  },
];
