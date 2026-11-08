import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { BlogFooter, BlogHeader } from "@/components/site-chrome";
import { formatPostDate, getPostBySlug } from "@/lib/posts";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    if (!getPostBySlug(params.slug)) {
      throw notFound();
    }
    return null;
  },
  head: ({ params }) => {
    const post = getPostBySlug(params.slug);

    if (!post) {
      return {};
    }

    const url = `${SITE.blog}/${post.slug}`;
    const image = post.cover ? `${SITE.blog}${post.cover}` : `${SITE.blog}/twitter-image.png`;
    const published = post.date;
    const modified = post.updated ?? post.date;
    const title = `${post.title} — Mathews Shaji`;

    return {
      meta: [
        { title },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "article:published_time", content: published },
        { property: "article:modified_time", content: modified },
        { property: "article:author", content: SITE.portfolio },
        ...post.tags.map((tag) => ({ property: "article:tag", content: tag })),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: published,
            dateModified: modified,
            url,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            image,
            keywords: post.tags.join(", "),
            author: {
              "@type": "Person",
              name: "Mathews Shaji",
              url: SITE.portfolio,
            },
            publisher: {
              "@type": "Person",
              name: "Mathews Shaji",
            },
          }),
        },
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return null;
  }

  return (
    <main className="scanlines min-h-screen bg-background font-mono text-foreground">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <BlogHeader />

        <article className="py-16 md:py-24">
          <Link
            to="/"
            className="text-[0.65rem] tracking-[0.3em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← all writing
          </Link>

          <header className="mt-10 border-b border-border pb-8">
            <h1 className="hero-title max-w-2xl text-xl md:text-[clamp(1.35rem,3vh,2.25rem)]">
              {post.title}
            </h1>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {post.description}
            </p>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[0.65rem] tracking-[0.18em] text-muted-foreground">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {post.updated && <span>updated {formatPostDate(post.updated)}</span>}
              {post.draft && <span className="text-yellow-500">draft</span>}
              {post.tags.length > 0 && (
                <span className="flex flex-wrap items-baseline gap-x-3">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to="/tags/$tag"
                      params={{ tag }}
                      className="underline-offset-4 hover:text-foreground hover:underline"
                    >
                      #{tag}
                    </Link>
                  ))}
                </span>
              )}
            </div>
          </header>

          {post.cover && (
            <img
              src={post.cover}
              alt={post.title}
              className="mt-10 w-full border border-border"
              loading="lazy"
            />
          )}

          <div className="post-prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        <BlogFooter />
      </div>
    </main>
  );
}
