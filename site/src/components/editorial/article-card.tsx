import Link from "next/link";
import Image from "next/image";
import type { MigrationRoute } from "@/lib/migration-content";
import {
  formatArticleDate,
  getArticleSummary,
  getCategory,
} from "./editorial-utils";

type ArticleCardProps = {
  article: MigrationRoute;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const date = formatArticleDate(article.date);
  const summary = getArticleSummary(article, compact ? 125 : 175);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-[#f2f2f5] text-brand-navy">
      <Link href={article.path} className="block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#18bdb1]">
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#707684]">
          <span>{getCategory(article)}</span>
          {date ? <span aria-hidden="true" className="text-[#18bdb1]">/</span> : null}
          {date ? <time dateTime={article.date}>{date}</time> : null}
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
          className="mt-auto inline-flex items-center justify-between gap-4 pt-8 text-lg font-medium text-[#0ebdb0] transition hover:text-brand-navy focus-visible:text-brand-navy"
        >
          Read article
          <span aria-hidden="true" className="text-2xl leading-none">→</span>
        </Link>
      </div>
    </article>
  );
}
