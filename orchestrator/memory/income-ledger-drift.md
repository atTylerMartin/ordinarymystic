---
name: income-ledger-drift
description: OM income is logged in two places and the Dropbox income-log.xlsx has drifted; do not treat it as complete, and a Supabase database with one ingest path is the agreed fix
metadata:
  type: project
---

As of 2026-09-30, OM income exists in two ledgers kept by Atlas, and the Dropbox file
`Ordinary Mystic/Bookkeeping/2026/income-log.xlsx` (last row 2026-08-03) has drifted from the
other. The business plan's 2026 actuals and the "books stop on 2026-08-03" statements came
from the drifted file and are understated until Atlas reconciles.

**Why:** Tyler's data is scattered across Dropbox markdown and xlsx files with several agent
write paths; the plan's rung tracking cannot work on that.

**How to apply:** Never state a 2026 income figure from the xlsx alone; ask for the
reconciled ledger. When reconciled rows arrive, update `ACT_2026` in
`plans/business-plan/build-financials.py`, rerun it, and refresh chapter 6 and `plans/now.md`
(rung 1 may already be reached). Agreed direction, not yet built: Supabase Postgres (the
existing OM project) with one ingest tool Atlas calls from the Mac; the dashboard waits until
after rung 1. The `Tarot Dashboard` folder is an unused CRA scaffold, not a start. See
[[business-plan-2026-09-30]].
