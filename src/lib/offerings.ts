// ─── The single source of truth for reading prices ───────────────────────────
//
// Nothing else in the codebase may hardcode a reading price or a Stripe link.
//
// Stripe Payment Links are fixed-amount: a link's price CANNOT be edited. Any
// price change requires a brand-new Product + Price + Payment Link. Use
// `scripts/stripe-payment-links.mjs` (it is idempotent on `metadata.om_tier`),
// paste the new URLs below, verify each button, and only then deactivate the
// old links. Never delete Stripe Products or Prices.
//
// If a `url` is empty, the button falls back to an "Email to book" mailto so
// the site never shows a new price behind an old link.

export type Minutes = 15 | 30 | 60;

export type Tier = {
  minutes: Minutes;
  price: number;
  url: string;
  /** The standard session — visually promoted. */
  featured?: boolean;
  /** One line under the price. */
  blurb: string;
};

// Prepared privately off-camera, delivered as a personalized video walkthrough
// plus a written synthesis.
export const RECORDED: Tier[] = [
  {
    minutes: 15,
    price: 35,
    url: "https://buy.stripe.com/5kQbJ3gCM6mtg6a3Zx6Zy0M",
    blurb: "One question, looked at closely.",
  },
  {
    minutes: 30,
    price: 65,
    url: "https://buy.stripe.com/eVqfZjaeodOVf26gMj6Zy0N",
    featured: true,
    blurb: "A question from several angles, or two related ones.",
  },
  {
    minutes: 60,
    price: 125,
    url: "https://buy.stripe.com/dRmdRbeuE12907canV6Zy0O",
    blurb: "Multiple questions and the connections between them.",
  },
];

// Live one-on-one over Zoom. In-person live readings are Tulsa Tarot Reader.
export const LIVE: Tier[] = [
  {
    minutes: 15,
    price: 40,
    url: "https://buy.stripe.com/9B68wR2LW26dbPU0Nl6Zy0P",
    blurb: "A focused sit-down for one question.",
  },
  {
    minutes: 30,
    price: 100,
    url: "https://buy.stripe.com/3cI14pcmw4elf262Vt6Zy0Q",
    featured: true,
    blurb: "The standard session. Room to follow the thread.",
  },
  {
    minutes: 60,
    price: 195,
    url: "https://buy.stripe.com/cNi3cx86g4elbPU67F6Zy0R",
    blurb: "A full hour, no rush, wherever the conversation goes.",
  },
];

export const RECORDED_COPY = {
  kicker: "Start Here",
  title: "Recorded Readings",
  lede: "You send the question. I read it privately, off camera, and take the time to sit with the patterns before I say anything about them. What comes back is a personalized video walkthrough of the reading plus a written synthesis — yours to watch when you have the attention for it, and to return to a month later when the situation has moved.",
  bullets: [
    "Submit your question whenever it occurs to you — no scheduling.",
    "I read privately and sit with it before recording.",
    "A personalized video walkthrough, not a template.",
    "A written synthesis you can keep and re-read.",
  ],
  cta: (tier: Tier) =>
    `Book a ${tier.minutes}-minute recorded reading · $${tier.price}`,
};

export const LIVE_COPY = {
  kicker: "Live",
  title: "Live Online Readings",
  lede: "A conversational reading that unfolds with you in real time over Zoom. Cards come out while you watch, you hear the thinking as it happens, and you can interrupt, add context, or chase a thread I would not have known to follow. A written synthesis follows afterward, once I have had time to reflect on the full reading.",
  premium:
    "Live costs more than recorded because you are buying real-time access: a scheduled hour of my attention, your questions answered as they occur to you, and the reading shaped by the conversation rather than delivered to it.",
  standard: "Thirty minutes is the standard session.",
  cta: (tier: Tier) => `Book ${tier.minutes} minutes live · $${tier.price}`,
};

export const ONGOING_COPY = {
  title: "Ongoing Readings",
  body: "Some people want a reader who already knows the shape of their situation. Ongoing readings are a standing arrangement — a regular cadence, continuity between sessions, and no re-explaining the backstory every time. Availability is limited and pricing depends on the cadence, so this one starts with a conversation rather than a checkout.",
  cta: "Contact me",
};

export const TULSA_CROSSLINK = {
  title: "In Tulsa?",
  body: "Looking for an in-person reading, a party, a wedding, or an event? That is my other practice, Tulsa Tarot Reader.",
  cta: "Visit Tulsa Tarot Reader",
  eventsCta: "Tarot for events",
};

export const TULSA_TAROT_READER_URL = "https://tulsatarotreader.com";
export const TULSA_TAROT_READER_EVENTS_URL =
  "https://tulsatarotreader.com/events";
