import Link from "next/link";
import type { ReactNode } from "react";

import { cn, isExternalHref } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary/85",
  secondary: "border border-border bg-surface text-fg hover:bg-surface-elevated",
  ghost: "text-muted hover:text-fg",
};

export function buttonStyles(variant: Variant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

/**
 * A link that looks like a button. Internal paths use `next/link`; external,
 * `mailto:` and other absolute URLs render a plain anchor.
 */
export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  const classes = buttonStyles(variant, className);

  if (isExternalHref(href)) {
    const isWeb = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {isWeb ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
