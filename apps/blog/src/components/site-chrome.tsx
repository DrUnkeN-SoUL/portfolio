import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { SiteNav } from "@mathews/ui";
import type { Post } from "@/lib/posts";
import { useActiveHeading } from "@/lib/use-post-enhancements";

const RAIL_LABEL =
  "mb-3 pl-3 whitespace-nowrap font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground/70 uppercase";

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto grid h-14 w-full max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 font-mono text-[0.7rem] tracking-[0.22em] text-muted-foreground md:px-8">
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
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      <div className="mx-auto grid w-full max-w-[1320px] flex-1 grid-cols-1 px-5 md:px-8 xl:grid-cols-[minmax(0,1000px)_200px] xl:justify-between xl:gap-x-14">
        <main className="w-full max-w-[1000px] min-w-0">{children}</main>
        {toc && <TableOfContents toc={toc} />}
      </div>
      <BlogFooter />
    </div>
  );
}

const FOOTER_LINKS = [
  { label: "portfolio", href: "https://mathewsshaji.com", external: false },
  { label: "github", href: "https://github.com/DrUnkeN-SoUL", external: true },
  { label: "linkedin", href: "https://linkedin.com/in/mathews-shaji", external: true },
];

/** Site footer: full width, aligned with the header, pinned to the bottom. */
export function BlogFooter() {
  return (
    <footer className="mt-24">
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-6 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground md:px-8">
        <span>© {new Date().getFullYear()} mathews shaji</span>
        <nav aria-label="Elsewhere" className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="site-nav-link"
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
