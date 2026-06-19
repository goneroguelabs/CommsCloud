import migrationData from "@/data/migration/routes.json";
import type { Schema } from "@/lib/schema";

export type MigrationRoute = (typeof migrationData.routes)[number];

export function localizeMigratedHtml(html: string) {
  return html
    .replace(
      /\b(href|action)=("|')https?:\/\/(?:www\.)?commscloud\.com(\/[^"']*)\2/gi,
      (_match, attribute: string, quote: string, path: string) => `${attribute}=${quote}${path}${quote}`,
    )
    .replace(
      /\b(href|action)=("|')https?:\/\/(?:www\.)?commscloud\.com\2/gi,
      (_match, attribute: string, quote: string) => `${attribute}=${quote}/${quote}`,
    )
    .replace(
      /<p>\s*(?:<a\b[^>]*>\s*)?Read\s+More\s+below\s*(?:-{2,}|&mdash;|&#8212;|\u2014)?\s*(?:-&gt;|\u2192|&gt;)?\s*(?:<\/a>)?\s*(?:<br\s*\/?>\s*)*<\/p>/gi,
      "",
    )
    .replace(
      /(?:<br\s*\/?>\s*)?Read\s+More\s+below\s*(?:-{2,}|&mdash;|&#8212;|\u2014)?\s*(?:-&gt;|\u2192|&gt;)?\s*(?:<br\s*\/?>\s*)*/gi,
      "",
    );
}

export const migrationRoutes = migrationData.routes.map((route) => ({
  ...route,
  description: cleanMigratedSummary(route.description),
  excerptHtml: cleanMigratedSummary(route.excerptHtml),
  contentTextPreview: cleanMigratedSummary(route.contentTextPreview),
  contentHtml: localizeMigratedHtml(route.contentHtml),
}));

function cleanMigratedSummary(value: string) {
  return value
    .replace(/\s*Read\s+More\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePath(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean.endsWith("/") ? clean : `${clean}/`;
}

export function findMigrationRoute(path: string) {
  const normalized = normalizePath(path);
  return migrationRoutes.find((route) => route.path === normalized);
}

export function routePathFromSegments(segments: string[] = []) {
  return normalizePath(segments.join("/"));
}

export function importedSchemas(route: MigrationRoute): readonly Schema[] {
  return route.schemaBlocks as unknown as readonly Schema[];
}
