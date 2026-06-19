import { redirects } from "../src/data/redirects.ts";

const errors = [];
const sources = new Set();

for (const rule of redirects) {
  if (!rule.source.startsWith("/") || !rule.destination.startsWith("/")) {
    errors.push(`Redirects must use local absolute paths: ${rule.source}`);
  }
  if (sources.has(rule.source)) {
    errors.push(`Duplicate redirect source: ${rule.source}`);
  }
  if (rule.source === rule.destination) {
    errors.push(`Self redirect: ${rule.source}`);
  }
  if (!rule.permanent) {
    errors.push(`Redirect must be permanent: ${rule.source}`);
  }
  sources.add(rule.source);
}

for (const rule of redirects) {
  if (sources.has(rule.destination)) {
    const destinationRule = redirects.find(
      (candidate) => candidate.source === rule.destination,
    );
    if (destinationRule?.destination === rule.source) {
      errors.push(`Redirect loop: ${rule.source} <-> ${rule.destination}`);
    }
  }
}

if (errors.length) {
  console.error("Redirect validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Redirect validation passed. ${redirects.length} configured rules.`);
