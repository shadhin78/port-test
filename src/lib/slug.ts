import { z } from "zod";

/** Lowercase kebab-case: "my-first-post", "excel-tips-2026". */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(SLUG_PATTERN, "Slug must be lowercase kebab-case (a-z, 0-9, hyphens).");
