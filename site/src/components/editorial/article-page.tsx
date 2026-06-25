import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { MigrationRoute } from "@/lib/migration-content";
import { ArticleCard } from "./article-card";
import {
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
  const summary = getArticleSummary(article, 260);
  const relatedPosts = getRelatedPosts(article, posts);

  return (
    <div className="min-h-screen bg-white text-brand-navy">
      <SiteHeader />
      <main>
        <article>
          <header className="relative isolate overflow-hidden border-b border-[#e5e4ec] bg-[#fbfbfe] px-5 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(24,189,177,0.13),transparent_26rem),radial-gradient(circle_at_86%_18%,rgba(97,90,132,0.16),transparent_30rem)]" />
            <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[linear-gradient(90deg,rgba(27,42,74,0.045)_1px,transparent_1px),linear-gradient(rgba(27,42,74,0.045)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(180deg,#000,transparent)]" />

            <div className="mx-auto grid max-w-[86rem] gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20">
              <div>
                <Link
                  href="/news-and-views/"
                  className="inline-flex rounded-full border border-[#18bdb1]/25 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1] shadow-[0_14px_36px_rgba(21,28,100,0.05)] transition hover:border-brand-navy hover:text-brand-navy"
                >
                  {getCategory(article)}
                </Link>
                <h1 className="mt-6 max-w-4xl text-[clamp(3.05rem,4.8vw,5.7rem)] font-semibold leading-[0.94] tracking-[-0.058em] text-brand-navy">
                  {article.title}
                </h1>
                {summary ? (
                  <p className="mt-7 max-w-3xl text-xl leading-9 text-[#595a5c]">
                    {summary}
                  </p>
                ) : null}
              </div>

              {article.firstImage ? (
                <figure className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#f1f0f5] shadow-[0_30px_90px_rgba(21,28,100,0.14)]">
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
                <div className="editorial-fallback aspect-[4/3] rounded-[2rem] shadow-[0_30px_90px_rgba(21,28,100,0.14)]" aria-hidden="true">
                  <span className="editorial-fallback-mark editorial-fallback-mark-large">CC</span>
                </div>
              )}
            </div>
          </header>

          <div className="mx-auto grid max-w-[86rem] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,820px)_18rem] lg:items-start lg:justify-center">
            <div className="min-w-0 rounded-[1.8rem] border border-[#e5e4ec] bg-white p-6 shadow-[0_20px_70px_rgba(21,28,100,0.055)] md:p-10">
              <div
                className="editorial-content"
                dangerouslySetInnerHTML={{ __html: getArticleHtml(article) }}
              />
            </div>

            <aside className="rounded-[1.6rem] border border-[#e2e1e9] bg-[#fbfbfe] p-6 shadow-[0_18px_55px_rgba(21,28,100,0.055)] lg:sticky lg:top-32">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">
                Deployment help
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em]">
                Need this translated into a network plan?
              </h2>
              <p className="mt-4 text-base leading-7 text-[#666a70]">
                Share your regions, devices and support needs with the CommsCloud team.
              </p>
              <Link
                href="/contact/"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#18bdb1] px-5 text-base font-semibold text-white transition hover:bg-brand-navy"
              >
                Start a brief
              </Link>
            </aside>
          </div>
        </article>

        {relatedPosts.length ? (
          <section className="border-y border-[#e5e4ec] bg-[#fbfbfe] px-5 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-[86rem]">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Keep reading</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-brand-navy md:text-5xl">
                    Related insights
                  </h2>
                </div>
                <Link href="/news-and-views/" className="text-lg font-semibold text-[#18bdb1] transition hover:text-brand-navy">
                  View all insights &rarr;
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

        <section className="bg-white px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-[86rem]">
            <div className="relative isolate overflow-hidden rounded-[2.2rem] bg-brand-navy p-8 text-white shadow-[0_28px_90px_rgba(21,28,100,0.2)] md:p-12">
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:58px_58px]" />
              <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#18bdb1]/25 blur-3xl" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">Talk to CommsCloud</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
                Build connectivity that stays visible across borders.
              </h2>
              <Link
                href="/contact/"
                className="mt-9 inline-flex min-h-14 items-center justify-center rounded-xl bg-[#18bdb1] px-8 text-base font-semibold text-white shadow-[0_16px_38px_rgba(24,189,177,0.28)] transition hover:bg-white hover:text-brand-navy"
              >
                Speak to an expert
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
