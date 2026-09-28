// One-off stopgap: profile-img.png centered on the brand gradient, at the
// canonical 1200x630 OG size. Run with `node scripts/generate-og-image.mjs`.
// Replace public/images/og-default.png with a designed image when one exists;
// this script does not run at build time.
import sharp from "sharp";
import path from "node:path";

const WIDTH = 1200;
const HEIGHT = 630;
const AVATAR_SIZE = 320;

const outPath = path.join(process.cwd(), "public", "images", "og-default.png");
const avatarPath = path.join(process.cwd(), "public", "images", "profile-img.png");

const gradient = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#151326" />
        <stop offset="100%" stop-color="#213752" />
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  </svg>`,
);

const avatarMask = Buffer.from(
  `<svg width="${AVATAR_SIZE}" height="${AVATAR_SIZE}">
    <circle cx="${AVATAR_SIZE / 2}" cy="${AVATAR_SIZE / 2}" r="${AVATAR_SIZE / 2}" fill="#fff" />
  </svg>`,
);

const avatar = await sharp(avatarPath)
  .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
  .composite([{ input: avatarMask, blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(gradient)
  .composite([
    {
      input: avatar,
      left: Math.round((WIDTH - AVATAR_SIZE) / 2),
      top: Math.round((HEIGHT - AVATAR_SIZE) / 2),
    },
  ])
  .png()
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
