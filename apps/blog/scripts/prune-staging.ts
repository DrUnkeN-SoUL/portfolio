import { readdir, rm } from "node:fs/promises";
import path from "node:path";

import { includeDrafts } from "./content.ts";

/** Production builds drop the `staging-*` demo media; preview and local draft builds keep it. */
if (!includeDrafts()) {
  const dir = path.join(process.cwd(), "dist", "client", "images", "blog");
  const files = await readdir(dir).catch(() => [] as string[]);
  const removed = files.filter((file) => file.startsWith("staging-"));
  await Promise.all(removed.map((file) => rm(path.join(dir, file))));
  console.log(`prune-staging: removed ${removed.length} staging-only file(s) from the build.`);
}
