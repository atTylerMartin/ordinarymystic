---
name: orchestrator-working-style
description: How Tyler wants the Fable session to work on his tarot brands - Fable plans, reviews and merges; Sonnet/Opus sessions implement from self-contained prompts; conventions carried over from the Tulsa Tarot Reader build (Sept 2026)
metadata:
  type: feedback
---

Tyler runs a Fable session as the **orchestrator** and does the coding in separate
Sonnet or Opus sessions, because Fable is expensive. The Fable session's job is
strategy, research, writing prompts, reviewing branches, and merging.

**Why:** cost, and it worked: the Tulsa Tarot Reader site (sister repo `tulsa-tarot`)
went from a three-route page to a full local SEO build in one week this way.

**How to apply:**
- Write implementation work as **self-contained prompts** a fresh session can run: read
  these files first, ask every question in ONE message, proceed on stated defaults if
  Tyler says "go" or does not answer, verify these specific things, commit on a branch,
  do not merge or push. Name the model (Sonnet for plumbing, Opus for writing and design
  judgment).
- Tyler pastes the agent's summary back; Fable reviews the branch (build, grep checks,
  facts against sources, a production-build curl), then fast-forwards to the production
  branch and pushes. Fable may make small edits itself (a few lines) rather than spawn a
  session. Always check `git status -sb` first: the checkout is often left on an agent's
  branch, and a `git add -A` or `commit -a` sweeps in that agent's uncommitted work.
- **Never commit from the shared checkout while an implementing session is active.** `git
  commit` commits the whole index, so `git add one-file && git commit` also commits whatever
  the agent has staged (on 2026-09-29 that was its deletion of `content/blog`, which then went
  to production and 404ed the blog for an hour). Use a separate worktree of the production
  branch (`../linkinbio-docs`) for every orchestrator commit and for fast-forward merges.
- **No em dashes anywhere Tyler can see** (UI, prose, commits, emails). Strong preference.
- **Plain, cut-and-dry copy when asked for it.** Tyler rejects "cute" or over-brand-voiced
  writing in emails and listings ("just a plain email, stop being cute"). Business
  descriptions for directories should be factual and only about the business.
- Give a recommendation, not a menu. Push back with reasons when a choice is weak; accept
  the decision once he reaffirms it.
- Tyler asks for decisions to be recorded with dates and criteria rather than left open.
- He tracks off-site work in a checklist file in the repo and likes it ticked as he goes.
- Files in these repos are CRLF on disk; multi-line Python string replacements need to
  account for that (match single lines, or use the file's own newline).
