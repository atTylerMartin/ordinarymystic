// Supabase Edge Function: review-action
//
// Handles the Approve / Reject buttons in the notification email. Each link
// carries an HMAC token (id + action, signed with REVIEW_WEBHOOK_SECRET) so it
// can't be guessed or reused. A GET shows a confirmation page; only a POST
// (the "Confirm" button) actually changes the review — this prevents email
// link-prefetchers from acting without you.
//
// Deploy: Supabase dashboard → Edge Functions → create "review-action",
// paste this file, UNCHECK "Verify JWT".
//
// Uses the auto-injected SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY secrets
// (Supabase provides these to every function — no setup needed). Requires the
// same REVIEW_WEBHOOK_SECRET you set on notify-review.

const SECRET = Deno.env.get("REVIEW_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const enc = new TextEncoder();

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );

function page(title: string, bodyHtml: string, status = 200): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title></head>
    <body style="font-family:system-ui,sans-serif;background:#f5f4f2;margin:0;padding:40px 16px">
      <div style="max-width:460px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px">
        <h1 style="margin:0 0 12px;font-size:20px;color:#111">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </div>
    </body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  let action = url.searchParams.get("action") ?? "";
  const token = url.searchParams.get("token") ?? "";
  if (action === "deny") action = "reject";

  if (!SECRET || !SUPABASE_URL || !SERVICE_KEY) {
    return page("Not configured", "<p>The function is missing required secrets.</p>", 500);
  }
  if (!id || (action !== "approve" && action !== "reject") || !token) {
    return page("Invalid link", "<p>This moderation link is malformed.</p>", 400);
  }
  if (token !== (await sign(`${id}:${action}`))) {
    return page("Invalid link", "<p>This link is invalid or has expired.</p>", 401);
  }

  const headers = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };
  const newStatus = action === "approve" ? "approved" : "rejected";

  // POST = the user pressed Confirm → actually update.
  if (req.method === "POST") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      console.error("Update failed", res.status, await res.text());
      return page("Something went wrong", "<p>Could not update the review. Try the Supabase dashboard.</p>", 502);
    }
    const rows = await res.json();
    if (!rows.length) {
      return page("Not found", "<p>That review no longer exists.</p>", 404);
    }
    const verb = action === "approve" ? "approved ✓" : "rejected";
    return page(
      `Review ${verb}`,
      `<p style="color:#444">The review by <strong>${escapeHtml(rows[0].name ?? "")}</strong> is now <strong>${newStatus}</strong>.${action === "approve" ? " It will show on the site on the next page load." : ""}</p>`,
    );
  }

  // GET = show a confirmation page with a Confirm button (POST).
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/reviews?id=eq.${id}&select=name,rating,body,status`,
    { headers },
  );
  const rows = res.ok ? await res.json() : [];
  const r = rows[0];
  if (!r) {
    return page("Not found", "<p>That review no longer exists.</p>", 404);
  }

  const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const verb = action === "approve" ? "Approve" : "Reject";
  const btnColor = action === "approve" ? "#16a34a" : "#dc2626";
  const already =
    r.status !== "pending"
      ? `<p style="color:#b45309;font-size:14px">Heads up: this review is already <strong>${escapeHtml(r.status)}</strong>.</p>`
      : "";

  return page(
    `${verb} this review?`,
    `<p style="margin:0 0 6px"><strong>${escapeHtml(r.name ?? "")}</strong> &middot; <span style="color:#f59e0b">${stars}</span></p>
     <blockquote style="border-left:3px solid #ddd;margin:0 0 16px;padding:4px 0 4px 12px;color:#333">${escapeHtml(r.body ?? "")}</blockquote>
     ${already}
     <form method="POST">
       <button type="submit" style="display:inline-block;background:${btnColor};color:#fff;border:none;padding:11px 20px;border-radius:8px;font-size:15px;cursor:pointer">${verb}</button>
     </form>`,
  );
});
