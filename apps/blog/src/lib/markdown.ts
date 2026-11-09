import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeShiki, {
    theme: "github-dark",
    langs: [
      "bash",
      "css",
      "dockerfile",
      "go",
      "html",
      "javascript",
      "json",
      "jsx",
      "markdown",
      "python",
      "rust",
      "sh",
      "sql",
      "toml",
      "tsx",
      "typescript",
      "yaml",
    ],
  })
  .use(rehypeStringify, { allowDangerousHtml: false });

/**
 * Render Markdown to HTML. In a static build this runs at build time; client
 * navigations load this module lazily, so Shiki is not part of the entry chunk.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}
