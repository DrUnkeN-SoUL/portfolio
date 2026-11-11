import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { parsePost, type Post } from "../src/lib/frontmatter.ts";

/**
 * Whether a build includes drafts: yes on Vercel preview (staging)
 * deployments, never on production. Locally, `BLOG_DRAFTS=1 bun run build`
 * opts in; the dev server always shows drafts.
 */
export function includeDrafts(): boolean {
  const vercelEnv = process.env["VERCEL_ENV"];
  if (vercelEnv) return vercelEnv !== "production";
  return process.env["BLOG_DRAFTS"] === "1";
}

/**
 * Posts per listing page. Staging (Vercel previews) uses 1 so pagination is
 * visible with only a couple of posts; override with BLOG_PAGE_SIZE.
 */
export function postsPerPage(): number {
  const fromEnv = Number(process.env["BLOG_PAGE_SIZE"]);
  if (Number.isInteger(fromEnv) && fromEnv > 0) return fromEnv;
  return process.env["VERCEL_ENV"] === "preview" ? 1 : 10;
}

export async function loadPostsFromDisk(
  root: string,
  options: { includeDrafts?: boolean } = {},
): Promise<{ posts: Post[]; errors: string[]; files: string[] }> {
  const postsDir = path.join(root, "content", "posts");
  const entries = await readdir(postsDir).catch((error: unknown) => {
    throw new Error(
      `[blog] Could not read ${postsDir}: ${error instanceof Error ? error.message : String(error)}`,
    );
  });

  const files = entries.filter((entry) => entry.endsWith(".md")).sort();
  const errors: string[] = [];
  const posts: Post[] = [];

  for (const fileName of files) {
    const raw = await readFile(path.join(postsDir, fileName), "utf8");
    try {
      posts.push(parsePost(raw, fileName));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

  const visible = options.includeDrafts === false ? posts.filter((post) => !post.draft) : posts;

  return { posts: visible, errors, files };
}
