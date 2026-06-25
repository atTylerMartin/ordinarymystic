// Supabase Edge Function: notify-review
//
// Triggered by a Database Webhook on INSERT into public.reviews. Emails a
// moderation notice via Resend so you know a review is waiting for approval.
//
// Deploy: Supabase dashboard → Edge Functions → create "notify-review",
// paste this file, and UNCHECK "Verify JWT" (the webhook authenticates with the
// shared secret below, not a Supabase Auth token).
//
// Required secret:  RESEND_API_KEY
// Optional secrets:
//   REVIEW_NOTIFY_TO       (default: ordinarymysticreadings@gmail.com)
//   REVIEW_NOTIFY_FROM     (default: Ordinary Mystic <reviews@ordinarymysticreadings.com>)
//   REVIEW_WEBHOOK_SECRET  (if set, the webhook must send a matching
//                           `x-webhook-secret` header — recommended)

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_TO = Deno.env.get("REVIEW_NOTIFY_TO") ?? "ordinarymysticreadings@gmail.com";
const NOTIFY_FROM =
  Deno.env.get("REVIEW_NOTIFY_FROM") ??
  "Ordinary Mystic <reviews@ordinarymysticreadings.com>";
const WEBHOOK_SECRET = Deno.env.get("REVIEW_WEBHOOK_SECRET");

const clamp = (n: number) => Math.max(0, Math.min(5, Math.round(n)));
const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

Deno.serve(async (req) => {
  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response("Not configured", { status: 500 });
  }

  let record: Record<string, unknown>;
  try {
    const body = await req.json();
    record = (body.record ?? body) as Record<string, unknown>;
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  const name = String(record.name ?? "Someone");
  const rating = clamp(Number(record.rating ?? 0));
  const text = String(record.body ?? "");
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px">
      <h2 style="margin:0 0 4px">New review awaiting approval</h2>
      <p style="margin:0 0 12px;color:#444">
        <strong>${escapeHtml(name)}</strong> &middot;
        <span style="color:#f59e0b">${stars}</span> (${rating}/5)
      </p>
      <blockquote style="border-left:3px solid #ddd;margin:0 0 16px;padding:4px 0 4px 12px;color:#333">
        ${escapeHtml(text)}
      </blockquote>
      <p style="margin:0;color:#666;font-size:14px">
        Approve it in the Supabase Table Editor — set <code>status</code> to
        <code>approved</code> and it appears on the site on the next page load.
      </p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `New review from ${name} (${rating}★) — pending approval`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return new Response("Email failed", { status: 502 });
  }
  return new Response("ok");
});
