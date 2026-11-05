# mathewsshaji.com — portfolio

Personal portfolio of **Mathews Shaji** — backend-leaning full-stack developer.
Static [Astro](https://astro.build) site, deployed on Vercel.

## Stack

- **Astro 5** — static site generation
- **React 19 islands** — canvas intro, ASCII portrait, pixel name mark
- **Tailwind CSS 4** — via `@tailwindcss/vite`
- **@astrojs/sitemap** — sitemap generation

Everything except the three canvas/animation islands is plain HTML, so the page
is fully readable and linkable without JavaScript.

## Development

```sh
bun install
bun run dev       # http://localhost:4321
bun run build     # -> dist/
bun run preview   # serve the production build
```

`npm` and `pnpm` work the same way (`npm install`, `npm run dev`, …).

## Structure

```
src/
  layouts/Layout.astro     SEO head: OG, Twitter, canonical, JSON-LD, fonts
  pages/index.astro        the whole page (static markup)
  pages/404.astro          not-found page
  components/
    IntroName.tsx          canvas intro + PixelNameMark island
    IntroOverlay.tsx       mounts/removes the intro, releases the page reveal
    AsciiPortrait.tsx      progressive ASCII portrait island
    ProjectRow.astro       <details> accordion, zero JS
  data/portfolio.ts        all copy: bio, roles, projects, community, links
  data/ascii-portrait.ts   ASCII art source
  styles.css               design tokens, scanlines, ascii, reveal animations
public/                    favicons, og-image, robots.txt, llm.txt, résumé
```

## Deployment

Vercel auto-detects Astro. Build command `astro build`, output `dist/`.
No environment variables required.

Any static host works too — Netlify, Cloudflare Pages, S3, nginx.

## Editing content

Almost all text lives in `src/data/portfolio.ts`. Update the object arrays and
the page rerenders. SEO copy lives in `src/pages/index.astro` (`title`,
`description`) and `src/layouts/Layout.astro` (OG/Twitter/JSON-LD).
