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

const dateField = z.preprocess(normalizeDate, dateString);
const optionalDateField = z.preprocess(normalizeDate, dateString.optional());

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

/**
 * The front matter contract shared by the build, the runtime and
 * `bun run check:content`. Keep this in sync with `.pages.yml`.
 */
export const postFrontMatterSchema = z
  .object({
    title: z.string().trim().min(1, "is required"),
    description: z.string().trim().min(1, "is required"),
    date: dateField,
    updated: optionalDateField,
    tags: z.preprocess(
      (value) => (value === undefined || value === null ? [] : value),
      z.array(z.string().trim().min(1)),
    ),
    draft: z.preprocess((value) => value ?? false, z.boolean()),
    cover: optionalString,
  })
  .strict();

export type PostFrontMatter = z.infer<typeof postFrontMatterSchema>;

export type Post = PostFrontMatter & {
  /** Derived from the Markdown filename. */
  slug: string;
  /** Markdown body, with front matter removed. */
  body: string;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugFromFilename(fileName: string): string {
  const slug = fileName.replace(/\.md$/i, "");
  if (!SLUG_RE.test(slug)) {
    throw new Error(
      `"${fileName}" must be kebab-case (lowercase letters, numbers and single hyphens), e.g. "hello-world.md".`,
    );
  }
  return slug;
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map(
      (issue) =>
        `  - ${issue.path.length > 0 ? issue.path.join(".") : "(front matter)"}: ${issue.message}`,
    )
    .join("\n");
}

/**
 * Parse one Markdown file. Throws with a useful message when the front matter
 * or filename is invalid, so a bad post fails the build instead of being
 * silently dropped.
 */
export function parsePost(raw: string, fileName: string): Post {
  const slug = slugFromFilename(fileName);
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
      `[blog] Invalid front matter in content/posts/${fileName}:\n${formatIssues(result.error)}`,
    );
  }

  return {
    ...result.data,
    slug,
    body: parsed.content.trim(),
  };
}
