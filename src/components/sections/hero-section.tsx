import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { profile } from "@/config/profile";

const lower = (values: readonly string[]) => values.map((value) => value.toLowerCase()).join(" · ");

/**
 * Decorative profile panel. It only restates facts from the profile config and is
 * hidden from assistive technology because the same facts appear in the page text.
 * Replace this component freely in a later phase.
 */
function ProfilePanel() {
  const rows = [
    ["focus", lower(profile.interests.professional.slice(0, 3))],
    ["tools", lower(profile.interests.professional.slice(3, 5))],
    ["exploring", lower(profile.interests.technical)],
    [
      "based in",
      `${profile.location.city.toLowerCase()}, ${profile.location.country.toLowerCase()}`,
    ],
  ] as const;

  return (
    <div
      aria-hidden="true"
      className="reveal overflow-hidden rounded-2xl border border-border bg-surface"
      style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 font-mono text-xs text-muted">profile.config</span>
      </div>
      <dl className="space-y-4 p-5 font-mono text-sm">
        {rows.map(([key, value]) => (
          <div key={key} className="grid grid-cols-[6.5rem_1fr] gap-3">
            <dt className="text-primary">{key}</dt>
            <dd className="text-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="ambient-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="grid-pattern absolute inset-0 -z-10 hidden sm:block" />

      <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:py-36">
        <div>
          <p className="mb-5 font-mono text-xs tracking-widest text-primary uppercase">
            {profile.education.level} &middot; {profile.location.city}, {profile.location.country}
          </p>
          <h1
            id="hero-heading"
            className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {profile.name}
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg text-pretty text-fg sm:text-xl">
            {profile.headline}
          </p>
          <p
            className="reveal mt-4 max-w-xl text-base text-pretty text-muted"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            {profile.summary}
          </p>
          <div
            className="reveal mt-9 flex flex-wrap gap-3"
            style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
          >
            <ButtonLink href="/projects">View projects</ButtonLink>
            <ButtonLink href="/about" variant="secondary">
              About me
            </ButtonLink>
          </div>
        </div>

        <ProfilePanel />
      </Container>
    </section>
  );
}
