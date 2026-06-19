import { readFile } from "node:fs/promises";

const expectedProtectedPaths = [
  "/the-best-iot-sim-card/cloud-connect-sim-card/",
  "/the-best-iot-sim-card/",
  "/iot-sim-card/",
  "/remote-monitoring-systems/",
  "/private-apn-vpn/",
  "/dashcams/",
  "/connected-things/cross-border-iot-connectivity-african-logistics/",
];
const expectedNavPaths = [
  "/the-best-iot-sim-card/iot-sim-cards-for-africa/",
  "/private-apn-vpn/",
  "/connectivity-management-portal/",
  "/commscloud-coverage-map/",
  "/commscloud-pricing/",
  "/iot-sim-card/",
  "/iot-connectivity-in-africa/",
  "/cellular-iot-solutions/",
  "/the-best-iot-sim-card/",
  "/remote-monitoring-systems/",
  "/connectivity-as-a-strategy/",
  "/dashcams/",
  "/contact/",
];
const expectedHomePhrases = [
  "Built for IoT. Designed for You.",
  "We Provide",
  "You Manage",
  "IoT Connectivity Solutions and Services",
];

const data = JSON.parse(
  await readFile(new URL("../src/data/migration/routes.json", import.meta.url), "utf8"),
);

const errors = [];
const paths = new Set(data.routes.map((route) => route.path));

if (data.count !== 135) {
  errors.push(`Expected 135 importable routes, found ${data.count}.`);
}

if (data.blockedRouteCount !== 1) {
  errors.push(`Expected 1 blocked route, found ${data.blockedRouteCount}.`);
}

for (const path of expectedProtectedPaths) {
  if (!paths.has(path)) {
    errors.push(`Missing protected path: ${path}`);
  }
}

for (const path of expectedNavPaths) {
  if (!paths.has(path)) {
    errors.push(`Missing live navigation path in imported routes: ${path}`);
  }
}

const homeRoute = data.routes.find((route) => route.path === "/");
if (!homeRoute) {
  errors.push("Missing homepage route from imported data.");
} else {
  const homeJson = JSON.stringify(homeRoute);
  for (const phrase of expectedHomePhrases) {
    if (!homeJson.includes(phrase)) {
      errors.push(`Homepage import missing phrase: ${phrase}`);
    }
  }
}

if (/flolive/i.test(JSON.stringify(data))) {
  errors.push("Forbidden vendor term found in route data.");
}

if (errors.length > 0) {
  console.error("Route QA failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Route QA passed. ${data.count} routes imported, ${data.blockedRouteCount} blocked URL recorded.`,
);
