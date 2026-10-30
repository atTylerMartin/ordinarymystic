// A time-boxed sale on the recorded readings. The Stripe coupon (promotion code
// below, on all three recorded Payment Links) carries the discount; this file
// only shows it. Everything it drives hides itself after `ends`. Delete this
// file and its uses once the sale is over.

export const SALE = {
  code: "TRICKORTREAT",
  amountOff: 10,
  label: "Halloween sale",
  headline: "$10 off every recorded reading",
  howTo: "Enter the code at checkout.",
  endsLabel: "Ends Sunday night.",
  /** Stripe's redeem-by for the coupon: 11:59 pm Central on Nov 1 (CST by then). */
  ends: "2026-11-01T23:59:00-06:00",
} as const;

export const SALE_ENDS_MS = Date.parse(SALE.ends);
