import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const appDir = join(root, ".next/server/app");
const migrationData = JSON.parse(
  await readFile(new URL("../src/data/migration/routes.json", import.meta.url), "utf8"),
);
const errors = [];

const sitemap = await readText(join(appDir, "sitemap.xml.body"));
const sitemapUrls = new Set(
  Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]),
);
const indexableRoutes = migrationData.routes.filter(
  (route) => route.path !== "/" && !route.robots.includes("noindex"),
);
const noindexRoutes = migrationData.routes.filter((route) =>
  route.robots.includes("noindex"),
);

for (const route of indexableRoutes) {
  if (!sitemapUrls.has(`https://commscloud.com${route.path}`)) {
    errors.push(`Sitemap missing indexable route: ${route.path}`);
  }
}

for (const route of noindexRoutes) {
  if (sitemapUrls.has(`https://commscloud.com${route.path}`)) {
    errors.push(`Sitemap includes noindex route: ${route.path}`);
  }
}

for (const route of migrationData.routes.filter(
  (entry) => entry.path !== "/" && !entry.robots.includes("noindex"),
)) {
  const html = await readRouteHtml(route.path);
  if (!html) {
    if (isTrackedRoute(route.path)) {
      errors.push(`Missing built HTML for tracked route: ${route.path}`);
    }
    continue;
  }

  const canonicalUrl = normalizeCanonical(route.canonical || route.path);
  const canonical = `rel="canonical" href="${canonicalUrl}"`;
  if (!html.includes(canonical)) {
    errors.push(`Missing canonical for ${route.path}`);
  }

  if (!isDedicatedRoute(route.path) && !html.includes('type="application/ld+json"')) {
    errors.push(`Missing JSON-LD for ${route.path}`);
  }

  if (!html.includes('property="og:title"') || !html.includes('property="og:image"')) {
    errors.push(`Missing OG metadata for ${route.path}`);
  }
}

const dashcams = await readRouteHtml("/dashcams/");
if (!dashcams?.includes('"@type":"FAQPage"') || !dashcams.includes('"@type":"HowTo"')) {
  errors.push("Dashcams route is missing imported FAQPage or HowTo schema.");
}

if (errors.length) {
  console.error("Built-route QA failed:");
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`- ...and ${errors.length - 80} more`);
  process.exit(1);
}

console.log(
  `Built-route QA passed. ${indexableRoutes.length} sitemap URLs and ${migrationData.routes.length - 1} built routes checked.`,
);

async function readText(path) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

async function readRouteHtml(path) {
  const candidates = routeHtmlCandidates(path);
  for (const candidate of candidates) {
    const text = await readText(candidate);
    if (text) return text;
  }
  return "";
}

function routeHtmlCandidates(path) {
  const normalized = path.replace(/^\/|\/$/g, "");
  if (!normalized) return [join(appDir, "index.html")];
  return [
    join(appDir, `${normalized}.html`),
    join(appDir, normalized, "index.html"),
  ];
}

function normalizeCanonical(path) {
  if (path.startsWith("https://")) return path;
  return `https://commscloud.com${path}`;
}

function isDedicatedRoute(path) {
  return path === "/contact/" || path === "/commscloud-coverage-map/";
}

function isTrackedRoute(path) {
  return new Set([
    "/the-best-iot-sim-card/cloud-connect-sim-card/",
    "/the-best-iot-sim-card/",
    "/iot-sim-card/",
    "/remote-monitoring-systems/",
    "/private-apn-vpn/",
    "/dashcams/",
  ]).has(path);
}
