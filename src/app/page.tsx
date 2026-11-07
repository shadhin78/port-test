import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { HeroSection } from "@/components/sections/hero-section";
import { IntroductionSection } from "@/components/sections/introduction-section";
import { LatestArticlesSection } from "@/components/sections/latest-articles-section";
import { SkillsOverviewSection } from "@/components/sections/skills-overview-section";
import { profile } from "@/config/profile";
import { pageSeo } from "@/config/seo";
import { getLatestArticles } from "@/lib/articles";
import { buildMetadata } from "@/lib/metadata";
import { getFeaturedProjects } from "@/lib/projects";
import { personSchema, webPageSchema, websiteSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({ ...pageSeo.home, path: "/" });

export default function HomePage() {
  const projects = getFeaturedProjects();
  const articles = getLatestArticles(3);

  return (
    <>
      <JsonLd
        nodes={[
          personSchema(),
          websiteSchema(),
          webPageSchema({
            path: "/",
            name: pageSeo.home.title,
            description: pageSeo.home.description,
          }),
        ]}
      />
      <HeroSection />
      <IntroductionSection />
      <FeaturedProjectsSection projects={projects} />
      <SkillsOverviewSection groups={profile.skills} />
      <LatestArticlesSection articles={articles} />
      <ContactCtaSection />
    </>
  );
}
