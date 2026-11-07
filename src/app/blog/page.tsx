import type { Metadata } from "next";

import { ArticleCard } from "@/components/blog/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageSeo } from "@/config/seo";
import { getArticles } from "@/lib/articles";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

// An index with nothing on it is a low-value page, so it stays out of search
// results until the first real article is published.
export function generateMetadata(): Metadata {
  return buildMetadata({
    ...pageSeo.blog,
    path: "/blog",
    noindex: getArticles().length === 0,
  });
}

export default function BlogPage() {
  const articles = getArticles();

  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({
            path: "/blog",
            name: pageSeo.blog.title,
            description: pageSeo.blog.description,
            type: "CollectionPage",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />

      <Container className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Blog"
          title="Blog"
          description="Notes and articles on accounting, finance, Excel and practical technology."
        />

        {articles.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-8">
            <p className="font-medium">No articles published yet.</p>
            <p className="mt-2 text-muted">
              This page will list articles as soon as the first one is published.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
