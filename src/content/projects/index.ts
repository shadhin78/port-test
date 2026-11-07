import type { z } from "zod";

import type { projectSchema } from "@/types/project";

/**
 * Project data. Add genuine projects here; they are validated at build time by
 * `src/lib/projects.ts`. Only list work that actually exists, and keep `status`
 * honest ("planned", "in-progress" or "completed").
 */
export const projectEntries: z.input<typeof projectSchema>[] = [
  {
    slug: "portfolio-website",
    title: "Personal portfolio & blog",
    summary:
      "This website: a fast, accessible and SEO-ready portfolio and blog. It is being built in phases, starting with the foundation.",
    status: "in-progress",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
];
