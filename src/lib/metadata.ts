import type { Metadata } from "next";

import { profile } from "@/config/profile";
import { defaultTitle, titleTemplate } from "@/config/seo";
import { siteConfig } from "@/config/site";

type BuildMetadataInput = {
  /** Page title without the site suffix. The homepage passes the default title. */
  title: string;
  description: string;
  /** Route path, e.g. "/about". Used for the canonical URL and og:url. */
  path: string;
  type?: "website" | "article";
  /** Ask search engines not to index this specific page. */
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

/** Apply the site's title template the same way the root layout does. */
export function formatTitle(title: string): string {
  return title === defaultTitle ? title : titleTemplate.replace("%s", title);
}

/** Robots directive for a page. Previews are always noindex. */
export function robotsFor(noindex = false): Metadata["robots"] {
  // Preview deployments: keep out of search entirely.
  if (!siteConfig.isIndexable) return { index: false, follow: false };
  // A single thin page: leave it out of the index but let crawlers follow its links.
  if (noindex) return { index: false, follow: true };
  return undefined;
}

/**
 * Build complete, consistent metadata for a route.
 *
 * Open Graph and Twitter objects replace (not merge with) the parent's, so every
 * field is supplied here to avoid accidentally losing values.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const fullTitle = formatTitle(title);
  const isHome = title === defaultTitle;

  return {
    title: isHome ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: robotsFor(noindex),
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: profile.name,
      locale: siteConfig.ogLocale,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
    },
  };
}
