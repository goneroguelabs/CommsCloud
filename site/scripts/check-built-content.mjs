import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const buildDir = join(root, ".next/server/app");
const baseline = JSON.parse(
  await readFile(new URL("./voice-baseline.json", import.meta.url), "utf8"),
);
const forbidden = [
  { label: "forbidden vendor term", pattern: new RegExp("flo" + "live", "i") },
  {
    label: "platform placeholder",
    pattern: new RegExp("the\\s+underlying\\s+platform", "i"),
  },
];
const baselineTerms = [
  { key: "seamless", pattern: /\bseamless\b/gi },
  { key: "ecosystem", pattern: /\becosystem\b/gi },
  { key: "synergy", pattern: /\bsynergy\b/gi },
  { key: "holistic", pattern: /\bholistic\b/gi },
];
const checkedExtensions = new Set([".html", ".txt", ".rsc", ".body"]);

function extname(path) {
  const match = path.match(/\.[^.\\/]+$/);
  return match ? match[0] : "";
}

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else if (checkedExtensions.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const hits = [];
const counts = Object.fromEntries(baselineTerms.map((term) => [term.key, 0]));

try {
  for (const file of await walk(buildDir)) {
    const text = await readFile(file, "utf8");
    for (const term of forbidden) {
      if (term.pattern.test(text)) {
        hits.push(`${file}: ${term.label}`);
        break;
      }
    }
    for (const term of baselineTerms) {
      counts[term.key] += Array.from(text.matchAll(term.pattern)).length;
    }
  }
} catch (error) {
  console.error(`Built-content check failed: ${error.message}`);
  console.error("Run `npm run build` before `npm run check:built`.");
  process.exit(1);
}

const regressions = baselineTerms
  .filter((term) => counts[term.key] > baseline.built[term.key])
  .map(
    (term) =>
      `${term.key}: ${counts[term.key]} exceeds baseline ${baseline.built[term.key]}`,
  );

if (hits.length || regressions.length) {
  console.error("Built-content voice gate failed:");
  for (const hit of hits) console.error(`- ${hit}`);
  for (const regression of regressions) console.error(`- ${regression}`);
  process.exit(1);
}

console.log(
  `Built-content check passed. Legacy baseline: ${baselineTerms
    .map((term) => `${term.key}=${counts[term.key]}/${baseline.built[term.key]}`)
    .join(", ")}.`,
);
