import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

// Vercel sets VERCEL=1 during builds. In that case Nitro must emit the Vercel
// Build Output API (`.vercel/output`) instead of a standalone Node server.
// Everywhere else (Docker, `node .output/server/index.mjs`) keeps node-server.
const isVercel = Boolean(process.env["VERCEL"]);

export default defineConfig(({ command }) => ({
  resolve: {
    // `@/…` maps to src. Duplicates of React and TanStack packages break hooks
    // and router context, so pin them to a single copy from the workspace root.
    alias: { "@": srcDir },
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
      // Server-only imports must never leak into the client bundle.
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
    // Nitro produces `.output` for Docker and the Vercel Build Output API on
    // Vercel. It is build-only: `vite dev` keeps using Start's own SSR server.
    ...(command === "build" ? [nitro({ preset: isVercel ? "vercel" : "node-server" })] : []),
    viteReact(),
  ],
  server: {
    host: "::",
    port: 8080,
  },
}));
