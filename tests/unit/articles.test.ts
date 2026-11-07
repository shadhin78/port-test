import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { loadArticles, parseArticle, sortArticles } from "@/lib/articles";

function post(overrides: Record<string, string> = {}, body = "Hello **world**.") {
  const fields: Record<string, string> = {
    title: "Excel basics",
    slug: "excel-basics",
    description: "A short introduction to spreadsheets for accounting.",
    publishedAt: "2026-01-10",
    ...overrides,
  };
  const frontMatter = Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return `---\n${frontMatter}\n---\n${body}\n`;
}

describe("parseArticle", () => {
  it("parses valid front matter and applies defaults", () => {
    const article = parseArticle(post(), "excel-basics.md");
    expect(article).toMatchObject({
      title: "Excel basics",
      slug: "excel-basics",
      publishedAt: "2026-01-10",
      draft: false,
      noindex: false,
      categories: [],
      tags: [],
      related: [],
    });
    expect(article.body).toBe("Hello **world**.");
  });

  it("rejects an invalid or impossible date", () => {
    expect(() => parseArticle(post({ publishedAt: "2026-02-31" }), "excel-basics.md")).toThrow(
      /publishedAt/,
    );
    expect(() => parseArticle(post({ publishedAt: "10/01/2026" }), "excel-basics.md")).toThrow(
      /publishedAt/,
    );
  });

  it("rejects a modification date before the publication date", () => {
    expect(() => parseArticle(post({ updatedAt: "2025-12-31" }), "excel-basics.md")).toThrow(
      /updatedAt/,
    );
  });

  it("rejects slugs that are not lowercase kebab-case", () => {
    expect(() => parseArticle(post({ slug: "Excel_Basics" }), "Excel_Basics.md")).toThrow(/slug/i);
  });

  it("rejects a slug that does not match the file name", () => {
    expect(() => parseArticle(post({ slug: "other-name" }), "excel-basics.md")).toThrow(
      /Slug mismatch/,
    );
  });

  it("rejects a too-short description", () => {
    expect(() => parseArticle(post({ description: "Too short" }), "excel-basics.md")).toThrow(
      /description/,
    );
  });

  it("refuses to evaluate JavaScript front matter", () => {
    const source = `---js\n({ title: "x" })\n---\nBody\n`;
    expect(() => parseArticle(source, "excel-basics.md")).toThrow();
  });
});

describe("sortArticles", () => {
  it("orders newest first and breaks ties by slug", () => {
    const make = (slug: string, publishedAt: string) =>
      parseArticle(post({ slug, publishedAt }), `${slug}.md`);
    const sorted = sortArticles([
      make("b-post", "2026-01-01"),
      make("c-post", "2026-03-01"),
      make("a-post", "2026-01-01"),
    ]);
    expect(sorted.map((article) => article.slug)).toEqual(["c-post", "a-post", "b-post"]);
  });
});

describe("loadArticles", () => {
  let directory: string;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "articles-"));
  });

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  const write = (slug: string, overrides: Record<string, string> = {}) =>
    fs.writeFileSync(path.join(directory, `${slug}.md`), post({ slug, ...overrides }));

  it("returns an empty list for a missing directory", () => {
    expect(loadArticles(path.join(directory, "does-not-exist"))).toEqual([]);
  });

  it("returns an empty list for an empty directory", () => {
    expect(loadArticles(directory)).toEqual([]);
  });

  it("excludes drafts, ignores non-markdown files, and sorts newest first", () => {
    write("older", { publishedAt: "2026-01-01" });
    write("newer", { publishedAt: "2026-02-01" });
    write("secret-draft", { draft: "true" });
    fs.writeFileSync(path.join(directory, "notes.txt"), "not an article");

    expect(loadArticles(directory).map((article) => article.slug)).toEqual(["newer", "older"]);
  });

  it("fails loudly when a related slug does not exist", () => {
    write("only-post", { related: "[ghost-post]" });
    expect(() => loadArticles(directory)).toThrow(/unknown related article "ghost-post"/);
  });

  it("accepts related slugs that exist", () => {
    write("first-post", { related: "[second-post]" });
    write("second-post");
    expect(loadArticles(directory)).toHaveLength(2);
  });
});
