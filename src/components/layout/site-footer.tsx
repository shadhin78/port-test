import Link from "next/link";

import { Container } from "@/components/ui/container";
import { mainNavigation } from "@/config/navigation";
import { profile } from "@/config/profile";
import { getActiveSocials } from "@/lib/contact";

export function SiteFooter() {
  const socials = getActiveSocials(profile.socials);
  // Evaluated when the page is generated; redeploying updates it each new year.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <p className="font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-2 text-sm text-muted">
            {profile.location.city}, {profile.location.country}
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-1 text-sm">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {socials.length > 0 ? (
            <nav aria-label="Social">
              <ul className="flex flex-col gap-1 text-sm">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center text-muted transition-colors hover:text-fg"
                    >
                      {social.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>

      <Container className="border-t border-border py-6">
        <p className="text-sm text-muted">
          &copy; {year} {profile.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
