import path from "node:path";
import type { Plugin } from "vite";

import { loadPostsFromDisk } from "../scripts/content.ts";
import { renderMarkdown } from "../src/lib/markdown.ts";

const VIRTUAL_ID = "virtual:blog-posts";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

type RenderedPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  draft: boolean;
  cover?: string;
  html: string;
};

/**
 * Build-time content module.
 *
 * Markdown is parsed and highlighted in Node, then injected as a virtual
 * module. This keeps gray-matter, unified and Shiki out of the client bundle;
 * browsers only receive the finished HTML.
 */
export function blogContentPlugin(root: string): Plugin {
  async function buildModule(): Promise<string> {
    const includeDrafts = process.env["NODE_ENV"] !== "production";
    const { posts, errors } = await loadPostsFromDisk(root, { includeDrafts });

    if (errors.length > 0) {
      throw new Error(`Invalid blog content:\n${errors.join("\n")}`);
    }

    const rendered: RenderedPost[] = await Promise.all(
      posts.map(async (post) => ({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        ...(post.updated ? { updated: post.updated } : {}),
        tags: post.tags,
        draft: post.draft,
        ...(post.cover ? { cover: post.cover } : {}),
        html: await renderMarkdown(post.body),
      })),
    );

    return `export const posts = ${JSON.stringify(rendered)};`;
  }

  return {
    name: "blog-content",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return null;
      return buildModule();
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
