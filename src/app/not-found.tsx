import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container size="narrow" className="py-24 sm:py-32">
      <p className="font-mono text-xs tracking-widest text-primary uppercase">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-5 text-lg text-muted">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
      </div>
    </Container>
  );
}
