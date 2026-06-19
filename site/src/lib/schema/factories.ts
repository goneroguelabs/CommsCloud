import type {
  ArticleSchemaInput,
  BreadcrumbInput,
  HowToStepInput,
  QuestionInput,
  Schema,
  SchemaObject,
} from "./types";

const context = "https://schema.org" as const;

export function createOrganizationSchema(input: {
  name: string;
  url: string;
  description?: string;
  slogan?: string;
  logo?: string;
  sameAs?: readonly string[];
  areaServed?: readonly string[];
  knowsAbout?: readonly string[];
  brandName?: string;
}): Schema {
  return compactSchema({
    "@context": context,
    "@type": "Organization",
    name: input.name,
    url: input.url,
    description: input.description,
    slogan: input.slogan,
    logo: input.logo
      ? { "@type": "ImageObject", url: input.logo }
      : undefined,
    sameAs: input.sameAs,
    areaServed: input.areaServed,
    knowsAbout: input.knowsAbout,
    brand: input.brandName
      ? { "@type": "Brand", name: input.brandName }
      : undefined,
  });
}

export function createWebsiteSchema(input: {
  name: string;
  url: string;
  inLanguage?: string;
}): Schema {
  return compactSchema({
    "@context": context,
    "@type": "WebSite",
    name: input.name,
    url: input.url,
    inLanguage: input.inLanguage,
  });
}

export function createWebPageSchema(input: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}): Schema {
  return compactSchema({
    "@context": context,
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
  });
}

export function createArticleSchema(input: ArticleSchemaInput): Schema {
  return compactSchema({
    "@context": context,
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: input.authorName
      ? { "@type": "Person", name: input.authorName }
      : { "@type": "Organization", name: "CommsCloud" },
    publisher: { "@type": "Organization", name: "CommsCloud" },
    image: input.image
      ? { "@type": "ImageObject", url: input.image }
      : undefined,
  });
}

export function createFaqPageSchema(items: readonly QuestionInput[]): Schema {
  if (!items.length) throw new Error("FAQPage requires at least one question.");
  return {
    "@context": context,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createHowToSchema(input: {
  name: string;
  description: string;
  steps: readonly HowToStepInput[];
  totalTime?: string;
  image?: string;
}): Schema {
  if (!input.steps.length) throw new Error("HowTo requires at least one step.");
  return compactSchema({
    "@context": context,
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    totalTime: input.totalTime,
    image: input.image,
    step: input.steps.map((step) =>
      compactObject({
        "@type": "HowToStep",
        name: step.name,
        text: step.text,
        url: step.url,
        image: step.image,
      }),
    ),
  });
}

export function createProductSchema(input: {
  name: string;
  description: string;
  url: string;
  brandName?: string;
  image?: string;
}): Schema {
  return compactSchema({
    "@context": context,
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    brand: { "@type": "Brand", name: input.brandName ?? "CommsCloud" },
    image: input.image,
  });
}

export function createBreadcrumbSchema(items: readonly BreadcrumbInput[]): Schema {
  return {
    "@context": context,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function compactSchema(value: Schema): Schema {
  return compactObject(value) as Schema;
}

function compactObject(value: SchemaObject): SchemaObject {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  );
}
