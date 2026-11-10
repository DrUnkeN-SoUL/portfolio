import { SITE } from "@mathews/ui";

/**
 * Link-preview bots do not run JavaScript or resolve relative URLs, so every URL here is absolute
 * and the tags are prerendered.
 */
export const BLOG_NAME = "Mathews Shaji — writing";
export const BLOG_URL = `${SITE.blog}/`;
export const BLOG_DESCRIPTION =
  "Notes on backend systems, data pipelines, cloud infrastructure and the occasional side project.";

export const OG_IMAGE = `${SITE.blog}/og-blog.png`;
export const OG_IMAGE_ALT = "Mathews Shaji — notes from the backend, dark monospace card";

/** The same Person node the portfolio publishes, so both sites agree on the author. */
export const PERSON_ID = `${SITE.portfolio}/#person`;
export const BLOG_ID = `${SITE.blog}/#blog`;

export type MetaTag =
  { title: string } | { name: string; content: string } | { property: string; content: string };

export function pageMeta({
  title,
  description,
  url,
  image = OG_IMAGE,
  imageAlt = OG_IMAGE_ALT,
  imageSize = { width: 1200, height: 630, type: "image/png" },
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  /** The default card is exactly 1200x630; pass null when the image is a post cover. */
  imageSize?: { width: number; height: number; type: string } | null;
}): MetaTag[] {
  const tags: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:secure_url", content: image },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  if (imageSize) {
    tags.push(
      { property: "og:image:type", content: imageSize.type },
      { property: "og:image:width", content: String(imageSize.width) },
      { property: "og:image:height", content: String(imageSize.height) },
    );
  }

  return tags;
}

export const BLOG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": BLOG_ID,
  name: BLOG_NAME,
  description: BLOG_DESCRIPTION,
  url: BLOG_URL,
  inLanguage: "en",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
};
