import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { getAllTags, posts } from "@/lib/posts";
import { escapeXml } from "@/lib/xml";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const newest = posts[0]?.date ?? new Date().toISOString().slice(0, 10);

        const entries = [
          { loc: `${SITE.blog}/`, lastmod: newest },
          ...posts.map((post) => ({
            loc: `${SITE.blog}/${post.slug}`,
            lastmod: post.updated ?? post.date,
          })),
          ...getAllTags().map(({ tag }) => ({
            loc: `${SITE.blog}/tags/${encodeURIComponent(tag)}`,
            lastmod: newest,
          })),
        ];

        const urls = entries
          .map(
            (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`,
          )
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=0, must-revalidate",
            },
          },
        );
      },
    },
  },
});
