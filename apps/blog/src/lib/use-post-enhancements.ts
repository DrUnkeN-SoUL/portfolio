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
      // the blog tokens (#0c0e14 page, #12151d cards, soft blue-grey lines).
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
          background: "#0c0e14",
          primaryColor: "#1c2028",
          primaryBorderColor: "#343841",
          primaryTextColor: "#d6d7db",
          secondaryColor: "#1c2028",
          secondaryBorderColor: "#343841",
          tertiaryColor: "#171a21",
          tertiaryBorderColor: "#343841",
          lineColor: "#60636b",
          textColor: "#d0d1d4",
          edgeLabelBackground: "#0c0e14",
          clusterBkg: "#171a21",
          clusterBorder: "#343841",
          nodeTextColor: "#d6d7db",
          actorBkg: "#1c2028",
          actorBorder: "#343841",
          actorTextColor: "#d6d7db",
          actorLineColor: "#343841",
          signalColor: "#8a8c92",
          signalTextColor: "#d0d1d4",
          labelBoxBkgColor: "#1c2028",
          labelBoxBorderColor: "#343841",
          labelTextColor: "#d6d7db",
          noteBkgColor: "#2a2620",
          noteBorderColor: "#5a4a2a",
          noteTextColor: "#e0d6c2",
          activationBkgColor: "#21242d",
          activationBorderColor: "#444851",
        },
        themeCSS: `
          .node rect, .node polygon, .actor, rect.actor { rx: 8px; ry: 8px; filter: none !important; }
          .node, .actor, g { filter: none !important; }
          .edgeLabel, .edgeLabel p, .edgeLabel span { background-color: #0c0e14 !important; color: #a3a4a9; }
          .edgeLabel rect { fill: #0c0e14 !important; opacity: 1; }
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
