import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeSchemaMeta } from "./lib/schema-normalizer.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourcePath =
  process.env.WP_MIGRATION_JSON ??
  join(root, "../migration-output-2026-06-17/content-full.json");
const outputPath = join(root, "src/data/migration/routes.json");

function stripScripts(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

const forbiddenPattern = /flo\s*live/i;

function normalizeTypography(value) {
  return value
    .replace(/\u00e2\u20ac\u201d/g, " - ")
    .replace(/\u00e2\u20ac\u201c/g, " - ")
    .replace(/\u00e2\u20ac\u2122/g, "'")
    .replace(/\u00e2\u20ac\u02dc/g, "'")
    .replace(/\u00e2\u20ac\u0153/g, '"')
    .replace(/\u00e2\u20ac\u009d/g, '"')
    .replace(/\u00e2\u20ac\ufffd/g, '"')
    .replace(/\u00e2\u20ac\u00a6/g, "...")
    .replace(/\u00e2\u20ac\u2039/g, "")
    .replace(/\u00e2\u0153\u2026\s*/g, "")
    .replace(/\u00c2\u00b7/g, " / ")
    .replace(/\u00e2\u2020\u2019/g, "->")
    .replace(/\u00e2\u2020\u201d/g, "<->")
    .replace(/\u00e2\u20ac\u00a2/g, "- ")
    .replace(/\u00e2\u009d\u0152/g, "No:")
    .replace(/\u00ef\u00b8\u008f/g, "")
    .replace(/\u00e2\u0161\u2122/g, "")
    .replace(/\u00e2\u0161/g, "")
    .replace(/\u00f0\u0178\u2018\u2030/g, "")
    .replace(/\u00f0\u0178\u201c\u00a9/g, "")
    .replace(/\u00f0\u0178\u2019\u00a1/g, "")
    .replace(/\u00f0\u0178\u201c\u0160/g, "")
    .replace(/\u00f0\u0178\u201d\u2019/g, "")
    .replace(/\u00f0\u0178\u0152\u008d/g, "")
    .replace(/\u00f0\u0178\u00a7\u00a9/g, "")
    .replace(/\u00f0\u0178\u0161\u0161/g, "")
    .replace(/\u00f0\u0178\u203a\u00a1/g, "")
    .replace(/\u00f0\u0178\u0152\u00be/g, "")
    .replace(/\u00f0\u0178\u201c\u017e/g, "")
    .replace(/\u00c3\u00a9/g, "e")
    .replace(/\u00c2\u00b0/g, " degrees")
    .replace(/\u00c2\u00b4/g, "'")
    .replace(/\u00e2\u201a\u00ac/g, "EUR")
    .replace(/\u00e2\u0081/g, "")
    .replace(/\u00e2\u201e\s*-\s*MN/g, "PLMN")
    .replace(/\u00e2\u201e/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/→/g, "->")
    .replace(/↔/g, "<->")
    .replace(/•/g, "- ")
    .replace(/·/g, " / ")
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[\u200b\u2060\ufe0f]/g, "")
    .replace(/[\u2014\u2013]/g, " - ")
    .replace(/\u00a0/g, " ")
    .replace(/\u00c2(?=\s|&nbsp;|$)/g, "");
}

function sanitizeForbiddenTerms(value) {
  return normalizeTypography(
    value
      .replace(/https?:\/\/(?:www\.)?flo\s*live\.net\/?[^\s"'<>)]*/gi, "#")
      .replace(/flo\s*live's/gi, "the connectivity platform's")
      .replace(/flo\s*live/gi, "the connectivity platform"),
  );
}

function sanitizeHtml(html) {
  return sanitizeForbiddenTerms(stripScripts(html))
    .replace(/\[wpu_silo(?:\s+[^\]]*)?\]/gi, "")
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, "")
    .replace(/\sdata-(start|end)="[^"]*"/g, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\shref="#"/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function toText(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|h1|h2|h3|li|blockquote)>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function routeSegments(path) {
  return path.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
}

function firstImage(html) {
  const match = html.match(/<img\b[^>]*\bsrc="([^"]+)"/i);
  return match?.[1] ?? "";
}

function hasForbidden(value) {
  return forbiddenPattern.test(value);
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));
const blockedRoutes = [];
const routes = source
  .filter(
    (item) =>
      ["page", "post"].includes(item.post_type) && item.status === "publish",
  )
  .filter((item) => {
    if (hasForbidden(`${item.path}\n${item.url}`)) {
      blockedRoutes.push({
        id: item.post_id,
        type: item.post_type,
        title: sanitizeForbiddenTerms(decodeEntities(item.title ?? "")),
        reason: "Forbidden vendor term appears in the client-facing URL.",
      });
      return false;
    }
    return true;
  })
  .map((item) => {
    const rawFields = [
      item.title,
      item.content,
      item.excerpt,
      item.seo_title,
      item.seo_description,
      item.focus_keyword,
      JSON.stringify(item.meta ?? {}),
      JSON.stringify(item.schema_meta ?? {}),
    ].join("\n");
    const contentHtml = sanitizeHtml(item.content ?? "");
    const excerptHtml = sanitizeHtml(item.excerpt ?? "");
    const contentText = toText(contentHtml);
    const title = sanitizeForbiddenTerms(decodeEntities(item.title ?? ""));
    const rawSeoTitle = decodeEntities(item.seo_title ?? "").trim();
    const seoTitle = sanitizeForbiddenTerms(
      rawSeoTitle && rawSeoTitle !== "%title%" ? rawSeoTitle : title,
    );
    const description = sanitizeForbiddenTerms(
      decodeEntities(
        item.seo_description ||
          item.excerpt ||
          contentText.slice(0, 155),
      ),
    );
    const categories = (item.categories ?? []).map((category) =>
      sanitizeForbiddenTerms(category),
    );
    const tags = (item.tags ?? []).map((tag) => sanitizeForbiddenTerms(tag));
    const routeFirstImage = firstImage(contentHtml);
    const focusKeyword = sanitizeForbiddenTerms(item.focus_keyword ?? "");
    const schemaImport = normalizeSchemaMeta(item.schema_meta ?? {}, {
      title,
      seoTitle,
      description,
      url: item.url,
      date: item.post_date,
      modified: item.modified,
      author: item.author,
      firstImage: routeFirstImage,
      focusKeyword,
      categories,
    });

    return {
      id: item.post_id,
      type: item.post_type,
      title,
      seoTitle,
      description,
      path: item.path,
      slug: routeSegments(item.path),
      url: item.url,
      date: item.post_date,
      modified: item.modified,
      author: item.author,
      categories,
      tags,
      canonical: item.canonical || item.path,
      robots: item.robots || "",
      focusKeyword,
      featuredImage: item.featured_image_id ?? "",
      firstImage: routeFirstImage,
      schemaBlocks: schemaImport.schemas,
      schemaSourceKeys: schemaImport.sourceKeys,
      schemaUnresolvedKeys: schemaImport.unresolvedKeys,
      contentHtml,
      excerptHtml,
      contentTextPreview: contentText.slice(0, 320),
      contentLength: contentHtml.length,
      hadForbiddenVendorTerm: hasForbidden(rawFields),
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const forbiddenAfterSanitize = routes.filter((route) =>
  hasForbidden(JSON.stringify(route)),
);

if (forbiddenAfterSanitize.length > 0) {
  console.error("Forbidden vendor term remains after import:");
  for (const route of forbiddenAfterSanitize) {
    console.error(`- ${route.path}`);
  }
  process.exit(1);
}

await mkdir(dirname(outputPath), { recursive: true });
const schemaParityPath = join(dirname(sourcePath), "schema-parity.csv");
await writeFile(
  schemaParityPath,
  [
    ["path", "source_schema_keys", "imported_schema_types", "unresolved_keys", "status"],
    ...routes.map((route) => [
      route.path,
      route.schemaSourceKeys.join(" | "),
      route.schemaBlocks.map((schema) => schema["@type"]).join(" | "),
      route.schemaUnresolvedKeys.join(" | "),
      route.schemaUnresolvedKeys.length
        ? "needs-review"
        : route.schemaBlocks.length
          ? "imported"
          : "no-source-schema",
    ]),
  ]
    .map((row) => row.map(csvCell).join(","))
    .join("\n") + "\n",
);
await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      source: sourcePath,
      generatedAt: new Date().toISOString(),
      count: routes.length,
      blockedRouteCount: blockedRoutes.length,
      blockedRoutes,
      sanitizedForbiddenRouteCount: routes.filter(
        (route) => route.hadForbiddenVendorTerm,
      ).length,
      routes,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `Imported ${routes.length} WordPress routes to ${outputPath}. Blocked ${
    blockedRoutes.length
  } route with forbidden vendor terms in the URL. Sanitized ${
    routes.filter((route) => route.hadForbiddenVendorTerm).length
  } routes with forbidden vendor terms.`,
);

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
