import type { Profile } from "@/types/profile";

export type ContactAction = {
  label: string;
  href: string;
  external: boolean;
};

/**
 * Pick the best available way to contact the site owner from the profile.
 * Returns `null` when nothing has been configured, so the UI can show a truthful
 * fallback instead of a dead button or a form that cannot send anything.
 */
export function getPrimaryContact(
  contact: Profile["contact"],
  socials: Profile["socials"],
): ContactAction | null {
  if (contact.email) {
    return { label: "Send an email", href: `mailto:${contact.email}`, external: true };
  }

  const social = socials.find((item) => item.url);
  if (social?.url) {
    return { label: `Message on ${social.label}`, href: social.url, external: true };
  }

  return null;
}

/** Socials that have a URL, in configured order. */
export function getActiveSocials(socials: Profile["socials"]) {
  return socials.flatMap((social) =>
    social.url ? [{ label: social.label, url: social.url }] : [],
  );
}
