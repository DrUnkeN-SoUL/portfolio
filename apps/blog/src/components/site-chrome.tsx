import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { SiteNav } from "@mathews/ui";
import type { Post } from "@/lib/posts";

const RAIL_LABEL =
  "mb-3 pl-3 whitespace-nowrap font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground/70 uppercase";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-14 w-full max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground md:px-8">
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

/** Right rail: "on this page" outline for posts with sections (xl and up). */
function TableOfContents({ toc }: { toc: Post["toc"] }) {
  if (toc.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] max-w-[220px] self-start overflow-y-auto pt-[8.5rem] xl:block"
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
 * Page frame shared by every blog route: header, one centred reading column,
 * and (xl and up) an "on this page" outline in the right margin. The outline
 * sits in its own grid track so it never pushes the column off-centre.
 */
export function BlogShell({
  children,
  toc,
}: {
  children: ReactNode;
  toc?: Post["toc"] | undefined;
}) {
  return (
    <div className="min-h-screen">
      <BlogHeader />
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-5 md:px-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,820px)_minmax(0,1fr)] xl:gap-x-12">
        <main className="mx-auto w-full max-w-[820px] min-w-0 xl:col-start-2">
          {children}
          <BlogFooter />
        </main>
        {toc && <TableOfContents toc={toc} />}
      </div>
    </div>
  );
}

export function BlogFooter() {
  return (
    <footer className="mt-24 flex flex-wrap items-baseline justify-between gap-3 py-8 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground">
      <span>© {new Date().getFullYear()} mathews shaji</span>
      <a href="https://mathewsshaji.com" className="site-nav-link">
        portfolio
      </a>
    </footer>
  );
}
