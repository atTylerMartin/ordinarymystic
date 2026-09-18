import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllTools } from "@/lib/content";
import { SITE_URL } from "@/lib/config";

const baseUrl = SITE_URL;

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getAllTools();
  const posts = await getAllBlogPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/blog",
    "/tulsa-tarot-reading",
    "/tulsa-astrology-reading",
    "/login",
    "/account",
    "/account/profile",
    "/account/sessions",
  ].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...toolRoutes, ...postRoutes];
}

