// Copy for the homepage hub. Prices come from offerings.ts via the readings
// helpers; nothing here states a number.

import { DIGITAL_TAROT_APP_URL } from "@/lib/config";
import { LIVE, LIVE_COPY, RECORDED_COPY } from "@/lib/offerings";
import { LIVE_SCHEDULING, lengthList, priceFrom } from "@/lib/content/readings";

export const HOME = {
  h1: "Ordinary Mystic Readings",
  hero: "Grounded tarot and astrology readings with Tyler Martin, recorded for you or live over Zoom.",
  heroPrimary: { href: "/readings/recorded", label: "Book a recorded reading" },
  heroSecondary: { href: "/readings/live", label: "See live readings" },

  recorded: {
    kicker: RECORDED_COPY.kicker,
    title: RECORDED_COPY.title,
    lede: RECORDED_COPY.lede,
    link: { href: "/readings/recorded", label: "How recorded readings work" },
  },

  live: {
    kicker: LIVE_COPY.kicker,
    title: LIVE_COPY.title,
    lede: LIVE_COPY.lede,
    detail: `${lengthList(LIVE)}, from ${priceFrom(LIVE)}. I email within ${LIVE_SCHEDULING} of booking to set a time.`,
    link: { href: "/readings/live", label: "See live readings" },
  },

  guides: {
    kicker: "Guides",
    title: "Guides to tarot and astrology",
    link: { href: "/guides", label: "All guides" },
  },

  readers: {
    kicker: "For readers",
    title: "Tools for your own practice",
    items: [
      {
        title: "Querent",
        body: "A notetaking suite for tarot readings, with an AI companion that learns your reading style and card meanings over time.",
        href: "https://querent.app",
        cta: "Try Querent",
        external: true,
      },
      {
        title: "Digital tarot deck",
        body: "A free desktop app to shuffle, pull and rearrange tarot cards. It is in beta and works on desktop only for now.",
        href: DIGITAL_TAROT_APP_URL,
        cta: "Open the deck",
        external: true,
      },
      {
        title: "Notion tools",
        body: "Notion templates for tracking readings, reflections and how you are really doing, so a practice deepens over time.",
        href: "/tools",
        cta: "Browse tools",
        external: false,
      },
    ],
  },
};
