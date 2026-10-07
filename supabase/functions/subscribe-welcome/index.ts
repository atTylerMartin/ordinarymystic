// Supabase Edge Function: subscribe-welcome
//
// Triggered by a Database Webhook on INSERT into public.subscribers. Adds the
// new subscriber to the Resend audience as a contact (with the properties
// brand, source, campaign and landing), then sends a one-line plain welcome
// email. The table is the list of record; Resend is a copy. A failed Resend
// call leaves the row in place, so the person can be added by hand.
//
// Deploy: Supabase dashboard -> Edge Functions -> "subscribe-welcome", paste
// this file, and UNCHECK "Verify JWT" (the webhook authenticates with the
// shared secret below).
//
// Webhook: Database -> Webhooks -> Create. Table public.subscribers, event
// INSERT only, type "Supabase Edge Functions", function subscribe-welcome,
// HTTP header `x-webhook-secret` set to the SUBSCRIBE_WEBHOOK_SECRET value.
//
// Resend audience: Contacts -> Properties. Create text properties named
// brand, source, campaign and landing first. If they are missing the contact
// is still created, just without them.
//
// Required secrets:  RESEND_API_KEY, RESEND_AUDIENCE_ID, SUBSCRIBE_WEBHOOK_SECRET
// Optional secrets:
//   SUBSCRIBE_FROM      (default: Tyler <tyler@ordinarymysticreadings.com>; the
//                        domain must be verified in Resend)
//   SUBSCRIBE_REPLY_TO  (default: ordinarymysticreadings@gmail.com)
//   SUBSCRIBE_SITE_URL  (default: https://ordinarymysticreadings.com)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const AUDIENCE_ID = Deno.env.get("RESEND_AUDIENCE_ID");
const WEBHOOK_SECRET = Deno.env.get("SUBSCRIBE_WEBHOOK_SECRET");
const FROM =
  Deno.env.get("SUBSCRIBE_FROM") ??
  "Tyler <tyler@ordinarymysticreadings.com>";
const REPLY_TO =
  Deno.env.get("SUBSCRIBE_REPLY_TO") ?? "ordinarymysticreadings@gmail.com";
const SITE_URL =
  Deno.env.get("SUBSCRIBE_SITE_URL") ?? "https://ordinarymysticreadings.com";

const RESEND = "https://api.resend.com";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Resend allows two requests a second. One retry after a pause on a 429 is
// enough for a welcome email sent right behind the contact call.
async function resend(path: string, body: unknown): Promise<Response> {
  const send = () =>
    fetch(`${RESEND}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  let res = await send();
  if (res.status === 429) {
    await sleep(1100);
    res = await send();
  }
  return res;
}

Deno.serve(async (req) => {
  // Fail closed: with no secret configured, nobody gets in.
  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!RESEND_API_KEY || !AUDIENCE_ID) {
    console.error("RESEND_API_KEY or RESEND_AUDIENCE_ID is not set");
    return new Response("Not configured", { status: 500 });
  }

  let record: Record<string, unknown>;
  try {
    const body = await req.json();
    if (body.type && body.type !== "INSERT") return new Response("ignored");
    record = (body.record ?? body) as Record<string, unknown>;
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const email = String(record.email ?? "").trim();
  if (!email) return new Response("Bad payload", { status: 400 });
  const firstName = String(record.first_name ?? "").trim();

  const properties = {
    brand: String(record.brand ?? "om"),
    source: String(record.source ?? ""),
    campaign: String(record.campaign ?? ""),
    landing: String(record.landing ?? ""),
  };
  const contact = {
    email,
    ...(firstName ? { first_name: firstName } : {}),
    unsubscribed: false,
  };

  let ok = true;

  // 1. The Resend contact. Retry without properties if the audience lacks
  //    them; "already exists" counts as success.
  let res = await resend(`/audiences/${AUDIENCE_ID}/contacts`, {
    ...contact,
    properties,
  });
  if (!res.ok) {
    const first = await res.text();
    if (/already exist/i.test(first)) {
      // Fine: the contact is there.
    } else {
      console.error("Resend contact (with properties) failed", res.status, first);
      res = await resend(`/audiences/${AUDIENCE_ID}/contacts`, contact);
      if (!res.ok) {
        const second = await res.text();
        if (!/already exist/i.test(second)) {
          console.error("Resend contact failed", res.status, second);
          ok = false;
        }
      }
    }
  }

  // 2. The welcome email: plain text, one link, tagged for GA.
  const link =
    `${SITE_URL}/readings/recorded` +
    "?utm_source=newsletter&utm_medium=email&utm_campaign=welcome";
  const text =
    "Thanks for signing up. Twice a month you get one guide, one note on the " +
    "sky, and one line about booking. If a question is already sitting with " +
    `you, recorded readings are here: ${link}\n\nTyler`;

  const mail = await resend("/emails", {
    from: FROM,
    to: email,
    reply_to: REPLY_TO,
    subject: "You're on the list",
    text,
  });
  if (!mail.ok) {
    console.error("Resend email failed", mail.status, await mail.text());
    ok = false;
  }

  return ok ? new Response("ok") : new Response("Resend failed", { status: 502 });
});
