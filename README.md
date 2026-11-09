# mathewsshaji.com

Personal site of Mathews Shaji. A Bun workspaces monorepo with two TanStack
Start apps and a shared UI package:

```
package.json            Bun workspaces root ("apps/*", "packages/*")
apps/portfolio/         portfolio -> https://mathewsshaji.com (Vercel project 1)
apps/blog/              static blog -> https://blog.mathewsshaji.com (Vercel project 2)
  content/posts/*.md    one Markdown file per post (YAML front matter)
  public/images/blog/   post images
packages/ui/            shared styles.css, fonts and cross-site nav
.pages.yml              Pages CMS schema
AGENTS.md               rules for coding agents
```

Both apps import the same `packages/ui/styles.css`, so the design tokens,
JetBrains Mono typography and base styles are identical by construction.

## Local development

Requires Bun 1.3.x and Node 26 (see `engines` and `.nvmrc`).

```sh
bun install

bun run dev:portfolio   # portfolio dev server
bun run dev:blog        # blog dev server

bun run build           # build both apps
bun run lint            # eslint apps + packages
bun run check:content   # validate every blog post
bun run new-post "Title" # create a draft post with a kebab-case slug
```

App-only commands:

```sh
bun run --filter mathews-portfolio dev
bun run --filter mathews-blog build
bun run --filter mathews-blog check:content
```

The blog build is static: `apps/blog/dist/client` contains prerendered HTML,
`rss.xml`, `sitemap.xml` and assets. The portfolio build is a Nitro server
(`apps/portfolio/.output`) for Vercel SSR / Docker.

## Writing a post

Posts live in `apps/blog/content/posts/`. The filename is the slug and must be
kebab-case (`hello-world.md` -> `/hello-world`). Front matter:

```md
---
title: "Post title"
description: "One sentence for the list and meta description."
date: 2026-11-09
updated: 2026-11-12 # optional
tags:
  - postgres
  - infrastructure
draft: true # optional, defaults to false
cover: /images/blog/cover.png # optional
---

Body in Markdown.
```

`bun run check:content` validates titles, descriptions, dates, tags, draft
flags and filenames. The blog build runs it first, so an invalid post fails the
build. `draft: true` posts are visible locally but are excluded from production
builds and route generation. Drafts are still public in git — do not put
secrets in them.

Images go in `apps/blog/public/images/blog/` and are referenced as
`/images/blog/<file>`. Pages CMS uploads to the same folder.

Agent-only rules (things this README does not cover) are in `AGENTS.md`.

## Editing from the browser with Pages CMS

1. Install the Pages CMS GitHub App on **this repository only**
   (`DrUnkeN-SoUL/portfolio`, or whichever account owns it):
   <https://github.com/apps/pages-cms>.
2. Open <https://app.pagescms.org> and sign in with GitHub.
3. Select this repository and the branch you want to edit (`master` for
   published content, or a branch to preview changes).
4. The **Writing** collection is read from `.pages.yml`: create/edit posts,
   upload cover images to `apps/blog/public/images/blog`, and commit from the
   Pages CMS UI. Each save is a normal git commit and triggers a Vercel build.

Pages CMS only needs repository access; there is no database or server for the
blog.

## Deploying to Vercel (one repo, two projects)

Both projects use the same repository. Create two Vercel projects from the same
GitHub repo and set a different **Root Directory** for each.

### Project 1 — portfolio (`mathewsshaji.com`)

| Setting | Value |
| --- | --- |
| Root Directory | `apps/portfolio` |
| Framework Preset | TanStack Start (or Other) |
| Install Command | `cd ../.. && bun install --frozen-lockfile` |
| Build Command | `bun run build` |
| Output Directory | leave empty — Nitro writes `.vercel/output` when `VERCEL=1` |
| Include files outside Root Directory | **on** (needed for `packages/ui`) |
| Domain | `mathewsshaji.com` |

### Project 2 — blog (`blog.mathewsshaji.com`)

| Setting | Value |
| --- | --- |
| Root Directory | `apps/blog` |
| Framework Preset | Other (static) |
| Install Command | `cd ../.. && bun install --frozen-lockfile` |
| Build Command | `bun run build` |
| Output Directory | `dist/client` |
| Include files outside Root Directory | **on** (needed for `packages/ui`) |
| Domain | `blog.mathewsshaji.com` |

`apps/blog/vercel.json` pins the framework, install command, build command and
output directory, so the dashboard values only need the Root Directory and the
domain. The blog has no serverless functions: all pages, RSS and the sitemap
are prerendered files.

### Only rebuild when the relevant app changes

Set each project's **Ignored Build Step** (Settings → Git) so a blog commit does
not redeploy the portfolio and vice versa. The command exits non-zero (build)
when the app or shared package changed:

```sh
# Portfolio project
git diff --quiet HEAD^ HEAD -- apps/portfolio packages/ui package.json bun.lock

# Blog project
git diff --quiet HEAD^ HEAD -- apps/blog packages/ui package.json bun.lock
```

Vercel skips the build when the command exits `0`. You can add `--` paths for
any other shared files.

### Adding the blog domain

In the `mathewsshaji.com` Vercel scope, add `blog.mathewsshaji.com` to the blog
project (Settings → Domains). If DNS is managed elsewhere, add the record Vercel
shows — usually:

```
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
```

If the domain uses Vercel nameservers, the subdomain is added automatically.

## Repository protection

Enable branch protection on `master` in GitHub:

- require a pull request before merging
- require status checks (at minimum the Vercel builds)
- disallow force pushes and deletions

Both Vercel projects build pull requests, so a broken content or config change
is caught before merge.

## Docker (portfolio only)

```sh
docker compose up --build   # -> http://localhost:3000
```

The Dockerfile installs the Bun workspace at the repo root, builds
`apps/portfolio`, and runs `apps/portfolio/.output/server/index.mjs`.

## Content and SEO locations

- Portfolio copy: `apps/portfolio/src/data/portfolio.ts`
- Portfolio SEO (title, Open Graph, JSON-LD): `apps/portfolio/src/lib/seo.ts`, used by
  `apps/portfolio/src/routes/index.tsx` and `__root.tsx`
- Blog routes: `apps/blog/src/routes/`
- Blog SEO helpers and default OG card: `apps/blog/src/lib/seo.ts`, `apps/blog/public/og-blog.png`
- Blog front matter schema: `apps/blog/src/lib/frontmatter.ts`
- Markdown -> HTML (Shiki at build time): `apps/blog/src/lib/markdown.ts`
- Blog RSS/sitemap: `apps/blog/src/routes/rss[.]xml.ts` and `sitemap[.]xml.ts`
- Shared design tokens and prose styles: `packages/ui/styles.css`
- Pages CMS schema: `.pages.yml`
- AI/agent profile: `apps/portfolio/public/llm.txt`, mirrored byte-for-byte as
  `apps/portfolio/public/llms.txt` at <https://mathewsshaji.com/llms.txt>

Per-post SEO includes absolute canonical and Open Graph/Twitter URLs (posts
without a cover fall back to `og-blog.png`), `article:published_time`, and
JSON-LD `BlogPosting` whose author is the same
`https://mathewsshaji.com/#person` node the portfolio publishes. All of it is
prerendered into the static HTML, since crawlers and link-preview bots do not
run JavaScript.
