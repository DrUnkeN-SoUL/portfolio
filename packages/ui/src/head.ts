/**
 * Head entries shared by the portfolio and the blog.
 */

/** Favicons. Google Search needs a square icon that is a multiple of 48px. */
export const SITE_ICON_LINKS = [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "icon", href: "/favicon-48.png", type: "image/png", sizes: "48x48" },
  { rel: "icon", href: "/favicon-96.png", type: "image/png", sizes: "96x96" },
  { rel: "icon", href: "/favicon-192.png", type: "image/png", sizes: "192x192" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
];

/** Google Analytics 4 measurement ID (public; it ships in every page). */
export const GA_MEASUREMENT_ID = "G-HHRY6R1KF8";

/**
 * GA4 gtag.js, production builds only so local dev never sends hits.
 * Enhanced measurement records client-side route changes as page views, and
 * the default cookie domain is shared by mathewsshaji.com and its blog subdomain.
 */
export const ANALYTICS_SCRIPTS = import.meta.env.PROD
  ? [
      { src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`, async: true },
      {
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
      },
    ]
  : [];
