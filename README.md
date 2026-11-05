# mathewsshaji.com

Portfolio of Mathews Shaji. TanStack Start + React 19 + Tailwind 4.

```sh
bun install
bun run dev      # http://localhost:3000
bun run build    # -> .output/ (or .vercel/output on Vercel)
```

## Deploy

Vercel: framework preset **TanStack Start**, build `bun run build`, leave the
output directory empty — Nitro emits `.vercel/output` when `VERCEL=1`.

Docker: `docker compose up --build` → http://localhost:3000

## Content

All copy is in `src/data/portfolio.ts`. SEO lives in `src/routes/index.tsx`.
