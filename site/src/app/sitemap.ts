import type { MetadataRoute } from "next";
import { migrationRoutes } from "@/lib/migration-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://commscloud.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const migratedRoutes: MetadataRoute.Sitemap = migrationRoutes
    .filter((route) => route.path !== "/" && !route.robots.includes("noindex"))
    .map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: route.modified ? new Date(route.modified) : now,
      changeFrequency: route.type === "post" ? "monthly" : "weekly",
      priority:
        route.path === "/the-best-iot-sim-card/cloud-connect-sim-card/"
          ? 1
          : route.type === "page"
            ? 0.8
            : 0.6,
    }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...migratedRoutes,
  ];
}
