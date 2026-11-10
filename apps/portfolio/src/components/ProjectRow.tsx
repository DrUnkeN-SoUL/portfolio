import { useState } from "react";
import type { Project } from "@/data/portfolio";

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-3 py-5 text-left focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground/60 md:grid-cols-[3rem_1fr_auto] md:gap-4"
      >
        <span className="text-xs text-muted-foreground">
          [{String(index + 1).padStart(2, "0")}]
        </span>
        <span className="flex flex-col gap-1.5">
          <span className="text-base tracking-tight text-foreground group-hover:underline">
            {project.name}
          </span>
          <span className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            {project.client}
          </span>
        </span>
        <span className="flex items-baseline gap-2 text-xs text-muted-foreground">
          {project.year}
          <span
            aria-hidden="true"
            className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "rotate-45" : "rotate-0"}`}
          >
            +
          </span>
        </span>
      </button>

      <div
        // Closed rows stay mounted for the animation; inert keeps their links unfocusable.
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`grid grid-cols-1 gap-4 pb-8 pl-[3rem] pr-2 transition-transform md:pl-[4rem] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[1fr_1fr] ${
              open ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            <p className="max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground">
              <span className="mr-2 text-foreground">[/&gt; info</span>
              {project.info}
            </p>
            <div className="flex flex-col gap-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              <span>tech: {project.tech}</span>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tap-area w-fit text-foreground underline underline-offset-4 hover:no-underline"
                >
                  {project.urlLabel ?? project.url} →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
