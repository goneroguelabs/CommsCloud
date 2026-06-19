# CommsCloud Brief-to-Implementation Audit

**Audit date:** 19 June 2026  
**Compared sources:** Website Rebuild Brief (15 June 2026) and Competitor SEO/GEO Benchmark + Layered Enhancement Brief  
**Repository audited:** `C:\Users\Vansh\Documents\CommsCloud`  
**Status labels:** Complete, Partial, Missing, External/Unverifiable, Later phase

## Executive summary

The frontend rebuild and migration foundation exist, but the project is not ready for staging sign-off or cutover against the supplied briefs.

- **Implemented:** Next.js 16 application, 135 imported routes, same-path routing for those routes, trailing slashes, non-production noindex/robots blocking, sitemap generation, basic metadata/canonicals, homepage Organization/WebSite JSON-LD, a reusable but untyped JSON-LD renderer, migration/QA scripts, coverage UI, contact page, editorial templates, and both tracking-data files.
- **Partially implemented:** URL mapping, redirect handling, metadata preservation, schema layer, brand enforcement, bot access, image optimization, tracked URL basket, definition-first content, and cornerstone protection.
- **Missing or unverified:** 85 redirects, schema parity, FAQPage/HowTo backfill, typed schema factories, CMS/Sanity, explicit AI bot allowlist, dynamic OG images, Vercel log drain, Lighthouse CI, GitHub Actions, staging crawl diff, Vercel/GitHub deployment setup, post-launch monitoring, GSC cutover work, and formal sign-off artifacts.
- **Current blockers:** exact brand colors are wrong; lint fails; no successful production build is recorded; 79 rendered routes expose `the underlying platform`; 50 expose `seamless`; legacy off-topic ICT/AI posts remain live; only 5 redirects are configured; and the export has 136 published pages/posts rather than the brief's expected 138.

## Verification evidence

- TypeScript: `npx tsc --noEmit` passes.
- Lint: fails with one React hooks error and four `<img>` optimization warnings.
- Route crawl: 135 imported routes checked locally; 134 return HTTP 200 and `/more-info/` returns an intentional HTTP 308 redirect.
- Rendered-content scan: 0 `floLIVE` occurrences, 79 routes with `the underlying platform`, 50 routes with `seamless`, and one redirected route without a canonical response body.
- Existing QA scripts pass, but their checks are narrower than the briefs.
- Full `next build` did not complete within the available execution window, so production-build success is unverified.

## Phase 1 rebuild brief alignment

| Requirement | Status | Evidence and gap | Confidence |
|---|---|---|---:|
| Next.js rebuild | Complete | `site/package.json` uses Next.js 16.2.9 and React 19.2.4. | 1.00 |
| Deploy on Vercel Pro | External/Unverifiable | No `vercel.json`, Vercel project evidence, analytics config, or Git remote exists locally. | 0.98 |
| 1:1 URL mapping | Partial | Two `url-map.csv` artifacts contain 136 published rows and all old/new paths match. The app imports 135 routes because one vendor-named route is blocked. The brief expects 138. | 1.00 |
| Preserve exact money-page path | Complete | `/the-best-iot-sim-card/cloud-connect-sim-card/` exists with the same canonical path. | 1.00 |
| Match WordPress trailing slashes | Partial | `trailingSlash: true` is explicit in `site/next.config.ts`; no production-vs-staging crawl diff or written policy approval exists. | 1.00 |
| Preserve all 85 redirects | Missing | `site/next.config.ts` contains only 5 redirects. No 85-row redirect source exists in the repository. | 1.00 |
| Staging noindex and robots block | Complete in code | Non-production metadata sets `index:false, follow:false`; non-production `robots.txt` disallows `/`. No staging crawl report exists. | 0.99 |
| RankMath metadata preservation | Partial | Titles exist for all 135 imported routes, descriptions for 132, canonicals default for all. RankMath OG/Twitter data and schema are not imported. | 0.99 |
| RankMath schema parity | Missing | Source export has schema metadata on 28 published page/post routes. `routes.json` has no schema field; every migrated route receives only generic Article/WebPage JSON-LD. | 1.00 |
| FAQPage schema where Q&A exists | Missing | Homepage and migrated pages contain FAQs, but no FAQPage factory/output is implemented. `/dashcams/` source FAQ schema is dropped. | 1.00 |
| HowTo schema on process pages | Missing | No HowTo implementation; `/dashcams/` source HowTo schema is dropped. | 1.00 |
| Homepage Organization schema | Complete | `site/src/lib/schema.ts` defines Organization and WebSite schema with slogan, area served, brand, and topic relationships; homepage renders both. | 0.98 |
| Definition-first cornerstone content | Partial | `/iot-sim-card/` and the money page open definition-first. `/the-best-iot-sim-card/` opens with promotional copy rather than the specified formula. | 0.92 |
| Exact brand colors `#1B2A4A` and `#F5A623` | Missing | CSS uses navy `#151c64` and “gold” `#b9b4c9`. | 1.00 |
| No `floLIVE` client-facing | Partial | Current rendered crawl has 0 literal occurrences and the basic vendor check passes. Import replaces the term with `the underlying platform`, which is visible on 79 routes and is not acceptable final copy. | 1.00 |
| Ban AI-tell phrases | Missing | Source has 102 `seamless`, 51 `ecosystem`, 1 `synergy`, and 4 `holistic` matches. Rendered crawl exposes `seamless` on 50 routes. | 1.00 |
| Enforced voice/brand CI gate | Partial | `check-forbidden-terms.mjs` checks only `/flolive/i`; no pre-commit hook or GitHub workflow exists. | 1.00 |
| Preserve cleaned WordPress baseline | Mismatch | Legacy ICT/AI posts identified by the brief remain imported, linked in listings, and mostly indexable. | 1.00 |
| Protect five cornerstone clusters | Partial | Money page and cross-border hub plus all four border spokes exist. Full cornerstone briefs/schema requirements were not provided or implemented. | 0.90 |
| Preserve GSC priority landing pages | Partial | `/the-best-iot-sim-card/`, `/iot-sim-card/`, and `/remote-monitoring-systems/` exist. `/embedded-sim/` is absent and has no redirect; `/the-best-iot-sim-card/embedded-sims/` exists instead. | 1.00 |
| Migrate 138 published pages/posts | Missing against brief; source discrepancy | Current WP export contains 136 published pages/posts, not 138. Import exposes 135 plus one redirect for the blocked route. | 1.00 |
| Do not auto-migrate drafts | Complete | Import explicitly includes only `status === "publish"`. Export contains 117 draft/pending items; none are in runtime routes. | 1.00 |
| Draft triage with Peter | Missing/External | Draft artifacts exist, but no per-draft approval decisions or signed triage record exists. | 0.99 |
| Preserve internal links | Mostly complete | Import localizes `commscloud.com` links to relative paths. No full broken-link report or approved redirect map proves every target. | 0.93 |
| Preserve alt text and image references | Partial | Migrated HTML retains image attributes and references. Editorial hero/card templates replace original image alt text with page titles, and remote images use raw `<img>`. | 0.98 |
| Next.js Image optimization | Partial | Static site imagery uses `next/image` in some components; editorial and migrated content use raw `<img>`, producing lint warnings. | 1.00 |
| Auto-generated sitemap | Complete in code | `site/src/app/sitemap.ts` generates URLs from imported routes. Submission to GSC is external and not done. | 0.99 |
| Private CommsCloud GitHub repo | Missing/External | No Git remote is configured; most application files are currently untracked in the local repository. | 1.00 |
| CMS usable without developers | Missing | No Sanity dependency, config, schemas, Studio, import, preview, or revalidation exists. | 1.00 |
| Architecture/component approval | Partial/External | Internal design specs exist, but no dated Peter email approval artifact exists. | 0.93 |
| Staging sign-off | Missing/External | No staging crawl, Rich Results screenshots, brand audit sign-off, or deployed preview evidence exists. | 1.00 |
| Cutover and 72-hour monitoring | Missing/Not started | No DNS cutover, GSC reverification, sitemap submission, redirect spot-check, or monitoring record exists. | 1.00 |

## Tier 1 enhancement alignment

| Tier 1 item | Status | Evidence and gap | Confidence |
|---|---|---|---:|
| 1.1 Typed `JsonLd` + schema factories | Partial | Reusable `JsonLd` exists, but accepts `unknown`; no typed FAQPage, HowTo, Article, Product, Organization, or BreadcrumbList factories directory exists. | 1.00 |
| 1.2 Schema parity audit | Missing | Migration metadata audit exists, but no page-by-page schema type/gap matrix. Source has 28 published routes with schema metadata that runtime drops. | 1.00 |
| 1.3 CMS decision + initial schema | Missing | Brief recommends Sanity; no implementation or decision artifact exists in code. | 1.00 |
| 1.4 Trailing slash, canonical util, crawl diff | Partial | Trailing slash is locked. Canonicals are emitted directly in route metadata rather than through one policy utility. No crawl diff exists. | 1.00 |
| 1.5 Full voice/vendor CI gate | Partial | A local script checks only `floLIVE`; banned phrase list, built HTML scan, pre-commit hook, and GitHub Action are missing. | 1.00 |
| 1.6 Explicit AI bot allowlist | Missing | Production robots has only `User-agent: * / Allow: /`; no explicit GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, or CCBot entries. | 1.00 |
| 1.7 Dynamic OG image route | Missing | No `opengraph-image.tsx`, `ImageResponse`, or `@vercel/og` route. RankMath OG images are not imported. | 1.00 |
| 1.8 AI crawler server-log shipping | External/Unverifiable | No repository or Vercel configuration for Axiom, BetterStack, Logflare, or a log drain. | 0.98 |
| 1.9 Lighthouse CI budgets | Missing | No `.lighthouserc.*`, Lighthouse dependency, or GitHub workflow. Current lint also fails. | 1.00 |
| 1.10 tracked URLs and prompts | Partial | `tracked-prompts.ts` contains all 15 prompts. `tracked-urls.ts` contains only 7 URLs instead of the required 21-item basket. | 1.00 |

## Tier 2 / Phase 1.5 status

These were explicitly scheduled after cutover, so missing items are not Phase 1 scope failures unless their Tier 1 prerequisites are also missing.

| Item | Status | Current state | Confidence |
|---|---|---|---:|
| 2.1 FAQPage backfill | Not started | No FAQPage output. | 1.00 |
| 2.2 HowTo schema | Not started | No HowTo output. | 1.00 |
| 2.3 “What is CommsCloud?” entity enhancement | Partial | Organization schema exists, but has no `sameAs`; `/about-us/` is not the specified entity enhancement. | 0.97 |
| 2.4 Coverage rebuild / 53 countries | Partial | A custom interactive coverage page exists, but no 53 country pages and no Place/Service schema. | 1.00 |
| 2.5 Five competitor comparison pages | Not started | No `/compare/` routes. | 1.00 |
| 2.6 Four GSC meta rewrites | Partial/Unverified | Imported titles/descriptions exist for several targets; no tracked rewrite task or approval. `/embedded-sim/` is missing. | 0.92 |
| 2.7 Consumer mobile-networks post decision | Not started | The post remains live and indexable under `/news-and-views/ict/…`. | 1.00 |
| 2.8 Cornerstone internal-link pass | Not started | Link counts are sparse; several cornerstone paths have zero direct migrated-content links. | 0.96 |
| 2.9 Five-market country SEO pilot | Not started | Only `/dashcams/south-africa/` resembles a market page; no programmatic pilot structure. | 1.00 |
| 2.10 Reddit/YouTube seeding | External/Unverifiable | No campaign evidence in repository. | 0.98 |

## Tier 3 / Phase 2 status

All are correctly unimplemented for the current phase:

- No `/use-cases/` route tree.
- No customer-story/case-study system.
- No developer REST API documentation surface.
- No `/glossary/[term]/` system.
- No multilingual routes or hreflang.
- Contact form uses `mailto:` and is not connected to Insightly/Make.com.
- No 53-country expansion.

## Engineering and release health

| Check | Status | Detail |
|---|---|---|
| TypeScript | Pass | `npx tsc --noEmit` exits 0. |
| ESLint | Fail | One `react-hooks/set-state-in-effect` error in `count-up-stats.tsx`; four raw-image warnings. |
| Production build | Unverified | Previous `next build` exceeded the execution window and ended with timeout/EPIPE; no successful build artifact exists. |
| Route availability | Mostly pass | 134 imported routes return 200; `/more-info/` returns configured 308. No imported route returned 404/500 in the local crawl. |
| Canonicals | Mostly pass | Every 200 route rendered a canonical in the local crawl; redirected `/more-info/` has no response-body canonical, as expected. |
| Sitemap | Generated | Runtime sitemap exists. It should be checked against noindex/deleted decisions before cutover. |
| Robots | Staging safe | Local/preview blocks all crawlers. Production lacks required explicit AI bot blocks. |
| Repository readiness | Fail | No remote and the application directory is untracked, so CI/Vercel handoff is not ready. |

## External decisions and artifacts still required

1. Confirm Sanity as the CMS.
2. Provide/approve the definitive 85 redirects.
3. Resolve the brief/export count mismatch: 138/109 in the brief vs 136/117 in the supplied export.
4. Provide final T10B noindex/delete decisions, especially the legacy ICT/AI corpus.
5. Decide the missing `/embedded-sim/` mapping.
6. Reconcile exact brand colors; both briefs require `#1B2A4A` and `#F5A623`, while the implementation uses the older palette.
7. Approve the URL map, architecture, staging build, and cutover in dated records.
8. Provide Vercel, GitHub, GSC, DNS, and monitoring access/configuration.
9. Confirm the cutover window and post-launch ranking monitoring ownership.

## Recommended completion order

### P0 — before staging sign-off

1. Put the site in the private CommsCloud repository and configure Vercel preview deployments.
2. Fix exact brand tokens.
3. Resolve source inventory and URL-map count discrepancies.
4. Load and test all 85 redirects, including `/embedded-sim/`.
5. Remove or correctly noindex the off-brand legacy corpus.
6. Replace all client-facing vendor placeholders and enforce the complete voice gate in CI.
7. Import and reproduce RankMath schema; add typed schema factories.
8. Preserve OG metadata/images and switch critical imagery to `next/image`.
9. Fix lint and obtain a successful production build.
10. Run production-vs-staging crawl diff and Rich Results checks.

### P1 — complete Tier 1 infrastructure

1. Add explicit AI bot allowlist.
2. Add dynamic OG image fallback.
3. Configure crawler-aware Vercel log drain.
4. Add Lighthouse CI budgets and workflow.
5. Expand `tracked-urls.ts` to the required 21 URLs.
6. Confirm Sanity and commit initial CMS schema/preview plan.

### P2 — cutover and post-launch

1. Obtain staging and go/no-go approvals.
2. Switch DNS, reverify GSC, submit sitemap, and spot-check redirects.
3. Monitor days 1, 3, 7, and 14 against the pre-launch baseline.

