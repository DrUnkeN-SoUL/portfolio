/**
 * Font links shared by the portfolio and the blog.
 *
 * Keep these in `head.links` so both sites load exactly the same typeface.
 */
export type SiteFontLink = {
  rel: string;
  href: string;
  crossOrigin?: "anonymous";
};

export const SITE_FONT_LINKS: SiteFontLink[] = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap",
  },
];

export const SITE = {
  portfolio: "https://mathewsshaji.com",
  blog: "https://blog.mathewsshaji.com",
} as const;
