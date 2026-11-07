import { profile } from "@/config/profile";

/**
 * All page titles and descriptions live here so they stay unique, consistent
 * and easy to audit. Titles are combined with `titleTemplate` by the root layout
 * (the homepage uses its full title as-is).
 */
export const titleTemplate = `%s | ${profile.name}`;

export const defaultTitle = `${profile.name} — Accounting, Finance & Technology`;

export const pageSeo = {
  home: {
    title: defaultTitle,
    description:
      "Portfolio and blog of Ratul Islam Shadhin, a BBA Accounting student in Dhaka, Bangladesh, exploring accounting, finance, Excel and practical web technology.",
  },
  about: {
    title: "About",
    description:
      "Background, education and interests of Ratul Islam Shadhin, a BBA Accounting student at Government Titumir College in Dhaka, Bangladesh.",
  },
  projects: {
    title: "Projects",
    description:
      "Projects by Ratul Islam Shadhin across accounting, finance and web technology, listed with their honest current status.",
  },
  blog: {
    title: "Blog",
    description:
      "Notes and articles on accounting, finance, Excel and practical technology from Ratul Islam Shadhin in Dhaka, Bangladesh.",
  },
  contact: {
    title: "Contact",
    description:
      "How to get in touch with Ratul Islam Shadhin about accounting, finance and technology projects.",
  },
} as const;

export type PageSeoKey = keyof typeof pageSeo;
