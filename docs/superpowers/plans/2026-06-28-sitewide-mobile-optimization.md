# Sitewide Mobile Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a sitewide mobile experience with complete navigation, readable layouts, safe overflow behavior, and accessible touch targets.

**Architecture:** Keep the desktop navigation and visual system intact. Add a client-side mobile navigation component backed by the existing navigation model, then centralize phone and tablet layout corrections in the current global stylesheet with minimal page-level class changes.

**Tech Stack:** Next.js 16.2.9, React 19.2.4, TypeScript, Tailwind CSS 4, global CSS, Node test runner

## Global Constraints

- Support viewport widths down to 320px.
- Preserve desktop styling and all existing content and routes.
- Add no runtime dependencies.
- Keep interactive targets at least 44px high or wide on touch layouts.
- Avoid document-level horizontal overflow; local table and data scrollers remain allowed.

---

### Task 1: Responsive contract test

**Files:**
- Create: `site/tests/mobile-responsive.test.mjs`
- Modify: `site/package.json`

**Interfaces:**
- Consumes: shared header source and global CSS text
- Produces: `pnpm test:mobile`, a repeatable source-contract verification command

- [ ] **Step 1: Write failing tests** asserting that the header exposes a mobile menu trigger, labelled dialog, close action, and that the CSS defines mobile touch targets and overflow containment.
- [ ] **Step 2: Run `pnpm test:mobile`** and confirm failure because the mobile navigation and CSS contracts do not exist.
- [ ] **Step 3: Add the `test:mobile` script** using `node --test tests/mobile-responsive.test.mjs`.

### Task 2: Accessible mobile navigation

**Files:**
- Modify: `site/src/components/layout/site-header.tsx`

**Interfaces:**
- Consumes: existing `navigation` data and Next.js `Link`/`Image`
- Produces: touch-accessible menu trigger, backdrop, navigation dialog, grouped primary links, and close behavior

- [ ] **Step 1: Convert the header to a client component** and add menu state, Escape handling, and scroll locking.
- [ ] **Step 2: Render compact phone controls** while retaining the existing desktop mega-menu at `lg` widths.
- [ ] **Step 3: Render the labelled mobile dialog** with complete navigation, explicit close control, backdrop dismissal, and focus-visible styles.
- [ ] **Step 4: Run `pnpm test:mobile`** and confirm the navigation assertions pass.

### Task 3: Sitewide phone and tablet layout hardening

**Files:**
- Modify: `site/src/app/globals.css`
- Modify if required: `site/src/app/page.tsx`
- Modify if required: `site/src/app/commscloud-coverage-map/page.tsx`

**Interfaces:**
- Consumes: existing component class names and CSS custom properties
- Produces: fluid mobile type, spacing, stacking, viewport containment, and touch sizing across shared route templates

- [ ] **Step 1: Add shared mobile primitives** for gutters, wrapping, media containment, focus, and 44px controls.
- [ ] **Step 2: Correct homepage layouts** for hero/globe, stats, handoff, principles, timeline, and FAQ at phone widths.
- [ ] **Step 3: Correct route templates** for imported content, editorial content, contact, footer, and coverage explorer.
- [ ] **Step 4: Run `pnpm test:mobile`** and confirm all responsive contracts pass.

### Task 4: Full verification

**Files:**
- Verify all modified files

**Interfaces:**
- Consumes: final implementation
- Produces: build, lint, and responsive inspection evidence

- [ ] **Step 1: Run `pnpm lint`.** Expected: exit code 0.
- [ ] **Step 2: Run `pnpm build`.** Expected: exit code 0 and all routes generated.
- [ ] **Step 3: Inspect representative routes** at 320x568, 390x844, and 768x1024, confirming no page-level horizontal overflow and working navigation.
- [ ] **Step 4: Review `git diff`** for unrelated or accidental changes.
