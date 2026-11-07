import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small monospaced label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Heading level. Homepage sections use h2; page titles use h1. */
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs tracking-widest text-primary uppercase">{eyebrow}</p>
      ) : null}
      <Heading id={id} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base text-pretty text-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
