# WP-0b: Hotfix the pages that prerender as the 404 page

Model: Sonnet. Branch: `fix-params` from `tiktok-landing`. Ships alone, before WP-1.

## Read first
- `CLAUDE.md` (static export; production branch is `tiktok-landing`)
- `src/app/blog/[slug]/page.tsx`
- `src/app/tools/[slug]/page.tsx`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` (the
  `params` prop is a Promise in Next 15 and later)

## The bug
Both dynamic pages type `params` as a plain object and read `params.slug` synchronously. In
Next 16 `params` is a Promise, so `slug` is `undefined`, the lookup misses, and `notFound()`
runs at build time. Every `/blog/<slug>` and `/tools/<slug>` file in `out/` is the 404 page
with a `noindex` tag and the site's default title, served with HTTP 200. The build passes
because Next's generated validator does not check the page's own prop annotation.

Confirm before changing anything:
```bash
npm run build
grep -c "This page could not be found" out/tools/everyday-checkin-notion-dashboard.html
```
That prints `1` today.

## The fix
In both files, in `generateMetadata` and in the page component:
- type the prop as `{ params: Promise<{ slug: string }> }`
- `const { slug } = await params;` and use `slug` everywhere `params.slug` was used.
Nothing else changes. Do not touch content, styling, or the sitemap.

## Questions
None expected. If anything else in those two files looks wrong, note it in the summary and
leave it alone; WP-2 replaces the blog route entirely.

## Verify
```bash
npm run build
grep -L "This page could not be found" out/tools/*.html      # lists both tool files
grep -L "This page could not be found" out/blog/*.html       # lists all 30 blog files
grep -o '<h1[^>]*>[^<]*' out/tools/everyday-checkin-notion-dashboard.html   # shows the tool title
grep -c 'name="robots" content="noindex' out/tools/everyday-checkin-notion-dashboard.html   # 0
grep -o '<title>[^<]*' out/blog/clear-questions-grounded-tarot.html   # the post title, not the site default
```

## Commit
One commit on `fix-params`, message: `Fix dynamic pages prerendering as 404: await params`.
Do not merge or push. Reply with the verification output and the diff summary.
