import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ArticleCard } from "@/components/blog/article-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/types/article";

type LatestArticlesSectionProps = {
  articles: readonly Article[];
};

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
  return (
    <section aria-labelledby="latest-articles-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading id="latest-articles-heading" eyebrow="Blog" title="Latest articles" />

        {articles.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-8">
            <p className="font-medium">No articles published yet.</p>
            <p className="mt-2 text-muted">
              Articles will appear here once the first one is ready.
            </p>
          </div>
        )}

        <Link
          href="/blog"
          className="mt-8 inline-flex min-h-11 items-center gap-2 font-medium text-primary hover:underline"
        >
          Visit the blog
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </Container>
    </section>
  );
}
