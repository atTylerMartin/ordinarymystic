// Copy for the newsletter form and the /newsletter page. No prices.

import { CONTACT_EMAIL } from "@/lib/config";

export const NEWSLETTER = {
  heading: "Get the newsletter",
  body: "Twice a month: one guide, one note on the sky, one line about booking.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  firstNameLabel: "First name (optional)",
  firstNamePlaceholder: "First name",
  button: "Sign up",
  pending: "Signing up…",
  success: "You're on the list. The first note comes with the next send.",
  // A repeat signup reads exactly like a new one.
  duplicate: "You're on the list. The first note comes with the next send.",
  error: `That didn't go through. Try again, or email ${CONTACT_EMAIL}.`,
  privacy: "No sharing, no selling, unsubscribe in one tap.",
};

export const NEWSLETTER_PAGE = {
  kicker: "Newsletter",
  h1: "The Ordinary Mystic newsletter",
  lede: "A short note twice a month, from Tyler Martin: grounded tarot, no theatrics, and nothing you did not ask for.",
  expectHeading: "What you get",
  expect: [
    { title: "One guide", body: "A guide worth keeping, with a link to the full piece." },
    { title: "One note on the sky", body: "What the planets are doing and what it does and does not mean." },
    { title: "One line about booking", body: "If a question is already sitting with you, where recorded and live readings are." },
  ],
  privacyHeading: "Your email",
  privacy:
    "Your address is used for this newsletter and nothing else. No sharing, no selling, and every email carries an unsubscribe link that works in one tap.",
  privacyLinkLabel: "Privacy policy",
};
