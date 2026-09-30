# WP-1b: IndexNow for Bing, automated on deploy

Model: Sonnet. Branch: `indexnow` from `tiktok-landing`. Independent of WP-3; can run in
parallel.

## Read first
- `CLAUDE.md` (static export, no server code; production branch `tiktok-landing`; the
  registry rule), `src/lib/routes.ts`, `src/app/sitemap.ts`, `src/lib/config.ts`
  (`SITE_URL`), `vercel.json` (headers live here, not in `next.config.ts`), `package.json`,
  `.gitignore`, `.github/workflows/` (an obsolete GitHub Pages workflow still deploys
  `main`; production is Vercel from `tiktok-landing`)
- `scripts/stripe-payment-links.mjs` for the house style of a plain-Node script that reads
  `.env.local` without a dependency and never prints a secret

## Questions (one message, then wait; on "go" use the defaults)
1. Automate on deploy with a GitHub Action, or manual only like the sister site? Default:
   automate. The Action needs one repository secret, `INDEXNOW_KEY`, which Tyler adds.
2. Delete the obsolete `.github/workflows/deploy-pages.yml`? Default: yes; it deploys the
   abandoned `main` branch to GitHub Pages and could overwrite nothing useful, but it is
   misleading.

## Build

1. **Key file.** Generate a 32-character lowercase hex key. Save it as `public/<key>.txt`
   with the key as the only content (public by design; commit it). Add `INDEXNOW_KEY=` to
   `.env.example` (create the file if there is none; list the other `NEXT_PUBLIC_*` vars in
   it too) and the real value to `.env.local` (confirm `.env*` is git-ignored; it is). In
   `vercel.json`, add a `headers` entry for `/<key>.txt` with
   `X-Robots-Tag: noindex, nofollow`, next to the `/pay` rule.

2. **Script.** `scripts/indexnow.mjs`, runnable as `npm run indexnow -- <url> [<url>...]`.
   Reads `INDEXNOW_KEY` from the environment, loading `.env.local` if present the way the
   Stripe script does. Accepts absolute URLs or paths; a path is prefixed with the site URL.
   The site URL is hardcoded as `https://ordinarymysticreadings.com` with a comment pointing
   at `src/lib/config.ts` (a plain `.mjs` cannot import the TS module). POSTs one JSON body
   to `https://api.indexnow.org/indexnow` with `host`, `key`, `keyLocation`
   (`https://ordinarymysticreadings.com/<key>.txt`) and `urlList`. Prints the status and one
   line per URL. Exits non-zero on anything other than 200 or 202. With no arguments, prints
   usage and exits 1. Never prints the key.

3. **Sitemap modes.** `npm run indexnow -- --sitemap` fetches the production sitemap,
   collects every `<loc>`, and submits them in one request (the protocol allows 10,000).
   `npm run indexnow -- --sitemap --since 3` submits only entries whose `<lastmod>` is within
   the last N days. Since every route carries a real `updated` date from the registry, this
   is exactly "what changed". Skip any `<loc>` for a path that is not in the sitemap by
   design (nothing to do; the sitemap already excludes `/pay`, `/links`, `/admin`).

4. **GitHub Action.** `.github/workflows/indexnow.yml`: on `push` to `tiktok-landing`, wait
   for the Vercel deploy by polling `https://ordinarymysticreadings.com/sitemap.xml` until
   it contains a `<lastmod>` equal to today's date or for up to five minutes, whichever
   comes first, then run `node scripts/indexnow.mjs --sitemap --since 3` with
   `INDEXNOW_KEY` from `secrets.INDEXNOW_KEY`. Node 22. If the key secret is missing, fail
   with a clear message. Also `workflow_dispatch` so it can be run by hand from the Actions
   tab with an optional `urls` input.

5. **Docs.** `CLAUDE.md`: a short "IndexNow" heading near the pre-merge sanity notes:
   Bing is notified automatically on every push to `tiktok-landing` for routes updated in
   the last three days; to notify by hand, `npm run indexnow -- /the/path`; the first run
   after this ships is `--sitemap` with no `--since`; Google has no equivalent, so Request
   Indexing in Search Console stays manual and is worth doing only for new pages. Add the
   key file, the script and the workflow to the file map. Add `INDEXNOW_KEY` to an
   environment variables note (repository secret for the Action, `.env.local` for local runs).
   Delete `.github/workflows/deploy-pages.yml` if approved.

## Verify (paste the output)
```bash
npm run build                               # passes; the key file is in out/
ls out/*.txt                                # the key file and llms.txt
npm run indexnow                            # prints usage, exit 1
npm run indexnow -- /guides                 # 200 or 202; or 422 with a clear "key file not deployed yet" line
npm run indexnow -- --sitemap --since 3     # lists only recently updated URLs before submitting
grep -c "X-Robots-Tag" vercel.json          # one more than before
grep -rl $'\xe2\x80\x94' scripts/indexnow.mjs .github CLAUDE.md   # nothing new (CLAUDE.md has three old ones)
```
Note in the summary that Bing will 422 until the key file is deployed; Fable runs
`--sitemap` once after the merge deploys.

## Commit
Small commits on `indexnow`. No em dashes in messages. Do not merge or push. Reply with the
verification output, the key file name (the key itself is public, so it is fine to include),
the files changed, and the one manual step for Tyler: add `INDEXNOW_KEY` as a repository
secret in GitHub.
