// Fails the build if `public/llms.txt` has drifted from the prices in
// `src/lib/offerings.ts`, the tool slugs in `content/tools`, or the guide
// slugs in `content/guides`. Wired as `prebuild` so a price change, a new
// tool, or a new guide can't go stale in the one file
// that has to state prices as literal text.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const llmsPath = path.join(root, "public", "llms.txt");
const offeringsPath = path.join(root, "src", "lib", "offerings.ts");
const toolsDir = path.join(root, "content", "tools");
const guidesDir = path.join(root, "content", "guides");

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

function slugsIn(dir) {
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
    : [];
}

for (const slug of slugsIn(toolsDir)) {
  if (!llms.includes(slug)) {
    missing.push(`tool slug "${slug}" (from content/tools) not found in llms.txt`);
  }
}

// Matched as a list item ("- <slug> :") so one slug that prefixes another
// can't pass by accident.
for (const slug of slugsIn(guidesDir)) {
  if (!llms.includes(`- ${slug} :`)) {
    missing.push(`guide slug "${slug}" (from content/guides) not found in llms.txt`);
  }
}

if (missing.length > 0) {
  console.error("llms.txt is out of date:");
  for (const line of missing) console.error(`  - ${line}`);
  process.exit(1);
}

console.log("llms.txt is up to date.");
