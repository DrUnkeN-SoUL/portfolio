import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState, type ReactNode } from "react";
import { SiteNav } from "@mathews/ui";
import { AsciiPortrait, RevealText } from "@/components/AsciiPortrait";
import { IntroName, PixelNameMark } from "@/components/IntroName";
import { ProjectRow } from "@/components/ProjectRow";
import { bio, community, links, projects, roles } from "@/data/portfolio";
import { HOME_DESCRIPTION, HOME_TITLE, HOME_URL, KEYWORDS, PROFILE_JSON_LD } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { name: "keywords", content: KEYWORDS },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: HOME_URL },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: HOME_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(PROFILE_JSON_LD),
      },
    ],
  }),
  component: Index,
});

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-10 text-xs lowercase tracking-[0.4em] text-muted-foreground">{children}</h2>
  );
}

function Index() {
  const [introComplete, setIntroComplete] = useState(false);
  const [portraitActive, setPortraitActive] = useState(false);
  const startReveal = useCallback(() => setPortraitActive(true), []);

  const completeIntro = useCallback(() => {
    setPortraitActive(true);
    setIntroComplete(true);
  }, []);

  return (
    <main className="scanlines min-h-screen bg-background font-mono text-foreground">
      {!introComplete && <IntroName onComplete={completeIntro} onTransitionStart={startReveal} />}
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center bg-background py-6 text-xs tracking-[0.3em] text-muted-foreground">
          <PixelNameMark visible />
          <div className="flex items-baseline gap-4">
            <SiteNav current="portfolio" />
            <span className="hidden sm:inline">ind · utc+5:30</span>
          </div>
        </header>

        <section className="grid min-h-[calc(100svh-4rem)] grid-cols-1 content-center gap-10 py-6 md:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)] md:items-center md:gap-8 lg:gap-14">
          <div className="min-w-0 overflow-hidden">
            <AsciiPortrait active={portraitActive} />
          </div>
          <div className="min-w-0">
            <div className="mb-10 md:mb-12">
              <h1 className="hero-title text-xl md:text-[clamp(1.15rem,2.2vh,1.875rem)]">
                <RevealText active={portraitActive}>Mathews Shaji</RevealText>
                <span className="mt-2 block text-[0.65rem] leading-relaxed tracking-[0.2em] text-muted-foreground">
                  <RevealText active={portraitActive}>Full-Stack &amp; DevOps Engineer</RevealText>
                </span>
              </h1>
            </div>
            <SectionLabel>
              <RevealText active={portraitActive}>biography</RevealText>
            </SectionLabel>
            <div className="hero-bio max-w-xl text-[clamp(0.65rem,1.3vh,0.8rem)] leading-[1.8]">
              {bio.map((line, i) =>
                line === "" ? (
                  <div key={i} className="h-3 md:h-[1.5vh]" />
                ) : line === "Guinness World Record" ? (
                  <p key={i} className="text-yellow-500">
                    <RevealText active={portraitActive}>{line}</RevealText>
                  </p>
                ) : (
                  <p key={i}>
                    <RevealText active={portraitActive}>{line}</RevealText>
                  </p>
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
            Open to remote, full-time and contract work — backend, platform and full-stack roles.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel={link.rel === "me" ? "me noreferrer noopener" : "noreferrer noopener"}
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
