// Copy for /about. The full name is used on this brand (Tulsa Tarot Reader
// stays first-name-only). The bio sits inside <section id="tyler-martin"> so
// the Person schema's @id resolves to it.

import { TULSA_TAROT_READER_URL } from "@/lib/offerings";

export const ABOUT = {
  kicker: "About",
  h1: "I'm Tyler Martin.",
  tagline: "Tarot reader in Tulsa, Oklahoma, three years into the practice.",
  // TODO headshot: swap for a real headshot once one is supplied.
  image: "/images/profile-img.png",
  imageAlt: "Tyler Martin",
  bio: [
    "I read tarot, and sometimes through an astrological lens, and Ordinary Mystic is where I do that work online: recorded readings, live readings over Zoom, and the guides and tools on this site. I live in Tulsa, and I have been reading for three years, working with study cohorts along the way.",
    "I use tarot as a pattern-recognition tool, a structured way to map timing, friction and possibility in ordinary life, and astrology when a chart or a transit frames the question. My style is grounded and conversational, closer to a strategic advisor than a mystical oracle. You bring the question, and the cards or the chart organize the thinking.",
    "I don't predict the future. You won't hear from me that something is meant to be or that you are locked into a path. We talk about options, trade-offs and things you can try in the real world. I am not a psychic or a medium; what I offer is a way of looking at a question you already have from angles you would not reach alone.",
  ],
  brands: {
    before:
      "I run two practices. Ordinary Mystic is the online one, and it is where you are now. If you want to sit across a table from me in Tulsa, that is ",
    linkLabel: "Tulsa Tarot Reader",
    href: TULSA_TAROT_READER_URL,
    after:
      ", the in-person side of the practice. Neither is the side project. They are two rooms for the same conversation.",
  },
  audiences:
    "The practice serves three kinds of people. Clients come for a reading. Students come to understand tarot for themselves, and the guides here are the start of that. Readers, people who already read cards, come for the tools: Querent, the digital tarot deck and the Notion templates.",
  links: [
    { href: "/readings", label: "Readings" },
    { href: "/guides", label: "Guides" },
    { href: "/tools", label: "Tools" },
  ],
  faqTitle: "Common questions",
  faqIds: ["predict", "psychic", "style", "in-person"],
  faqMore: "All questions",
};
