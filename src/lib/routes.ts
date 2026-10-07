// The single registry of indexable pages. Drives the sitemap, per-page
// metadata (via `pageMetadata`), and breadcrumb schema. A page cannot exist
// without a correct canonical and sitemap entry: register it here, once.
//
// Never register /pay, /links, /admin, /book, /resources, or a thanks page.
// Those are kept out of search deliberately (noindex, or a client-side
// redirect for old inbound links).
//
// Tool and guide entries are derived from `content/tools` and `content/guides`
// rather than listed by hand. `routes.ts` reads the filesystem through
// `content.ts`, so no client component may import it.

import { getAllToolsSync, listGuides } from "@/lib/content";
import { priceFrom } from "@/lib/content/readings";
import { LIVE, RECORDED } from "@/lib/offerings";

export type RouteEntry = {
  path: string;
  label: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  // ISO date string, hand-maintained. Bump it when a page's content changes.
  updated: string;
  parent?: string;
  /** Skips the layout's " | Ordinary Mystic" suffix for a title that already stands alone. */
  absoluteTitle?: boolean;
  audience: "clients" | "students" | "readers" | "all";
};

const tools = getAllToolsSync();
const guides = listGuides("guides");

// ToolFrontmatter carries no date field, so this is hand-maintained; bump it
// when a tool is added, removed, or its copy changes.
const toolsUpdated = "2026-09-28";

const guidesUpdated = guides.reduce(
  (latest, g) => (g.frontmatter.updated > latest ? g.frontmatter.updated : latest),
  "",
);

const staticRoutes: RouteEntry[] = [
  {
    path: "/",
    label: "Home",
    title: "Ordinary Mystic: Tarot Readings",
    description:
      "Online tarot readings with Ordinary Mystic. Recorded readings delivered as a personalized video walkthrough plus a written synthesis, and live one-on-one sessions over Zoom.",
    priority: 1,
    changeFrequency: "weekly",
    updated: "2026-10-07",
    absoluteTitle: true,
    audience: "all",
  },
  {
    path: "/readings",
    label: "Readings",
    title: "Online Tarot Readings with a Real Person",
    description:
      "Online tarot readings with a real person: recorded video readings, live one-on-one Zoom sessions, and ongoing readings. How to choose.",
    priority: 0.9,
    changeFrequency: "weekly",
    updated: "2026-10-07",
    parent: "/",
    audience: "clients",
  },
  {
    path: "/readings/recorded",
    label: "Recorded",
    title: "Recorded Tarot Readings by Video",
    description: `A recorded tarot reading by video, from ${priceFrom(RECORDED)}. I read your question privately and email a video walkthrough plus a written synthesis in three business days.`,
    priority: 0.9,
    changeFrequency: "monthly",
    updated: "2026-09-29",
    parent: "/readings",
    audience: "clients",
  },
  {
    path: "/readings/live",
    label: "Live",
    title: "Live Tarot Readings Online over Zoom",
    description: `A live tarot reading online over Zoom, one on one, from ${priceFrom(LIVE)}. Ask questions as the cards come out, then get a written synthesis after the session.`,
    priority: 0.8,
    changeFrequency: "monthly",
    updated: "2026-09-29",
    parent: "/readings",
    audience: "clients",
  },
  {
    path: "/readings/astrology",
    label: "Astrology",
    title: "Astrology and Birth Chart Readings Online",
    description:
      "Birth chart and astrology readings online, recorded or live over Zoom. What a chart reading includes and what to send: date, time and place of birth.",
    priority: 0.8,
    changeFrequency: "monthly",
    updated: "2026-09-29",
    parent: "/readings",
    audience: "clients",
  },
  {
    path: "/faq",
    label: "FAQ",
    title: "Frequently Asked Questions",
    description:
      "Answers about booking a tarot reading online: prices, recorded and live readings, turnaround, what to send, and in-person readings in Tulsa.",
    priority: 0.7,
    changeFrequency: "monthly",
    updated: "2026-10-07",
    parent: "/",
    audience: "clients",
  },
  {
    path: "/about",
    label: "About",
    title: "About Tyler Martin, Tarot Reader",
    description:
      "Tyler Martin is the tarot reader behind Ordinary Mystic, based in Tulsa, Oklahoma. Grounded, conversational readings that do not predict.",
    priority: 0.8,
    changeFrequency: "monthly",
    updated: "2026-10-07",
    parent: "/",
    audience: "all",
  },
  {
    path: "/testimonials",
    label: "Testimonials",
    title: "Tarot Reading Testimonials",
    description:
      "Testimonials from Ordinary Mystic clients after recorded and live tarot readings, with a link to leave your own after a reading.",
    priority: 0.6,
    changeFrequency: "monthly",
    updated: "2026-10-07",
    parent: "/",
    audience: "clients",
  },
  {
    path: "/tools",
    label: "Tools",
    title: "Tools & Resources",
    description:
      "Notion templates and tools that support grounded tarot practice, plus recommended resources.",
    priority: 0.7,
    changeFrequency: "monthly",
    updated: toolsUpdated,
    parent: "/",
    audience: "readers",
  },
  {
    path: "/tulsa-tarot-reading",
    label: "Tulsa Tarot Reading",
    title: "Tulsa Tarot Readings, Online",
    description:
      "Online tarot readings from Tulsa-based reader Tyler Martin. Recorded readings and live Zoom sessions. For in-person readings and events in Tulsa, visit Tulsa Tarot Reader.",
    priority: 0.7,
    changeFrequency: "monthly",
    updated: "2026-09-29",
    parent: "/",
    audience: "clients",
  },
  {
    path: "/tulsa-astrology-reading",
    label: "Tulsa Astrology Reading",
    title: "Tulsa Astrology Readings, Online",
    description:
      "Online astrology consultations from Tulsa-based reader Tyler Martin, focused on timing, patterns, and practical choices. Recorded readings and live Zoom sessions.",
    priority: 0.7,
    changeFrequency: "monthly",
    updated: "2026-09-29",
    parent: "/",
    audience: "clients",
  },
  {
    path: "/newsletter",
    label: "Newsletter",
    title: "Tarot and Astrology Newsletter",
    description:
      "A short note twice a month from Tyler Martin: one guide, one note on the sky, and one line about booking. No sharing, no selling, unsubscribe in one tap.",
    priority: 0.5,
    changeFrequency: "monthly",
    updated: "2026-10-07",
    parent: "/",
    audience: "all",
  },
  {
    path: "/terms",
    label: "Terms",
    title: "Terms of Service",
    description:
      "The terms that govern using the Ordinary Mystic site and booking a reading.",
    priority: 0.3,
    changeFrequency: "yearly",
    updated: "2026-09-28",
    parent: "/",
    audience: "all",
  },
  {
    path: "/privacy",
    label: "Privacy",
    title: "Privacy Policy",
    description:
      "What Ordinary Mystic collects when you book a reading, subscribe, or leave a review, and who it is shared with.",
    priority: 0.3,
    changeFrequency: "yearly",
    updated: "2026-09-28",
    parent: "/",
    audience: "all",
  },
  {
    path: "/guides",
    label: "Guides",
    title: "Guides to Tarot and Astrology",
    description:
      "Grounded guides to tarot, with astrology essays alongside: reading court cards and reversals, keeping a tarot journal, reading a birth chart, the houses, and the year's major transits.",
    priority: 0.7,
    changeFrequency: "weekly",
    updated: guidesUpdated,
    parent: "/",
    audience: "students",
  },
];

const toolRoutes: RouteEntry[] = tools.map((t) => ({
  path: `/tools/${t.slug}`,
  label: t.frontmatter.title,
  title: t.frontmatter.title,
  description: t.frontmatter.description,
  priority: 0.5,
  changeFrequency: "monthly",
  updated: "2026-09-28",
  parent: "/tools",
  audience: "readers",
}));

const guideRoutes: RouteEntry[] = guides.map((g) => ({
  path: `/guides/${g.slug}`,
  label: g.frontmatter.title,
  title: g.frontmatter.title,
  description: g.frontmatter.description,
  priority: 0.6,
  changeFrequency: "monthly",
  updated: g.frontmatter.updated,
  parent: "/guides",
  audience: "students",
}));

export const routes: RouteEntry[] = [
  ...staticRoutes,
  ...toolRoutes,
  ...guideRoutes,
];

export function getRoute(path: string): RouteEntry {
  const route = routes.find((r) => r.path === path);
  if (!route) {
    throw new Error(
      `getRoute: "${path}" is not registered in src/lib/routes.ts. Add it to \`routes\` before using it.`,
    );
  }
  return route;
}
