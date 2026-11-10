import { Fragment } from "react";

import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { BlogShell, InlineToc } from "@/components/site-chrome";
import { formatPostDate, getPostBySlug } from "@/lib/posts";
import { useMermaid } from "@/lib/use-post-enhancements";
import {
  BLOG_ID,
  BLOG_NAME,
  BLOG_URL,
  OG_IMAGE,
  OG_IMAGE_ALT,
  PERSON_ID,
  pageMeta,
} from "@/lib/seo";

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
    const hasCover = Boolean(post.cover);
    const image = post.cover ? `${SITE.blog}${post.cover}` : OG_IMAGE;
    const imageAlt = hasCover ? `Cover image for ${post.title}` : OG_IMAGE_ALT;
    const published = post.date;
    const modified = post.updated ?? post.date;
    const title = `${post.title} — Mathews Shaji`;

    return {
      meta: [
        ...pageMeta({
          title,
          description: post.description,
          url,
          image,
          imageAlt,
          // Only the default card is a known 1200x630 PNG.
          ...(hasCover ? { imageSize: null } : {}),
        }),
        { property: "og:type", content: "article" },
        ...(post.draft ? [{ name: "robots", content: "noindex, nofollow" }] : []),
        { property: "article:published_time", content: published },
        { property: "article:modified_time", content: modified },
        { property: "article:author", content: SITE.portfolio },
        ...post.tags.map((tag) => ({ property: "article:tag", content: tag })),
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
            inLanguage: "en",
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
            isPartOf: { "@type": "Blog", "@id": BLOG_ID, name: BLOG_NAME, url: BLOG_URL },
          }),
        },
      ],
    };
  },
  component: PostPage,
});

const BACK_LINK =
  "tap-area font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground";

function MetaDot() {
  return (
    <span aria-hidden="true" className="text-muted-foreground/50">
      ·
    </span>
  );
}

function PostPage() {
  const { slug } = Route.useParams();
  const post = getPostBySlug(slug);
  useMermaid(slug);

  if (!post) {
    return null;
  }

  return (
    <BlogShell toc={post.toc}>
      <article className="pt-6 md:pt-12">
        <Link to="/" className={BACK_LINK}>
          ← all writing
        </Link>

        <header className="mt-5 md:mt-8">
          <h1 className="text-[1.9rem] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[2.4rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-[1.05rem] leading-[1.6] text-muted-foreground">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-0 font-mono text-[0.7rem] text-muted-foreground">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <MetaDot />
            <span>{post.readingMinutes} min read</span>
            {post.updated && (
              <>
                <MetaDot />
                <span>updated {formatPostDate(post.updated)}</span>
              </>
            )}
            {post.tags.map((tag) => (
              <Fragment key={tag}>
                <MetaDot />
                <Link
                  to="/tags/$tag"
                  params={{ tag }}
                  className="-mx-1.5 px-1.5 py-2.5 transition-colors hover:text-foreground"
                >
                  #{tag}
                </Link>
              </Fragment>
            ))}
            {post.draft && (
              <>
                <MetaDot />
                <span className="text-amber">draft</span>
              </>
            )}
          </div>
        </header>

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            width={1200}
            height={630}
            className="mt-10 aspect-[1200/630] w-full rounded-lg object-cover"
            fetchPriority="high"
          />
        )}

        <InlineToc toc={post.toc} />

        <div className="post-prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      {/* `mt-auto` rests this at the bottom of the page on short posts. */}
      <p className="mt-auto pt-14">
        <Link to="/" className={BACK_LINK}>
          ← all writing
        </Link>
      </p>
    </BlogShell>
  );
}
