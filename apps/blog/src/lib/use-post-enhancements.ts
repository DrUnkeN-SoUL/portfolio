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
      const font = getComputedStyle(document.body).fontFamily;
      // "base" is the only theme whose variables fully apply; these mirror
      // the blog tokens (#191919 page, #202020 cards, soft grey lines).
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "strict",
        fontFamily: font,
        flowchart: { curve: "basis", padding: 14, nodeSpacing: 40, rankSpacing: 48 },
        sequence: { mirrorActors: false, actorMargin: 60, boxMargin: 8, messageFontWeight: 400 },
        themeVariables: {
          darkMode: true,
          fontFamily: font,
          fontSize: "14px",
          background: "#191919",
          primaryColor: "#232323",
          primaryBorderColor: "#3d3d3d",
          primaryTextColor: "#d6d6d6",
          secondaryColor: "#232323",
          secondaryBorderColor: "#3d3d3d",
          tertiaryColor: "#1f1f1f",
          tertiaryBorderColor: "#3d3d3d",
          lineColor: "#6e6e6e",
          textColor: "#bdbdbd",
          edgeLabelBackground: "#191919",
          clusterBkg: "#1f1f1f",
          clusterBorder: "#333333",
          nodeTextColor: "#d6d6d6",
          actorBkg: "#232323",
          actorBorder: "#3d3d3d",
          actorTextColor: "#d6d6d6",
          actorLineColor: "#3d3d3d",
          signalColor: "#8a8a8a",
          signalTextColor: "#bdbdbd",
          labelBoxBkgColor: "#232323",
          labelBoxBorderColor: "#3d3d3d",
          labelTextColor: "#d6d6d6",
          noteBkgColor: "#2a2620",
          noteBorderColor: "#5a4a2a",
          noteTextColor: "#e0d6c2",
          activationBkgColor: "#2a2a2a",
          activationBorderColor: "#4a4a4a",
        },
        themeCSS: `
          .node rect, .node polygon, .actor, rect.actor { rx: 8px; ry: 8px; filter: none !important; }
          .node, .actor, g { filter: none !important; }
          .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #191919 !important; color: #9a9a9a; }
          .edgeLabel rect { fill: #191919 !important; opacity: 1; }
          .messageText { fill: #bdbdbd !important; }
        `,
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
