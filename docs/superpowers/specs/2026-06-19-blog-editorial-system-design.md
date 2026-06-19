# CommsCloud Blog Editorial System Design

## Objective

Create a shared editorial presentation for every migrated blog post and for the `/news-and-views/` and `/news-insights/` listing routes. The result must use the landing page's typography, spacing, navy/teal palette, button treatment, borders, header, and footer. Product and ordinary migrated pages must remain unchanged.

## Route Classification

- A route with `type: "post"` uses the new article template.
- `/news-and-views/` and `/news-insights/` use the new listing template.
- All other migrated routes continue through the existing generic migrated-page template.
- A dedicated `/contact/` route continues to take precedence over the catch-all route.

## Architecture

The catch-all route remains responsible for metadata lookup, schema output, and route validation. It delegates rendering to focused editorial components when the route is a blog post or known blog listing. Blog data is derived from the existing normalized `migrationRoutes` collection; no new CMS, API, or dependency is introduced.

Create reusable components under `site/src/components/editorial/`:

- `article-page.tsx`: renders one migrated post.
- `article-listing.tsx`: renders a listing from migrated post data.
- `article-card.tsx`: renders a consistent preview card shared by listings and related posts.
- `editorial-utils.ts`: derives category labels, readable dates, summaries, and related-post selections from migration data.

The generic page renderer keeps ownership of non-editorial migrated pages.

## Individual Article Structure

1. Existing `SiteHeader`.
2. Editorial hero with category label, article title, concise description, publication date, and author when available.
3. Featured image when `firstImage` exists; otherwise a branded navy/lavender visual field with a restrained dot-grid treatment.
4. Narrow article body optimized for long-form reading.
5. Related insights section containing up to three cards from the same top-level route category, excluding the current post.
6. Full-width teal/navy CTA directing users to `/contact/`.
7. Existing `SiteFooter`.

## Blog Listing Structure

1. Existing `SiteHeader`.
2. Landing-style editorial hero introducing CommsCloud insights.
3. Category filter links derived from post route families. Filters use query-string links and degrade safely when JavaScript is unavailable.
4. Three-column article card grid ordered by publication date, newest first. Cards include image or branded fallback, category, date, title, summary, and a `Read article` link.
5. A simple initial result limit with a link-based continuation pattern; no client-side animation or new state library is required.
6. Full-width CTA and existing `SiteFooter`.

## Visual System

- Reuse `--brand-navy`, `--brand-lavender`, `--brand-line`, and the existing teal `#18bdb1` accent.
- Reuse the landing page's Aptos-based font stack and heading weight conventions.
- Use white and pale lavender surfaces with square or lightly rounded containers consistent with current landing sections.
- Article titles use strong landing-page scale without exceeding the available reading width.
- Article body width remains approximately 760–820px for readable line length.
- Cards match the landing page's current capability-card proportions and restrained hover behavior.
- Images use stable aspect ratios and `object-fit: cover`; missing images never produce empty or broken containers.

## Content Normalization

- Existing migrated HTML remains the article source and continues to render through `dangerouslySetInnerHTML`.
- The current `wp-content` rules are refined into editorial typography rules for headings, paragraphs, lists, links, quotes, tables, and media.
- Empty legacy wrappers, duplicate title-like elements, and embedded layout debris are not interpreted as page structure; the editorial shell supplies the canonical title and metadata.
- Summary text prefers the route description, then excerpt text, then content preview.

## Responsive Behavior

- The hero and featured image stack vertically below desktop widths.
- Listing and related-post grids collapse from three columns to two and then one.
- Article typography scales down while preserving hierarchy and readable line length.
- Tables remain horizontally scrollable inside the article column without causing page-level overflow.

## Accessibility and Semantics

- Use semantic `article`, `header`, `nav`, `main`, `section`, and heading order.
- Featured and card images use route titles as meaningful alt text when no better migrated alt text is available.
- Links and filters retain visible keyboard focus states.
- Decorative fallback graphics are hidden from assistive technology.
- Color contrast follows the existing accessible navy/white and teal/navy combinations.

## Metadata and Structured Data

- Preserve current route-specific metadata and canonical URLs.
- Preserve article JSON-LD for post routes, including publication date, modification date, author, and publisher where available.
- Listing routes remain `WebPage` schema.

## Error and Empty States

- Missing routes continue to call `notFound()`.
- A listing with no matching posts displays a concise empty state and a link back to all insights.
- Missing dates, authors, images, or descriptions are omitted cleanly without blank labels.
- Malformed migrated media remains constrained by editorial CSS and cannot create horizontal page overflow.

## Verification Scope

Implementation should verify one image-backed post, one post without an image, both listing routes, and one ordinary migrated product page to confirm route isolation. Responsive verification should cover desktop and mobile widths. If the user explicitly requests no testing during implementation, verification is skipped and reported as such.

