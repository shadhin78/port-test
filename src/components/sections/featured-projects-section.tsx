import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/types/project";

type FeaturedProjectsSectionProps = {
  projects: readonly Project[];
};

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  return (
    <section aria-labelledby="featured-projects-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="featured-projects-heading"
          eyebrow="Projects"
          title="Featured projects"
          description="What I'm building right now. More projects will be added here as they are completed."
        />

        {projects.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-muted">
            No projects to show yet.
          </p>
        )}

        <Link
          href="/projects"
          className="mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-primary hover:underline"
        >
          All projects
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Container>
    </section>
  );
}
