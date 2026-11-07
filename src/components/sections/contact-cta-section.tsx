import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { profile } from "@/config/profile";
import { getPrimaryContact } from "@/lib/contact";

export function ContactCtaSection() {
  const contact = getPrimaryContact(profile.contact, profile.socials);

  return (
    <section aria-labelledby="contact-cta-heading" className="py-16 sm:py-24">
      <Container>
        <div className="rounded-3xl border border-border bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2
            id="contact-cta-heading"
            className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Interested in talking about accounting, finance or technology?
          </h2>

          {contact ? (
            <div className="mt-8 flex justify-center">
              <ButtonLink href={contact.href}>{contact.label}</ButtonLink>
            </div>
          ) : (
            <>
              <p className="mx-auto mt-4 max-w-md text-muted">
                A public contact method hasn&apos;t been set up yet. Check the contact page for
                updates.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/contact" variant="secondary">
                  Contact page
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
