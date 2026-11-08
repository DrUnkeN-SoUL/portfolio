# AGENTS.md

Rules for coding agents working in this repository. Read this before editing.
`CLAUDE.md` points here too.

## What this repository is

A Bun workspaces monorepo:

```
apps/portfolio/        TanStack Start portfolio -> https://mathewsshaji.com
apps/blog/             TanStack Start static blog -> https://blog.mathewsshaji.com
packages/ui/           shared styles.css, fonts and cross-site nav
apps/blog/content/     Markdown posts (the blog's source of truth)
```

The blog is fully static. Posts are Markdown files, so both Pages CMS (browser)
and local coding agents edit the same files. There is no database and no server
code at runtime for the blog.

## Commands (run from the repository root)

```sh
bun install
bun run dev:portfolio     # portfolio dev server
bun run dev:blog          # blog dev server
bun run build             # build both apps
bun run lint              # eslint apps + packages
bun run check:content     # validate every blog post
bun run new-post "Title"  # create apps/blog/content/posts/<slug>.md (draft)
```

`bun run build` for the blog runs `check:content` first, so invalid content
fails the build.

## Blog post format

One Markdown file per post in `apps/blog/content/posts/`. The filename is the
URL slug and **must be kebab-case**: lowercase letters, numbers and single
hyphens only, e.g. `postgres-listen-notify.md`. The slug becomes
`https://blog.mathewsshaji.com/<slug>`.

Front matter is YAML and must match `.pages.yml`:

```md
---
title: "A human title"
description: "One sentence used as the meta description and list summary."
date: 2026-11-09
updated: 2026-11-12 # optional, YYYY-MM-DD
tags:
  - postgres
  - observability
draft: true # optional, defaults to false
cover: /images/blog/cover.png # optional, path under public/
---

# A human title

Markdown body.
```

Required fields: `title`, `description`, `date`, `tags`, `draft`.
`title` and `description` must be non-empty strings. `date` and `updated` must
be `YYYY-MM-DD`. Unknown front-matter fields are rejected (typos fail the
build). Keep the schema in `apps/blog/src/lib/frontmatter.ts` and `.pages.yml`
in sync.

Posts are sorted newest first by `date`.

## Drafts

- `draft: true` posts are visible on the local dev server.
- Production builds hide drafts and do not generate routes for them.
- **Drafts are still public in git.** Never put secrets, credentials, private
  URLs or anything you would not publish into a draft file.

## Images

Put images in `apps/blog/public/images/blog/` and reference them with an
absolute path:

```md
![alt text](/images/blog/diagram.png)
```

Pages CMS writes uploads to the same folder. Use lowercase, descriptive,
kebab-case filenames. Prefer `.webp` or compressed `.png`.

## Before committing

1. Run `bun run check:content`.
2. Run `bun run lint` (or at least the app you touched).
3. Do not commit `.env` files, tokens, keys or other secrets.
4. Do not edit generated files by hand:
   - `apps/*/src/routeTree.gen.ts` (TanStack Router regenerates it)
   - `apps/*/dist/`, `apps/*/.output/`, `.vercel/`, `node_modules/`
5. Do not push directly to `master`; use a branch and pull request.

## Dependency rules

- `bunfig.toml` has a 24-hour supply-chain guard (`minimumReleaseAge`). Do not
  add entries to `minimumReleaseAgeExcludes`; confirm with the user instead.
- Keep the lockfile text-based (`bun.lock`). Do not switch to a binary lockfile.
- Add app dependencies to the app's `package.json`, shared UI dependencies to
  `packages/ui/package.json`, and repo tooling to the root `package.json`.
- Both apps use a plain Vite config: TanStack Start, React, Tailwind,
  `vite-tsconfig-paths`, and Nitro (portfolio only, build-only). Keep the plugin
  list and the `@` alias in `vite.config.ts` in sync between the two apps; do not
  wrap them in another config helper.

## Where things live

- Portfolio copy and data: `apps/portfolio/src/data/portfolio.ts`
- Portfolio SEO: `apps/portfolio/src/routes/index.tsx` and `__root.tsx`
- Blog routes: `apps/blog/src/routes/`
- Blog front matter parsing: `apps/blog/src/lib/frontmatter.ts`
- Markdown -> HTML (Shiki highlighting): `apps/blog/src/lib/markdown.ts`
- Shared design tokens and prose styles: `packages/ui/styles.css`
- Shared font links and cross-site nav: `packages/ui/src/`
- Pages CMS schema: `.pages.yml`
