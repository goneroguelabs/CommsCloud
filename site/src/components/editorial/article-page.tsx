import Link from "next/link";
import Image from "next/image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { MigrationRoute } from "@/lib/migration-content";
import { ArticleCard } from "./article-card";
import {
  formatArticleDate,
  getArticleHtml,
  getArticleSummary,
  getCategory,
  getRelatedPosts,
} from "./editorial-utils";

type ArticlePageProps = {
  article: MigrationRoute;
  posts: MigrationRoute[];
};

export function ArticlePage({ article, posts }: ArticlePageProps) {
  const date = formatArticleDate(article.date);
  const summary = getArticleSummary(article, 260);
  const relatedPosts = getRelatedPosts(article, posts);

  return (
    <div className="min-h-screen bg-white text-brand-navy">
      <SiteHeader />
      <main>
        <article>
          <header className="border-b border-[#e5e4ec] bg-white px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
              <div>
                <Link
                  href="/news-and-views/"
                  className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1] transition hover:text-brand-navy"
                >
                  {getCategory(article)}
                </Link>
                <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.052em] text-brand-navy md:text-7xl">
                  {article.title}
                </h1>
                {summary ? (
                  <p className="mt-7 max-w-3xl text-lg leading-8 text-[#666a70] md:text-xl">
                    {summary}
                  </p>
                ) : null}
                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#767b84]">
                  {date ? <time dateTime={article.date}>{date}</time> : null}
                  {date && article.author ? <span aria-hidden="true" className="text-[#18bdb1]">/</span> : null}
                  {article.author ? <span>By {article.author}</span> : null}
                </div>
              </div>

              {article.firstImage ? (
                <figure className="overflow-hidden rounded-[1.6rem] bg-[#f1f0f5]">
                  <Image
                    src={article.firstImage}
                    alt={article.title}
                    width={960}
                    height={720}
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                </figure>
              ) : (
                <div className="editorial-fallback aspect-[4/3] rounded-[1.6rem]" aria-hidden="true">
                  <span className="editorial-fallback-mark editorial-fallback-mark-large">CC</span>
                </div>
              )}
            </div>
          </header>

          <div className="mx-auto max-w-[820px] px-5 py-16 md:px-8 md:py-24">
            <div
              className="editorial-content"
              dangerouslySetInnerHTML={{ __html: getArticleHtml(article) }}
            />
          </div>
        </article>

        {relatedPosts.length ? (
          <section className="border-y border-[#e5e4ec] bg-white px-5 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Keep reading</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-brand-navy md:text-5xl">
                    Related insights
                  </h2>
                </div>
                <Link href="/news-and-views/" className="text-lg font-medium text-[#18bdb1] transition hover:text-brand-navy">
                  View all insights →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedPosts.map((post) => (
                  <ArticleCard key={post.path} article={post} compact />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-brand-navy px-5 py-20 text-white md:px-8 md:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Talk to CommsCloud</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
                Build connectivity that stays visible across borders.
              </h2>
            </div>
            <Link
              href="/contact/"
              className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-lg bg-[#18bdb1] px-8 text-base font-semibold text-white transition hover:bg-white hover:text-brand-navy"
            >
              Speak to an expert
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
