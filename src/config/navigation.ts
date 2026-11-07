export type NavItem = {
  label: string;
  href: string;
};

/** Primary navigation, used by the header, mobile menu, footer and sitemap. */
export const mainNavigation: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/** Every indexable static route (the homepage plus the main navigation). */
export const staticRoutes: readonly string[] = ["/", ...mainNavigation.map((item) => item.href)];
