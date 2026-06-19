import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
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
const ignored = new Set(["node_modules", ".next", ".git", "pnpm-lock.yaml"]);
const checkedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".css",
  ".html",
]);

function extname(path) {
  const match = path.match(/\.[^.\\/]+$/);
  return match ? match[0] : "";
}

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else if (checkedExtensions.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const forbiddenHits = [];
const counts = Object.fromEntries(baselineTerms.map((term) => [term.key, 0]));

for (const file of await walk(root)) {
  const text = await readFile(file, "utf8");
  const localPath = relative(root, file);

  for (const term of forbidden) {
    if (term.pattern.test(text)) {
      forbiddenHits.push(`${localPath}: ${term.label}`);
    }
  }

  for (const term of baselineTerms) {
    counts[term.key] += Array.from(text.matchAll(term.pattern)).length;
  }
}

const regressions = baselineTerms
  .filter((term) => counts[term.key] > baseline.source[term.key])
  .map(
    (term) =>
      `${term.key}: ${counts[term.key]} exceeds baseline ${baseline.source[term.key]}`,
  );

if (forbiddenHits.length > 0 || regressions.length > 0) {
  console.error("Voice gate failed:");
  for (const hit of forbiddenHits) console.error(`- ${hit}`);
  for (const regression of regressions) console.error(`- ${regression}`);
  process.exit(1);
}

console.log(
  `Voice gate passed. Legacy baseline: ${baselineTerms
    .map((term) => `${term.key}=${counts[term.key]}/${baseline.source[term.key]}`)
    .join(", ")}.`,
);
