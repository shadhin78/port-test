import { describe, expect, it } from "vitest";

import {
  blogPostingSchema,
  breadcrumbSchema,
  buildGraph,
  personSchema,
  serializeJsonLd,
  webPageSchema,
  websiteSchema,
} from "@/lib/structured-data";
import type { Article } from "@/types/article";

const article: Article = {
  title: "Excel basics",
  slug: "excel-basics",
  description: "A short introduction to spreadsheets for accounting.",
  publishedAt: "2026-01-10",
  categories: ["Excel"],
  tags: ["excel", "accounting"],
  draft: false,
  noindex: false,
  related: [],
  body: "Body",
};

describe("serializeJsonLd", () => {
  it("escapes < so content cannot close the script tag", () => {
    const output = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(output).not.toContain("<");
    expect(output).toContain("\\u003c/script>");
  });

  it("escapes U+2028 and U+2029 line separators", () => {
    const output = serializeJsonLd({
      text: `a${String.fromCharCode(0x2028)}b${String.fromCharCode(0x2029)}c`,
    });
    expect(output).not.toContain(String.fromCharCode(0x2028));
    expect(output).not.toContain(String.fromCharCode(0x2029));
  });

  it("round-trips through JSON.parse", () => {
    const data = { a: 1, b: ["x", "</y>"] };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});

describe("personSchema", () => {
  const person = personSchema();

  it("uses verified profile details", () => {
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Ratul Islam Shadhin");
    expect(person.address).toMatchObject({ addressLocality: "Dhaka", addressCountry: "BD" });
  });

  it("does not invent employers, credentials, ratings or social profiles", () => {
    for (const forbidden of [
      "worksFor",
      "jobTitle",
      "alumniOf",
      "hasCredential",
      "award",
      "aggregateRating",
      "review",
      "email",
      "telephone",
    ]) {
      expect(person).not.toHaveProperty(forbidden);
    }
    // No social URLs are configured, so sameAs must be absent rather than empty.
    expect(person).not.toHaveProperty("sameAs");
  });
});

describe("page schemas", () => {
  it("links the website to its publisher and the page to the website", () => {
    const site = websiteSchema();
    const page = webPageSchema({ path: "/about", name: "About", description: "d" });
    expect(site.publisher).toEqual({ "@id": personSchema()["@id"] });
    expect(page.isPartOf).toEqual({ "@id": site["@id"] });
    expect(page.url).toMatch(/\/about$/);
  });

  it("numbers breadcrumb items from 1", () => {
    const crumbs = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]);
    const items = crumbs.itemListElement as { position: number; name: string }[];
    expect(items.map((item) => item.position)).toEqual([1, 2]);
    expect(items.map((item) => item.name)).toEqual(["Home", "Blog"]);
  });

  it("builds BlogPosting data only from article front matter", () => {
    const posting = blogPostingSchema(article);
    expect(posting["@type"]).toBe("BlogPosting");
    expect(posting.headline).toBe("Excel basics");
    expect(posting.datePublished).toBe("2026-01-10");
    // Falls back to the publication date when there is no modification date.
    expect(posting.dateModified).toBe("2026-01-10");
    expect(posting.url).toMatch(/\/blog\/excel-basics$/);
    expect(posting).not.toHaveProperty("image");
  });
});

describe("buildGraph", () => {
  it("wraps nodes in a schema.org @graph", () => {
    const graph = buildGraph([personSchema(), websiteSchema()]);
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"]).toHaveLength(2);
  });

  it("rejects an empty graph and nodes without a type", () => {
    expect(() => buildGraph([])).toThrow();
    expect(() => buildGraph([{} as never])).toThrow();
  });
});
