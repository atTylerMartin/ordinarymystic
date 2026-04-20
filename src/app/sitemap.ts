import type { MetadataRoute } from "next";
import { AUTHORS } from "@/data/authors";
import { TAXONOMY_INDEX } from "@/data/taxonomy";
import {
  getAllBlogPosts,
  getAllForecasts,
  getAllKnowledgeBase,
} from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, forecasts, knowledgeBase] = await Promise.all([
    getAllBlogPosts(),
    getAllForecasts(),
    getAllKnowledgeBase(),
  ]);
  const categories = new Set<string>();
  const subcategories = new Set<string>();
  const tags = new Set<string>();

  for (const post of posts) {
    if (post.frontmatter.category) categories.add(post.frontmatter.category);
    if (post.frontmatter.subcategory) subcategories.add(post.frontmatter.subcategory);
    for (const tag of post.frontmatter.tags ?? []) tags.add(tag);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/blog",
    "/forecasts",
    "/knowledge-base",
    "/book",
    "/tools",
    "/resources",
    "/about",
    "/tulsa-tarot-reading",
    "/tulsa-astrology-reading",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : ["/book", "/tulsa-tarot-reading", "/tulsa-astrology-reading"].includes(path) ? 0.9 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : undefined,
  }));

  const forecastRoutes: MetadataRoute.Sitemap = forecasts.map((post) => ({
    url: `${SITE_URL}/forecasts/${post.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : undefined,
  }));

  const knowledgeBaseRoutes: MetadataRoute.Sitemap = knowledgeBase.map((post) => ({
    url: `${SITE_URL}/knowledge-base/${post.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : undefined,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = [...categories].map((category) => ({
    url: `${SITE_URL}/blog/categories/${category}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const subcategoryRoutes: MetadataRoute.Sitemap = [...subcategories].map((subcategory) => ({
    url: `${SITE_URL}/blog/subcategories/${subcategory}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = [...tags].map((tag) => ({
    url: `${SITE_URL}/blog/tags/${tag}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const authorRoutes: MetadataRoute.Sitemap = Object.keys(AUTHORS).map((authorSlug) => ({
    url: `${SITE_URL}/authors/${authorSlug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const taxonomyRoutes: MetadataRoute.Sitemap = [
    ...Object.keys(TAXONOMY_INDEX.signs).map((sign) => `/blog/signs/${sign}`),
    ...Object.keys(TAXONOMY_INDEX.planets).map((planet) => `/blog/planets/${planet}`),
    ...Object.keys(TAXONOMY_INDEX.houses).map((house) => `/blog/houses/${house}`),
    ...Object.keys(TAXONOMY_INDEX.cards).map((card) => `/blog/cards/${card}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...forecastRoutes,
    ...knowledgeBaseRoutes,
    ...categoryRoutes,
    ...subcategoryRoutes,
    ...tagRoutes,
    ...authorRoutes,
    ...taxonomyRoutes,
  ];
}

