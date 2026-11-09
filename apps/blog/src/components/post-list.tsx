import { Link } from "@tanstack/react-router";

import { formatPostDate, type Post } from "@/lib/posts";

/** One row in a post list: text on the left, cover thumbnail on the right. */
function PostListItem({ post }: { post: Post }) {
  return (
    <li>
      <Link
        to="/$slug"
        params={{ slug: post.slug }}
        className="group flex items-start gap-4 rounded-md px-3 py-4 transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.05] focus-visible:outline-none sm:gap-6"
      >
        <span className="min-w-0 flex-1">
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
            {post.draft && <span className="text-amber">draft</span>}
          </span>
        </span>

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            width={1200}
            height={630}
            loading="lazy"
            decoding="async"
            className="aspect-[1200/630] w-24 shrink-0 rounded-md object-cover opacity-90 ring-1 ring-white/[0.06] transition-opacity group-hover:opacity-100 sm:w-44"
          />
        )}
      </Link>
    </li>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="-mx-3 flex flex-col gap-1">
      {posts.map((post) => (
        <PostListItem key={post.slug} post={post} />
      ))}
    </ul>
  );
}
