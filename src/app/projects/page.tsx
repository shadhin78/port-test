import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/projects";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({ ...pageSeo.projects, path: "/projects" });

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({
            path: "/projects",
            name: pageSeo.projects.title,
            description: pageSeo.projects.description,
            type: "CollectionPage",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
        ]}
      />

      <Container className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Projects"
          title="Projects"
          description="Everything listed here is real, and each project shows its honest current status."
        />

        {projects.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-muted">
            No projects have been added yet.
          </p>
        )}
      </Container>
    </>
  );
}
