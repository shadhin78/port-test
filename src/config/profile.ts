import type { Profile } from "@/types/profile";

/**
 * Single source of truth for personal information.
 *
 * Everything shown on the site (hero, About, footer, structured data, contact
 * actions) is read from here. Only verified details are filled in. Anything not
 * supplied yet is `null` and is simply hidden until you add it.
 */
export const profile: Profile = {
  name: "Ratul Islam Shadhin",
  shortName: "Shadhin",
  headline: "Accounting and finance student building practical technology.",
  summary:
    "BBA Accounting student in Dhaka, Bangladesh, exploring accounting, finance, Excel and practical web technology.",
  biography: [
    "I'm studying for a BBA in Accounting at Government Titumir College in Dhaka, Bangladesh. I'm at the start of my career and focused on building a solid foundation in accounting, finance and auditing.",
    "I'm interested in business analysis and in using Excel to make financial information easier to understand and work with.",
    "Alongside my studies I'm exploring how AI-assisted development can be used to build websites, progressive web applications and workflow automations. This site is where I plan to share projects and notes as they take shape.",
  ],
  location: {
    city: "Dhaka",
    country: "Bangladesh",
    countryCode: "BD",
  },
  education: {
    degree: "BBA in Accounting",
    institution: "Government Titumir College",
    level: "BBA student",
    // Left unset on purpose: confirm the exact, accurate wording for the
    // relevant academic period before publishing an affiliation.
    affiliation: null,
  },
  interests: {
    professional: [
      "Accounting",
      "Finance",
      "Auditing",
      "Excel",
      "Business analysis",
      "Productivity technology",
    ],
    technical: [
      "AI-assisted development",
      "Websites",
      "Progressive web applications",
      "Workflow automation",
    ],
  },
  languages: [
    { name: "Bangla", proficiency: "Native", code: "bn" },
    { name: "English", proficiency: "Basic", code: "en" },
  ],
  skills: [
    {
      title: "Accounting and finance",
      description: "The subject area I'm studying.",
      items: ["Accounting", "Finance", "Auditing"],
    },
    {
      title: "Analysis and tools",
      description: "Practical tools for working with business data.",
      items: ["Excel", "Business analysis"],
    },
    {
      title: "Technology",
      description: "Areas I'm exploring and building in.",
      items: [
        "AI-assisted development",
        "Websites",
        "Progressive web applications",
        "Workflow automation",
      ],
    },
  ],
  contact: {
    // Add your address here, e.g. "name@example.com". Left `null` so that no
    // private contact detail is exposed by default.
    email: null,
  },
  socials: [
    // Set `url` to a full https:// address to show a link. `null` hides it.
    { label: "GitHub", url: null },
    { label: "LinkedIn", url: null },
  ],
};
