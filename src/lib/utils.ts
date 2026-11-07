/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a YYYY-MM-DD date for display. Pinned to UTC and a fixed locale so the
 * output is identical on the server, at build time and in every browser.
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** True when a URL points outside this site (so it should open as a plain link). */
export function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:)/i.test(href) || href.startsWith("//");
}

/** True for the exact route or any of its nested routes (e.g. /blog/my-post). */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
