import type { MigrationRoute } from "@/lib/migration-content";

const listingPaths = new Set(["/news-and-views/", "/news-insights/"]);

const editorialPagePrefixes = [
  "/iot-sim-card/",
  "/iot-connectivity-in-africa/",
  "/the-best-iot-sim-card/",
  "/connectivity-as-a-strategy/",
];

const editorialPagePaths = new Set(["/connectivity-management-portal/"]);

const categoryLabels: Record<string, string> = {
  "news-and-views": "News & views",
  "the-best-iot-sim-card": "IoT SIM guidance",
  "iot-connectivity": "IoT connectivity",
  "iot-connectivity-in-africa": "IoT in Africa",
  "iot-sim-card": "IoT SIM guides",
  "connectivity-as-a-strategy": "Connectivity strategy",
  "connectivity-management-portal": "SIM management",
  "onboarding-testing-iot-devices-hardware": "Device onboarding",
};

export function isEditorialListing(path: string) {
  return listingPaths.has(path);
}

export function isEditorialArticle(route: MigrationRoute) {
  if (route.type === "post") return true;
  if (isEditorialListing(route.path)) return false;
  if (editorialPagePaths.has(route.path)) return true;
  return editorialPagePrefixes.some((prefix) => route.path.startsWith(prefix));
}

export function getCategoryKey(route: MigrationRoute) {
  return route.path.split("/").filter(Boolean)[0] || "insights";
}

export function getCategory(route: MigrationRoute) {
  const key = getCategoryKey(route);
  return categoryLabels[key] || titleCase(key);
}

export function formatArticleDate(date?: string) {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function getArticleSummary(route: MigrationRoute, maxLength = 190) {
  const source = route.description || route.excerptHtml || route.contentTextPreview || "";
  const clean = decodeEntities(stripHtml(source)).replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

export function getArticleHtml(route: MigrationRoute) {
  let html = route.contentHtml
    .replace(/^\s*\[caption[^\]]*\]/i, "")
    .replace(/\[\/caption\]/gi, "");

  if (route.firstImage) {
    html = html
      .replace(/^\s*<p>\s*<img\b[^>]*>\s*<\/p>/i, "")
      .replace(/^\s*<img\b[^>]*>/i, "");
  }

  return html;
}

export function sortPosts(posts: MigrationRoute[]) {
  return [...posts].sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
}

export function getRelatedPosts(
  current: MigrationRoute,
  posts: MigrationRoute[],
  limit = 3,
) {
  const currentCategory = getCategoryKey(current);
  const candidates = sortPosts(posts.filter((post) => post.path !== current.path));
  const sameCategory = candidates.filter(
    (post) => getCategoryKey(post) === currentCategory,
  );
  return [...sameCategory, ...candidates.filter((post) => getCategoryKey(post) !== currentCategory)].slice(
    0,
    limit,
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    "&amp;": "&",
    "&quot;": '"',
    "&#039;": "'",
    "&#39;": "'",
    "&apos;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&ndash;": "–",
    "&mdash;": "—",
    "&hellip;": "…",
  };

  return value
    .replace(/&(amp|quot|#039|#39|apos|lt|gt|nbsp|ndash|mdash|hellip);/g, (entity) => named[entity] || entity)
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

function titleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
