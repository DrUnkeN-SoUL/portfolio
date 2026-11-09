import { useEffect, useState, type ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { SiteNav } from "@mathews/ui";
import { SearchDialog, SearchIcon } from "@/components/search";
import { getAllTags, posts, type Post } from "@/lib/posts";
import { openSearch } from "@/lib/search-events";
import { useActiveHeading } from "@/lib/use-post-enhancements";

const FRAME = "mx-auto w-full max-w-[1440px] px-5 md:px-8";
const RAIL_LABEL =
  "mb-3 pl-3 whitespace-nowrap font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground/70 uppercase";
const SIDE_LABEL =
  "mb-2 px-2 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground/70 uppercase";
const SIDE_LINK =
  "block truncate rounded-[5px] px-2 py-[5px] text-[0.875rem] leading-snug text-muted-foreground transition-colors hover:bg-white/[0.045] hover:text-foreground";
const SIDE_ACTIVE = "bg-white/[0.06] text-foreground";
/** The rail lists the newest posts; the rest are a page or a search away. */
const SIDEBAR_POSTS = 8;

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div
        className={`${FRAME} flex h-14 items-center justify-between gap-3 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground sm:tracking-[0.22em]`}
      >
        <Link
          to="/"
          className="flex shrink-0 items-baseline gap-2 whitespace-nowrap transition-colors hover:text-foreground"
        >
          <span className="text-foreground">mathews shaji</span>
          <span className="hidden text-muted-foreground sm:inline">/ writing</span>
        </Link>
        <SiteNav
          current="blog"
          className="flex items-baseline gap-3 text-[0.65rem] tracking-[0.16em] whitespace-nowrap text-muted-foreground sm:gap-4 sm:tracking-[0.3em]"
        />
      </div>
    </header>
  );
}

/** Search field for screens without the left rail; sits in the page body. */
export function InlineSearch({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openSearch}
      className={`flex h-10 w-full items-center gap-2.5 rounded-lg bg-white/[0.045] px-3.5 text-left text-[0.9rem] text-muted-foreground ring-1 ring-white/[0.06] transition-colors ring-inset hover:bg-white/[0.07] lg:hidden ${className}`}
    >
      <SearchIcon className="size-4 shrink-0 opacity-70" />
      Search posts…
    </button>
  );
}

/** Left rail (lg and up): search, every post and every tag. */
function BlogSidebar({ slug, tag }: { slug?: string | undefined; tag?: string | undefined }) {
  const tags = getAllTags();
  const [shortcut, setShortcut] = useState("Ctrl K");
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘K");
  }, []);

  return (
    <nav
      aria-label="Blog"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] self-start overflow-y-auto py-10 lg:block"
    >
      <button
        type="button"
        onClick={openSearch}
        className="group mb-6 flex h-9 w-full items-center gap-2.5 rounded-lg bg-white/[0.045] px-3 text-left text-[0.85rem] text-muted-foreground ring-1 ring-white/[0.06] transition-colors ring-inset hover:bg-white/[0.07] hover:text-foreground"
      >
        <SearchIcon className="size-[15px] shrink-0 opacity-70 group-hover:opacity-100" />
        <span className="flex-1">Search…</span>
        <kbd className="rounded-[4px] bg-white/[0.06] px-1.5 py-[1px] font-mono text-[0.6rem] tracking-[0.04em] text-muted-foreground/80 ring-1 ring-white/[0.08] ring-inset">
          {shortcut}
        </kbd>
      </button>

      <Link
        to="/"
        className={`${SIDE_LINK} mb-6 font-medium`}
        activeProps={{ className: SIDE_ACTIVE }}
        activeOptions={{ exact: true }}
      >
        All writing
      </Link>

      <p className={SIDE_LABEL}>Recent</p>
      <ul className="mb-7 space-y-px">
        {posts.slice(0, SIDEBAR_POSTS).map((post) => (
          <li key={post.slug}>
            <Link
              to="/$slug"
              params={{ slug: post.slug }}
              title={post.title}
              className={`${SIDE_LINK} ${post.slug === slug ? SIDE_ACTIVE : ""}`}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>

      {tags.length > 0 && (
        <>
          <p className={SIDE_LABEL}>Tags</p>
          <ul className="space-y-px">
            {tags.map(({ tag: name, count }) => (
              <li key={name}>
                <Link
                  to="/tags/$tag"
                  params={{ tag: name }}
                  className={`${SIDE_LINK} flex justify-between gap-3 ${name === tag ? SIDE_ACTIVE : ""}`}
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
  const active = useActiveHeading(toc.map((entry) => entry.id));
  if (toc.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-[200px] self-start overflow-y-auto pt-[8.5rem] xl:block"
    >
      <p className={RAIL_LABEL}>On this page</p>
      <ul className="space-y-px border-l border-border">
        {toc.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={entry.id === active ? "location" : undefined}
              className={`-ml-px block border-l py-1 pr-2 text-[0.8125rem] leading-snug transition-colors hover:text-foreground ${entry.id === active ? "border-foreground/70 text-foreground" : "border-transparent text-muted-foreground hover:border-foreground/40"} ${entry.depth === 3 ? "pl-6" : "pl-3"}`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Collapsible outline at the top of a post, for screens without the rail. */
export function InlineToc({ toc }: { toc: Post["toc"] }) {
  if (toc.length < 2) return null;

  return (
    <details className="group mt-8 rounded-md bg-white/[0.03] px-4 py-3 xl:hidden">
      <summary className="cursor-pointer list-none font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase select-none">
        <span className="inline-block transition-transform group-open:rotate-90">›</span> On this
        page
      </summary>
      <ul className="mt-3 space-y-1">
        {toc.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${entry.id}`}
              className="text-[0.9rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * Page frame shared by every blog route: header; a left rail with search,
 * posts and tags (lg+); the reading column; and an "on this page" outline on
 * the right for posts with sections (xl+).
 */
export function BlogShell({
  children,
  slug,
  tag,
  toc,
}: {
  children: ReactNode;
  slug?: string | undefined;
  tag?: string | undefined;
  toc?: Post["toc"] | undefined;
}) {
  const hasToc = Boolean(toc && toc.length >= 2);

  return (
    <div className="flex min-h-dvh flex-col">
      <BlogHeader />
      <div
        className={`${FRAME} grid flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-12 ${hasToc ? "xl:grid-cols-[220px_minmax(0,1fr)_200px]" : ""}`}
      >
        <BlogSidebar slug={slug} tag={tag} />
        <main className="w-full max-w-[1000px] min-w-0">{children}</main>
        {hasToc && toc && <TableOfContents toc={toc} />}
      </div>
      <BlogFooter />
      <SearchDialog />
    </div>
  );
}

/** Thin outline logos (1.5px stroke, after Lucide), not filled brand marks. */
function GitHubLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/DrUnkeN-SoUL", Logo: GitHubLogo },
  { label: "LinkedIn", href: "https://linkedin.com/in/mathews-shaji", Logo: LinkedInLogo },
];

/** Site footer: full width, aligned with the header, pinned to the bottom. */
export function BlogFooter() {
  return (
    <footer className="mt-8">
      <div
        className={`${FRAME} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground`}
      >
        <span>© {new Date().getFullYear()} mathews shaji</span>
        <nav aria-label="Elsewhere" className="flex items-center gap-5">
          <a href="https://mathewsshaji.com" className="site-nav-link">
            portfolio
          </a>
          {SOCIAL_LINKS.map(({ label, href, Logo }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Logo />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
