// @lovable.dev/vite-tanstack-config already includes TanStack Start, React,
// Tailwind, tsconfig paths, env injection and the @ alias. Do not add those
// plugins manually.
//
// The blog is deliberately static: `nitro: false` skips the server preset and
// TanStack Start's prerender step writes plain HTML/XML into `dist/client`.
// Vercel deploys that folder as a static site (see apps/blog/vercel.json).
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

import { blogContentPlugin } from "./plugins/blog-content.ts";
import { loadPostsFromDisk } from "./scripts/content.ts";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
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

export default defineConfig({
  plugins: [blogContentPlugin(appRoot)],
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: false,
      failOnError: true,
    },
    pages,
  },
  nitro: false,
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  },
});
