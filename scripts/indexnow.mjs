#!/usr/bin/env node
//
// Tell Bing (and other IndexNow-subscribed engines) that a URL changed, via
// https://api.indexnow.org/indexnow. Plain Node against fetch, no dependency,
// the same house style as scripts/stripe-payment-links.mjs.
//
//   npm run indexnow -- /guides /guides/some-slug   # specific paths or URLs
//   npm run indexnow -- --sitemap                   # every URL in the sitemap
//   npm run indexnow -- --sitemap --since 3         # only <lastmod> within 3 days
//
// Reads INDEXNOW_KEY from .env.local (if present) or the environment. Never
// prints the key.

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Hardcoded because a plain .mjs cannot import the TS module; keep in sync
// with SITE_URL in src/lib/config.ts.
const SITE_URL = "https://ordinarymysticreadings.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

function readEnvLocal() {
  let text;
  try {
    text = readFileSync(join(root, ".env.local"), "utf8");
  } catch {
    return {};
  }
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...readEnvLocal(), ...process.env };
const KEY = env.INDEXNOW_KEY;

function usage() {
  console.log(`
Usage:
  npm run indexnow -- <url> [<url>...]          submit specific paths or URLs
  npm run indexnow -- --sitemap                 submit every URL in the sitemap
  npm run indexnow -- --sitemap --since <days>  submit only recently updated URLs

INDEXNOW_KEY must be set in .env.local or the environment.
`);
}

const rawArgs = process.argv.slice(2);
if (rawArgs.length === 0) {
  usage();
  process.exit(1);
}

if (!KEY) {
  console.error("✗ INDEXNOW_KEY not found in .env.local or the environment.");
  process.exit(1);
}

const SITEMAP_MODE = rawArgs.includes("--sitemap");
const sinceIndex = rawArgs.indexOf("--since");
const SINCE_DAYS = sinceIndex !== -1 ? Number(rawArgs[sinceIndex + 1]) : undefined;

if (sinceIndex !== -1 && (!Number.isFinite(SINCE_DAYS) || SINCE_DAYS <= 0)) {
  console.error("✗ --since needs a positive number of days.");
  process.exit(1);
}

function toAbsoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) {
    throw new Error(`Fetching sitemap → ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const entries = [];
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (loc) entries.push({ loc, lastmod });
  }
  return entries;
}

async function collectUrls() {
  if (!SITEMAP_MODE) {
    return rawArgs.filter((a) => a !== "--sitemap").map(toAbsoluteUrl);
  }

  const entries = await fetchSitemapUrls();
  if (SINCE_DAYS === undefined) {
    return entries.map((e) => e.loc);
  }

  const cutoff = Date.now() - SINCE_DAYS * 24 * 60 * 60 * 1000;
  const recent = entries.filter((e) => {
    if (!e.lastmod) return false;
    const t = Date.parse(e.lastmod);
    return Number.isFinite(t) && t >= cutoff;
  });
  console.log(
    `${recent.length} of ${entries.length} sitemap URLs updated in the last ${SINCE_DAYS} day(s):`,
  );
  for (const e of recent) console.log(`  ${e.loc}  (${e.lastmod})`);
  return recent.map((e) => e.loc);
}

async function submit(urlList) {
  const body = {
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`\nIndexNow: ${res.status} ${res.statusText}`);
  for (const url of urlList) console.log(`  ${url}`);

  if (res.status !== 200 && res.status !== 202) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      // ignore
    }
    if (res.status === 422) {
      console.error(
        "\n✗ 422: the key file is probably not deployed yet at keyLocation, or the key does not match.",
      );
    }
    if (detail) console.error(detail);
    process.exit(1);
  }

  console.log("\nSubmitted.\n");
}

try {
  const urlList = await collectUrls();
  if (urlList.length === 0) {
    console.log("Nothing to submit.");
    process.exit(0);
  }
  await submit(urlList);
} catch (err) {
  console.error(`\n✗ ${err.message}\n`);
  process.exit(1);
}
