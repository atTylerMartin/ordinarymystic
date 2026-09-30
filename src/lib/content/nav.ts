// Header nav and footer columns. The header and footer render from here and
// nowhere else.

import { CONTACT_EMAIL, SOCIALS, TIKTOK_URL } from "@/lib/config";
import { TULSA_TAROT_READER_URL, WALLETS } from "@/lib/offerings";

export type NavLink = {
  href: string;
  label: string;
  /** Small text after the label, e.g. "in person, Tulsa". */
  note?: string;
  external?: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/readings", label: "Readings" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  // Points at /tools until WP-7 creates /for-readers.
  { href: "/tools", label: "For Readers" },
  // Newsletter slot: { href: "/newsletter", label: "Newsletter" } (WP-5).
];

export const NAV_BOOK: NavLink = {
  href: "/readings/recorded",
  label: "Book a reading",
};

export const FOOTER_TAGLINE = "Ordinary Mystic Readings: tarot and astrology without the woo";

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Readings",
    links: [
      { href: "/readings/recorded", label: "Recorded" },
      { href: "/readings/live", label: "Live" },
      { href: "/readings/astrology", label: "Astrology" },
      { href: "/readings/live#ongoing", label: "Ongoing" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "The Practice",
    links: [
      { href: "/about", label: "About" },
      { href: "/guides", label: "Guides" },
      { href: "/tools", label: "Tools" },
      {
        href: TULSA_TAROT_READER_URL,
        label: "Tulsa Tarot Reader",
        note: "in person, Tulsa",
        external: true,
      },
    ],
  },
  {
    heading: "Contact",
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      { href: TIKTOK_URL, label: "TikTok", external: true },
      { href: SOCIALS.youtube, label: "YouTube", external: true },
      { href: WALLETS.cashApp, label: "Cash App", external: true },
      { href: WALLETS.paypal, label: "PayPal", external: true },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];
