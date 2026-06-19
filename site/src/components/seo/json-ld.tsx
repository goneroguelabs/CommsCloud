import type { Schema } from "@/lib/schema";

type JsonLdProps<T extends Schema | readonly Schema[]> = {
  data: T;
};

export function JsonLd<T extends Schema | readonly Schema[]>({
  data,
}: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
