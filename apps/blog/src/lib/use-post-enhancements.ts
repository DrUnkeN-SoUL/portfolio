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
      // the blog tokens (#05060a page, #0a0c12 cards, soft blue-grey lines).
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
          background: "#05060a",
          primaryColor: "#13161d",
          primaryBorderColor: "#2d3039",
          primaryTextColor: "#d6d7db",
          secondaryColor: "#13161d",
          secondaryBorderColor: "#2d3039",
          tertiaryColor: "#0e1017",
          tertiaryBorderColor: "#2d3039",
          lineColor: "#5d6068",
          textColor: "#d0d1d4",
          edgeLabelBackground: "#05060a",
          clusterBkg: "#0e1017",
          clusterBorder: "#2d3039",
          nodeTextColor: "#d6d7db",
          actorBkg: "#13161d",
          actorBorder: "#2d3039",
          actorTextColor: "#d6d7db",
          actorLineColor: "#2d3039",
          signalColor: "#84868c",
          signalTextColor: "#d0d1d4",
          labelBoxBkgColor: "#13161d",
          labelBoxBorderColor: "#2d3039",
          labelTextColor: "#d6d7db",
          noteBkgColor: "#2a2620",
          noteBorderColor: "#5a4a2a",
          noteTextColor: "#e0d6c2",
          activationBkgColor: "#171a22",
          activationBorderColor: "#3c4048",
        },
        themeCSS: `
          .node rect, .node polygon, .actor, rect.actor { rx: 8px; ry: 8px; filter: none !important; }
          .node, .actor, g { filter: none !important; }
          .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #05060a !important; color: #a3a4a9; }
          .edgeLabel rect { fill: #05060a !important; opacity: 1; }
          .messageText { fill: #d0d1d4 !important; }
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
