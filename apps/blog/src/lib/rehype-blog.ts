/**
 * Runs after rehype-slug (headings need ids) and before Shiki (mermaid blocks
 * are pulled out before highlighting). Authoring syntax: see README.md.
 */

type Text = { type: "text"; value: string };
type Element = {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: Node[];
};
type Node = Text | Element | { type: string; children?: Node[] };
type Root = { type: "root"; children: Node[] };

const isElement = (node: Node | undefined, tag?: string): node is Element =>
  node?.type === "element" && (tag === undefined || (node as Element).tagName === tag);

const el = (
  tagName: string,
  properties: Record<string, unknown>,
  children: Node[] = [],
): Element => ({
  type: "element",
  tagName,
  properties,
  children,
});

const text = (value: string): Text => ({ type: "text", value });

function textContent(node: Node): string {
  if (node.type === "text") return (node as Text).value;
  return (node as { children?: Node[] }).children?.map(textContent).join("") ?? "";
}

function embedUrl(src: string): string | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  let id: string | null = null;
  if (host === "youtube.com" || host === "m.youtube.com") {
    id = url.pathname.startsWith("/shorts/")
      ? (url.pathname.split("/")[2] ?? null)
      : url.searchParams.get("v");
  } else if (host === "youtu.be") {
    id = url.pathname.slice(1);
  }
  if (id && /^[\w-]{6,}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  if (host === "vimeo.com") {
    const vimeoId = url.pathname.split("/")[1];
    if (vimeoId && /^\d+$/.test(vimeoId)) return `https://player.vimeo.com/video/${vimeoId}?dnt=1`;
  }
  return null;
}

/** null means "leave it as an image". */
function toMedia(img: Element): Element | null {
  const src = String(img.properties["src"] ?? "");
  const label = String(img.properties["alt"] ?? "");

  if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src)) {
    return el(
      "video",
      {
        src,
        controls: true,
        playsInline: true,
        preload: "metadata",
        ariaLabel: label || undefined,
      },
      [text(label)],
    );
  }

  const embed = embedUrl(src);
  if (embed) {
    return el("div", { className: ["post-embed"] }, [
      el("iframe", {
        src: embed,
        title: label || "Embedded video",
        loading: "lazy",
        allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
        allowFullScreen: true,
        referrerPolicy: "strict-origin-when-cross-origin",
      }),
    ]);
  }

  img.properties["loading"] = "lazy";
  img.properties["decoding"] = "async";
  return null;
}

function transformLink(link: Element) {
  const href = String(link.properties["href"] ?? "");
  const title = typeof link.properties["title"] === "string" ? link.properties["title"] : "";
  let newTab: boolean;

  if (title.startsWith("newtab:") || title.startsWith("sametab:")) {
    newTab = title.startsWith("newtab:");
    const rest = title.replace(/^(newtab|sametab):\s*/, "");
    if (rest) link.properties["title"] = rest;
    else delete link.properties["title"];
  } else if (href.startsWith("#") || href.startsWith("/")) {
    newTab = false;
  } else {
    try {
      const url = new URL(href);
      newTab =
        /^https?:$/.test(url.protocol) &&
        !["blog.mathewsshaji.com", "mathewsshaji.com", "www.mathewsshaji.com"].includes(
          url.hostname,
        );
    } catch {
      newTab = false;
    }
  }

  if (newTab) {
    link.properties["target"] = "_blank";
    link.properties["rel"] = ["noopener", "noreferrer"];
    link.properties["className"] = ["external"];
  }
}

function walk(parent: Root | Element) {
  parent.children = parent.children.map((child) => {
    if (!isElement(child)) return child;

    if (child.tagName === "pre" && isElement(child.children[0], "code")) {
      const code = child.children[0];
      const classes = (code.properties["className"] as string[] | undefined) ?? [];
      if (classes.includes("language-mermaid")) {
        return el("figure", { className: ["post-diagram"] }, [
          el("pre", { className: ["mermaid"] }, [text(textContent(code))]),
        ]);
      }
      return child;
    }

    if (child.tagName === "p") {
      const meaningful = child.children.filter(
        (node) => !(node.type === "text" && !(node as Text).value.trim()),
      );
      const only = meaningful[0];
      if (meaningful.length === 1 && isElement(only, "img")) {
        const media = toMedia(only) ?? only;
        const title = only.properties["title"];
        const caption =
          typeof title === "string" && title
            ? title
            : media.tagName !== "img"
              ? String(only.properties["alt"] ?? "")
              : "";
        delete only.properties["title"];
        return el(
          "figure",
          { className: ["post-media"] },
          caption ? [media, el("figcaption", {}, [text(caption)])] : [media],
        );
      }
    }

    // Tables scroll inside a rounded frame instead of overflowing the column.
    if (child.tagName === "table") {
      return el("div", { className: ["post-table"] }, [child]);
    }

    if (child.tagName === "img") return toMedia(child) ?? child;
    if (child.tagName === "a") transformLink(child);

    if ((child.tagName === "h2" || child.tagName === "h3") && child.properties["id"]) {
      walk(child);
      child.children.push(
        el(
          "a",
          {
            href: `#${String(child.properties["id"])}`,
            className: ["heading-anchor"],
            ariaLabel: "Link to this section",
          },
          [text("#")],
        ),
      );
      return child;
    }

    walk(child);
    return child;
  });
}

export function rehypeBlog() {
  return (tree: Root) => {
    walk(tree);
  };
}
