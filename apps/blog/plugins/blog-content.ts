import path from "node:path";
import type { Plugin } from "vite";

import { includeDrafts, loadPostsFromDisk } from "../scripts/content.ts";
import { renderMarkdown } from "../src/lib/markdown.ts";

const VIRTUAL_ID = "virtual:blog-posts";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/** Heading ids come from rehype-slug. */
function extractToc(html: string) {
  return [...html.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map((match) => ({
    depth: match[1] === "3" ? 3 : 2,
    id: match[2] ?? "",
    text: (match[3] ?? "")
      .replace(/<a [^>]*class="heading-anchor"[^>]*>[\s\S]*?<\/a>/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim(),
  }));
}

/**
 * Markdown is parsed and highlighted in Node and injected as a virtual
 * module, so gray-matter, unified and Shiki stay out of the client bundle.
 */
export function blogContentPlugin(root: string): Plugin {
  let isDevServer = false;

  return {
    name: "blog-content",
    configResolved(config) {
      isDevServer = config.command === "serve";
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null;

      const { posts, errors } = await loadPostsFromDisk(root, {
        includeDrafts: isDevServer || includeDrafts(),
      });

      if (errors.length > 0) {
        throw new Error(`Invalid blog content:\n${errors.join("\n")}`);
      }

      const rendered = await Promise.all(
        posts.map(async (post) => {
          const html = await renderMarkdown(post.body);
          return {
            slug: post.slug,
            title: post.title,
            description: post.description,
            date: post.date,
            ...(post.updated ? { updated: post.updated } : {}),
            tags: post.tags,
            draft: post.draft,
            ...(post.cover ? { cover: post.cover } : {}),
            html,
            toc: extractToc(html),
            readingMinutes: Math.max(
              1,
              Math.round(post.body.split(/\s+/).filter(Boolean).length / 220),
            ),
          };
        }),
      );

      return `export const posts = ${JSON.stringify(rendered)};`;
    },
    configureServer(server) {
      const postsDir = path.join(root, "content", "posts");
      server.watcher.add(postsDir);

      const invalidate = (file: string) => {
        if (!file.endsWith(".md")) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.moduleGraph.invalidateModule(module);
      };

      server.watcher.on("add", invalidate);
      server.watcher.on("change", invalidate);
      server.watcher.on("unlink", invalidate);
    },
  };
}
