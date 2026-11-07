import { z } from "zod";

import { profile } from "@/config/profile";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { Article } from "@/types/article";

/**
 * Schema.org JSON-LD builders. Every value comes from the profile or site
 * configuration (verified information only) so the markup always matches the
 * visible content. Nothing here fabricates ratings, reviews, employers or
 * credentials.
 */

type JsonLdNode = { "@type": string; "@id"?: string } & Record<string, unknown>;

export const personId = () => `${absoluteUrl("/")}#person`;
export const websiteId = () => `${absoluteUrl("/")}#website`;

export function personSchema(): JsonLdNode {
  const sameAs = profile.socials
    .map((social) => social.url)
    .filter((url): url is string => Boolean(url));

  return {
    "@type": "Person",
    "@id": personId(),
    name: profile.name,
    url: absoluteUrl("/"),
    description: profile.summary,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressCountry: profile.location.countryCode,
    },
    knowsAbout: [...profile.interests.professional, ...profile.interests.technical],
    knowsLanguage: profile.languages.map((language) => language.code),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    name: siteConfig.title,
    url: absoluteUrl("/"),
    inLanguage: siteConfig.language,
    publisher: { "@id": personId() },
  };
}

export function webPageSchema(input: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}): JsonLdNode {
  const url = absoluteUrl(input.path);
  return {
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": websiteId() },
  };
}

export function breadcrumbSchema(items: readonly { name: string; path: string }[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Ready for future `/blog/[slug]` pages. Uses only fields from validated front matter. */
export function blogPostingSchema(article: Article): JsonLdNode {
  const url = absoluteUrl(`/blog/${article.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: siteConfig.language,
    author: { "@id": personId() },
    publisher: { "@id": personId() },
    ...(article.coverImage ? { image: absoluteUrl(article.coverImage.src) } : {}),
    ...(article.tags.length > 0 ? { keywords: article.tags.join(", ") } : {}),
    ...(article.categories[0] ? { articleSection: article.categories[0] } : {}),
  };
}

const graphSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@graph": z.array(z.looseObject({ "@type": z.string().min(1) })).min(1),
});

/** Combine nodes into one `@graph` document, checking its basic structure. */
export function buildGraph(nodes: readonly JsonLdNode[]) {
  return graphSchema.parse({ "@context": "https://schema.org", "@graph": nodes });
}

/**
 * Serialize JSON-LD for embedding in a `<script>` tag. Escaping `<` prevents a
 * string such as `</script>` in content from breaking out of the tag (XSS), and
 * the line separators U+2028/U+2029 are escaped for older parsers.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
