import { z } from "zod";

import { slugSchema } from "@/lib/slug";

export const projectStatusSchema = z.enum(["planned", "in-progress", "completed"]);

const optionalUrl = z
  .url({ protocol: /^https?$/ })
  .nullable()
  .default(null);

export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(100),
  summary: z.string().min(10).max(240),
  status: projectStatusSchema,
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  repositoryUrl: optionalUrl,
  liveUrl: optionalUrl,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectStatusLabels: Record<ProjectStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  completed: "Completed",
};
