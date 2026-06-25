# CLAUDE.md

## Branches

- **`tiktok-landing` is the production branch right now.** Treat it as the
  source of truth: commit, push, and deploy from `tiktok-landing`.
- **`main` is being ignored** for the time being — do not open PRs into it or
  merge `tiktok-landing` back into it unless explicitly asked.

## Architecture

- **This is a fully static site** (`output: "export"` in `next.config.ts`).
  There is no server runtime. **Do not** add Server Actions, API routes, route
  handlers, middleware, or request-time server fetching — they break the build
  ("Server Actions are not supported with static export"). All dynamic behavior
  must run client-side in the browser.
- **Supabase is called directly from the browser** with the publishable
  (`anon`) key, gated by Row Level Security. Reviews are the first such feature:
  see `src/lib/supabase.ts`, `src/lib/reviews.ts`, and `src/components/reviews-*`.
  Approving a review = set its `status` to `approved` in the Supabase dashboard.
- **Secrets:** only `NEXT_PUBLIC_*` env vars reach the browser/build. The
  service-role key must never be used in client code.
