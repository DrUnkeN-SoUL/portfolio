# mathewsshaji.com — portfolio

Personal portfolio of **Mathews Shaji** — backend-leaning full-stack developer.
Built with **TanStack Start** (React 19 + Vite), deployed on **Vercel**.

## Stack

- **TanStack Start** — SSR + file-based routing
- **React 19** — one page, three canvas-driven pieces
- **Tailwind CSS 4** — via `@tailwindcss/vite`
- **Nitro** — Vercel Build Output on Vercel, Node server everywhere else

## Development

```sh
bun install
bun run dev        # http://localhost:3000
```

`npm` works the same way (`npm install`, `npm run dev`).

## Build

```sh
bun run build      # -> .output/ (Node server)
```

The Nitro preset is chosen automatically:

| Environment | Preset | Output |
|---|---|---|
| `VERCEL=1` (Vercel) | `vercel` | `.vercel/output` |
| anywhere else | `node-server` | `.output/server/index.mjs` |

## Deploy on Vercel

1. Import this repository.
2. Framework preset: **TanStack Start** (auto-detected).
3. Build command: `bun run build` (or `npm run build`).
4. **Leave Output Directory empty** — the Vercel Build Output API
   (`.vercel/output`) is emitted by Nitro and picked up automatically.
5. No environment variables required.

## Deploy anywhere else (Docker)

```sh
docker compose up --build   # http://localhost:3000
```

The image builds with Bun, then runs the Nitro Node server on Node 22.

## Structure

```
src/
  routes/__root.tsx      document shell, fonts, meta defaults
  routes/index.tsx       the page + SEO head (OG, Twitter, JSON-LD)
  components/
    IntroName.tsx        canvas intro + PixelNameMark header mark
    AsciiPortrait.tsx    progressive ASCII portrait
    ProjectRow.tsx       projects accordion
  data/portfolio.ts      all copy: bio, roles, projects, community, links
  data/ascii-portrait.ts ASCII art source
  styles.css             design tokens, scanlines, ascii, intro animations
public/                  favicons, og-image, twitter-image, robots.txt,
                         sitemap.xml, llm.txt, résumé
```

## Editing content

Almost all text lives in `src/data/portfolio.ts`. SEO copy lives in
`src/routes/index.tsx` (`title`, `description`, meta array).
