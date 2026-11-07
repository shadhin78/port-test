import { buildGraph, serializeJsonLd } from "@/lib/structured-data";

type JsonLdProps = {
  /** Nodes to publish as one schema.org `@graph`. */
  nodes: Parameters<typeof buildGraph>[0];
};

/**
 * Renders one JSON-LD script. Render it once per page: pages pass every node
 * they need in a single `@graph` so no schema is emitted twice.
 */
export function JsonLd({ nodes }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from typed config and validated, then escaped.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildGraph(nodes)) }}
    />
  );
}
