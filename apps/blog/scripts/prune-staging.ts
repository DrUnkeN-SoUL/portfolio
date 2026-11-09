import { readdir, rm } from "node:fs/promises";
import path from "node:path";

import { includeDrafts } from "./content.ts";

/**
 * Production builds drop staging-only demo media (`staging-*` files used by
 * the draft kitchen-sink post), so they are never served on the live site.
 * Preview and local draft builds keep them.
 */
if (!includeDrafts()) {
  const dir = path.join(process.cwd(), "dist", "client", "images", "blog");
  const files = await readdir(dir).catch(() => [] as string[]);
  const removed = files.filter((file) => file.startsWith("staging-"));
  await Promise.all(removed.map((file) => rm(path.join(dir, file))));
  console.log(`prune-staging: removed ${removed.length} staging-only file(s) from the build.`);
}
