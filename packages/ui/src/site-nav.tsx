import { SITE } from "./fonts";

type Site = "portfolio" | "blog";

const LINKS: Array<{ site: Site; label: string; href: string }> = [
  { site: "portfolio", label: "portfolio", href: SITE.portfolio },
  { site: "blog", label: "writing", href: SITE.blog },
];

/**
 * Cross-site navigation. The current site is plain text; the other site is a
 * link. Styled to match the portfolio's small, wide-tracked header type.
 */
export function SiteNav({ current }: { current: Site }) {
  return (
    <nav
      aria-label="Sites"
      className="flex items-baseline gap-4 text-[0.65rem] tracking-[0.3em] text-muted-foreground"
    >
      {LINKS.map((link) =>
        link.site === current ? (
          <span key={link.site} aria-current="page" className="text-foreground">
            {link.label}
          </span>
        ) : (
          <a
            key={link.site}
            href={link.href}
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {link.label} ↗
          </a>
        ),
      )}
    </nav>
  );
}
