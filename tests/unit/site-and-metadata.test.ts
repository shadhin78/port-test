import { describe, expect, it } from "vitest";

import { defaultTitle } from "@/config/seo";
import { resolveSiteUrl } from "@/config/site";
import { buildMetadata, formatTitle } from "@/lib/metadata";

describe("resolveSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and normalises it to an origin", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://example.com/some/path/",
        VERCEL_PROJECT_PRODUCTION_URL: "ignored.vercel.app",
      }),
    ).toEqual({ url: "https://example.com", isConfigured: true });
  });

  it("falls back to the Vercel production hostname", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "my-site.vercel.app" })).toEqual({
      url: "https://my-site.vercel.app",
      isConfigured: true,
    });
  });

  it("uses localhost and reports unconfigured when nothing is set (no invented domain)", () => {
    expect(resolveSiteUrl({})).toEqual({ url: "http://localhost:3000", isConfigured: false });
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "   " }).isConfigured).toBe(false);
  });

  it("throws on a malformed URL instead of publishing a broken canonical", () => {
    expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "not a url" })).toThrow();
  });
});

describe("buildMetadata", () => {
  const input = { title: "About", description: "About this site.", path: "/about" };

  it("sets a relative canonical and matching Open Graph URL", () => {
    const meta = buildMetadata(input);
    expect(meta.alternates?.canonical).toBe("/about");
    expect(meta.openGraph).toMatchObject({ url: "/about", type: "website" });
  });

  it("applies the title template to social titles but not the base title", () => {
    const meta = buildMetadata(input);
    expect(meta.title).toBe("About");
    expect(meta.openGraph?.title).toBe("About | Ratul Islam Shadhin");
    expect(meta.twitter?.title).toBe("About | Ratul Islam Shadhin");
  });

  it("uses the full default title as an absolute title on the homepage", () => {
    const meta = buildMetadata({ title: defaultTitle, description: "Home.", path: "/" });
    expect(meta.title).toEqual({ absolute: defaultTitle });
    expect(formatTitle(defaultTitle)).toBe(defaultTitle);
  });

  it("only sets robots when a page opts out of indexing", () => {
    expect(buildMetadata(input).robots).toBeUndefined();
    expect(buildMetadata({ ...input, noindex: true }).robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("includes article dates only for article pages", () => {
    const article = buildMetadata({
      ...input,
      type: "article",
      publishedTime: "2026-01-10",
      modifiedTime: "2026-01-12",
    });
    expect(article.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-01-10",
      modifiedTime: "2026-01-12",
    });
    expect(buildMetadata(input).openGraph).not.toHaveProperty("publishedTime");
  });

  it("uses the large-image Twitter card", () => {
    expect(buildMetadata(input).twitter).toMatchObject({ card: "summary_large_image" });
  });
});
