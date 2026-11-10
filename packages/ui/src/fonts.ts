import monoFontUrl from "../fonts/jetbrains-mono-latin.woff2?url";

export type SiteFontLink = {
  rel: string;
  href: string;
  as?: "font";
  type?: string;
  crossOrigin?: "anonymous";
};

/** The face itself is declared in styles.css. */
export const SITE_FONT_LINKS: SiteFontLink[] = [
  // Font fetches are always CORS; without crossOrigin the preload is discarded.
  { rel: "preload", href: monoFontUrl, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
];

export const SITE = {
  portfolio: "https://mathewsshaji.com",
  blog: "https://blog.mathewsshaji.com",
} as const;
