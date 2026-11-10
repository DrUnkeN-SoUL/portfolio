import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { SITE, SITE_FONT_LINKS } from "@mathews/ui";
import appCss from "@mathews/ui/styles.css?url";

import { BLOG_DESCRIPTION, BLOG_NAME, OG_IMAGE, OG_IMAGE_ALT } from "@/lib/seo";
import { ANALYTICS_SCRIPTS, SITE_ICON_LINKS } from "@mathews/ui/head";

function NotFoundComponent() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-[0.65rem] tracking-[0.24em] text-muted-foreground">
          error / 404
        </p>
        <h1 className="mt-4 text-[1.6rem] leading-tight font-semibold tracking-[-0.02em]">
          Page not found
        </h1>
        <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
          The post or tag you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← all writing
        </Link>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-[0.65rem] tracking-[0.24em] text-muted-foreground">
          error / 500
        </p>
        <h1 className="mt-4 text-[1.6rem] leading-tight font-semibold tracking-[-0.02em]">
          This page didn't load
        </h1>
        <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
          Something went wrong on our end. Try refreshing or head back to the index.
        </p>
        <div className="mt-8 flex justify-center gap-5 font-mono text-[0.7rem]">
          <button
            onClick={reset}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            try again
          </button>
          <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
            all writing
          </Link>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: BLOG_NAME },
      { name: "description", content: BLOG_DESCRIPTION },
      { name: "author", content: "Mathews Shaji" },
      { name: "theme-color", content: "#030507" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: "Mathews Shaji" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: BLOG_NAME },
      { property: "og:description", content: BLOG_DESCRIPTION },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: BLOG_NAME },
      { name: "twitter:description", content: BLOG_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      ...SITE_FONT_LINKS,
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Mathews Shaji — writing",
        href: `${SITE.blog}/rss.xml`,
      },
      // Identity signals: the same person owns both sites.
      { rel: "me", href: "https://github.com/DrUnkeN-SoUL" },
      { rel: "me", href: "https://linkedin.com/in/mathews-shaji" },
      ...SITE_ICON_LINKS,
    ],
    scripts: [...ANALYTICS_SCRIPTS],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      {/* `.blog-surface` scopes the Notion-dark reading tokens to the blog. */}
      <body className="blog-surface">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function useScrollIndicator() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;

    const show = () => {
      root.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove("is-scrolling"), 700);
    };

    window.addEventListener("scroll", show, { passive: true });
    window.addEventListener("wheel", show, { passive: true });
    window.addEventListener("touchmove", show, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", show);
      window.removeEventListener("wheel", show);
      window.removeEventListener("touchmove", show);
      root.classList.remove("is-scrolling");
    };
  }, []);
}

function RootComponent() {
  useScrollIndicator();
  return <Outlet />;
}
