import Link from "next/link";

import { formatDate } from "@/lib/utils";
import type { Article } from "@/types/article";

type ArticleCardProps = {
  article: Article;
  headingLevel?: "h2" | "h3";
};

export function ArticleCard({ article, headingLevel: Heading = "h3" }: ArticleCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-primary/50 hover:bg-surface-elevated">
      <p className="font-mono text-xs text-muted">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        {article.categories[0] ? <span> &middot; {article.categories[0]}</span> : null}
      </p>
      <Heading className="mt-3 text-xl font-semibold tracking-tight text-balance">
        <Link
          href={`/blog/${article.slug}`}
          className="after:absolute after:inset-0 hover:text-primary"
        >
          {article.title}
        </Link>
      </Heading>
      <p className="mt-2 text-sm text-pretty text-muted">{article.description}</p>
    </article>
  );
}
