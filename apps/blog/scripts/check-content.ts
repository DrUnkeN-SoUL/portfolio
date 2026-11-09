import { loadPostsFromDisk } from "./content.ts";

const { posts, errors, files } = await loadPostsFromDisk(process.cwd(), { includeDrafts: true });

if (errors.length > 0) {
  console.error(`✗ ${errors.length} invalid blog post(s):\n`);
  console.error(errors.join("\n\n"));
  process.exit(1);
}

if (files.length === 0) {
  console.error("✗ content/posts is empty; add at least one Markdown file.");
  process.exit(1);
}

const drafts = posts.filter((post) => post.draft).length;
console.log(
  `✓ ${posts.length} post(s) valid (${posts.length - drafts} published, ${drafts} draft).`,
);
