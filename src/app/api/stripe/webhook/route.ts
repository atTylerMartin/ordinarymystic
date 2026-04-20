import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

// Must be a raw body route — Next.js must not parse JSON before Stripe signature check
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Maps Stripe product names (or amount) to internal product keys.
// Add entries as new products are created in Stripe.
function deriveProductKey(name: string | null, amountUsd: number): string {
  if (!name) return `unknown_${amountUsd}`;
  const n = name.toLowerCase();
  if (n.includes("natal") && n.includes("zoom"))   return "natal_live_zoom";
  if (n.includes("natal") && n.includes("person")) return "natal_live_ip";
  if (n.includes("natal"))                          return "natal_written";
  if (n.includes("transit") && n.includes("zoom")) return "transit_live_zoom";
  if (n.includes("transit"))                        return "transit_written";
  if (n.includes("profection"))                     return "annual_profections";
  if (n.includes("combined") && n.includes("person")) return "combined_live_ip";
  if (n.includes("combined"))                       return "combined_live_zoom";
  if (n.includes("tarot") && n.includes("zoom"))   return "tarot_live_zoom";
  if (n.includes("tarot") && n.includes("person")) return "tarot_live_ip";
  if (n.includes("tarot") && n.includes("record")) return "tarot_recorded";
  if (n.includes("tarot") && n.includes("written")) return "tarot_written";
  if (n.includes("quick") || n.includes("3 card") || n.includes("3-card")) return "tarot_quick";
  if (n.includes("subscription"))                   return "tarot_subscription";
  return `other_${amountUsd}`;
}

// April 2026 promo prices (cents) — 3-card and 10-card at $25
const PROMO_PRICES_CENTS = new Set([2500]);

export async function POST(request: Request) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {

      // ── New completed purchase ──────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status !== "paid") break; // handle async_payment_succeeded separately

        const amountCents = session.amount_total ?? 0;
        const amountUsd   = amountCents / 100;

        // Pull first line item name if available (requires expand — best effort from metadata)
        const productName = (session.metadata?.product_name as string | undefined) ?? null;
        const productKey  = deriveProductKey(productName, amountUsd);

        await supabase.from("om_sales").upsert(
          {
            stripe_checkout_id:  session.id,
            stripe_charge_id:    typeof session.payment_intent === "string"
                                   ? session.payment_intent
                                   : (session.payment_intent?.id ?? null),
            product_key:         productKey,
            product_name:        productName,
            amount_usd:          amountUsd,
            customer_email:      session.customer_details?.email ?? null,
            customer_name:       session.customer_details?.name  ?? null,
            promo_applied:       PROMO_PRICES_CENTS.has(amountCents),
            content_rights:      (session.metadata?.content_rights as string | undefined) === "true",
            referrer_email:      (session.metadata?.referrer_email as string | undefined) ?? null,
            attribution_channel: (session.metadata?.attribution_channel as string | undefined)
                                   ?? deriveChannel(session.metadata?.utm_source as string | undefined),
            fulfillment_status:  "pending",
            event_type:          event.type,
            raw_event:           event as unknown as Record<string, unknown>,
          },
          { onConflict: "stripe_checkout_id" }
        );

        console.info(`[stripe/webhook] Sale recorded: ${productKey} $${amountUsd} (${session.customer_details?.email})`);
        break;
      }

      // ── Async payment succeeded (bank/ACH delayed) ─────────────────────────
      case "checkout.session.async_payment_succeeded": {
        const session     = event.data.object as Stripe.Checkout.Session;
        const amountCents = session.amount_total ?? 0;
        const amountUsd   = amountCents / 100;
        const productName = (session.metadata?.product_name as string | undefined) ?? null;
        const productKey  = deriveProductKey(productName, amountUsd);

        await supabase.from("om_sales").upsert(
          {
            stripe_checkout_id:  session.id,
            stripe_charge_id:    typeof session.payment_intent === "string"
                                   ? session.payment_intent
                                   : (session.payment_intent?.id ?? null),
            product_key:         productKey,
            product_name:        productName,
            amount_usd:          amountUsd,
            customer_email:      session.customer_details?.email ?? null,
            customer_name:       session.customer_details?.name  ?? null,
            promo_applied:       PROMO_PRICES_CENTS.has(amountCents),
            content_rights:      (session.metadata?.content_rights as string | undefined) === "true",
            referrer_email:      (session.metadata?.referrer_email as string | undefined) ?? null,
            attribution_channel: (session.metadata?.attribution_channel as string | undefined)
                                   ?? deriveChannel(session.metadata?.utm_source as string | undefined),
            fulfillment_status:  "pending",
            event_type:          event.type,
            raw_event:           event as unknown as Record<string, unknown>,
          },
          { onConflict: "stripe_checkout_id" }
        );

        console.info(`[stripe/webhook] Async payment succeeded: ${productKey} $${amountUsd}`);
        break;
      }

      // ── Async payment failed ────────────────────────────────────────────────
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const { error } = await supabase
          .from("om_sales")
          .update({
            fulfillment_status: "async_failed",
            event_type:         event.type,
            raw_event:          event as unknown as Record<string, unknown>,
          })
          .eq("stripe_checkout_id", session.id);

        if (error) {
          // Row may not exist if this fires before completed — insert a minimal record
          await supabase.from("om_sales").upsert(
            {
              stripe_checkout_id: session.id,
              customer_email:     session.customer_details?.email ?? null,
              fulfillment_status: "async_failed",
              event_type:         event.type,
              raw_event:          event as unknown as Record<string, unknown>,
            },
            { onConflict: "stripe_checkout_id" }
          );
        }

        console.warn(`[stripe/webhook] Async payment FAILED for session ${session.id}`);
        break;
      }

      // ── Refund ─────────────────────────────────────────────────────────────
      case "charge.refunded": {
        const charge       = event.data.object as Stripe.Charge;
        const refundAmount = (charge.amount_refunded ?? 0) / 100;

        const { error } = await supabase
          .from("om_sales")
          .update({
            fulfillment_status: "refunded",
            refunded_at:        new Date().toISOString(),
            refund_amount_usd:  refundAmount,
            event_type:         event.type,
            raw_event:          event as unknown as Record<string, unknown>,
          })
          .eq("stripe_charge_id", charge.payment_intent as string);

        if (error) {
          console.error("[stripe/webhook] Failed to update refund:", error);
        } else {
          console.info(`[stripe/webhook] Refund recorded: $${refundAmount} for PI ${charge.payment_intent}`);
        }
        break;
      }

      default:
        // Silently ignore unregistered events
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err);
    return NextResponse.json({ error: "Internal handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Derive attribution channel from UTM source if no explicit channel in metadata
function deriveChannel(utmSource: string | undefined): string {
  if (!utmSource) return "direct";
  const s = utmSource.toLowerCase();
  if (s.includes("tiktok"))   return "tiktok";
  if (s.includes("reddit"))   return "reddit";
  if (s.includes("youtube"))  return "youtube";
  if (s.includes("instagram")) return "instagram";
  return s;
}
