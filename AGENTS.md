# AGENTS.md

Rules for coding agents. Read README.md for the layout, commands, post format
and deployment; this file only adds what README does not cover.

## Blog content

- The page renders the front-matter `title` as the only `<h1>`. Never start a
  post body with `# Title`; start sections at `## `. `check:content` rejects a
  `# ` heading outside code fences.
- Required front matter: `title`, `description`, `date`, `tags`, `draft`.
  Unknown fields fail the build, so keep `apps/blog/src/lib/frontmatter.ts` and
  `.pages.yml` in sync when changing the schema.
- Image filenames: lowercase kebab-case; prefer `.webp` or compressed `.png`.

## Before committing

1. Run `bun run check:content` and `bun run lint`.
2. Never commit `.env` files, tokens or keys. Drafts are public in git too.
3. Do not hand-edit generated files: `apps/*/src/routeTree.gen.ts`,
   `apps/*/dist/`, `apps/*/.output/`, `.vercel/`.
4. Work on a branch and open a pull request; do not push to `master` (it
   deploys both sites to production).

## Dependencies and config

- `bunfig.toml` enforces a 24h `minimumReleaseAge`. Never add
  `minimumReleaseAgeExcludes` entries without asking the user.
- Keep `bun.lock` text-based.
- App deps go in the app's `package.json`, shared UI deps in
  `packages/ui/package.json`, repo tooling in the root `package.json`.
- Both `vite.config.ts` files are plain configs (TanStack Start, React,
  Tailwind, tsconfig paths; Nitro build-only in the portfolio). Keep their
  plugin lists and `@` alias in sync; don't wrap them in a config helper.
- Favicons and the GA4 tag (production builds only) are shared via
  `packages/ui/src/head.ts`; change them there, not per app.
- `apps/portfolio/public/llm.txt` and `llms.txt` must stay byte-identical.
