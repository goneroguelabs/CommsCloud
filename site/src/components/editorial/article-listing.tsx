import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { MigrationRoute } from "@/lib/migration-content";
import { ArticleCard } from "./article-card";
import {
  getCategory,
  getCategoryKey,
  sortPosts,
} from "./editorial-utils";

type ArticleListingProps = {
  posts: MigrationRoute[];
  pathname: string;
  activeCategory?: string;
  page?: number;
};

const pageSize = 12;

export function ArticleListing({
  posts,
  pathname,
  activeCategory,
  page = 1,
}: ArticleListingProps) {
  const sortedPosts = sortPosts(posts);
  const categories = Array.from(
    new Map(
      sortedPosts.map((post) => [
        getCategoryKey(post),
        getCategory(post),
      ]),
    ),
  );
  const filteredPosts = activeCategory
    ? sortedPosts.filter((post) => getCategoryKey(post) === activeCategory)
    : sortedPosts;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const visiblePosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const pageHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (activeCategory) query.set("category", activeCategory);
    if (targetPage > 1) query.set("page", String(targetPage));
    const value = query.toString();
    return value ? `${pathname}?${value}` : pathname;
  };

  return (
    <div className="min-h-screen bg-white text-brand-navy">
      <SiteHeader />
      <main>
        <header className="relative isolate overflow-hidden border-b border-[#e5e4ec] bg-[#fbfbfe] px-5 py-16 md:px-8 md:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(24,189,177,0.13),transparent_25rem),radial-gradient(circle_at_82%_8%,rgba(97,90,132,0.15),transparent_28rem)]" />
          <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[linear-gradient(90deg,rgba(27,42,74,0.045)_1px,transparent_1px),linear-gradient(rgba(27,42,74,0.045)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(180deg,#000,transparent)]" />
          <div className="mx-auto grid max-w-[86rem] gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18bdb1]">CommsCloud insights</p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3.25rem,5.4vw,6.4rem)] font-semibold leading-[0.93] tracking-[-0.06em] text-brand-navy">
                Practical thinking for connected IoT operations.
              </h1>
            </div>
            <div className="rounded-[1.6rem] border border-white/80 bg-white/72 p-6 shadow-[0_20px_70px_rgba(21,28,100,0.075)] backdrop-blur">
              <p className="text-lg leading-8 text-[#595a5c] md:text-xl">
                Engineering guidance, field lessons and clear analysis for teams deploying connected devices across Africa and beyond.
              </p>
            </div>
          </div>
        </header>

        <section className="px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-[86rem]">
            <nav aria-label="Filter insights" className="mb-12 flex flex-wrap gap-3 rounded-[1.4rem] border border-[#e5e4ec] bg-[#fbfbfe] p-3 shadow-[0_14px_44px_rgba(21,28,100,0.045)]">
              <Link
                href={pathname}
                aria-current={!activeCategory ? "page" : undefined}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  !activeCategory
                    ? "border-brand-navy bg-brand-navy text-white shadow-[0_10px_24px_rgba(21,28,100,0.16)]"
                    : "border-[#d8d6e1] bg-white text-brand-navy hover:border-[#18bdb1] hover:text-[#18bdb1]"
                }`}
              >
                All insights
              </Link>
              {categories.map(([key, label]) => (
                <Link
                  key={key}
                  href={`${pathname}?category=${encodeURIComponent(key)}`}
                  aria-current={activeCategory === key ? "page" : undefined}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    activeCategory === key
                      ? "border-brand-navy bg-brand-navy text-white shadow-[0_10px_24px_rgba(21,28,100,0.16)]"
                      : "border-[#d8d6e1] bg-white text-brand-navy hover:border-[#18bdb1] hover:text-[#18bdb1]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {visiblePosts.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visiblePosts.map((post) => (
                  <ArticleCard key={post.path} article={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-[#d8d6e1] bg-[#f4f3f7] px-6 py-16 text-center">
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">No insights found</h2>
                <p className="mt-3 text-lg text-[#6f737b]">Choose another category to continue browsing.</p>
                <Link href={pathname} className="mt-6 inline-flex text-lg font-semibold text-[#18bdb1] hover:text-brand-navy">
                  View all insights &rarr;
                </Link>
              </div>
            )}

            {totalPages > 1 ? (
              <nav aria-label="Insight pages" className="mt-12 flex items-center justify-between rounded-[1.4rem] border border-[#e5e4ec] bg-white px-5 py-4 shadow-[0_14px_44px_rgba(21,28,100,0.045)]">
                {currentPage > 1 ? (
                  <Link href={pageHref(currentPage - 1)} className="text-lg font-semibold text-brand-navy transition hover:text-[#18bdb1]">
                    &larr; Previous
                  </Link>
                ) : <span />}
                <span className="text-sm font-semibold uppercase tracking-[0.1em] text-[#737780]">Page {currentPage} of {totalPages}</span>
                {currentPage < totalPages ? (
                  <Link href={pageHref(currentPage + 1)} className="text-lg font-semibold text-brand-navy transition hover:text-[#18bdb1]">
                    Next &rarr;
                  </Link>
                ) : <span />}
              </nav>
            ) : null}
          </div>
        </section>

        <section className="bg-white px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-[86rem]">
            <div className="relative isolate overflow-hidden rounded-[2.2rem] bg-brand-navy p-8 text-center text-white shadow-[0_28px_90px_rgba(21,28,100,0.2)] md:p-12">
              <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#18bdb1]/25 blur-3xl" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Your deployment, understood</p>
              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
                Turn insight into resilient connectivity.
              </h2>
              <Link
                href="/contact/"
                className="mt-9 inline-flex min-h-14 items-center justify-center rounded-xl bg-[#18bdb1] px-8 text-base font-semibold text-white shadow-[0_16px_38px_rgba(24,189,177,0.28)] transition hover:bg-white hover:text-brand-navy"
              >
                Talk to an expert
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
