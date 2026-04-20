-- OM Sales tracking table
-- Run this once in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS om_sales (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_checkout_id   TEXT         UNIQUE,
  stripe_charge_id     TEXT,
  product_key          TEXT,                          -- e.g. "tarot_written", "natal_written"
  product_name         TEXT,                          -- raw name from Stripe line item
  amount_usd           NUMERIC(10, 2),
  customer_email       TEXT,
  customer_name        TEXT,
  promo_applied        BOOLEAN      NOT NULL DEFAULT FALSE,
  content_rights       BOOLEAN      NOT NULL DEFAULT FALSE,
  referrer_email       TEXT,
  attribution_channel  TEXT,                          -- tiktok | reddit | youtube | direct
  fulfillment_status   TEXT         NOT NULL DEFAULT 'pending'
    CHECK (fulfillment_status IN ('pending', 'delivered', 'refunded', 'async_pending', 'async_failed')),
  delivered_at         TIMESTAMPTZ,
  refunded_at          TIMESTAMPTZ,
  refund_amount_usd    NUMERIC(10, 2),
  event_type           TEXT,                          -- the Stripe event that created/updated this row
  raw_event            JSONB,                         -- full event payload for debugging
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS om_sales_customer_email_idx      ON om_sales (customer_email);
CREATE INDEX IF NOT EXISTS om_sales_created_at_idx          ON om_sales (created_at DESC);
CREATE INDEX IF NOT EXISTS om_sales_fulfillment_status_idx  ON om_sales (fulfillment_status);
CREATE INDEX IF NOT EXISTS om_sales_stripe_checkout_id_idx  ON om_sales (stripe_checkout_id);
