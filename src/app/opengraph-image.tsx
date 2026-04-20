import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Google Fonts' css2 endpoint returns WOFF2 by default, which satori can't
// parse ("Unsupported OpenType signature wOF2"). When you include a `text=`
// subset parameter, Google returns a TTF subset containing just those glyphs,
// which satori accepts.
async function loadNewsreaderFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Newsreader:wght@400&text=${encodeURIComponent(text)}`;
    const css = await fetch(url, {
      next: { revalidate: 86400 },
    }).then((r) => r.text());

    const match = css.match(
      /src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/,
    );
    if (!match) return null;

    return fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OgImage() {
  // SITE_NAME is the only text that renders in Newsreader on the home OG.
  const fontData = await loadNewsreaderFont(SITE_NAME);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#1a1614",
          display: "flex",
          flexDirection: "column",
          padding: "0 96px 72px 96px",
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

        {/* scope labels */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginTop: 72,
            color: "#4a3f36",
            fontSize: 12,
            fontFamily: "sans-serif",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <span>Tarot</span>
          <span style={{ color: "#2e2420" }}>·</span>
          <span>Astrology</span>
          <span style={{ color: "#2e2420" }}>·</span>
          <span>Tulsa, Oklahoma</span>
        </div>

        {/* site name */}
        <div
          style={{
            marginTop: 32,
            color: "#f5f0e8",
            fontSize: 88,
            fontFamily: fontData ? "Newsreader" : "serif",
            fontWeight: 400,
            lineHeight: 1.08,
            flex: 1,
          }}
        >
          {SITE_NAME}
        </div>

        {/* tagline */}
        <div
          style={{
            color: "#7a6c5e",
            fontSize: 22,
            fontFamily: "sans-serif",
            lineHeight: 1.5,
            marginBottom: 36,
          }}
        >
          Structured thinking for tarot and astrology — without the theatrics.
        </div>

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
              color: "#7a2e2a",
              fontSize: 14,
              fontFamily: "sans-serif",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Tyler Martin
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
            {SITE_URL.replace("https://", "")}
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
