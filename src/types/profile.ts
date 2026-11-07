/**
 * Shape of the single source of truth for personal information.
 * Edit the values in `src/config/profile.ts`, not here.
 */

export type SocialLink = {
  /** Visible label, e.g. "GitHub". */
  label: string;
  /** Full URL. `null` means "not supplied yet": the link is hidden everywhere. */
  url: string | null;
};

export type SkillGroup = {
  title: string;
  description: string;
  items: readonly string[];
};

export type Profile = {
  name: string;
  /** Short brand name used in the wordmark and manifest. */
  shortName: string;
  /** One-line positioning statement. */
  headline: string;
  /** Short factual summary used in the hero and meta descriptions. */
  summary: string;
  /** Longer biography paragraphs for the About page. */
  biography: readonly string[];
  location: {
    city: string;
    country: string;
    /** ISO 3166-1 alpha-2 code, used in structured data. */
    countryCode: string;
  };
  education: {
    degree: string;
    institution: string;
    level: string;
    /**
     * Optional, e.g. a university affiliation. Intentionally `null` until the
     * wording has been verified for the relevant academic period. It is only
     * rendered when set.
     */
    affiliation: string | null;
  };
  interests: {
    professional: readonly string[];
    technical: readonly string[];
  };
  languages: readonly { name: string; proficiency: string; code: string }[];
  skills: readonly SkillGroup[];
  contact: {
    /** `null` until supplied. Never hard-code a placeholder address. */
    email: string | null;
  };
  socials: readonly SocialLink[];
};
