import Link from "next/link";
import Markdown, { type Components } from "react-markdown";

import { isExternalHref } from "@/lib/utils";

/**
 * Markdown is rendered on the server, so this ships no client JavaScript.
 * react-markdown does not render raw HTML and neutralises unsafe URL protocols.
 *
 * - The article title is the page's only h1, so headings in the body start at h2.
 * - Images are not allowed yet: they need dimensions to avoid layout shift, and
 *   will be added with a purpose-built component in a later phase.
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-12 mb-4 text-3xl font-semibold tracking-tight">{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight">{children}</h3>
  ),
  h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>,
  p: ({ children }) => <p className="my-5 text-pretty">{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-primary pl-5 text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-border" />,
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code
      className={className ?? "rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.9em]"}
    >
      {children}
    </code>
  ),
  a: ({ href = "", children }) =>
    isExternalHref(href) ? (
      <a
        href={href}
        {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-primary underline underline-offset-4"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className="text-primary underline underline-offset-4">
        {children}
      </Link>
    ),
};

export function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="text-base text-fg sm:text-lg">
      <Markdown components={components} disallowedElements={["img"]} unwrapDisallowed>
        {source}
      </Markdown>
    </div>
  );
}
