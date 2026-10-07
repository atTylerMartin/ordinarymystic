// Header nav and footer columns. The header and footer render from here and
// nowhere else.

import { CONTACT_EMAIL, SOCIALS, TIKTOK_URL } from "@/lib/config";
import type { SocialLabel } from "@/lib/analytics";
import { TULSA_TAROT_READER_URL, WALLETS } from "@/lib/offerings";

export type NavLink = {
  href: string;
  label: string;
  /** Small text after the label, e.g. "in person, Tulsa". */
  note?: string;
  external?: boolean;
  /** Fires `social_tap` with this label when the link is clicked. */
  track?: SocialLabel;
};

export const NAV_LINKS: NavLink[] = [
  { href: "/readings", label: "Readings" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  // Points at /tools until WP-7 creates /for-readers.
  { href: "/tools", label: "For Readers" },
  { href: "/newsletter", label: "Newsletter" },
];

export const NAV_BOOK: NavLink = {
  href: "/readings/recorded",
  label: "Book a reading",
};

export const FOOTER_TAGLINE = "Ordinary Mystic Readings: grounded tarot, no theatrics";

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
      { href: "/newsletter", label: "Newsletter" },
      {
        href: TULSA_TAROT_READER_URL,
        label: "Tulsa Tarot Reader",
        note: "in person, Tulsa",
        external: true,
        track: "tulsa",
      },
    ],
  },
  {
    heading: "Contact",
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL, track: "email" },
      { href: TIKTOK_URL, label: "TikTok", external: true, track: "tiktok" },
      { href: SOCIALS.youtube, label: "YouTube", external: true, track: "youtube" },
      { href: WALLETS.cashApp, label: "Cash App", external: true, track: "cashapp" },
      { href: WALLETS.paypal, label: "PayPal", external: true, track: "paypal" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];
