import { profile } from "@/config/profile";

/**
 * Resolve the canonical origin of the site from one place.
 *
 * Order of precedence:
 * 1. `NEXT_PUBLIC_SITE_URL`: set this to your verified production domain.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL`: the production hostname Vercel assigns to
 *    the project (provided automatically at build time, no protocol).
 * 3. `http://localhost:3000` for local development only.
 *
 * No domain is invented: if neither variable is set, `isSiteUrlConfigured` is
 * `false` and the sitemap reference in robots.txt is omitted.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): {
  url: string;
  isConfigured: boolean;
} {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return { url: new URL(explicit).origin, isConfigured: true };
  }

  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    return { url: new URL(`https://${vercelHost}`).origin, isConfigured: true };
  }

  return { url: "http://localhost:3000", isConfigured: false };
}

const resolved = resolveSiteUrl(process.env);

export const siteConfig = {
  name: profile.name,
  shortName: profile.shortName,
  /** Name of the project, used in the manifest and as the OG site name. */
  title: "Shadhin — Personal Portfolio & Blog",
  url: resolved.url,
  isUrlConfigured: resolved.isConfigured,
  /** Document language. Add more locales only when real translated pages exist. */
  language: "en",
  ogLocale: "en_US",
  themeColor: "#0b0d13",
  /**
   * Preview deployments must never be indexed. Production (and local) can be.
   */
  isIndexable: process.env.VERCEL_ENV !== "preview",
  /** `@handle` for Twitter/X cards, or `null` if there is no account. */
  twitterHandle: null as string | null,
} as const;

/** Build an absolute URL for a site path such as "/about". */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
