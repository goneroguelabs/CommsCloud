import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
            <header className="relative isolate overflow-hidden border-b border-[#e5e4ec] bg-[#fbfbfe] px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(24,189,177,0.13),transparent_26rem),radial-gradient(circle_at_86%_18%,rgba(97,90,132,0.16),transparent_30rem)]" />
              <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[linear-gradient(90deg,rgba(27,42,74,0.045)_1px,transparent_1px),linear-gradient(rgba(27,42,74,0.045)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(180deg,#000,transparent)]" />
              <div className="mx-auto grid max-w-[86rem] gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20">
                <div>
                  <p className="inline-flex rounded-full border border-[#18bdb1]/25 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1] shadow-[0_14px_36px_rgba(21,28,100,0.05)]">
                    CommsCloud
                  </p>
                  <h1 className="mt-6 max-w-4xl text-[clamp(3.05rem,4.8vw,5.7rem)] font-semibold leading-[0.94] tracking-[-0.058em] text-brand-navy">
                    {route.title}
                  </h1>
                  {pageSummary ? (
                    <p className="mt-7 max-w-3xl text-xl leading-9 text-[#595a5c]">
                      {pageSummary}
                    </p>
                  ) : null}
                </div>

                {route.firstImage ? (
                  <figure className="overflow-hidden rounded-[2rem] border border-white/80 bg-[#f1f0f5] shadow-[0_30px_90px_rgba(21,28,100,0.14)]">
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
                    className="editorial-fallback aspect-[4/3] rounded-[2rem] shadow-[0_30px_90px_rgba(21,28,100,0.14)]"
                    aria-hidden="true"
                  >
                    <span className="editorial-fallback-mark editorial-fallback-mark-large">
                      CC
                    </span>
                  </div>
                )}
              </div>
            </header>

            <div className="mx-auto max-w-[960px] px-5 py-16 md:px-8 md:py-24">
              <div className="min-w-0 rounded-[1.8rem] border border-[#e5e4ec] bg-white p-6 shadow-[0_20px_70px_rgba(21,28,100,0.055)] md:p-10">
                <div
                  className="editorial-content"
                  dangerouslySetInnerHTML={{ __html: getArticleHtml(route) }}
                />
              </div>
            </div>
          </article>

          <section className="bg-white px-5 pb-16 md:px-8 md:pb-20">
            <div className="mx-auto max-w-[86rem]">
              <div className="relative isolate overflow-hidden rounded-[2.2rem] bg-brand-navy p-8 text-white shadow-[0_28px_90px_rgba(21,28,100,0.2)] md:p-12">
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:58px_58px]" />
                <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#18bdb1]/25 blur-3xl" />
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Ready to plan?</p>
                <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
                  Turn this into a deployment-ready connectivity path.
                </h2>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/contact/"
                    className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#18bdb1] px-8 text-base font-semibold text-white shadow-[0_16px_38px_rgba(24,189,177,0.28)] transition hover:bg-white hover:text-brand-navy"
                  >
                    Talk to an expert
                  </Link>
                  <Link
                    href="/commscloud-coverage-map/"
                    className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/18 bg-white/8 px-8 text-base font-semibold text-white transition hover:bg-white/14"
                  >
                    View coverage
                  </Link>
                </div>
              </div>
            </div>
          </section>
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
