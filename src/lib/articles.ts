import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import yaml from "js-yaml";
import { z } from "zod";

import { articleFrontmatterSchema, type Article } from "@/types/article";

/** Articles are Markdown files named after their slug: `src/content/blog/<slug>.md`. */
export const BLOG_DIRECTORY = path.join(process.cwd(), "src", "content", "blog");

const rejectJavaScriptFrontMatter = () => {
  throw new Error("JavaScript front matter is disabled. Use YAML.");
};

/**
 * Parse front matter with YAML's JSON schema. The default schema turns an
 * unquoted `2026-01-10` into a JavaScript Date (and silently rolls an impossible
 * date such as `2026-02-31` over into March). The JSON schema keeps dates as
 * plain strings, so they are validated exactly as written.
 */
const parseYaml = (source: string): object =>
  (yaml.load(source, { schema: yaml.JSON_SCHEMA }) as object | null | undefined) ?? {};

/**
 * Parse and validate one article. Throws a descriptive error (which fails the
 * build) when the front matter is invalid or the slug does not match the file name.
 */
export function parseArticle(source: string, filename: string): Article {
  const { data, content } = matter(source, {
    // gray-matter can evaluate `---js` front matter. Content is plain data, so
    // that capability is switched off.
    engines: {
      yaml: { parse: parseYaml, stringify: () => "" },
      js: rejectJavaScriptFrontMatter,
      javascript: rejectJavaScriptFrontMatter,
    },
  });

  const result = articleFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid front matter in ${filename}:\n${z.prettifyError(result.error)}`);
  }

  const expectedSlug = filename.replace(/\.md$/, "");
  if (result.data.slug !== expectedSlug) {
    throw new Error(
      `Slug mismatch in ${filename}: front matter says "${result.data.slug}" but the file name implies "${expectedSlug}".`,
    );
  }

  return { ...result.data, body: content.trim() };
}

/** Newest first; ties are broken by slug so ordering is deterministic. */
export function sortArticles(articles: readonly Article[]): Article[] {
  return [...articles].sort(
    (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
  );
}

/** Load every non-draft article from a directory (missing directory means none). */
export function loadArticles(directory: string = BLOG_DIRECTORY): Article[] {
  if (!fs.existsSync(/*turbopackIgnore: true*/ directory)) return [];

  const articles = fs
    .readdirSync(/*turbopackIgnore: true*/ directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) =>
      parseArticle(
        fs.readFileSync(path.join(/*turbopackIgnore: true*/ directory, file), "utf8"),
        file,
      ),
    )
    .filter((article) => !article.draft);

  const slugs = new Set(articles.map((article) => article.slug));
  for (const article of articles) {
    for (const related of article.related) {
      if (!slugs.has(related)) {
        throw new Error(`Article "${article.slug}" lists unknown related article "${related}".`);
      }
    }
  }

  return sortArticles(articles);
}

export function getArticles(): Article[] {
  return loadArticles();
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((article) => article.slug === slug);
}

export function getLatestArticles(count: number): Article[] {
  return getArticles().slice(0, count);
}

/**
 * Related articles: explicitly listed ones first, then others sharing a tag or
 * category, newest first.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const all = getArticles().filter((candidate) => candidate.slug !== article.slug);
  const explicit = article.related.flatMap((slug) => all.filter((item) => item.slug === slug));
  const topics = new Set([...article.tags, ...article.categories]);
  const similar = all.filter(
    (item) =>
      !article.related.includes(item.slug) &&
      [...item.tags, ...item.categories].some((topic) => topics.has(topic)),
  );
  return [...explicit, ...similar].slice(0, limit);
}
