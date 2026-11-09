import { createFileRoute, notFound } from "@tanstack/react-router";

import { Listing } from "@/components/listing";
import { PAGE_COUNT } from "@/lib/posts";
import { SITE } from "@mathews/ui";
import { BLOG_DESCRIPTION, BLOG_NAME, pageMeta } from "@/lib/seo";

function parsePage(raw: string): number | null {
  const page = Number(raw);
  return Number.isInteger(page) && page >= 2 && page <= PAGE_COUNT ? page : null;
}

export const Route = createFileRoute("/page/$page")({
  loader: ({ params }) => {
    if (parsePage(params.page) === null) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const url = `${SITE.blog}/page/${params.page}`;
    return {
      meta: pageMeta({
        title: `${BLOG_NAME} — page ${params.page}`,
        description: BLOG_DESCRIPTION,
        url,
      }),
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PageRoute,
});

function PageRoute() {
  const { page } = Route.useParams();
  return <Listing page={parsePage(page) ?? 1} />;
}
