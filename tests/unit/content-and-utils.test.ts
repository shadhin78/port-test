import { describe, expect, it } from "vitest";

import { mainNavigation, staticRoutes } from "@/config/navigation";
import { profile } from "@/config/profile";
import { getActiveSocials, getPrimaryContact } from "@/lib/contact";
import { getFeaturedProjects, getProjects, parseProjects } from "@/lib/projects";
import { slugSchema } from "@/lib/slug";
import { cn, formatDate, isActivePath, isExternalHref } from "@/lib/utils";

describe("getPrimaryContact", () => {
  it("returns null when nothing is configured, so the UI shows a truthful fallback", () => {
    expect(getPrimaryContact({ email: null }, [{ label: "GitHub", url: null }])).toBeNull();
    expect(getPrimaryContact(profile.contact, profile.socials)).toBeNull();
  });

  it("prefers email, then the first social link that has a URL", () => {
    expect(getPrimaryContact({ email: "a@b.test" }, [])).toEqual({
      label: "Send an email",
      href: "mailto:a@b.test",
      external: true,
    });
    expect(
      getPrimaryContact({ email: null }, [
        { label: "GitHub", url: null },
        { label: "LinkedIn", url: "https://linkedin.test/in/x" },
      ]),
    ).toMatchObject({ label: "Message on LinkedIn", href: "https://linkedin.test/in/x" });
  });

  it("lists only socials that have a URL", () => {
    expect(
      getActiveSocials([
        { label: "A", url: null },
        { label: "B", url: "https://b.test" },
      ]),
    ).toEqual([{ label: "B", url: "https://b.test" }]);
  });
});

describe("projects", () => {
  const valid = {
    slug: "demo",
    title: "Demo",
    summary: "A short demo summary.",
    status: "planned",
  };

  it("ships only genuine, honestly labelled projects", () => {
    const projects = getProjects();
    expect(projects.length).toBeGreaterThan(0);
    // No project may claim to be completed until real work is added.
    expect(projects.every((project) => project.status !== "completed")).toBe(true);
    expect(getFeaturedProjects().every((project) => project.featured)).toBe(true);
  });

  it("applies defaults and rejects invalid entries", () => {
    expect(parseProjects([valid as never])[0]).toMatchObject({
      tags: [],
      featured: false,
      repositoryUrl: null,
      liveUrl: null,
    });
    expect(() => parseProjects([{ ...valid, status: "launched" } as never])).toThrow();
    expect(() => parseProjects([{ ...valid, slug: "Bad Slug" } as never])).toThrow();
    expect(() => parseProjects([{ ...valid, liveUrl: "javascript:alert(1)" } as never])).toThrow();
  });

  it("rejects duplicate slugs", () => {
    expect(() => parseProjects([valid as never, valid as never])).toThrow(/Duplicate project slug/);
  });
});

describe("slugSchema", () => {
  it("accepts lowercase kebab-case and rejects everything else", () => {
    for (const ok of ["a", "my-post", "excel-2026", "a1-b2"]) {
      expect(slugSchema.safeParse(ok).success).toBe(true);
    }
    for (const bad of [
      "",
      "My-Post",
      "my_post",
      "-lead",
      "trail-",
      "double--dash",
      "sp ace",
      "a/b",
    ]) {
      expect(slugSchema.safeParse(bad).success).toBe(false);
    }
  });
});

describe("navigation", () => {
  it("has unique, lowercase, short URLs", () => {
    const hrefs = mainNavigation.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) expect(href).toMatch(/^\/[a-z]+(?:-[a-z]+)*$/);
  });

  it("includes the homepage and every nav route in the static routes", () => {
    expect(staticRoutes).toEqual(["/", "/about", "/projects", "/blog", "/contact"]);
  });

  it("marks a route and its children as active, but not look-alike prefixes", () => {
    expect(isActivePath("/blog", "/blog")).toBe(true);
    expect(isActivePath("/blog/my-post", "/blog")).toBe(true);
    expect(isActivePath("/blogging", "/blog")).toBe(false);
    expect(isActivePath("/", "/about")).toBe(false);
  });
});

describe("utils", () => {
  it("joins only truthy class names", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("formats dates identically regardless of the machine time zone", () => {
    expect(formatDate("2026-01-05")).toBe("5 January 2026");
    expect(formatDate("2026-12-31")).toBe("31 December 2026");
  });

  it("detects external hrefs", () => {
    for (const external of ["https://a.test", "mailto:a@b.test", "//cdn.test/x", "tel:123"]) {
      expect(isExternalHref(external)).toBe(true);
    }
    for (const internal of ["/about", "#section", "relative/path"]) {
      expect(isExternalHref(internal)).toBe(false);
    }
  });
});

describe("profile", () => {
  it("does not expose private contact details or unverified claims by default", () => {
    expect(profile.contact.email).toBeNull();
    expect(profile.socials.every((social) => social.url === null)).toBe(true);
    expect(profile.education.affiliation).toBeNull();
    expect(profile.education.level).toBe("BBA student");
  });
});
