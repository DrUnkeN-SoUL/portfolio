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
      // the blog tokens (#030507 page, #070b0f cards, soft blue-grey lines).
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
          background: "#030507",
          primaryColor: "#0f1419",
          primaryBorderColor: "#282f35",
          primaryTextColor: "#c8cbce",
          secondaryColor: "#0f1419",
          secondaryBorderColor: "#282f35",
          tertiaryColor: "#0a0f13",
          tertiaryBorderColor: "#282f35",
          lineColor: "#585e64",
          textColor: "#b7b9bb",
          edgeLabelBackground: "#030507",
          clusterBkg: "#0a0f13",
          clusterBorder: "#282f35",
          nodeTextColor: "#c8cbce",
          actorBkg: "#0f1419",
          actorBorder: "#282f35",
          actorTextColor: "#c8cbce",
          actorLineColor: "#282f35",
          signalColor: "#777b7f",
          signalTextColor: "#b7b9bb",
          labelBoxBkgColor: "#0f1419",
          labelBoxBorderColor: "#282f35",
          labelTextColor: "#c8cbce",
          noteBkgColor: "#2a2620",
          noteBorderColor: "#5a4a2a",
          noteTextColor: "#e0d6c2",
          activationBkgColor: "#13191e",
          activationBorderColor: "#373e45",
        },
        themeCSS: `
          .node rect, .node polygon, .actor, rect.actor { rx: 8px; ry: 8px; filter: none !important; }
          .node, .actor, g { filter: none !important; }
          .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #030507 !important; color: #9c9fa2; }
          .edgeLabel rect { fill: #030507 !important; opacity: 1; }
          .messageText { fill: #b7b9bb !important; }
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
