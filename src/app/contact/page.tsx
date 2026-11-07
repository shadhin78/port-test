import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/config/profile";
import { pageSeo } from "@/config/seo";
import { getActiveSocials, getPrimaryContact } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({ ...pageSeo.contact, path: "/contact" });

export default function ContactPage() {
  const primary = getPrimaryContact(profile.contact, profile.socials);
  const socials = getActiveSocials(profile.socials);

  return (
    <>
      <JsonLd
        nodes={[
          webPageSchema({
            path: "/contact",
            name: pageSeo.contact.title,
            description: pageSeo.contact.description,
            type: "ContactPage",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <Container size="narrow" className="py-16 sm:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Get in touch"
          description="I'm happy to talk about accounting, finance and technology."
        />

        {primary ? (
          <div className="mt-10 space-y-6">
            <ButtonLink href={primary.href}>{primary.label}</ButtonLink>

            {profile.contact.email ? (
              <p className="text-muted">
                Or write to{" "}
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="text-primary hover:underline"
                >
                  {profile.contact.email}
                </a>
                .
              </p>
            ) : null}

            {socials.length > 0 ? (
              <ul className="flex flex-wrap gap-x-6 gap-y-1">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-primary hover:underline"
                    >
                      {social.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-8">
            <p className="font-medium">No public contact method is available yet.</p>
            <p className="mt-2 text-muted">
              There is no contact form on this site, so nothing you type here would be sent
              anywhere. A way to get in touch will be added here once it has been set up.
            </p>
          </div>
        )}
      </Container>
    </>
  );
}
