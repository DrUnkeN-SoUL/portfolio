import { Link } from "@tanstack/react-router";

import { formatPostDate, type Post } from "@/lib/posts";

/**
 * Generated artwork for posts without a cover: the post's first tag set large
 * over a soft gradient. It deliberately does not repeat the title, which sits
 * right below the banner.
 */
function TagBanner({ tag }: { tag: string | undefined }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(110%_90%_at_100%_0%,rgba(224,163,58,0.16),transparent_55%),radial-gradient(80%_70%_at_0%_100%,rgba(255,255,255,0.04),transparent_60%),linear-gradient(160deg,#262626,#1a1a1a)] p-5 sm:p-6"
    >
      <span className="font-mono text-[0.6rem] tracking-[0.22em] text-muted-foreground/60">
        mathews shaji / writing
      </span>
      <span className="font-mono text-[2.4rem] leading-none tracking-[-0.03em] text-white/[0.13]">
        #{tag ?? "notes"}
      </span>
    </div>
  );
}

/**
 * Card: a full-width banner (the cover, or a generated title banner), then
 * title, description and meta. Cards in a row share subgrid rows, so those
 * three line up even when one title or description wraps more than another.
 */
function PostCard({ post }: { post: Post }) {
  return (
    <li className="row-span-4 mb-8 grid sm:mb-10 grid-rows-subgrid gap-y-0">
      <Link
        to="/$slug"
        params={{ slug: post.slug }}
        className="group row-span-4 grid grid-rows-subgrid gap-y-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
      >
        <div
          className={`relative aspect-[1200/630] overflow-hidden rounded-xl ${post.cover ? "" : "hidden sm:block"} bg-[#202020] ring-1 ring-white/[0.07] transition-[box-shadow] group-hover:ring-white/[0.16]`}
        >
          {post.cover ? (
            <img
              src={post.cover}
              alt=""
              width={1200}
              height={630}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <TagBanner tag={post.tags[0]} />
          )}
          {post.draft && (
            <span className="absolute top-3 right-3 rounded bg-amber/90 px-1.5 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] text-black uppercase">
              draft
            </span>
          )}
        </div>

        <h2
          className={`${post.cover ? "mt-4" : "sm:mt-4"} text-[1.15rem] leading-snug font-semibold tracking-[-0.01em] text-foreground`}
        >
          {post.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 self-start text-[0.92rem] leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <p className="mt-1.5 flex flex-wrap items-baseline self-start gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground/80">
          {post.draft && !post.cover && <span className="text-amber sm:hidden">draft</span>}
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
          {post.tags.length > 0 && (
            <span className="text-muted-foreground/65">
              {post.tags.map((tag) => `#${tag}`).join("  ")}
            </span>
          )}
        </p>
      </Link>
    </li>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ul>
  );
}
