# Vercel and GitHub Deployment Checklist

Generated: 2026-06-19

## Completed Locally

- Local staging QA command: `npm run qa:staging`
- Production build command: `npm run build`
- Route QA, redirect QA, tracking QA, schema/OG/canonical post-build QA, source voice gate, and rendered voice gate.
- GitHub Actions workflow: `.github/workflows/staging-qa.yml`
- Lighthouse CI config: `site/.lighthouserc.cjs`

## GitHub

1. Create a private repository for this workspace.
2. Push the current branch.
3. Confirm Actions can install with `pnpm install --frozen-lockfile`.
4. Confirm the `Staging QA` workflow passes on `main`.

## Vercel

1. Create or import the project from the GitHub repository.
2. Use `site` as the project root.
3. Use install command `pnpm install --frozen-lockfile`.
4. Use build command `pnpm run build`.
5. Set `NEXT_PUBLIC_SITE_URL=https://commscloud.com`.
6. Keep preview deployments closed by default through non-production robots and metadata.

## Still Needs Client Input

- Definitive 85-row redirect map.
- `/embedded-sim/` mapping.
- Final noindex/delete/redirect decisions for the legacy content sheet.
- Sanity CMS approval and required editable content types.
- DNS cutover window, GSC access, analytics, and log drain destination.
