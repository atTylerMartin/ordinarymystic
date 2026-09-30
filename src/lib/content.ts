import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";

export type GuideFrontmatter = {
  title: string;
  date: string;
  updated: string;
  description: string;
  category: "tarot" | "astrology" | "general-spirituality";
  /** e.g. "Season archive"; defaults to the category label. */
  kicker?: string;
  subcategory?: string;
  tags?: string[];
  // Keywords only: there are no taxonomy pages.
  planets?: string[];
  signs?: string[];
  houses?: string[];
  cards?: string[];
  image?: string;
  imageAlt?: string;
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  /** Rendered visibly, never as schema. */
  faq?: { question: string; answer: string }[];
  sources?: string[];
  wing: "guides" | "lessons";
};

export type Guide = {
  slug: string;
  frontmatter: GuideFrontmatter;
  readingMinutes: number;
};

export type ToolFrontmatter = {
  title: string;
  price: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  featured?: boolean;
  type: string;
  image?: string;
};

export type ResourceFrontmatter = {
  title: string;
  description: string;
  category: string;
};

export type ContentType = "tools" | "resources";

export type MarkdownEntry<T> = {
  slug: string;
  frontmatter: T;
  contentHtml: string;
};

export type MarkdownListItem<T> = {
  slug: string;
  frontmatter: T;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function getDirectoryForType(type: ContentType) {
  return path.join(CONTENT_DIR, type);
}

function getFallbackImage(type: ContentType): string {
  switch (type) {
    case "tools":
      return "/images/placeholder-tool-1.svg";
    default:
      return "/images/placeholder-generic.svg";
  }
}

function normalizeImage<T extends { image?: string }>(
  type: ContentType,
  frontmatter: T,
): T & { image: string } {
  const image =
    (frontmatter.image && frontmatter.image.trim().length > 0
      ? frontmatter.image
      : getFallbackImage(type)) || getFallbackImage(type);

  return {
    ...frontmatter,
    image,
  };
}

// `sanitize: false` because content is authored in this repo and some guides
// carry raw HTML (figures, <details> blocks). Never render untrusted markdown here.
export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processed = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  return processed.toString();
}

export function getSlugs(type: ContentType): string[] {
  const dir = getDirectoryForType(type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function getEntryBySlug<T>(
  type: ContentType,
  slug: string,
): Promise<MarkdownEntry<T>> {
  const dir = getDirectoryForType(type);
  const fullPath = path.join(dir, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  const contentHtml = await renderMarkdownToHtml(content);

  let frontmatter = data as T;

  if (type === "tools") {
    frontmatter = normalizeImage(
      type,
      data as { image?: string },
    ) as unknown as T;
  }

  return {
    slug,
    frontmatter,
    contentHtml,
  };
}

// Synchronous: frontmatter only, no markdown rendering. Lets `routes.ts`
// build the sitemap and registry entries at import time.
export function getAllEntriesSync<T>(type: ContentType): MarkdownListItem<T>[] {
  const dir = getDirectoryForType(type);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));

  const items: MarkdownListItem<T>[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(dir, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    let frontmatter = data as T;
    if (type === "tools") {
      frontmatter = normalizeImage(
        type,
        data as { image?: string },
      ) as unknown as T;
    }

    return {
      slug,
      frontmatter,
    };
  });

  if (type === "tools") {
    return items.sort((a, b) => {
      const aTool = a.frontmatter as unknown as ToolFrontmatter;
      const bTool = b.frontmatter as unknown as ToolFrontmatter;

      if (aTool.featured && !bTool.featured) return -1;
      if (!aTool.featured && bTool.featured) return 1;
      return aTool.title.localeCompare(bTool.title);
    });
  }

  return items;
}

export async function getAllEntries<T>(
  type: ContentType,
): Promise<MarkdownListItem<T>[]> {
  return getAllEntriesSync<T>(type);
}

export async function getAllTools() {
  return getAllEntries<ToolFrontmatter>("tools");
}

export function getAllToolsSync() {
  return getAllEntriesSync<ToolFrontmatter>("tools");
}

export async function getAllResources() {
  return getAllEntries<ResourceFrontmatter>("resources");
}


// ---------------------------------------------------------------------------
// Guides and lessons: markdown in content/guides and content/lessons.

const WINGS = ["guides", "lessons"] as const;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const EM_DASH = String.fromCharCode(0x2014);
const MIN_WORDS = 300;
const WORDS_PER_MINUTE = 220;

function bodyWordCount(body: string): number {
  const text = body.replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

// gray-matter turns an unquoted YAML date into a Date; keep it a plain string.
function isoString(value: unknown): unknown {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

/** The only content check. Throws at build with the slug and the reason. */
export function validateGuide(
  slug: string,
  data: Record<string, unknown>,
  body: string,
): void {
  const fail = (reason: string) => {
    throw new Error(`Guide "${slug}": ${reason}`);
  };
  for (const field of ["title", "date", "updated", "description"]) {
    if (!data[field]) fail(`frontmatter is missing "${field}"`);
  }
  for (const field of ["date", "updated"]) {
    if (typeof data[field] !== "string" || !ISO_DATE.test(data[field] as string)) {
      fail(`"${field}" must be YYYY-MM-DD, got ${JSON.stringify(data[field])}`);
    }
  }
  if ((data.updated as string) < (data.date as string)) {
    fail(`"updated" (${data.updated}) is earlier than "date" (${data.date})`);
  }
  const words = bodyWordCount(body);
  if (words < MIN_WORDS) fail(`body is ${words} words; the minimum is ${MIN_WORDS}`);
  if (body.includes(EM_DASH)) fail("body contains an em dash");
  if (JSON.stringify(data).includes(EM_DASH)) fail("frontmatter contains an em dash");
}

function readGuideFile(slug: string): { dir: string; data: GuideFrontmatter; body: string } {
  for (const wing of WINGS) {
    const fullPath = path.join(CONTENT_DIR, wing, `${slug}.md`);
    if (!fs.existsSync(fullPath)) continue;
    const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
    data.date = isoString(data.date);
    data.updated = isoString(data.updated);
    data.wing = data.wing ?? wing;
    validateGuide(slug, data, content);
    return { dir: wing, data: data as GuideFrontmatter, body: content };
  }
  throw new Error(`Guide "${slug}" not found in content/guides or content/lessons`);
}

function toGuide(slug: string, data: GuideFrontmatter, body: string): Guide {
  return {
    slug,
    frontmatter: data,
    readingMinutes: Math.ceil(bodyWordCount(body) / WORDS_PER_MINUTE),
  };
}

/** Synchronous (gray-matter only) so `routes.ts` can build at import time.
 * Sorted by `updated`, newest first. */
export function listGuides(wing?: "guides" | "lessons"): Guide[] {
  const guides: Guide[] = [];
  for (const w of wing ? [wing] : WINGS) {
    const dir = path.join(CONTENT_DIR, w);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const slug = file.replace(/\.md$/, "");
      const { data, body } = readGuideFile(slug);
      guides.push(toGuide(slug, data, body));
    }
  }
  return guides.sort(
    (a, b) =>
      b.frontmatter.updated.localeCompare(a.frontmatter.updated) ||
      b.frontmatter.date.localeCompare(a.frontmatter.date) ||
      a.frontmatter.title.localeCompare(b.frontmatter.title),
  );
}

export async function getGuide(
  slug: string,
): Promise<Guide & { contentHtml: string }> {
  const { data, body } = readGuideFile(slug);
  const contentHtml = await renderMarkdownToHtml(body);
  return { ...toGuide(slug, data, body), contentHtml };
}
