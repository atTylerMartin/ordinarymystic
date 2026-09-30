// Every question on the site, grouped, for /faq. The FAQPage schema on /faq is
// built from this list and is the only FAQPage on the site. Other pages show
// a visible subset through `faqItems(ids)` with no schema.
//
// Prices are read from offerings.ts, never typed here.

import { CONTACT_EMAIL } from "@/lib/config";
import { LIVE, RECORDED } from "@/lib/offerings";
import { LIVE_SCHEDULING, RECORDED_TURNAROUND, priceList } from "@/lib/content/readings";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqGroup = {
  heading: string;
  items: FaqItem[];
};

export const FAQ: FaqGroup[] = [
  {
    heading: "Booking",
    items: [
      {
        id: "how-to-book",
        question: "How do I book a reading?",
        answer:
          "Pick a reading and a length on the recorded or live readings page, then pay through the Stripe checkout. Checkout asks for your question in a sentence, so I have it as soon as you book. For ongoing readings, email me instead.",
      },
      {
        id: "cost",
        question: "How much does a reading cost?",
        answer: `Recorded readings are ${priceList(RECORDED)}. Live readings over Zoom are ${priceList(LIVE)}. Ongoing readings are priced by how often we meet, so they start with an email.`,
      },
      {
        id: "wallets",
        question: "Can I pay with Cash App or PayPal?",
        answer: `Yes. Send the payment, then email ${CONTACT_EMAIL} with the reading you paid for and your question. Card payments through Stripe are the quickest route, since checkout collects the question for you.`,
      },
      {
        id: "ongoing",
        question: "What are ongoing readings?",
        answer:
          "A standing arrangement: readings on a regular schedule, with a reader who already knows your situation, so you never have to explain the backstory again. Availability is limited and the price depends on the cadence. Email me to talk it through.",
      },
    ],
  },
  {
    heading: "Recorded readings",
    items: [
      {
        id: "what-is-recorded",
        question: "What is a recorded reading?",
        answer:
          "A reading I prepare privately, off camera, for your question. You get a video walkthrough where I show you the cards and explain what they say, plus a written synthesis you can keep. You watch it whenever suits you.",
      },
      {
        id: "recorded-turnaround",
        question: "How long does a recorded reading take?",
        answer: `It arrives within ${RECORDED_TURNAROUND} of my receiving your question. For an astrology reading, the clock starts once I also have your birth date, time and place.`,
      },
      {
        id: "recorded-delivery",
        question: "How is a recorded reading delivered?",
        answer:
          "By email: a private YouTube link to your video walkthrough, and the written synthesis. You can watch the video as many times as you like, on any device.",
      },
      {
        id: "recorded-question",
        question: "How do I send my question?",
        answer:
          "Stripe checkout asks for your question in a sentence. That is enough for me to start. If there is background you want me to have, reply to your Stripe receipt or email me.",
      },
      {
        id: "recorded-context",
        question: "What if my question needs more explanation?",
        answer:
          "Send it by email, as much as you like. What is going on, what you have already tried, and what prompted the question all help. If anything is unclear, I will ask by email before I read.",
      },
      {
        id: "recorded-length",
        question: "Which length should I choose?",
        answer: `${RECORDED[0].minutes} minutes is right for one question looked at closely. ${RECORDED[1].minutes} minutes gives a question room to be seen from several angles, or covers two related ones. ${RECORDED[2].minutes} minutes is for several questions and the connections between them.`,
      },
    ],
  },
  {
    heading: "Live readings",
    items: [
      {
        id: "what-is-live",
        question: "How does a live reading work?",
        answer:
          "We meet one on one over Zoom. I lay out the cards on camera and talk through them as they come up, and you can ask questions, add context, or steer the reading as we go. A written synthesis follows afterward.",
      },
      {
        id: "live-scheduling",
        question: "How is a live reading scheduled?",
        answer: `After you book, I email you within ${LIVE_SCHEDULING} with times. Once we agree on one, I send the Zoom link.`,
      },
      {
        id: "live-zoom",
        question: "Do I need a Zoom account?",
        answer:
          "No paid account is needed. The link I send opens in the Zoom app or in a web browser. A quiet spot and a steady connection are the only things worth arranging ahead of time.",
      },
      {
        id: "live-after",
        question: "What do I get after a live reading?",
        answer:
          "A written synthesis by email, once I have had time to reflect on the whole reading. It pulls together the cards, what we talked about, and the parts worth coming back to.",
      },
    ],
  },
  {
    heading: "Astrology",
    items: [
      {
        id: "astrology-includes",
        question: "What does an astrology reading include?",
        answer:
          "A reading of your birth chart: the planets, signs and houses, and how they work together. When your question is about timing, I also look at what is moving through your chart now. It comes recorded or live, at the same prices as tarot.",
      },
      {
        id: "astrology-send",
        question: "What do you need for a chart reading?",
        answer:
          "Your date, time and place of birth. Checkout has a field for them, or you can email them to me. The reading starts once I have them.",
      },
      {
        id: "birth-time",
        question: "What if I don't know my birth time?",
        answer:
          "Tell me, and send the date and place anyway. A lot of the chart can still be read without it, but the houses and the rising sign depend on the time. A birth certificate or a hospital record usually has it.",
      },
    ],
  },
  {
    heading: "About the reader",
    items: [
      {
        id: "who",
        question: "Who does the readings?",
        answer:
          "I do. I'm Tyler Martin, a tarot reader and astrologer in Tulsa, Oklahoma, three years into this practice. Every reading on this site is mine, start to finish.",
      },
      {
        id: "predict",
        question: "Do you predict the future?",
        answer:
          "No. I talk about timing, tendencies and patterns, and you always keep the choice. Instead of \"this will happen,\" a reading with me looks at what is worth paying attention to right now and what you might try.",
      },
      {
        id: "psychic",
        question: "Are you a psychic?",
        answer:
          "No. I am not a psychic or a medium, and I don't claim to read minds or contact anyone. I read the cards and the chart as structured ways to look at a question you already have.",
      },
      {
        id: "style",
        question: "What is a reading with you like?",
        answer:
          "Grounded and conversational. The cards are prompts that organize the thinking; you bring the question and your own knowledge of your life. The aim is a clearer view of your situation and a few concrete things to do next.",
      },
    ],
  },
  {
    heading: "Tulsa and in person",
    items: [
      {
        id: "in-person",
        question: "Do you read in person?",
        answer:
          "Yes, in Tulsa, through Tulsa Tarot Reader, the in-person side of the practice. This site is for online readings only. Visit tulsatarotreader.com for anything face to face.",
      },
      {
        id: "tulsa-online",
        question: "I'm in Tulsa. Can I still book online?",
        answer:
          "Yes. Recorded and live readings work the same wherever you are. Pick whichever format fits.",
      },
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = FAQ.flatMap((group) => group.items);

/** A visible subset for a page other than /faq. Throws on an unknown id so a
 * renamed question cannot silently drop off a page. */
export function faqItems(ids: string[]): FaqItem[] {
  return ids.map((id) => {
    const item = FAQ_ITEMS.find((i) => i.id === id);
    if (!item) throw new Error(`faqItems: no FAQ item with id "${id}" in src/lib/content/faq.ts`);
    return item;
  });
}
