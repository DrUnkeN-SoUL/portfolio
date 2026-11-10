import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { PostList } from "@/components/post-list";
import { BlogShell } from "@/components/site-chrome";
import { getPostsByTag } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/tags/$tag")({
  loader: ({ params }) => {
    if (getPostsByTag(params.tag).length === 0) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const url = `${SITE.blog}/tags/${encodeURIComponent(params.tag)}`;

    return {
      meta: pageMeta({
        title: `#${params.tag} — Writing — Mathews Shaji`,
        description: `Posts tagged #${params.tag} on Mathews Shaji's writing section.`,
        url,
      }),
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TagPage,
});

function TagPage() {
  const { tag } = Route.useParams();
  const posts = getPostsByTag(tag);

  return (
    <BlogShell tag={tag}>
      <section className="pt-6 pb-5 md:pt-10 md:pb-6">
        <p className="font-mono text-[0.65rem] tracking-[0.24em] text-muted-foreground uppercase">
          tag
        </p>
        <h1 className="mt-3 text-[1.9rem] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[2.2rem]">
          #{tag}
        </h1>
        <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </section>

      <PostList posts={posts} />

      <div className="mt-auto pt-6">
        <Link
          to="/"
          className="tap-area font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← all writing
        </Link>
      </div>
    </BlogShell>
  );
}
