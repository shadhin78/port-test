import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/config/profile";
import { pageSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, personSchema, webPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({ ...pageSeo.about, path: "/about" });

function InterestList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-border bg-surface px-2.5 py-1 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  const { education, languages, interests } = profile;

  return (
    <>
      <JsonLd
        nodes={[
          personSchema(),
          webPageSchema({
            path: "/about",
            name: pageSeo.about.title,
            description: pageSeo.about.description,
            type: "AboutPage",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <Container size="narrow" className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="About"
          title={`About ${profile.name}`}
          description={profile.summary}
        />

        <div className="mt-10 space-y-5 text-base text-pretty text-muted sm:text-lg">
          {profile.biography.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section aria-labelledby="education-heading" className="mt-16">
          <h2 id="education-heading" className="text-2xl font-semibold tracking-tight">
            Education
          </h2>
          <div className="mt-5 rounded-2xl border border-border bg-surface p-6">
            <p className="font-medium">{education.degree}</p>
            <p className="mt-1 text-muted">{education.institution}</p>
            {education.affiliation ? (
              <p className="mt-1 text-sm text-muted">{education.affiliation}</p>
            ) : null}
            <p className="mt-4 font-mono text-xs tracking-wide text-primary uppercase">
              {education.level}
            </p>
          </div>
        </section>

        <section aria-labelledby="interests-heading" className="mt-16">
          <h2 id="interests-heading" className="text-2xl font-semibold tracking-tight">
            Interests
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <InterestList title="Professional" items={interests.professional} />
            <InterestList title="Technical" items={interests.technical} />
          </div>
        </section>

        <section aria-labelledby="languages-heading" className="mt-16">
          <h2 id="languages-heading" className="text-2xl font-semibold tracking-tight">
            Languages
          </h2>
          <ul className="mt-5 space-y-2">
            {languages.map((language) => (
              <li key={language.code} className="flex gap-3">
                <span className="font-medium">{language.name}</span>
                <span className="text-muted">{language.proficiency}</span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
