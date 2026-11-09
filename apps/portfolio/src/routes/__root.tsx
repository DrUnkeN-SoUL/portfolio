import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { SITE, SITE_FONT_LINKS } from "@mathews/ui";
import appCss from "@mathews/ui/styles.css?url";

import {
  GITHUB_URL,
  HOME_DESCRIPTION,
  HOME_TITLE,
  LINKEDIN_URL,
  OG_IMAGE,
  OG_IMAGE_ALT,
  RSS_URL,
  SITE_NAME,
} from "@/lib/seo";
import { ANALYTICS_SCRIPTS, SITE_ICON_LINKS } from "@mathews/ui/head";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#0d0d0d" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      ...SITE_FONT_LINKS,
      ...SITE_ICON_LINKS,
      // The blog is the long-form feed; advertise it from the portfolio too.
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: `${SITE_NAME} — writing`,
        href: RSS_URL,
      },
      // Identity signals for this person's profiles.
      { rel: "me", href: GITHUB_URL },
      { rel: "me", href: LINKEDIN_URL },
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
      <body>
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
  const { queryClient } = Route.useRouteContext();

  useScrollIndicator();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
