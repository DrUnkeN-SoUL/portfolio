import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AsciiPortrait } from "@/components/AsciiPortrait";
import { IntroName, PixelNameMark } from "@/components/IntroName";
import { ProjectRow } from "@/components/ProjectRow";
import { bio, community, links, projects, roles } from "@/data/portfolio";

const title = "Mathews Shaji — Backend-leaning full-stack developer";
const description =
  "Mathews Shaji builds data pipelines, multi-tenant APIs and cloud infrastructure across AWS, GCP and Azure. Python, Go and Rust.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:site_name", content: "Mathews Shaji" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Mathews Shaji — pixel M favicon mark, black and amber",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "/twitter-image.png" },
      {
        name: "twitter:image:alt",
        content: "Mathews Shaji — pixel M favicon mark, black and amber",
      },
      {
        name: "keywords",
        content:
          "Mathews Shaji, full-stack developer, backend developer, DevOps engineer, Python, Go, Rust, FastAPI, TypeScript, AWS, GCP, Azure, multi-tenant APIs, data pipelines, cloud infrastructure, observability",
      },
      { name: "theme-color", content: "#0d0d0d" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Mathews Shaji" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Mathews Shaji",
          jobTitle: "Backend-leaning full-stack developer",
          description: description,
          url: "/",
          image: "/og-image.png",
          sameAs: ["https://github.com/DrUnkeN-SoUL", "https://linkedin.com/in/mathews-shaji"],
          knowsAbout: [
            "Python",
            "Go",
            "Rust",
            "FastAPI",
            "TypeScript",
            "AWS",
            "GCP",
            "Azure",
            "DevOps",
            "Cloud Infrastructure",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="mb-10 text-xs lowercase tracking-[0.4em] text-muted-foreground">{children}</h2>
  );
}

function Index() {
  const [introComplete, setIntroComplete] = useState(false);

  const completeIntro = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <main className="scanlines min-h-screen bg-background font-mono text-foreground">
      {!introComplete && <IntroName onComplete={completeIntro} />}
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center bg-background py-6 text-xs tracking-[0.3em] text-muted-foreground">
          <PixelNameMark visible />
          <span>ind · utc+5:30</span>
        </header>

        <section className="grid min-h-[calc(100svh-4rem)] grid-cols-1 content-center gap-10 py-6 md:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)] md:items-center md:gap-8 lg:gap-14">
          <div className="min-w-0 overflow-hidden">
            <AsciiPortrait />
          </div>
          <div className="min-w-0">
            <div className="mb-10 md:mb-12">
              <h1 className="text-xl md:text-[clamp(1.15rem,2.2vh,1.875rem)]">Mathews Shaji</h1>
              <p className="mt-2 text-[0.65rem] leading-relaxed tracking-[0.2em] text-muted-foreground">
                backend-leaning full-stack developer
              </p>
            </div>
            <SectionLabel>biography</SectionLabel>
            <div className="max-w-xl text-[clamp(0.65rem,1.3vh,0.8rem)] leading-[1.8]">
              {bio.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-3 md:h-[1.5vh]" />
                ) : line === "Guinness World Record" ? (
                  <p key={i} className="text-yellow-500">
                    {line}
                  </p>
                ) : (
                  <p key={i}>{line}</p>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <SectionLabel>journey</SectionLabel>
          <ul className="flex flex-col">
            {roles.map((role) => (
              <li
                key={role.title + role.period}
                className="grid grid-cols-1 gap-2 border-t border-border py-6 md:grid-cols-[12rem_1fr] md:gap-8"
              >
                <span className="text-[0.7rem] tracking-[0.2em] text-muted-foreground">
                  {role.period}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="text-sm">{role.title}</span>
                  <span className="text-xs text-muted-foreground">{role.org}</span>
                  <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
                    {role.line}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-24 md:py-32">
          <SectionLabel>projects</SectionLabel>
          <ul className="flex flex-col border-b border-border">
            {projects.map((project, i) => (
              <ProjectRow key={project.name} project={project} index={i} />
            ))}
          </ul>
        </section>

        <section className="py-24 md:py-32">
          <SectionLabel>community</SectionLabel>
          <ul className="flex flex-col">
            {community.map((item) => (
              <li
                key={item}
                className="grid grid-cols-[2rem_1fr] items-baseline gap-2 border-t border-border py-5"
              >
                <span className="text-[0.65rem] text-muted-foreground">▸</span>
                <p className="max-w-prose text-xs leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-24 md:py-32">
          <SectionLabel>contact</SectionLabel>
          <p className="max-w-md text-sm leading-8">
            Open to backend, infrastructure and full-stack work.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4 hover:no-underline"
                >
                  {link.label} →
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="flex items-baseline justify-between border-t border-border py-8 text-[0.65rem] tracking-[0.3em] text-muted-foreground">
          <span>© {new Date().getFullYear()} mathews shaji</span>
          <span>end of file</span>
        </footer>
      </div>
    </main>
  );
}
