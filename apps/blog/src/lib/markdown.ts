import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { rehypeBlog } from "./rehype-blog.ts";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeBlog)
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

export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}
