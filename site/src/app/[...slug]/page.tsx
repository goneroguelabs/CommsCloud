import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleListing } from "@/components/editorial/article-listing";
import { ArticlePage } from "@/components/editorial/article-page";
import {
  getArticleHtml,
  getArticleSummary,
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

  const pageSummary = getArticleSummary(route, 260);

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen bg-white text-brand-navy">
        <SiteHeader />
        <main>
          <article>
            <header className="border-b border-[#e5e4ec] bg-white px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
              <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">
                    CommsCloud
                  </p>
                  <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.052em] text-brand-navy md:text-7xl">
                    {route.title}
                  </h1>
                  {pageSummary ? (
                    <p className="mt-7 max-w-3xl text-lg leading-8 text-[#666a70] md:text-xl">
                      {pageSummary}
                    </p>
                  ) : null}
                </div>

                {route.firstImage ? (
                  <figure className="overflow-hidden rounded-[1.6rem] bg-[#f1f0f5]">
                    <Image
                      src={route.firstImage}
                      alt={route.title}
                      width={960}
                      height={720}
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  </figure>
                ) : (
                  <div
                    className="editorial-fallback aspect-[4/3] rounded-[1.6rem]"
                    aria-hidden="true"
                  >
                    <span className="editorial-fallback-mark editorial-fallback-mark-large">
                      CC
                    </span>
                  </div>
                )}
              </div>
            </header>

            <div className="mx-auto max-w-[820px] px-5 py-16 md:px-8 md:py-24">
              <div
                className="editorial-content"
                dangerouslySetInnerHTML={{ __html: getArticleHtml(route) }}
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
