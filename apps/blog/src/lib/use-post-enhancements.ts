import { useEffect, useState } from "react";

/**
 * Render ```mermaid blocks in the browser. Mermaid is large, so it is
 * imported only on pages that actually contain a diagram.
 */
export function useMermaid(slug: string) {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>(
      ".post-prose pre.mermaid:not([data-processed])",
    );
    if (blocks.length === 0) return;

    let cancelled = false;
    void import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        fontFamily: "inherit",
        themeVariables: {
          background: "#191919",
          primaryColor: "#252525",
          primaryBorderColor: "#3a3a3a",
          primaryTextColor: "#d4d4d4",
          lineColor: "#6b6b6b",
          secondaryColor: "#202020",
          tertiaryColor: "#202020",
        },
      });
      void mermaid.run({ nodes: [...blocks] });
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);
}

/** Id of the section heading currently at the top of the viewport. */
export function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (ids.length === 0) return;
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    const update = () => {
      // Last heading whose top has scrolled above 30% of the viewport.
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading.id;
        else break;
      }
      // At the very bottom, the last section is the active one.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = headings.at(-1)?.id ?? current;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` tracks `ids`
  }, [key]);

  return active;
}
