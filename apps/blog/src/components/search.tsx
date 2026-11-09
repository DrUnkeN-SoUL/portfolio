import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { formatPostDate, posts } from "@/lib/posts";

import { OPEN_SEARCH_EVENT as OPEN_EVENT } from "@/lib/search-events";

type Entry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  haystack: string;
  text: string;
};

function toText(html: string): string {
  return html
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<a [^>]*heading-anchor[^>]*>[\s\S]*?<\/a>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildIndex(): Entry[] {
  return posts.map((post) => {
    const text = toText(post.html);
    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      text,
      haystack: [post.title, post.description, post.tags.join(" "), text].join(" ").toLowerCase(),
    };
  });
}

/** Rank: every word must match; title hits beat tag hits beat body hits. */
function search(index: Entry[], query: string): { entry: Entry; snippet: string }[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return index.map((entry) => ({ entry, snippet: entry.description }));

  return index
    .filter((entry) => words.every((word) => entry.haystack.includes(word)))
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const score = words.reduce(
        (sum, word) =>
          sum +
          (title.includes(word) ? 10 : 0) +
          (entry.tags.some((tag) => tag.includes(word)) ? 4 : 0) +
          (entry.description.toLowerCase().includes(word) ? 2 : 0),
        0,
      );
      const first = words[0] ?? "";
      const at = entry.text.toLowerCase().indexOf(first);
      const snippet =
        at >= 0 && !title.includes(first)
          ? `${at > 40 ? "…" : ""}${entry.text.slice(Math.max(0, at - 40), at + 100)}…`
          : entry.description;
      return { entry, snippet, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ entry, snippet }) => ({ entry, snippet }));
}

/** ⌘K / Ctrl+K / "/" command palette over every post's title, tags and text. */
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const index = useMemo(() => (open ? buildIndex() : []), [open]);
  const results = useMemo(() => search(index, query), [index, query]);

  useEffect(() => {
    const show = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (slug: string) => {
    setOpen(false);
    void navigate({ to: "/$slug", params: { slug } });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-start sm:px-4 sm:pt-[12vh] sm:pb-0"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search writing"
        className="flex w-full max-w-[600px] flex-col-reverse overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50 sm:flex-col"
      >
        <div className="flex items-center gap-3 border-t border-border px-4 sm:border-t-0 sm:border-b">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
              else if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((value) => Math.min(value + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((value) => Math.max(value - 1, 0));
              } else if (event.key === "Enter") {
                const hit = results[active];
                if (hit) go(hit.entry.slug);
              }
            }}
            placeholder="Search posts, tags and text…"
            aria-label="Search"
            className="h-12 w-full bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground sm:block">
            esc
          </kbd>
        </div>

        <ul
          className="max-h-[60dvh] overflow-y-auto p-2 sm:max-h-[55vh]"
          role="listbox"
          aria-label="Results"
        >
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-[0.9rem] text-muted-foreground">
              No posts match “{query}”.
            </li>
          )}
          {results.map(({ entry, snippet }, i) => (
            <li key={entry.slug} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(entry.slug)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left transition-colors ${i === active ? "bg-white/[0.06]" : ""}`}
              >
                <span className="block truncate text-[0.95rem] font-medium text-foreground">
                  {entry.title}
                </span>
                <span className="mt-0.5 line-clamp-1 block text-[0.825rem] text-muted-foreground">
                  {snippet}
                </span>
                <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.06em] text-muted-foreground/70">
                  {formatPostDate(entry.date)}
                  {entry.tags.length > 0 && `  ${entry.tags.map((tag) => `#${tag}`).join(" ")}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="7" cy="7" r="4.75" />
      <path d="m10.5 10.5 3.25 3.25" />
    </svg>
  );
}
