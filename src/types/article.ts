import { z } from "zod";

import { slugSchema } from "@/lib/slug";

/** A calendar date in YYYY-MM-DD form that must also be a real date. */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, "Not a valid calendar date.");

const coverImageSchema = z.object({
  /** Path under /public, e.g. "/images/blog/cover.webp". */
  src: z.string().startsWith("/"),
  /** Meaningful alternative text. Required so images are never added without it. */
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/** Front matter of a Markdown file in `src/content/blog`. */
export const articleFrontmatterSchema = z
  .object({
    title: z.string().min(1).max(120),
    slug: slugSchema,
    description: z.string().min(20).max(200),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema.optional(),
    author: z.string().min(1).optional(),
    categories: z.array(z.string().min(1)).default([]),
    tags: z.array(z.string().min(1)).default([]),
    coverImage: coverImageSchema.optional(),
    /** Drafts are never listed, built, or added to the sitemap. */
    draft: z.boolean().default(false),
    /** Keep the page reachable but ask search engines not to index it. */
    noindex: z.boolean().default(false),
    /** Slugs of other articles to suggest at the end of this one. */
    related: z.array(slugSchema).default([]),
  })
  .refine((data) => !data.updatedAt || data.updatedAt >= data.publishedAt, {
    path: ["updatedAt"],
    message: "updatedAt cannot be earlier than publishedAt.",
  });

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export type Article = ArticleFrontmatter & {
  /** Raw Markdown body (front matter removed). */
  body: string;
};
