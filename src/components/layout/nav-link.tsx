"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, isActivePath } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onNavigate?: () => void;
};

/** Navigation link that marks the current page with `aria-current`. */
export function NavLink({ href, children, className, activeClassName, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
    >
      {children}
    </Link>
  );
}
