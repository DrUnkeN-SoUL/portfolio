import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SITE } from "@mathews/ui";
import { BlogFooter, BlogHeader } from "@/components/site-chrome";
import { formatPostDate, getPostsByTag } from "@/lib/posts";
import { pageMeta } from "@/lib/seo";

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
      meta: pageMeta({ title, description, url }),
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: TagPage,
});

function TagPage() {
  const { tag } = Route.useParams();
  const posts = getPostsByTag(tag);

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-[860px] px-6 pb-8">
        <BlogHeader />

        <section className="pt-14 pb-10 md:pt-20 md:pb-14">
          <p className="font-mono text-[0.65rem] tracking-[0.24em] text-muted-foreground uppercase">
            tag
          </p>
          <h1 className="mt-3 text-[1.9rem] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[2.4rem]">
            #{tag}
          </h1>
          <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </section>

        <ul className="-mx-3 flex flex-col divide-y divide-border">
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
                <span className="mt-1.5 block font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground/85">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t border-border pt-5">
          <Link
            to="/"
            className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← all writing
          </Link>
        </div>

        <BlogFooter />
      </div>
    </main>
  );
}
