import path from "node:path";
import type { Plugin } from "vite";

import { includeDrafts, loadPostsFromDisk } from "../scripts/content.ts";
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
  toc: TocEntry[];
  readingMinutes: number;
};

type TocEntry = { id: string; text: string; depth: 2 | 3 };

const HEADING = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** h2/h3 outline for the "on this page" rail; ids come from rehype-slug. */
function extractToc(html: string): TocEntry[] {
  return [...html.matchAll(HEADING)].map((match) => ({
    depth: match[1] === "3" ? 3 : 2,
    id: match[2] ?? "",
    text: decodeEntities(
      (match[3] ?? "")
        .replace(/<a [^>]*class="heading-anchor"[^>]*>[\s\S]*?<\/a>/g, "")
        .replace(/<[^>]+>/g, ""),
    ).trim(),
  }));
}

function readingMinutes(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Build-time content module.
 *
 * Markdown is parsed and highlighted in Node, then injected as a virtual
 * module. This keeps gray-matter, unified and Shiki out of the client bundle;
 * browsers only receive the finished HTML.
 */
async function renderPost(body: string) {
  const html = await renderMarkdown(body);
  return { html, toc: extractToc(html), readingMinutes: readingMinutes(body) };
}

export function blogContentPlugin(root: string): Plugin {
  let isDevServer = false;

  async function buildModule(): Promise<string> {
    const { posts, errors } = await loadPostsFromDisk(root, {
      includeDrafts: isDevServer || includeDrafts(),
    });

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
        ...(await renderPost(post.body)),
      })),
    );

    return `export const posts = ${JSON.stringify(rendered)};`;
  }

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
