import { readFile } from "node:fs/promises";
import { trackedPrompts } from "../src/data/tracked-prompts.ts";
import { trackedUrls } from "../src/data/tracked-urls.ts";

const errors = [];
const migrationData = JSON.parse(
  await readFile(new URL("../src/data/migration/routes.json", import.meta.url), "utf8"),
);
const paths = new Set([
  "/contact/",
  "/commscloud-coverage-map/",
  ...migrationData.routes.map((route) => route.path),
]);
const seen = new Set();

if (trackedUrls.length !== 21) {
  errors.push(`Expected 21 tracked URLs, found ${trackedUrls.length}.`);
}

for (const item of trackedUrls) {
  if (seen.has(item.path)) {
    errors.push(`Duplicate tracked URL: ${item.path}`);
  }
  seen.add(item.path);

  if (!item.path.startsWith("/") || !item.path.endsWith("/")) {
    errors.push(`Tracked URL must be a canonical local path: ${item.path}`);
  }

  if (!paths.has(item.path)) {
    errors.push(`Tracked URL does not resolve locally: ${item.path}`);
  }
}

if (trackedPrompts.length !== 15) {
  errors.push(`Expected 15 tracked prompts, found ${trackedPrompts.length}.`);
}

for (const prompt of trackedPrompts) {
  if (!prompt.trim() || prompt.length < 12) {
    errors.push(`Tracked prompt is too short: ${prompt}`);
  }
}

if (errors.length) {
  console.error("Tracking data validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Tracking data validation passed. ${trackedUrls.length} URLs and ${trackedPrompts.length} prompts configured.`,
);
