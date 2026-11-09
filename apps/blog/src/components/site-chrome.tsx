import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { SiteNav } from "@mathews/ui";
import { getAllTags, posts, type Post } from "@/lib/posts";

const RAIL_LABEL =
  "mb-2 px-2 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground/70 uppercase";
const RAIL_LINK =
  "block truncate rounded-[5px] px-2 py-[5px] text-[0.875rem] leading-snug text-muted-foreground transition-colors hover:bg-white/[0.045] hover:text-foreground";
const RAIL_ACTIVE = "bg-white/[0.06] text-foreground";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-14 w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground md:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-baseline gap-2 transition-colors hover:text-foreground"
        >
          <span className="truncate text-foreground">mathews shaji</span>
          <span className="hidden text-muted-foreground sm:inline">/ writing</span>
        </Link>
        <SiteNav current="blog" />
      </div>
    </header>
  );
}

/** Left rail: every post and every tag, Notion-sidebar style (lg and up). */
function BlogSidebar({ slug, tag }: { slug?: string | undefined; tag?: string | undefined }) {
  const tags = getAllTags();

  return (
    <nav
      aria-label="Blog"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10 lg:block"
    >
      <Link
        to="/"
        className={`${RAIL_LINK} mb-6 font-medium`}
        activeProps={{ className: RAIL_ACTIVE }}
        activeOptions={{ exact: true }}
      >
        All writing
      </Link>

      <p className={RAIL_LABEL}>Posts</p>
      <ul className="mb-7 space-y-px">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/$slug"
              params={{ slug: post.slug }}
              title={post.title}
              className={`${RAIL_LINK} ${post.slug === slug ? RAIL_ACTIVE : ""}`}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

      {tags.length > 0 && (
        <>
          <p className={RAIL_LABEL}>Tags</p>
          <ul className="space-y-px">
            {tags.map(({ tag: name, count }) => (
              <li key={name}>
                <Link
                  to="/tags/$tag"
                  params={{ tag: name }}
                  className={`${RAIL_LINK} flex justify-between gap-3 ${name === tag ? RAIL_ACTIVE : ""}`}
                >
                  <span className="truncate">#{name}</span>
                  <span className="font-mono text-[0.7rem] text-muted-foreground/60">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  );
}

/** Right rail: "on this page" outline for posts with sections (xl and up). */
function TableOfContents({ toc }: { toc: Post["toc"] }) {
  if (toc.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10 xl:block"
    >
      <p className={RAIL_LABEL}>On this page</p>
      <ul className="space-y-px border-l border-border">
        {toc.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={`-ml-px block border-l border-transparent py-1 pr-2 text-[0.8125rem] leading-snug text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground ${entry.depth === 3 ? "pl-6" : "pl-3"}`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Page frame shared by every blog route: full-width header, left rail of
 * posts and tags, a wide reading column, and an optional outline on the right.
 */
export function BlogShell({
  children,
  slug,
  tag,
  toc,
}: {
  children: ReactNode;
  slug?: string;
  tag?: string;
  toc?: Post["toc"];
}) {
  const hasToc = Boolean(toc && toc.length >= 2);

  return (
    <div className="min-h-screen">
      <BlogHeader />
      <div
        className={`mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-12 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,1fr)] ${hasToc ? "xl:grid-cols-[220px_minmax(0,1fr)_200px]" : ""}`}
      >
        <BlogSidebar slug={slug} tag={tag} />
        <main className="mx-auto w-full max-w-[900px] min-w-0">
          {children}
          <BlogFooter />
        </main>
        {hasToc && toc && <TableOfContents toc={toc} />}
      </div>
    </div>
  );
}

export function BlogFooter() {
  return (
    <footer className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-border py-6 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground">
      <span>© {new Date().getFullYear()} mathews shaji</span>
      <div className="flex items-baseline gap-4">
        <a href="/rss.xml" className="site-nav-link">
          rss
        </a>
        <a href="https://mathewsshaji.com" className="site-nav-link">
          portfolio
        </a>
      </div>
    </footer>
  );
}
