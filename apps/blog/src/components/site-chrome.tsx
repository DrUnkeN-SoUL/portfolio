import { Link } from "@tanstack/react-router";

import { SiteNav } from "@mathews/ui";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-background py-5 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground">
      <Link
        to="/"
        className="flex min-w-0 items-baseline gap-2 transition-colors hover:text-foreground"
      >
        <span className="truncate text-foreground">mathews shaji</span>
        <span className="hidden text-muted-foreground sm:inline">/ writing</span>
      </Link>
      <SiteNav current="blog" />
    </header>
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
