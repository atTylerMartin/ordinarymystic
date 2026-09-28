// The single registry of indexable pages. Drives the sitemap, per-page
// metadata (via `pageMetadata`), and breadcrumb schema. A page cannot exist
// without a correct canonical and sitemap entry: register it here, once.
//
// Never register /pay, /links, /admin, /book, /resources, or a thanks page.
// Those are kept out of search deliberately (noindex, or a client-side
// redirect for old inbound links).
//
// Tool and blog entries are derived from `content/tools` and `content/blog`
// rather than listed by hand. `routes.ts` reads the filesystem through
// `content.ts`, so no client component may import it.

import { getAllBlogPostsSync, getAllToolsSync } from "@/lib/content";

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
const posts = getAllBlogPostsSync();

// ToolFrontmatter carries no date field, so this is hand-maintained; bump it
// when a tool is added, removed, or its copy changes.
const toolsUpdated = "2026-09-28";

const blogUpdated = posts.reduce((latest, p) => {
  const date = p.frontmatter.date;
  return date > latest ? date : latest;
}, "2026-09-28");

const staticRoutes: RouteEntry[] = [
  {
    path: "/",
    label: "Home",
    title: "Ordinary Mystic: Tarot and Astrology Readings",
    description:
      "Online tarot and astrology readings with Ordinary Mystic. Recorded readings delivered as a personalized video walkthrough plus a written synthesis, and live one-on-one sessions over Zoom.",
    priority: 1,
    changeFrequency: "weekly",
    updated: "2026-09-28",
    absoluteTitle: true,
    audience: "all",
  },
  {
    path: "/tools",
    label: "Tools",
    title: "Tools & Resources",
    description:
      "Notion templates and tools that support grounded tarot and astrology practice, plus recommended resources.",
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
    updated: "2026-09-28",
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
    updated: "2026-09-28",
    parent: "/",
    audience: "clients",
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
    path: "/blog",
    label: "Blog",
    title: "Blog",
    description:
      "Short, grounded essays on tarot, astrology, and reflective practice, without the theatrics.",
    priority: 0.5,
    changeFrequency: "weekly",
    updated: blogUpdated,
    parent: "/",
    audience: "all",
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

const blogRoutes: RouteEntry[] = posts.map((p) => ({
  path: `/blog/${p.slug}`,
  label: p.frontmatter.title,
  title: p.frontmatter.title,
  description: p.frontmatter.description,
  priority: 0.5,
  changeFrequency: "monthly",
  updated: p.frontmatter.date,
  parent: "/blog",
  audience: "all",
}));

export const routes: RouteEntry[] = [
  ...staticRoutes,
  ...toolRoutes,
  ...blogRoutes,
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
