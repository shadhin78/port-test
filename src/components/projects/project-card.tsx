import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { projectStatusLabels, type Project, type ProjectStatus } from "@/types/project";

const statusStyles: Record<ProjectStatus, string> = {
  planned: "text-muted",
  "in-progress": "text-warning",
  completed: "text-success",
};

/**
 * Status is always conveyed with text as well as colour. The dot is decorative.
 */
function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs tracking-wide uppercase",
        statusStyles[status],
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {projectStatusLabels[status]}
    </span>
  );
}

type ProjectCardProps = {
  project: Project;
  /** Heading level inside the card; h3 under a section's h2. */
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, headingLevel: Heading = "h3" }: ProjectCardProps) {
  const links = [
    project.repositoryUrl ? { label: "Source code", href: project.repositoryUrl } : null,
    project.liveUrl ? { label: "Live site", href: project.liveUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-primary/50 hover:bg-surface-elevated">
      <StatusBadge status={project.status} />
      <Heading className="mt-4 text-xl font-semibold tracking-tight">{project.title}</Heading>
      <p className="mt-2 text-sm text-pretty text-muted">{project.summary}</p>

      {project.tags.length > 0 ? (
        <ul aria-label="Technologies" className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {links.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {link.label}
                <span className="sr-only"> for {project.title} (opens in a new tab)</span>
                <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
