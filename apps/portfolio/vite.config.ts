import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  resolve: {
    // Duplicates of React and TanStack packages break hooks and router context, so pin them to a
    // single copy.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR
      // error wrapper). Only used for the build; Nitro builds from this.
      server: { entry: "server" },
    }),
    // Build-only: `vite dev` keeps using Start's own SSR server. Vercel sets
    // VERCEL=1, where Nitro must emit the Build Output API (`.vercel/output`)
    // instead of the standalone Node server used by Docker.
    ...(command === "build"
      ? [nitro({ preset: process.env["VERCEL"] ? "vercel" : "node-server" })]
      : []),
    viteReact(),
  ],
  server: {
    host: "::",
    port: 8080,
  },
}));
