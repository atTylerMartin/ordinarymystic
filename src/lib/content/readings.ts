// Copy for the four readings pages (/readings, /readings/recorded,
// /readings/live, /readings/astrology) and the two booking thanks pages.
//
// Every price, tier, blurb and lede comes from offerings.ts. The helpers below
// turn tiers into text so a price is never typed into a sentence by hand.

import {
  LIVE,
  LIVE_COPY,
  ONGOING_COPY,
  RECORDED,
  RECORDED_COPY,
  type Tier,
} from "@/lib/offerings";

export const RECORDED_TURNAROUND = "three business days";
export const LIVE_SCHEDULING = "two business days";

/** The lowest tier as "$N". */
export function priceFrom(tiers: Tier[]): string {
  return `$${Math.min(...tiers.map((t) => t.price))}`;
}

/** "$A for 15 minutes, $B for 30 minutes, or $C for 60 minutes" */
export function priceList(tiers: Tier[]): string {
  const parts = tiers.map((t) => `$${t.price} for ${t.minutes} minutes`);
  return `${parts.slice(0, -1).join(", ")}, or ${parts[parts.length - 1]}`;
}

/** "15, 30 or 60 minutes" */
export function lengthList(tiers: Tier[]): string {
  const m = tiers.map((t) => String(t.minutes));
  return `${m.slice(0, -1).join(", ")} or ${m[m.length - 1]} minutes`;
}

export const READINGS_OVERVIEW = {
  h1: "Online readings with a real person",
  intro:
    "Every reading here is with me, Tyler Martin, a tarot reader and astrologer in Tulsa. There are three ways to work together, and astrology fits into any of them.",
  sections: [
    {
      key: "recorded",
      title: RECORDED_COPY.title,
      body: `You send a question, I read it privately, and within ${RECORDED_TURNAROUND} you get a private video walkthrough of the reading plus a written synthesis. It is built for taking in at your own pace and coming back to later. ${lengthList(RECORDED)}, from ${priceFrom(RECORDED)}.`,
      href: "/readings/recorded",
      cta: "About recorded readings",
    },
    {
      key: "live",
      title: LIVE_COPY.title,
      body: `A one-on-one session over Zoom, where the cards come out while you watch and you can ask, interrupt and steer as we go. I email within ${LIVE_SCHEDULING} of booking to set a time, and a written synthesis follows. ${lengthList(LIVE)}, from ${priceFrom(LIVE)}.`,
      href: "/readings/live",
      cta: "About live readings",
    },
    {
      key: "ongoing",
      title: ONGOING_COPY.title,
      body: "Readings on a regular schedule with a reader who already knows your situation. The price depends on the cadence, so it starts with an email rather than a checkout.",
      href: "/readings/live#ongoing",
      cta: "About ongoing readings",
    },
    {
      key: "astrology",
      title: "Astrology readings",
      body: "A reading of your birth chart, or of the timing around a question, in plain language. It comes recorded or live, at the same prices, and needs your date, time and place of birth.",
      href: "/readings/astrology",
      cta: "About astrology readings",
    },
  ],
  chooseTitle: "How to choose",
  choose:
    "If you want time to take a reading in, and something you can return to, book a recorded reading. If you want to talk it through as the cards come out and steer where it goes, book a live one. If you want someone who already knows your situation checking in on a schedule, ask about ongoing readings.",
  recordedTiersTitle: "Recorded reading prices",
  liveTiersTitle: "Live reading prices",
};

export const RECORDED_PAGE = {
  h1: "Recorded tarot readings",
  answer: `A recorded reading is a tarot or astrology reading I prepare privately, off camera, for your question. Prices start at ${priceFrom(RECORDED)}. Within ${RECORDED_TURNAROUND} of receiving your question, I email you a private YouTube link to a video walkthrough of the reading, plus a written synthesis you can keep.`,
  tiersTitle: "Choose a length",
  arrivesTitle: "What arrives",
  arrives: [
    "A private YouTube link to your video walkthrough. You see the spread, and I talk you through what the cards say about your question.",
    "A written synthesis of the reading, the part you can re-read when the situation moves.",
    `Both by email, within ${RECORDED_TURNAROUND} of my receiving your question.`,
    "The length you book sets how long the walkthrough runs.",
  ],
  questionTitle: "How your question reaches me",
  question: [
    "Stripe checkout asks for your question in a sentence. That is all I need to begin.",
    "If there is background you want me to have, reply to your Stripe receipt or use the email button on the confirmation page. For an astrology reading, checkout also has a field for your birth date, time and place.",
    `The ${RECORDED_TURNAROUND} start once I have the question. If anything is unclear, I ask by email before I read.`,
  ],
  prepareTitle: "How I prepare",
  prepare:
    "I read your question before I touch the cards, and usually more than once. Then I lay out the spread privately, with no camera on, and sit with it until I can see what the cards are doing together, not only what each one means alone. I make notes as I go. Only then do I record the walkthrough, so the video is me explaining a reading I have already worked through. The written synthesis comes last, once I have seen the whole thing.",
  ownProductTitle: "Recorded is its own kind of reading",
  ownProduct:
    "A recorded reading is not a stand-in for a live one. Its advantage is time: I work through the spread without anyone waiting on me, and you get it in a form you can replay and re-read. If you would rather talk it through in real time, ask questions as they come up and steer where the reading goes, that is what live readings are for.",
  liveLink: "See live readings",
  testimonialsTitle: "What clients say",
  faqTitle: "Questions about recorded readings",
  faqIds: [
    "recorded-turnaround",
    "recorded-delivery",
    "recorded-question",
    "recorded-context",
    "recorded-length",
    "wallets",
    "predict",
  ],
};

export const LIVE_PAGE = {
  h1: "Live tarot readings over Zoom",
  answer: `A live reading is a one-on-one tarot or astrology session over Zoom. Sessions run ${lengthList(LIVE)} and start at ${priceFrom(LIVE)}. After you book, I email within ${LIVE_SCHEDULING} to set a time, and a written synthesis follows the session.`,
  tiersTitle: "Choose a length",
  expectTitle: "What to expect",
  expect: [
    `I email within ${LIVE_SCHEDULING} of booking with times, then send the Zoom link.`,
    "The cards come out on camera while you watch, and you hear my thinking as it happens.",
    "You can interrupt, add context, or chase a thread I would not have known to follow.",
    "A written synthesis arrives by email afterward, once I have reflected on the whole reading.",
  ],
  whyTitle: "Why live",
  why: "What you get from a live reading is the back and forth. You can react to a card, tell me what it brings up, and the reading changes direction because of it. That real-time access is why a live session costs more for the same length of time.",
  recordedLink: "See recorded readings",
  ongoingTitle: ONGOING_COPY.title,
  testimonialsTitle: "What clients say",
  faqTitle: "Questions about live readings",
  faqIds: [
    "live-scheduling",
    "live-zoom",
    "live-after",
    "astrology-send",
    "wallets",
    "ongoing",
  ],
};

export const ASTROLOGY_PAGE = {
  h1: "Astrology and birth chart readings online",
  answer: `An astrology reading looks at your birth chart, or at the timing around a question, and puts it in plain language. It comes in the same formats and lengths as tarot: recorded, from ${priceFrom(RECORDED)}, or live over Zoom, from ${priceFrom(LIVE)}. For a chart reading I need your date, time and place of birth.`,
  includesTitle: "What a chart reading includes",
  includes: [
    "The planets, signs and houses in your chart, and how they work together rather than one at a time.",
    "The patterns that keep showing up: where effort goes, where things stall, what you keep returning to.",
    "When your question is about timing, what is moving through your chart now and over the coming months.",
    "Plain language and practical takeaways. The chart is a map to think with, not a set of labels.",
  ],
  approach:
    "I read from a Hellenistic foundation, which pays close attention to houses, timing and the relationships between planets. You do not need to know any of that to book; the reading explains what it uses as it goes.",
  sendTitle: "What to send",
  send: [
    "Your date of birth.",
    "Your time of birth, as exact as you can get it. A birth certificate or hospital record usually has it.",
    "Your place of birth: city and country.",
  ],
  sendHow:
    "Checkout has a field for your birth details, or you can email them. The reading starts once they arrive. If you don't know your birth time, say so: a lot of the chart can still be read, but the houses and the rising sign depend on it.",
  birthTimeGuide: { href: "/guides/why-birth-time", label: "Why birth time matters" },
  formatsTitle: "Recorded or live",
  recorded: `Recorded: I work through your chart privately and send a video walkthrough plus a written synthesis within ${RECORDED_TURNAROUND}. Good for a full look at the chart that you can come back to.`,
  live: `Live: we go through your chart together over Zoom, and you can ask about whatever stands out. I email within ${LIVE_SCHEDULING} to schedule, and a written synthesis follows.`,
  recordedCta: "Recorded reading prices",
  liveCta: "Live reading prices",
};

export const THANKS_RECORDED = {
  title: "Thank you for booking",
  have: "I have the question you gave at checkout, so your recorded reading is in my queue.",
  context:
    "If there is context you want me to have, reply to your Stripe receipt or use the button below. What is going on, what you have already tried, and what prompted the question all help.",
  mailtoLabel: "Email me context",
  mailtoSubject: "Context for my recorded reading",
  mailtoBody:
    "My question (as I gave it at checkout):\n\n\nContext I'd like you to have:\n\n\nFor astrology, my birth date, time and place:\n",
  delivery: `Your reading arrives by email within ${RECORDED_TURNAROUND}: a private YouTube link to the video walkthrough, plus the written synthesis.`,
  astrology:
    "Booked an astrology reading and left the birth details blank? Send your date, time and place of birth now with the same button. The clock starts when they arrive.",
};

export const THANKS_LIVE = {
  scheduling: `I'll email within ${LIVE_SCHEDULING} to schedule.`,
};
