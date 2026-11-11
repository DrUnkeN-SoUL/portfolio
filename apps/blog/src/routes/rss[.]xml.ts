import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { formatRssDate, posts } from "@/lib/posts";
import { BLOG_DESCRIPTION, BLOG_NAME } from "@/lib/seo";
import { escapeXml } from "@/lib/xml";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () => {
        const items = posts
          .map((post) => {
            const url = `${SITE.blog}/${post.slug}`;
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${formatRssDate(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`;
          })
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_NAME)}</title>
    <link>${escapeXml(`${SITE.blog}/`)}</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE.blog}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`,
          {
            headers: {
              "Content-Type": "application/rss+xml; charset=utf-8",
              "Cache-Control": "public, max-age=0, must-revalidate",
            },
          },
        );
      },
    },
  },
});
