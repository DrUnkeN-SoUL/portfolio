import { Link } from "@tanstack/react-router";

import { PostList } from "@/components/post-list";
import { BlogShell } from "@/components/site-chrome";
import { PAGE_COUNT, getAllTags, getPage, posts } from "@/lib/posts";

const PAGER_LINK =
  "inline-flex items-center gap-2 rounded-md px-3 py-2 font-mono text-[0.7rem] tracking-[0.12em] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground";

function pageLink(page: number) {
  return page === 1
    ? ({ to: "/" } as const)
    : ({ to: "/page/$page", params: { page: String(page) } } as const);
}

/** Newer / page numbers / older. Hidden when everything fits on one page. */
function Pagination({ page }: { page: number }) {
  if (PAGE_COUNT <= 1) return null;
  const numbers = Array.from({ length: PAGE_COUNT }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="hidden items-center justify-center gap-1 lg:flex">
      {page > 1 && (
        <Link {...pageLink(page - 1)} rel="prev" className={PAGER_LINK}>
          ← newer
        </Link>
      )}
      <ol className="flex items-center gap-1 font-mono text-[0.7rem]">
        {numbers.map((n) => (
          <li key={n}>
            <Link
              {...pageLink(n)}
              aria-current={n === page ? "page" : undefined}
              className={`grid size-8 place-items-center rounded-md transition-colors ${n === page ? "bg-white/[0.07] text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"}`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ol>
      {page < PAGE_COUNT && (
        <Link {...pageLink(page + 1)} rel="next" className={PAGER_LINK}>
          older →
        </Link>
      )}
    </nav>
  );
}

/**
 * Phone pager: a compact pill pinned to the bottom centre, beside the search
 * button, so paging works one-handed. Larger screens use the inline pager.
 */
function MobilePager({ page }: { page: number }) {
  if (PAGE_COUNT <= 1) return null;
  const arrow =
    "grid size-10 place-items-center rounded-full text-[1.05rem] text-foreground transition-colors hover:bg-white/[0.06]";

  return (
    <nav
      aria-label="Pagination"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex h-12 -translate-x-1/2 items-center gap-1 rounded-full bg-[#0f1419]/95 px-1 shadow-lg ring-1 shadow-black/40 ring-white/[0.1] backdrop-blur lg:hidden"
    >
      {page > 1 ? (
        <Link {...pageLink(page - 1)} rel="prev" aria-label="Newer posts" className={arrow}>
          ‹
        </Link>
      ) : (
        <span aria-hidden="true" className={`${arrow} opacity-25`}>
          ‹
        </span>
      )}
      <span className="px-2 font-mono text-[0.72rem] tracking-[0.08em] whitespace-nowrap text-muted-foreground">
        <span className="text-foreground">{page}</span> / {PAGE_COUNT}
      </span>
      {page < PAGE_COUNT ? (
        <Link {...pageLink(page + 1)} rel="next" aria-label="Older posts" className={arrow}>
          ›
        </Link>
      ) : (
        <span aria-hidden="true" className={`${arrow} opacity-25`}>
          ›
        </span>
      )}
    </nav>
  );
}

/** The post listing used by "/" (page 1) and "/page/N". */
export function Listing({ page }: { page: number }) {
  const tags = getAllTags();
  const pagePosts = getPage(page);

  return (
    <BlogShell>
      <section className="pt-8 pb-6 md:pt-10 md:pb-8">
        <h1 className="text-[1.9rem] leading-[1.15] font-semibold tracking-[-0.02em] md:text-[2.2rem]">
          Writing
        </h1>
        <p className="mt-3 max-w-xl text-[0.975rem] leading-relaxed text-muted-foreground">
          Notes on backends, infrastructure and the details worth keeping.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="text-[0.95rem] text-muted-foreground">
          Nothing published yet. Check back soon.
        </p>
      ) : (
        <PostList posts={pagePosts} />
      )}

      {tags.length > 0 && (
        <section className="mb-8 lg:hidden">
          <h2 className="font-mono text-[0.65rem] tracking-[0.24em] text-muted-foreground uppercase">
            tags
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  to="/tags/$tag"
                  params={{ tag }}
                  className="inline-flex items-baseline gap-1.5 rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
                >
                  #{tag}
                  <span className="text-[0.6rem] opacity-60">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Pagination page={page} />
      <MobilePager page={page} />
    </BlogShell>
  );
}
