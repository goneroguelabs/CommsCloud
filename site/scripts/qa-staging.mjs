import { spawn } from "node:child_process";

const commands = [
  ["npm", ["run", "import:wp"]],
  ["npm", ["run", "qa:routes"]],
  ["npm", ["run", "qa:redirects"]],
  ["npm", ["run", "qa:tracking"]],
  ["npm", ["run", "check:brand"]],
  ["npm", ["run", "lint"]],
  ["npx", ["tsc", "--noEmit"]],
  ["npm", ["run", "build"]],
  ["npm", ["run", "qa:built-routes"]],
  ["npm", ["run", "check:built"]],
];

for (const [command, args] of commands) {
  await run(command, args);
}

if (process.env.STAGING_BASE_URL) {
  await crawlTrackedRoutes(process.env.STAGING_BASE_URL);
}

console.log("Staging QA passed.");

function run(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${command} ${args.join(" ")}`);
    const child = spawn(command, args, {
      shell: true,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with ${code}`));
      }
    });
    child.on("error", reject);
  });
}

async function crawlTrackedRoutes(baseUrl) {
  const { trackedUrls } = await import("../src/data/tracked-urls.ts");
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const failures = [];

  for (const route of trackedUrls) {
    const url = `${normalizedBase}${route.path}`;
    const response = await fetch(url, { redirect: "manual" });
    if (response.status < 200 || response.status >= 400) {
      failures.push(`${route.path} returned ${response.status}`);
    }
  }

  if (failures.length) {
    console.error("Deployed-route crawl failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Deployed-route crawl passed for ${trackedUrls.length} URLs.`);
}
