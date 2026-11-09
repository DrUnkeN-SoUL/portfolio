import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { BlogFooter, BlogHeader } from "@/components/site-chrome";
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-8 text-xs lowercase tracking-[0.4em] text-muted-foreground">{children}</h2>
  );
}

function Index() {
  const tags = getAllTags();

  return (
    <main className="scanlines min-h-screen bg-background font-mono text-foreground">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <BlogHeader />

        <section className="py-20 md:py-28">
          <SectionLabel>writing</SectionLabel>
          <h1 className="hero-title max-w-2xl text-xl md:text-[clamp(1.15rem,2.2vh,1.875rem)]">
            notes from the backend
          </h1>
          <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground">
            Systems, infrastructure and the occasional side project. Long-form notes kept here
            instead of scattered across chat threads.
          </p>

          {posts.length === 0 ? (
            <p className="mt-16 border-t border-border pt-6 text-xs text-muted-foreground">
              Nothing published yet. Check back soon.
            </p>
          ) : (
            <ul className="mt-16 flex flex-col border-b border-border">
              {posts.map((post, index) => (
                <li key={post.slug} className="border-t border-border">
                  <Link
                    to="/$slug"
                    params={{ slug: post.slug }}
                    className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 py-6"
                  >
                    <span className="text-[0.65rem] text-muted-foreground">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>
                    <span className="flex min-w-0 flex-col gap-2">
                      <span className="text-base tracking-tight text-foreground group-hover:underline">
                        {post.title}
                      </span>
                      <span className="max-w-prose text-xs leading-relaxed text-muted-foreground">
                        {post.description}
                      </span>
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.65rem] tracking-[0.18em] text-muted-foreground">
                        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                        {post.tags.length > 0 && (
                          <span className="flex flex-wrap gap-x-2">
                            {post.tags.map((tag) => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {tags.length > 0 && (
          <section className="pb-24 md:pb-32">
            <SectionLabel>tags</SectionLabel>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-xs">
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <Link
                    to="/tags/$tag"
                    params={{ tag }}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    #{tag}
                    <span className="ml-1 text-[0.6rem]">({count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <BlogFooter />
      </div>
    </main>
  );
}
