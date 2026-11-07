import type { MetadataRoute } from "next";

import { staticRoutes } from "@/config/navigation";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getArticles } from "@/lib/articles";

/**
 * Lists only canonical, indexable URLs:
 * - the static routes (the blog index is left out until it has articles, because
 *   an empty index is a low-value page and is marked noindex);
 * - published, indexable articles, with their real last-modified date.
 *
 * Nothing is listed on preview deployments. No `lastModified`, `priority` or
 * `changeFrequency` is invented for pages that have no real date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexable) return [];

  const articles = getArticles().filter((article) => !article.noindex);

  const pages = staticRoutes
    .filter((route) => route !== "/blog" || articles.length > 0)
    .map((route) => ({ url: absoluteUrl(route) }));

  const articleEntries = articles.map((article) => ({
    url: absoluteUrl(`/blog/${article.slug}`),
    lastModified: article.updatedAt ?? article.publishedAt,
  }));

  return [...pages, ...articleEntries];
}
