import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { parsePost, type Post } from "../src/lib/frontmatter.ts";

export type LoadedPosts = {
  posts: Post[];
  errors: string[];
  files: string[];
};

/**
 * Read posts straight from disk (no Vite). Used by `check:content`,
 * `new-post` and the Vite config that builds the prerender page list.
 */
export async function loadPostsFromDisk(
  root: string,
  options: { includeDrafts?: boolean } = {},
): Promise<LoadedPosts> {
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
