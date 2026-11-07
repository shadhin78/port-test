import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are never crawled.
  if (!siteConfig.isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    // Only advertise the sitemap once the real production URL is configured, so a
    // placeholder or localhost address is never published.
    ...(siteConfig.isUrlConfigured ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
