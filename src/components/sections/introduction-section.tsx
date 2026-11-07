import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/config/profile";

export function IntroductionSection() {
  return (
    <section aria-labelledby="introduction-heading" className="py-16 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading
          id="introduction-heading"
          eyebrow="Introduction"
          title="Where I'm starting from"
        />
        <div className="space-y-5 text-base text-pretty text-muted sm:text-lg">
          <p>{profile.biography[0]}</p>
          <p>{profile.biography[2]}</p>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-primary hover:underline"
          >
            More about me
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
