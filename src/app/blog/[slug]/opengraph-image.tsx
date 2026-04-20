import { ImageResponse } from "next/og";
import { getAllBlogPosts } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

async function loadNewsreaderFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Newsreader:wght@400&display=swap",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        next: { revalidate: 86400 },
      },
    ).then((r) => r.text());

    const url = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
    if (!url) return null;

    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  astrology: "Astrology",
  tarot: "Tarot",
  "general-spirituality": "Spirituality",
};

function getCategoryLabel(category?: string): string {
  if (!category) return "Essay";
  return (
    CATEGORY_LABELS[category] ??
    category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function getTitleFontSize(title: string): number {
  if (title.length <= 28) return 72;
  if (title.length <= 42) return 62;
  if (title.length <= 56) return 52;
  return 44;
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getAllBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  const title = post?.frontmatter.title ?? SITE_NAME;
  const description = post?.frontmatter.description ?? "";
  const categoryLabel = getCategoryLabel(post?.frontmatter.category);
  const fontSize = getTitleFontSize(title);
  const truncatedDesc =
    description.length > 110
      ? description.slice(0, 110).trimEnd() + "…"
      : description;

  const fontData = await loadNewsreaderFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#1a1614",
          display: "flex",
          flexDirection: "column",
          padding: "0 80px 64px 80px",
          position: "relative",
        }}
      >
        {/* oxblood accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#7a2e2a",
          }}
        />

        {/* category label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 68,
            color: "#7a2e2a",
            fontSize: 13,
            fontFamily: "sans-serif",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 24, height: 2, backgroundColor: "#7a2e2a" }} />
          {categoryLabel}
        </div>

        {/* title */}
        <div
          style={{
            marginTop: 24,
            color: "#f5f0e8",
            fontSize,
            fontFamily: fontData ? "Newsreader" : "serif",
            fontWeight: 400,
            lineHeight: 1.18,
            flex: 1,
          }}
        >
          {title}
        </div>

        {/* description */}
        {truncatedDesc ? (
          <div
            style={{
              color: "#7a6c5e",
              fontSize: 20,
              fontFamily: "sans-serif",
              lineHeight: 1.55,
              marginBottom: 32,
            }}
          >
            {truncatedDesc}
          </div>
        ) : null}

        {/* bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #2e2420",
            paddingTop: 22,
          }}
        >
          <span
            style={{
              color: "#f5f0e8",
              fontSize: 19,
              fontFamily: fontData ? "Newsreader" : "serif",
              fontWeight: 400,
            }}
          >
            {SITE_NAME}
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: "#4a3f36",
              fontSize: 14,
              fontFamily: "sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            ordinarymysticreadings.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Newsreader", data: fontData, style: "normal", weight: 400 }]
        : [],
    },
  );
}
