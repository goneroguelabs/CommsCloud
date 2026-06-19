import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleListing } from "@/components/editorial/article-listing";
import { ArticlePage } from "@/components/editorial/article-page";
import {
  isEditorialArticle,
  isEditorialListing,
} from "@/components/editorial/editorial-utils";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import {
  findMigrationRoute,
  importedSchemas,
  migrationRoutes,
  routePathFromSegments,
} from "@/lib/migration-content";
import { createArticleSchema, createWebPageSchema } from "@/lib/schema";

type RoutePageProps = {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return migrationRoutes
    .filter((route) => route.path !== "/")
    .map((route) => ({
      slug: route.slug,
    }));
}

export async function generateMetadata({
  params,
}: RoutePageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const route = findMigrationRoute(routePathFromSegments(slug));

  if (!route) {
    return {};
  }

  return {
    title: route.seoTitle || route.title,
    description: route.description,
    alternates: {
      canonical: route.canonical || route.path,
    },
    openGraph: {
      title: route.seoTitle || route.title,
      description: route.description,
      url: route.path,
      type: isEditorialArticle(route) ? "article" : "website",
      images: route.firstImage
        ? [{ url: route.firstImage }]
        : [{ url: `/api/og?title=${encodeURIComponent(route.title)}` }],
    },
    robots: route.robots.includes("noindex")
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export default async function MigrationPage({ params, searchParams }: RoutePageProps) {
  const { slug = [] } = await params;
  const route = findMigrationRoute(routePathFromSegments(slug));

  if (!route || route.path === "/") {
    notFound();
  }

  const url = `https://commscloud.com${route.path}`;
  const schema = isEditorialArticle(route)
    ? createArticleSchema({
        headline: route.title,
        description: route.description,
        url,
        image: route.firstImage || undefined,
      })
    : createWebPageSchema({
        name: route.title,
        description: route.description,
        url,
      });
  const routeSchemas = importedSchemas(route).map(stripDateAuthorMetadata);
  const schemas = routeSchemas.length ? routeSchemas : [schema];

  const posts = migrationRoutes.filter(isEditorialArticle);

  if (isEditorialArticle(route)) {
    return (
      <>
        <JsonLd data={schemas} />
        <ArticlePage article={route} posts={posts} />
      </>
    );
  }

  if (isEditorialListing(route.path)) {
    const query = searchParams ? await searchParams : {};
    const category = firstQueryValue(query.category);
    const parsedPage = Number.parseInt(firstQueryValue(query.page) || "1", 10);

    return (
      <>
        <JsonLd data={schemas} />
        <ArticleListing
          posts={posts}
          pathname={route.path}
          activeCategory={category}
          page={Number.isFinite(parsedPage) ? parsedPage : 1}
        />
      </>
    );
  }

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main>
          <article>
            <header className="relative overflow-hidden bg-brand-navy px-5 py-16 text-white md:px-8 md:py-24">
            <div className="hero-media absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,var(--brand-gold)_0,transparent_18%),linear-gradient(120deg,var(--brand-navy)_0,var(--brand-lavender)_100%)]" />
            <div className="motion-rise relative mx-auto max-w-5xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">
                {route.type === "post" ? "Insights" : "CommsCloud"}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                {route.title}
              </h1>
              {route.description ? (
                <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78">
                  {route.description}
                </p>
              ) : null}
            </div>
          </header>

          <div className="section-reveal mx-auto max-w-4xl px-5 py-12 md:px-8">
            <div
              className="wp-content max-w-none"
              dangerouslySetInnerHTML={{ __html: route.contentHtml }}
            />
          </div>
          </article>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function stripDateAuthorMetadata<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripDateAuthorMetadata) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const cleaned: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (
      key === "author" ||
      key === "datePublished" ||
      key === "dateModified" ||
      key === "dateCreated" ||
      key === "publisher"
    ) {
      continue;
    }

    cleaned[key] = stripDateAuthorMetadata(entry);
  }

  return cleaned as T;
}
