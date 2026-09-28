import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

const baseUrl = SITE_URL;

export const dynamic = "force-static";

// AI crawlers are allowed explicitly rather than left to the default rule:
// some respect a narrower `Disallow` under their own user-agent even when
// `*` allows everything, so naming them removes any ambiguity. No page here
// carries a `Disallow`; a crawler can only honor a page's `noindex` tag if it
// is allowed to fetch the page in the first place.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
