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
    );
}

export const migrationRoutes = migrationData.routes.map((route) => ({
  ...route,
  contentHtml: localizeMigratedHtml(route.contentHtml),
}));

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
