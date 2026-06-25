import Image from "next/image";
import Link from "next/link";
import type { MigrationRoute } from "@/lib/migration-content";
import {
  getArticleSummary,
  getCategory,
} from "./editorial-utils";

type ArticleCardProps = {
  article: MigrationRoute;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const summary = getArticleSummary(article, compact ? 125 : 175);

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[1.55rem] border border-[#e2e1e9] bg-white text-brand-navy shadow-[0_18px_55px_rgba(21,28,100,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#18bdb1]/70 hover:shadow-[0_28px_76px_rgba(21,28,100,0.11)]">
      <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-[#18bdb1] via-[#b9b4c9] to-transparent opacity-0 transition group-hover:opacity-100" />
      <Link
        href={article.path}
        className="block overflow-hidden bg-[#f2f1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#18bdb1]"
      >
        {article.firstImage ? (
          <Image
            src={article.firstImage}
            alt={article.title}
            width={900}
            height={562}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="editorial-fallback aspect-[16/10]" aria-hidden="true">
            <span className="editorial-fallback-mark">CC</span>
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-6" : "p-7 md:p-8"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#18bdb1]">
          <span>{getCategory(article)}</span>
        </div>

        <h3 className={`${compact ? "mt-4 text-2xl" : "mt-5 text-[2rem]"} font-semibold leading-[1.12] tracking-[-0.035em]`}>
          <Link href={article.path} className="transition hover:text-[#18bdb1] focus-visible:text-[#18bdb1]">
            {article.title}
          </Link>
        </h3>

        {summary ? (
          <p className="mt-5 text-base leading-7 text-[#707684]">{summary}</p>
        ) : null}

        <Link
          href={article.path}
          className="mt-auto inline-flex items-center justify-between gap-4 pt-8 text-base font-semibold text-[#0ebdb0] transition hover:text-brand-navy focus-visible:text-brand-navy"
        >
          Read more
          <span aria-hidden="true" className="text-2xl leading-none transition group-hover:translate-x-1">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
