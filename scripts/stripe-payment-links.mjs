#!/usr/bin/env node
//
// Create (or re-find) the six reading Products + Prices + Payment Links in
// Stripe, and print a block of URLs to paste into `src/lib/offerings.ts`.
//
// Plain Node against the Stripe REST API via fetch — no new dependency, and
// `scripts/` sits outside the static build.
//
//   node scripts/stripe-payment-links.mjs --dry-run      # print the plan only
//   node scripts/stripe-payment-links.mjs --test         # STRIPE_TEST_SECRET_KEY
//   node scripts/stripe-payment-links.mjs                # STRIPE_SECRET_KEY (LIVE)
//   node scripts/stripe-payment-links.mjs --deactivate-old   # after the new URLs are live
//   node scripts/stripe-payment-links.mjs --list         # inventory, changes nothing
//
// Idempotent: a product is matched by `metadata.om_tier`, so re-running finds
// what already exists instead of creating duplicates.
//
// This script NEVER prints a secret key, and NEVER deletes a Product or Price.

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── tiers ────────────────────────────────────────────────────────────────────

const SITE = "https://ordinarymysticreadings.com";

const TIERS = [
  { om_tier: "recorded-15", name: "Recorded Reading — 15 minutes", amount: 3500,  redirect: `${SITE}/book/thanks/recorded` },
  { om_tier: "recorded-30", name: "Recorded Reading — 30 minutes", amount: 6500,  redirect: `${SITE}/book/thanks/recorded` },
  { om_tier: "recorded-60", name: "Recorded Reading — 60 minutes", amount: 12500, redirect: `${SITE}/book/thanks/recorded` },
  { om_tier: "live-15",     name: "Live Online Reading — 15 minutes", amount: 4000,  redirect: `${SITE}/book/thanks/live` },
  { om_tier: "live-30",     name: "Live Online Reading — 30 minutes", amount: 10000, redirect: `${SITE}/book/thanks/live` },
  { om_tier: "live-60",     name: "Live Online Reading — 60 minutes", amount: 19500, redirect: `${SITE}/book/thanks/live` },
];

const DESCRIPTIONS = {
  recorded:
    "Prepared privately off camera and delivered as a personalized video walkthrough plus a written synthesis.",
  live: "A live one-on-one reading over Zoom, followed by a written synthesis.",
};

// The six Payment Links currently wired into the site, by URL. These are the
// ONLY links --deactivate-old will ever touch.
const OLD_LINK_URLS = {
  "live-15": "https://buy.stripe.com/14A5kFaeocKR3joeEb6Zy0D",
  "live-30": "https://buy.stripe.com/eVqfZj2LWcKR2fkgMj6Zy0E",
  "live-60": "https://buy.stripe.com/dRmcN73Q07qx9HM0Nl6Zy0L",
  "recorded-15": "https://buy.stripe.com/4gMfZjaeo4elbPU1Rp6Zy0I",
  "recorded-30": "https://buy.stripe.com/fZu7sNcmw9yF4ns2Vt6Zy0J",
  "recorded-60": "https://buy.stripe.com/aFa7sN4U4bGN1bg7bJ6Zy0K",
};

// ── args ─────────────────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const TEST_MODE = args.has("--test");
const DEACTIVATE_OLD = args.has("--deactivate-old");
const LIST_ONLY = args.has("--list");

// ── key (read, never printed) ────────────────────────────────────────────────

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
const KEY_NAME = TEST_MODE ? "STRIPE_TEST_SECRET_KEY" : "STRIPE_SECRET_KEY";
const SECRET = env[KEY_NAME];

if (!DRY_RUN && !SECRET) {
  console.error(`✗ ${KEY_NAME} not found in .env.local or the environment.`);
  process.exit(1);
}
if (SECRET && !TEST_MODE && SECRET.startsWith("sk_test")) {
  console.error("✗ STRIPE_SECRET_KEY looks like a TEST key. Use --test, or fix the key.");
  process.exit(1);
}
if (SECRET && TEST_MODE && SECRET.startsWith("sk_live")) {
  console.error("✗ STRIPE_TEST_SECRET_KEY looks like a LIVE key. Refusing to run.");
  process.exit(1);
}

const MODE = DRY_RUN ? "DRY RUN" : TEST_MODE ? "TEST MODE" : "LIVE MODE";

// ── Stripe REST ──────────────────────────────────────────────────────────────

// Stripe takes form-encoded bodies with bracket notation for nesting.
function encodeForm(obj, prefix = "", out = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue;
    const k = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) =>
        typeof item === "object"
          ? encodeForm(item, `${k}[${i}]`, out)
          : out.push(`${encodeURIComponent(`${k}[${i}]`)}=${encodeURIComponent(item)}`)
      );
    } else if (typeof value === "object") {
      encodeForm(value, k, out);
    } else {
      out.push(`${encodeURIComponent(k)}=${encodeURIComponent(value)}`);
    }
  }
  return out.join("&");
}

async function stripe(method, path, body) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2025-08-27.basil",
    },
    body: body ? encodeForm(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    const message = json?.error?.message ?? res.statusText;
    // Never echo the request body — it is safe here, but the habit matters.
    throw new Error(`Stripe ${method} ${path} → ${res.status}: ${message}`);
  }
  return json;
}

async function listAll(path, params = {}) {
  const out = [];
  let starting_after;
  for (;;) {
    const qs = new URLSearchParams({ limit: "100", ...params });
    if (starting_after) qs.set("starting_after", starting_after);
    const page = await stripe("GET", `${path}?${qs}`);
    out.push(...page.data);
    if (!page.has_more) break;
    starting_after = page.data[page.data.length - 1].id;
  }
  return out;
}

// ── actions ──────────────────────────────────────────────────────────────────

function dryRun() {
  console.log(`\n${MODE} — nothing will be created.\n`);
  for (const t of TIERS) {
    console.log(`  ${t.om_tier.padEnd(12)} ${t.name}`);
    console.log(`  ${" ".repeat(12)} $${(t.amount / 100).toFixed(2)} USD one-time`);
    console.log(`  ${" ".repeat(12)} redirect → ${t.redirect}`);
    console.log(`  ${" ".repeat(12)} metadata.om_tier = ${t.om_tier}\n`);
  }
  console.log("Would create 6 Products, 6 Prices, 6 Payment Links.");
  console.log("Would deactivate nothing. Re-run without --dry-run to apply.\n");
}

async function inventory() {
  const [products, links] = await Promise.all([
    listAll("/products", { active: "true" }),
    listAll("/payment_links"),
  ]);
  console.log(`\n${MODE} — inventory\n`);
  console.log(`Active products: ${products.length}`);
  for (const p of products) {
    const tier = p.metadata?.om_tier ? ` [om_tier=${p.metadata.om_tier}]` : "";
    console.log(`  ${p.id}  ${p.name}${tier}`);
  }
  console.log(`\nPayment Links: ${links.length}`);
  for (const l of links) {
    console.log(`  ${l.id}  active=${l.active}  ${l.url}`);
  }
  console.log("");
  return { products, links };
}

async function apply() {
  console.log(`\n${MODE} — creating Products, Prices, and Payment Links.\n`);

  const products = await listAll("/products", { active: "true" });
  const byTier = new Map(
    products.filter((p) => p.metadata?.om_tier).map((p) => [p.metadata.om_tier, p])
  );
  const existingLinks = await listAll("/payment_links");

  const results = {};

  for (const t of TIERS) {
    let product = byTier.get(t.om_tier);
    if (product) {
      console.log(`  = product exists  ${t.om_tier}  ${product.id}`);
    } else {
      product = await stripe("POST", "/products", {
        name: t.name,
        description: DESCRIPTIONS[t.om_tier.split("-")[0]],
        metadata: { om_tier: t.om_tier },
      });
      console.log(`  + product created ${t.om_tier}  ${product.id}`);
    }

    // Reuse a matching active price if one is already on the product.
    const prices = await listAll("/prices", { product: product.id, active: "true" });
    let price = prices.find(
      (p) => p.unit_amount === t.amount && p.currency === "usd" && !p.recurring
    );
    if (price) {
      console.log(`  = price exists    ${t.om_tier}  ${price.id}`);
    } else {
      price = await stripe("POST", "/prices", {
        product: product.id,
        currency: "usd",
        unit_amount: t.amount,
        metadata: { om_tier: t.om_tier },
      });
      console.log(`  + price created   ${t.om_tier}  ${price.id}`);
    }

    let link = existingLinks.find(
      (l) => l.active && l.metadata?.om_tier === t.om_tier
    );
    if (link) {
      console.log(`  = link exists     ${t.om_tier}  ${link.url}`);
    } else {
      link = await stripe("POST", "/payment_links", {
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: "redirect",
          redirect: { url: t.redirect },
        },
        metadata: { om_tier: t.om_tier },
      });
      console.log(`  + link created    ${t.om_tier}  ${link.url}`);
    }

    results[t.om_tier] = link.url;
  }

  console.log("\n─── paste into src/lib/offerings.ts ───\n");
  console.log(JSON.stringify(results, null, 2));
  console.log("\nVerify every button before running --deactivate-old.\n");
  return results;
}

async function deactivateOld() {
  console.log(`\n${MODE} — deactivating the six previous reading links.\n`);
  const links = await listAll("/payment_links");
  const byUrl = new Map(links.map((l) => [l.url, l]));

  const targets = [];
  const missing = [];
  for (const [tier, url] of Object.entries(OLD_LINK_URLS)) {
    const link = byUrl.get(url);
    if (!link) missing.push(`${tier} → ${url}`);
    else targets.push({ tier, link });
  }

  if (missing.length) {
    console.error("✗ Could not resolve every old link. Nothing was changed.\n");
    for (const m of missing) console.error(`   missing: ${m}`);
    console.error("\nStop and report before deactivating anything.\n");
    process.exit(1);
  }

  for (const { tier, link } of targets) {
    if (!link.active) {
      console.log(`  = already inactive ${tier}  ${link.id}`);
      continue;
    }
    await stripe("POST", `/payment_links/${link.id}`, { active: false });
    console.log(`  · deactivated      ${tier}  ${link.id}  ${link.url}`);
  }
  console.log("\nProducts and Prices were left untouched. This is reversible.\n");
}

// ── main ─────────────────────────────────────────────────────────────────────

try {
  if (DRY_RUN) dryRun();
  else if (LIST_ONLY) await inventory();
  else if (DEACTIVATE_OLD) await deactivateOld();
  else await apply();
} catch (err) {
  console.error(`\n✗ ${err.message}\n`);
  process.exit(1);
}
