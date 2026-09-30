# WP-3a: Collect the question at checkout on the six reading Payment Links

Model: Sonnet. Branch: `stripe-question` from `tiktok-landing`. Small and independent of
WP-2 and WP-3. Prerequisite: Tyler has confirmed in the Stripe dashboard whether the
recorded links already collect a custom field. If they do, this package only documents it.

## Read first
- `CLAUDE.md` (Pricing section: never delete Products or Prices, never print a secret key)
- `scripts/stripe-payment-links.mjs` (idempotent on `metadata.om_tier`; has `--dry-run`,
  `--test`, `--list`, `--deactivate-old`)
- Stripe docs for Payment Links custom fields: `custom_fields` accepts up to three fields;
  a `text` field allows up to 255 characters; `custom_fields` can be set on an existing link
  with `paymentLinks.update`, so no new links and no URL changes are needed.

## Build
Add a `--set-question-field` mode to `scripts/stripe-payment-links.mjs` that, for the six
tiers with `om_tier` starting `recorded-` or `live-` (never the `stream-` ones), finds the
active link by `metadata.om_tier` and updates it with:
```js
custom_fields: [{
  key: "question",
  label: { type: "custom", custom: "Your question, in a sentence" },
  type: "text",
  optional: false,
  text: { maximum_length: 255 },
}]
```
Astrology bookings share these links, so the label stays generic. `--dry-run` prints what
would change. The script reads `STRIPE_SECRET_KEY` from `.env.local` as it does today and
never prints it. Add a short comment block at the top of the tier list saying the question
is collected at checkout by this field and in full on `/book/thanks/recorded`.

Document in `CLAUDE.md` under "The pay page" or a new "Booking" line: the six reading links
carry a required `question` custom field; the stream links do not; the thanks page asks for
the full question by email.

## Verify
- `node scripts/stripe-payment-links.mjs --set-question-field --dry-run` lists six links
  and no `stream-` ones.
- Run it for real, then `--list` shows `custom_fields` present on the six.
- Open one recorded link in a browser: the checkout page shows the question field, required.
- The two stream links are unchanged.

## Commit
One commit on `stripe-question`. Do not merge or push. Reply with the dry-run output and
the `--list` output (no keys).
