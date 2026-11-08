import { useState } from "react";
import type { Project } from "@/data/portfolio";

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-t border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5 text-left"
      >
        <span className="text-[0.65rem] text-muted-foreground">
          [{String(index + 1).padStart(2, "0")}]
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            pr. name
          </span>
          <span className="text-base tracking-tight text-foreground group-hover:underline">
            {project.name}
          </span>
        </span>
        <span className="flex items-baseline gap-2 text-[0.65rem] text-muted-foreground">
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
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`grid grid-cols-1 gap-4 pb-8 pl-[3.75rem] pr-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[1fr_1fr] ${
              open ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
              <span className="mr-2 text-foreground">[/&gt; info</span>
              {project.info}
            </p>
            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <span>client: {project.client}</span>
              <span>tech: {project.tech}</span>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-fit text-foreground underline underline-offset-4 hover:no-underline"
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
