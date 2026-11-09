import { Link, createFileRoute } from "@tanstack/react-router";

import { BlogShell } from "@/components/site-chrome";
import { formatPostDate, getAllTags, posts } from "@/lib/posts";
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
      <section className="pt-14 pb-10 md:pt-20 md:pb-14">
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
        <ul className="-mx-3 flex flex-col gap-1">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/$slug"
                params={{ slug: post.slug }}
                className="block rounded-md px-3 py-4 transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.05] focus-visible:outline-none"
              >
                <span className="block text-[1.125rem] leading-snug font-medium text-foreground">
                  {post.title}
                </span>
                <span className="mt-1 block text-[0.9rem] leading-relaxed text-muted-foreground">
                  {post.description}
                </span>
                <span className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground/85">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  {post.tags.length > 0 && (
                    <span className="text-muted-foreground/70">
                      {post.tags.map((tag) => `#${tag}`).join("  ")}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {tags.length > 0 && (
        <section className="mt-16">
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
