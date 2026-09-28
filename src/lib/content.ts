import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type BlogPostFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
  image?: string;
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

export type ContentType = "blog" | "tools" | "resources";

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
    case "blog":
      return "/images/placeholder-blog-1.svg";
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

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(html).process(markdown);
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

  if (type === "blog" || type === "tools") {
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
    if (type === "blog" || type === "tools") {
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

  if (type === "blog") {
    return items.sort((a, b) => {
      const aDate = new Date(
        (a.frontmatter as unknown as BlogPostFrontmatter).date,
      ).getTime();
      const bDate = new Date(
        (b.frontmatter as unknown as BlogPostFrontmatter).date,
      ).getTime();
      return bDate - aDate;
    });
  }

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

export async function getAllBlogPosts() {
  return getAllEntries<BlogPostFrontmatter>("blog");
}

export function getAllBlogPostsSync() {
  return getAllEntriesSync<BlogPostFrontmatter>("blog");
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

