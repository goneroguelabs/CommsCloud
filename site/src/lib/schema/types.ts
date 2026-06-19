export type SchemaPrimitive = string | number | boolean | null;
export type SchemaValue =
  | SchemaPrimitive
  | SchemaObject
  | readonly SchemaValue[];

export type SchemaObject = {
  readonly [key: string]: SchemaValue | undefined;
};

export type Schema = SchemaObject & {
  readonly "@context"?: "https://schema.org";
  readonly "@type": string | readonly string[];
};

export type QuestionInput = {
  question: string;
  answer: string;
};

export type HowToStepInput = {
  name: string;
  text: string;
  url?: string;
  image?: string;
};

export type BreadcrumbInput = {
  name: string;
  url: string;
};

export type ArticleSchemaInput = {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
};
