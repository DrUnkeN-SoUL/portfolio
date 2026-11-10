import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: bun run new-post "Post title"');
  process.exit(1);
}

const slug = title
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 80)
  .replace(/-+$/g, "");

if (!slug) {
  console.error(`Could not derive a slug from "${title}". Use letters or numbers in the title.`);
  process.exit(1);
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
  now.getDate(),
).padStart(2, "0")}`;
const postsDir = path.join(process.cwd(), "content", "posts");
const filePath = path.join(postsDir, `${slug}.md`);

try {
  await access(filePath);
  console.error(`Post already exists: content/posts/${slug}.md`);
  process.exit(1);
} catch {
  // Expected: the file does not exist yet.
}

await mkdir(postsDir, { recursive: true });

await writeFile(
  filePath,
  `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(`A draft post about ${title}.`)}
date: ${today}
tags: []
draft: true
---

Intro paragraph.

## First section

`,
  "utf8",
);

console.log(`Created content/posts/${slug}.md`);
console.log("Edit the post, then run `bun run check:content`.");
