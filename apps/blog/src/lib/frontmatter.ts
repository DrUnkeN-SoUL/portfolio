import matter from "gray-matter";
import { z } from "zod";

/** A date as written by Pages CMS or a local editor. */
function normalizeDate(value: unknown): unknown {
  if (value === undefined || value === null || value === "") return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? value : value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }

  return value;
}

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date in YYYY-MM-DD format");

/** Keep in sync with `.pages.yml`. */
export const postFrontMatterSchema = z
  .object({
    title: z.string().trim().min(1, "is required"),
    description: z.string().trim().min(1, "is required"),
    date: z.preprocess(normalizeDate, dateString),
    updated: z.preprocess(normalizeDate, dateString.optional()),
    tags: z.preprocess(
      (value) => (value === undefined || value === null ? [] : value),
      z.array(z.string().trim().min(1)),
    ),
    draft: z.preprocess((value) => value ?? false, z.boolean()),
    cover: z.preprocess(
      (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z.string().trim().min(1).optional(),
    ),
  })
  .strict();

export type Post = z.infer<typeof postFrontMatterSchema> & { slug: string; body: string };

/**
 * Throws on an invalid filename or front matter, so a bad post fails the build instead of being
 * dropped.
 */
export function parsePost(raw: string, fileName: string): Post {
  const slug = fileName.replace(/\.md$/i, "");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `"${fileName}" must be kebab-case (lowercase letters, numbers and single hyphens), e.g. "hello-world.md".`,
    );
  }

  let parsed: matter.GrayMatterFile<string>;

  try {
    parsed = matter(raw);
  } catch (error) {
    throw new Error(
      `[blog] Could not parse front matter in content/posts/${fileName}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const result = postFrontMatterSchema.safeParse(parsed.data);

  if (!result.success) {
    throw new Error(
      `[blog] Invalid front matter in content/posts/${fileName}:\n${result.error.issues
        .map(
          (issue) =>
            `  - ${issue.path.length > 0 ? issue.path.join(".") : "(front matter)"}: ${issue.message}`,
        )
        .join("\n")}`,
    );
  }

  const body = parsed.content.trim();

  if (hasLevelOneHeading(body)) {
    throw new Error(
      `[blog] content/posts/${fileName} has a "# " heading in the body. The page already renders the front-matter title as the only <h1>; start sections at "## ".`,
    );
  }

  return {
    ...result.data,
    slug,
    body,
  };
}

/** Ignores "# " lines inside fenced code. */
function hasLevelOneHeading(body: string): boolean {
  let fence: string | null = null;
  for (const line of body.split("\n")) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (fence === null) fence = marker.charAt(0);
      else if (marker.charAt(0) === fence) fence = null;
      continue;
    }
    if (fence === null && /^\s{0,3}#(\s|$)/.test(line)) return true;
  }
  return false;
}
