import { SITE } from "./fonts";

/** No arrows: the two labels read as one flat nav. */
export function SiteNav({
  current,
  className,
}: {
  current: "portfolio" | "blog";
  className?: string;
}) {
  return (
    <nav
      aria-label="Sites"
      className={
        className ??
        "flex items-baseline gap-4 text-[0.65rem] tracking-[0.3em] text-muted-foreground"
      }
    >
      {[
        { site: "portfolio", label: "portfolio", href: SITE.portfolio },
        { site: "blog", label: "writing", href: SITE.blog },
      ].map((link) =>
        link.site === current ? (
          <span key={link.site} aria-current="page" className="text-foreground">
            {link.label}
          </span>
        ) : (
          <a key={link.site} href={link.href} className="site-nav-link">
            {link.label}
          </a>
        ),
      )}
    </nav>
  );
}
