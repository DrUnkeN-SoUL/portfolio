import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { blogContentPlugin } from "./plugins/blog-content.ts";
import { loadPostsFromDisk } from "./scripts/content.ts";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const srcDir = fileURLToPath(new URL("./src", import.meta.url));

const { posts, errors } = await loadPostsFromDisk(appRoot, { includeDrafts: false });

if (errors.length > 0) {
  throw new Error(`Invalid blog content:\n${errors.join("\n")}`);
}

const tags = [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));

const pages = [
  { path: "/" },
  ...posts.map((post) => ({ path: `/${post.slug}` })),
  ...tags.map((tag) => ({ path: `/tags/${encodeURIComponent(tag)}` })),
  { path: "/rss.xml" },
  { path: "/sitemap.xml" },
];

// The blog is deliberately static: no Nitro plugin, so `vite build` only emits
// the client bundle, the SSR bundle and the prerendered HTML/XML that
// TanStack Start writes into `dist/client`. Vercel deploys that folder as a
// static site (see apps/blog/vercel.json).
export default defineConfig(() => ({
  resolve: {
    alias: { "@": srcDir },
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
