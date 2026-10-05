---
name: om-seo-build-2026-09
description: "The Ordinary Mystic three-audience SEO build started 2026-09-28 - where the plan and prompts live, the decisions Tyler made, and facts about the repo that are easy to get wrong (main branch is source material, pay merged, static stays)"
metadata:
  type: project
---

Started 2026-09-28. The plan is `plans/om-seo-plan.md` in the repo (copy of the approved
plan file `~/.claude/plans/elegant-gathering-kitten.md`); implementation prompts go in
`plans/prompts/wp-*.md`; Tyler's off-site work is `OFFSITE-CHECKLIST.md` at the repo root.
Work packages run WP-0b (hotfix) then WP-1 through WP-8 in the plan's order.

**Decisions Tyler made 2026-09-28:**
- Port all 20 essays from the `main` branch (`src/content/blog/*.md`, April 2026, 800 to
  6,700 words each) into `/guides`. `main` is a server-mode site that was abandoned when
  `tiktok-landing` replaced production; treat it as archived source material, never merge it.
- Reader wing: routes reserved, one public `/for-readers` page plus the first lesson from the
  Tulsa build. Teaching (`/learn`) is IA only until he says go.
- No Ordinary Mystic Instagram or Facebook for now: OM is TikTok + YouTube + email. Existing
  OM Instagram goes dormant; a silent Facebook placeholder Page only. Revisit when the reader
  wing opens.
- Resend accounts are separate today; consolidate onto OM's account with a `brand` contact
  property and a Tulsa segment.
- Full name and a headshot are allowed on OM (`/about`, Person schema `@id`
  `/about#tyler-martin`). TTR links to it by `sameAs` only, never by name.
- Static export stays; no server migration for SEO. Newsletter = Supabase table insert +
  DB webhook + Edge Function (the `notify-review` pattern). Redirects and headers go in
  `vercel.json`.

**Why:** the plan and its research are long; these are the parts a future session must not
re-litigate or rediscover.

**How to apply:** read `plans/om-seo-plan.md` before writing any OM prompt. Run
`git status -sb` before every commit, not just at session start: the implementing session
switches the shared checkout to its branch mid-conversation, and on 2026-09-29 three docs
commits landed on `seo-hygiene` instead of `tiktok-landing` because I skipped the check (a
`git push origin tiktok-landing` then silently pushed nothing). Merged so far: WP-0 (/pay),
WP-0b (await params hotfix), WP-1 (registry, metadata, schema graph, llms.txt, vercel.json),
all live by 2026-09-29. Reviews decision 2026-09-29: OM clients review OM only (site +
Trustpilot), never the Tulsa profiles. Related: [[orchestrator-working-style]],
[[tyler-and-the-two-brands]].
