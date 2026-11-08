import { SITE } from "@mathews/ui";

import { skills } from "@/data/portfolio";

/**
 * Homepage SEO. Everything here is server-rendered — crawlers and link-preview
 * bots do not run the client bundle, so absolute URLs matter.
 */
export const SITE_NAME = "Mathews Shaji";
export const HOME_URL = `${SITE.portfolio}/`;
export const PERSON_ID = `${SITE.portfolio}/#person`;
export const WEBSITE_ID = `${SITE.portfolio}/#website`;
export const PROFILE_PAGE_ID = `${SITE.portfolio}/#webpage`;

export const HOME_TITLE = "Mathews Shaji — Full-Stack & DevOps Engineer, Kochi, India";

export const HOME_DESCRIPTION =
  "Full-stack developer and DevOps engineer in Kochi, Kerala, India. Python, Go and FastAPI backend work, AWS, GCP and Azure. Open to remote and contract roles.";

export const OG_IMAGE = `${SITE.portfolio}/og-image.png`;
export const OG_IMAGE_ALT = "Mathews Shaji — pixel M mark on a black background";

export const KEYWORDS = [
  "Mathews Shaji",
  "full-stack developer",
  "full stack engineer",
  "DevOps engineer",
  "backend developer",
  "Python developer",
  "FastAPI developer",
  "Go developer",
  "cloud engineer",
  "AWS",
  "GCP",
  "Azure",
  "platform engineer",
  "SRE",
  "remote",
  "contract",
  "Kochi",
  "Kerala",
  "India",
].join(", ");

export const GITHUB_URL = "https://github.com/DrUnkeN-SoUL";
export const LINKEDIN_URL = "https://linkedin.com/in/mathews-shaji";
export const EMAIL = "mail@mathewsshaji.com";
export const RSS_URL = `${SITE.blog}/rss.xml`;

/** schema.org graph for the homepage: who he is, the site, and this profile page. */
export const PROFILE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      jobTitle: "Full-Stack & DevOps Engineer",
      description: HOME_DESCRIPTION,
      url: HOME_URL,
      email: `mailto:${EMAIL}`,
      image: OG_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kochi",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      sameAs: [GITHUB_URL, LINKEDIN_URL],
      knowsAbout: skills,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Mahatma Gandhi University",
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: HOME_URL,
      name: SITE_NAME,
      description: HOME_DESCRIPTION,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": PROFILE_PAGE_ID,
      url: HOME_URL,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
    },
  ],
};
