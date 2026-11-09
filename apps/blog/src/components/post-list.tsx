import { Link } from "@tanstack/react-router";

import { formatPostDate, type Post } from "@/lib/posts";

/** Generated banner for posts without a cover: the title, set large. */
function TitleBanner({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(120%_90%_at_100%_0%,rgba(224,163,58,0.13),transparent_55%),linear-gradient(160deg,#262626,#1b1b1b)] p-5 sm:p-6"
    >
      <span className="font-mono text-[0.6rem] tracking-[0.22em] text-muted-foreground/70">
        mathews shaji / writing
      </span>
      <p className="line-clamp-3 text-[1.35rem] leading-[1.2] font-semibold tracking-[-0.015em] text-white/90 sm:text-[1.6rem]">
        {title}
      </p>
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
    <li className="row-span-4 mb-12 grid grid-rows-subgrid gap-y-0">
      <Link
        to="/$slug"
        params={{ slug: post.slug }}
        className="group row-span-4 grid grid-rows-subgrid gap-y-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
      >
        <div className="relative aspect-[1200/630] overflow-hidden rounded-xl bg-[#202020] ring-1 ring-white/[0.07] transition-[box-shadow] group-hover:ring-white/[0.16]">
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
            <TitleBanner title={post.title} />
          )}
          {post.draft && (
            <span className="absolute top-3 right-3 rounded bg-amber/90 px-1.5 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] text-black uppercase">
              draft
            </span>
          )}
        </div>

        <h2 className="mt-4 text-[1.15rem] leading-snug font-semibold tracking-[-0.01em] text-foreground">
          {post.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 self-start text-[0.92rem] leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <p className="mt-1.5 flex flex-wrap items-baseline self-start gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.06em] text-muted-foreground/80">
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
