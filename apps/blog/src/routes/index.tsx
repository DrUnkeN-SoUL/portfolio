import { createFileRoute } from "@tanstack/react-router";

import { Listing } from "@/components/listing";
import { BLOG_DESCRIPTION, BLOG_JSON_LD, BLOG_NAME, BLOG_URL, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({ title: BLOG_NAME, description: BLOG_DESCRIPTION, url: BLOG_URL }),
    links: [{ rel: "canonical", href: BLOG_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(BLOG_JSON_LD),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Listing page={1} />;
}
