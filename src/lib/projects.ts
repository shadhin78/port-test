import type { z } from "zod";

import { projectEntries } from "@/content/projects";
import { projectSchema, type Project } from "@/types/project";

/** Validate a list of raw project entries and reject duplicate slugs. */
export function parseProjects(entries: z.input<typeof projectSchema>[]): Project[] {
  const projects = entries.map((entry) => projectSchema.parse(entry));

  const seen = new Set<string>();
  for (const project of projects) {
    if (seen.has(project.slug)) {
      throw new Error(`Duplicate project slug: "${project.slug}".`);
    }
    seen.add(project.slug);
  }

  return projects;
}

export function getProjects(): Project[] {
  return parseProjects(projectEntries);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}
