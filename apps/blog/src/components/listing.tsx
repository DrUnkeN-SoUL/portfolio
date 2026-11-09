import { Link } from "@tanstack/react-router";

import { PostList } from "@/components/post-list";
import { BlogShell, InlineSearch } from "@/components/site-chrome";
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
    <nav aria-label="Pagination" className="flex items-center gap-1">
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
        <InlineSearch className="mt-6" />
      </section>

      {posts.length === 0 ? (
        <p className="text-[0.95rem] text-muted-foreground">
          Nothing published yet. Check back soon.
        </p>
      ) : (
        <PostList posts={pagePosts} />
      )}

      <Pagination page={page} />

      {tags.length > 0 && (
        <section className="mt-8 lg:hidden">
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
    </BlogShell>
  );
}
