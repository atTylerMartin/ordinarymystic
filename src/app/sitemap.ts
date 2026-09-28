import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: route.updated,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
