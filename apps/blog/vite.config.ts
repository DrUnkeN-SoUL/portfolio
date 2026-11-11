import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { blogContentPlugin } from "./plugins/blog-content.ts";
import { includeDrafts, loadPostsFromDisk, postsPerPage } from "./scripts/content.ts";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

const { posts, errors } = await loadPostsFromDisk(appRoot, { includeDrafts: includeDrafts() });

if (errors.length > 0) {
  throw new Error(`Invalid blog content:\n${errors.join("\n")}`);
}

const pageSize = postsPerPage();

const pages = [
  { path: "/" },
  ...Array.from({ length: Math.max(1, Math.ceil(posts.length / pageSize)) - 1 }, (_, i) => ({
    path: `/page/${i + 2}`,
  })),
  ...posts.map((post) => ({ path: `/${post.slug}` })),
  ...[...new Set(posts.flatMap((post) => post.tags))]
    .sort((a, b) => a.localeCompare(b))
    .map((tag) => ({ path: `/tags/${encodeURIComponent(tag)}` })),
  { path: "/rss.xml" },
  { path: "/sitemap.xml" },
];

// The blog is deliberately static: no Nitro plugin, so `vite build` only emits
// the client bundle, the SSR bundle and the prerendered HTML/XML that
// TanStack Start writes into `dist/client`. Vercel deploys that folder as a
// static site (see apps/blog/vercel.json).
export default defineConfig(() => ({
  define: { __BLOG_PAGE_SIZE__: JSON.stringify(pageSize) },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: false,
        failOnError: true,
      },
      pages,
    }),
    viteReact(),
    blogContentPlugin(appRoot),
  ],
  server: {
    host: "::",
    port: 8081,
  },
}));
