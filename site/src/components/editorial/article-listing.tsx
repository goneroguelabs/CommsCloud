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
        <header className="border-b border-[#e5e4ec] bg-white px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">CommsCloud insights</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.052em] text-brand-navy md:text-7xl">
                Practical thinking for connected IoT operations.
              </h1>
            </div>
            <p className="max-w-xl text-lg leading-8 text-[#666a70] md:text-xl lg:justify-self-end">
              Engineering guidance, field lessons and clear analysis for teams deploying connected devices across Africa and beyond.
            </p>
          </div>
        </header>

        <section className="px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Filter insights" className="mb-12 flex flex-wrap gap-3 border-b border-[#e5e4ec] pb-7">
              <Link
                href={pathname}
                aria-current={!activeCategory ? "page" : undefined}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  !activeCategory
                    ? "border-brand-navy bg-brand-navy text-white"
                    : "border-[#d8d6e1] text-brand-navy hover:border-[#18bdb1] hover:text-[#18bdb1]"
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
                      ? "border-brand-navy bg-brand-navy text-white"
                      : "border-[#d8d6e1] text-brand-navy hover:border-[#18bdb1] hover:text-[#18bdb1]"
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
              <div className="border border-[#d8d6e1] bg-[#f4f3f7] px-6 py-16 text-center">
                <h2 className="text-3xl font-semibold tracking-[-0.04em]">No insights found</h2>
                <p className="mt-3 text-lg text-[#6f737b]">Choose another category to continue browsing.</p>
                <Link href={pathname} className="mt-6 inline-flex text-lg font-medium text-[#18bdb1] hover:text-brand-navy">
                  View all insights →
                </Link>
              </div>
            )}

            {totalPages > 1 ? (
              <nav aria-label="Insight pages" className="mt-12 flex items-center justify-between border-t border-[#e5e4ec] pt-7">
                {currentPage > 1 ? (
                  <Link href={pageHref(currentPage - 1)} className="text-lg font-medium text-brand-navy transition hover:text-[#18bdb1]">
                    ← Previous
                  </Link>
                ) : <span />}
                <span className="text-sm text-[#737780]">Page {currentPage} of {totalPages}</span>
                {currentPage < totalPages ? (
                  <Link href={pageHref(currentPage + 1)} className="text-lg font-medium text-brand-navy transition hover:text-[#18bdb1]">
                    Next →
                  </Link>
                ) : <span />}
              </nav>
            ) : null}
          </div>
        </section>

        <section className="bg-[#f2f1f6] px-5 py-20 text-center md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Your deployment, understood</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-brand-navy md:text-6xl">
              Turn insight into resilient connectivity.
            </h2>
            <Link
              href="/contact/"
              className="mt-9 inline-flex min-h-14 items-center justify-center rounded-lg bg-[#18bdb1] px-8 text-base font-semibold text-white transition hover:bg-brand-navy"
            >
              Talk to an expert
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
