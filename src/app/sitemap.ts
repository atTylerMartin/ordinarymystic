import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/content";

const baseUrl = "https://ordinary.local";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getAllTools();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
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

  return [...staticRoutes, ...toolRoutes];
}

