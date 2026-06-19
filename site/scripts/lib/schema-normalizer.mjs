import { unserializePhp } from "./php-unserialize.mjs";

const schemaKeyPattern = /^(?:article_schema|rank_math_schema_(?!.*shortcode))/i;

export function normalizeSchemaMeta(schemaMeta, route) {
  const schemas = [];
  const sourceKeys = [];
  const unresolvedKeys = [];

  for (const [key, rawValue] of Object.entries(schemaMeta ?? {})) {
    if (!schemaKeyPattern.test(key) || !rawValue) continue;
    sourceKeys.push(key);
    try {
      const parsed = parseSchemaValue(rawValue);
      const normalized = resolvePlaceholders(stripRankMathMetadata(parsed), route);
      if (isSchema(normalized)) {
        schemas.push({
          "@context": normalized["@context"] ?? "https://schema.org",
          ...normalized,
        });
      } else {
        unresolvedKeys.push(key);
      }
    } catch {
      unresolvedKeys.push(key);
    }
  }

  return {
    schemas: deduplicateSchemas(schemas),
    sourceKeys,
    unresolvedKeys,
  };
}

function parseSchemaValue(value) {
  const trimmed = String(value).trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  return unserializePhp(trimmed);
}

function stripRankMathMetadata(value) {
  if (Array.isArray(value)) return value.map(stripRankMathMetadata);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "metadata")
      .map(([key, entry]) => [key, stripRankMathMetadata(entry)]),
  );
}

function resolvePlaceholders(value, route) {
  if (Array.isArray(value)) return value.map((entry) => resolvePlaceholders(entry, route));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, resolvePlaceholders(entry, route)]),
    );
  }
  if (typeof value !== "string") return value;

  const replacements = new Map([
    ["%seo_title%", route.seoTitle],
    ["%seo_description%", route.description],
    ["%url%", route.url],
    ["%post_author%", route.author],
    ["%post_thumbnail%", route.firstImage],
    ["%keywords%", route.focusKeyword],
    ["%primary_taxonomy_terms%", route.categories.join(", ")],
    ["%date(Y-m-dTH:i:sP)%", route.date],
    ["%modified(Y-m-dTH:i:sP)%", route.modified],
  ]);

  let output = value;
  for (const [placeholder, replacement] of replacements) {
    output = output.replaceAll(placeholder, replacement ?? "");
  }
  return output;
}

function isSchema(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && value["@type"]);
}

function deduplicateSchemas(schemas) {
  const seen = new Set();
  return schemas.filter((schema) => {
    const signature = `${schema["@type"]}:${schema.url ?? schema.name ?? schema.headline ?? ""}`;
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}
