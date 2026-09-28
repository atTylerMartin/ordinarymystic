// Fails the build if `public/llms.txt` has drifted from the prices in
// `src/lib/offerings.ts` or the tool slugs in `content/tools`. Wired as
// `prebuild` so a price change or a new tool can't go stale in the one file
// that has to state prices as literal text.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const llmsPath = path.join(root, "public", "llms.txt");
const offeringsPath = path.join(root, "src", "lib", "offerings.ts");
const toolsDir = path.join(root, "content", "tools");

const llms = fs.readFileSync(llmsPath, "utf8");
const offerings = fs.readFileSync(offeringsPath, "utf8");

const missing = [];

const prices = [...offerings.matchAll(/price:\s*(\d+)/g)].map((m) => m[1]);
const uniquePrices = [...new Set(prices)];
for (const price of uniquePrices) {
  if (!llms.includes(`$${price}`)) {
    missing.push(`price $${price} (from offerings.ts) not found in llms.txt`);
  }
}

const toolSlugs = fs.existsSync(toolsDir)
  ? fs
      .readdirSync(toolsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""))
  : [];
for (const slug of toolSlugs) {
  if (!llms.includes(slug)) {
    missing.push(`tool slug "${slug}" (from content/tools) not found in llms.txt`);
  }
}

if (missing.length > 0) {
  console.error("llms.txt is out of date:");
  for (const line of missing) console.error(`  - ${line}`);
  process.exit(1);
}

console.log("llms.txt is up to date.");
