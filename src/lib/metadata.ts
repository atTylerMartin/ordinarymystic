import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { getRoute } from "@/lib/routes";

const SITE_NAME = "Ordinary Mystic";

export const OG_DEFAULT = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** A page that skips this and hand-writes `openGraph` loses the rest of the
 * block, because Next merges metadata shallowly against the root layout's.
 * Every registered page goes through this instead. */
export function pageMetadata(
  path: string,
  overrides?: {
    image?: typeof OG_DEFAULT;
    /** Guides only: switches og:type to article and adds its dates. */
    article?: { publishedTime: string; modifiedTime: string };
  },
): Metadata {
  const route = getRoute(path);
  const image = overrides?.image ?? OG_DEFAULT;
  const article = overrides?.article;

  return {
    title: route.absoluteTitle ? { absolute: route.title } : route.title,
    description: route.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
          }
        : { type: "website" as const }),
      locale: "en_US",
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title: route.title,
      description: route.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
      images: [image.url],
    },
  };
}

/** For the utility pages that must stay live for old inbound links, out of
 * search entirely: `/book/thanks/*`, `/thank-you`, `/resources`. */
export const NOINDEX: Metadata = {
  robots: { index: false, follow: false },
};
