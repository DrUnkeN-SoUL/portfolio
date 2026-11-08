import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { BlogFooter, BlogHeader } from "@/components/site-chrome";
import { formatPostDate, getPostsByTag } from "@/lib/posts";

export const Route = createFileRoute("/tags/$tag")({
  loader: ({ params }) => {
    if (getPostsByTag(params.tag).length === 0) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const title = `#${params.tag} — Writing — Mathews Shaji`;
    const description = `Posts tagged #${params.tag} on Mathews Shaji's writing section.`;
    const url = `${SITE.blog}/tags/${encodeURIComponent(params.tag)}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "robots", content: "noindex, follow" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TagPage,
});

function TagPage() {
  const { tag } = Route.useParams();
  const posts = getPostsByTag(tag);

  return (
    <main className="scanlines min-h-screen bg-background font-mono text-foreground">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <BlogHeader />

        <section className="py-20 md:py-28">
          <p className="text-xs lowercase tracking-[0.4em] text-muted-foreground">tag</p>
          <h1 className="hero-title mt-4 text-xl md:text-[clamp(1.15rem,2.2vh,1.875rem)]">
            #{tag}
          </h1>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>

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
                    <time
                      dateTime={post.date}
                      className="text-[0.65rem] tracking-[0.18em] text-muted-foreground"
                    >
                      {formatPostDate(post.date)}
                    </time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to="/"
            className="mt-10 inline-block text-[0.65rem] tracking-[0.3em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← all writing
          </Link>
        </section>

        <BlogFooter />
      </div>
    </main>
  );
}
