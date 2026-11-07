import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SkillGroup } from "@/types/profile";

type SkillsOverviewSectionProps = {
  groups: readonly SkillGroup[];
};

/**
 * Skills are listed by name only, grouped by theme. There are deliberately no
 * proficiency bars or percentages: they would be invented numbers.
 */
export function SkillsOverviewSection({ groups }: SkillsOverviewSectionProps) {
  return (
    <section aria-labelledby="skills-heading" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="skills-heading"
          eyebrow="Skills & interests"
          title="What I'm learning and working with"
          description="Areas of study and practice, grouped by theme."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{group.description}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
