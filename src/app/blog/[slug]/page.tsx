import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/blog/article-card";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { profile } from "@/config/profile";
import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/articles";
import { buildMetadata } from "@/lib/metadata";
import {
  blogPostingSchema,
  breadcrumbSchema,
  personSchema,
  webPageSchema,
} from "@/lib/structured-data";
import { formatDate } from "@/lib/utils";

// Only articles that exist at build time are valid URLs; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
    type: "article",
    noindex: article.noindex,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
  });
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const path = `/blog/${article.slug}`;

  return (
    <>
      <JsonLd
        nodes={[
          personSchema(),
          webPageSchema({ path, name: article.title, description: article.description }),
          blogPostingSchema(article),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: article.title, path },
          ]),
        ]}
      />

      <Container size="narrow" className="py-16 sm:py-24">
        <article>
          <header>
            <p className="font-mono text-xs text-muted">
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              {article.updatedAt && article.updatedAt !== article.publishedAt ? (
                <span>
                  {" "}
                  &middot; Updated{" "}
                  <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </span>
              ) : null}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-pretty text-muted">{article.description}</p>
            <p className="mt-5 text-sm text-muted">By {article.author ?? profile.name}</p>
          </header>

          {article.coverImage ? (
            <Image
              src={article.coverImage.src}
              alt={article.coverImage.alt}
              width={article.coverImage.width}
              height={article.coverImage.height}
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="mt-10 h-auto w-full rounded-2xl border border-border"
            />
          ) : null}

          <div className="mt-10">
            <MarkdownContent source={article.body} />
          </div>
        </article>

        {related.length > 0 ? (
          <section aria-labelledby="related-heading" className="mt-20">
            <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
              Related articles
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <ArticleCard article={item} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
