import { Link, createFileRoute } from "@tanstack/react-router";

import { PostList } from "@/components/post-list";
import { BlogShell } from "@/components/site-chrome";
import { getAllTags, posts } from "@/lib/posts";
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
  const tags = getAllTags();

  return (
    <BlogShell>
      <section className="pt-12 pb-8 md:pt-16 md:pb-10">
        <h1 className="text-[1.9rem] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[2.4rem]">
          Writing
        </h1>
        <p className="mt-3 max-w-xl text-[0.975rem] leading-relaxed text-muted-foreground">
          Notes on backends, infrastructure and the details worth keeping.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="text-[0.95rem] text-muted-foreground">
          Nothing published yet. Check back soon.
        </p>
      ) : (
        <PostList posts={posts} />
      )}

      {tags.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-[0.65rem] tracking-[0.24em] text-muted-foreground uppercase">
            tags
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  to="/tags/$tag"
                  params={{ tag }}
                  className="inline-flex items-baseline gap-1.5 rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
                >
                  #{tag}
                  <span className="text-[0.6rem] opacity-60">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </BlogShell>
  );
}
