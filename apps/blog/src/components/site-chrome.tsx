import { Link } from "@tanstack/react-router";

import { SiteNav } from "@mathews/ui";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 bg-background py-6 text-xs tracking-[0.3em] text-muted-foreground">
      <Link to="/" className="flex min-w-0 items-baseline gap-2">
        <span className="truncate text-foreground">mathews shaji</span>
        <span className="hidden text-muted-foreground sm:inline">/writing</span>
      </Link>
      <SiteNav current="blog" />
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t border-border py-8 text-[0.65rem] tracking-[0.3em] text-muted-foreground">
      <span>© {new Date().getFullYear()} mathews shaji</span>
      <div className="flex items-baseline gap-4">
        <a href="/rss.xml" className="hover:text-foreground">
          rss
        </a>
        <a
          href="https://mathewsshaji.com"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          portfolio ↗
        </a>
      </div>
    </footer>
  );
}
