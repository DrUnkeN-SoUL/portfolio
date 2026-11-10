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
      // the blog tokens (#080a10 page, #0f1118 cards, soft blue-grey lines).
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
          background: "#080a10",
          primaryColor: "#181b23",
          primaryBorderColor: "#30343d",
          primaryTextColor: "#d6d7db",
          secondaryColor: "#181b23",
          secondaryBorderColor: "#30343d",
          tertiaryColor: "#13151d",
          tertiaryBorderColor: "#30343d",
          lineColor: "#5f6269",
          textColor: "#d0d1d4",
          edgeLabelBackground: "#080a10",
          clusterBkg: "#13151d",
          clusterBorder: "#30343d",
          nodeTextColor: "#d6d7db",
          actorBkg: "#181b23",
          actorBorder: "#30343d",
          actorTextColor: "#d6d7db",
          actorLineColor: "#30343d",
          signalColor: "#87898f",
          signalTextColor: "#d0d1d4",
          labelBoxBkgColor: "#181b23",
          labelBoxBorderColor: "#30343d",
          labelTextColor: "#d6d7db",
          noteBkgColor: "#2a2620",
          noteBorderColor: "#5a4a2a",
          noteTextColor: "#e0d6c2",
          activationBkgColor: "#1c2028",
          activationBorderColor: "#40444d",
        },
        themeCSS: `
          .node rect, .node polygon, .actor, rect.actor { rx: 8px; ry: 8px; filter: none !important; }
          .node, .actor, g { filter: none !important; }
          .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #080a10 !important; color: #a3a4a9; }
          .edgeLabel rect { fill: #080a10 !important; opacity: 1; }
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
