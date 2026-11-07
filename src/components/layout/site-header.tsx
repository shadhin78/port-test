import Link from "next/link";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { NavLink } from "@/components/layout/nav-link";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { mainNavigation } from "@/config/navigation";
import { profile } from "@/config/profile";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${profile.name}, home`}
          className="flex items-center gap-2.5 text-fg"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-semibold text-on-primary"
          >
            S
          </span>
          <span className="font-semibold tracking-tight">{profile.shortName}</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-lg px-3.5 text-sm text-muted transition-colors duration-150 hover:text-fg"
                    activeClassName="text-fg! bg-surface-elevated"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileNavigation items={mainNavigation} />
        </div>
      </Container>
    </header>
  );
}
