# Sitewide mobile optimization design

## Objective

Make the CommsCloud website usable and visually coherent from 320px phone widths through tablet layouts while preserving the established desktop design and content.

## Scope

- Apply to the shared header and footer, homepage, migrated content pages, editorial pages, contact page, and coverage explorer.
- Preserve the current brand palette, typography, content, URLs, and desktop mega-menu.
- Add no runtime dependencies.

## Responsive design

The shared header will use a compact mobile layout with the logo, a menu trigger, and an off-canvas navigation panel. The panel will expose all primary destinations and grouped links without relying on hover. It will close through an explicit button and after navigation, lock background scrolling while open, expose a dialog label, and retain visible keyboard focus.

Phone layouts will use fluid type scales, 16-20px page gutters, at least 44px interactive targets, and single-column content where side-by-side layouts become cramped. Large visual elements such as the globe, statistics, timeline, coverage controls, tables, and long imported content will remain contained within the viewport. Tablet layouts will retain useful multi-column arrangements where they fit.

## Implementation boundaries

- `site-header.tsx` remains the source of navigation data and renders both desktop and mobile navigation.
- `globals.css` owns shared responsive rules and component-level mobile overrides.
- Existing page components receive only targeted class changes when CSS alone cannot express the correct behavior.
- A source-contract test will guard the mobile menu semantics and critical overflow/touch-target rules because the repository currently has no component test harness.

## Verification

- Run the mobile contract test through Node's built-in test runner.
- Run ESLint and a production Next.js build.
- Inspect representative homepage, migrated content, contact, editorial, and coverage routes at phone and tablet viewport widths, checking horizontal overflow and navigation behavior.
