import {
  createOrganizationSchema,
  createWebsiteSchema,
} from "./schema/factories";

export * from "./schema/factories";
export type * from "./schema/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://commscloud.com";

export const organizationSchema = createOrganizationSchema({
  name: "CommsCloud",
  url: siteUrl,
  slogan: "One SIM. All Borders.",
  description:
    "CommsCloud provides Cloud Connect SIM connectivity for African IoT deployments.",
  areaServed: ["South Africa", "Nigeria", "Kenya", "Africa"],
  brandName: "Cloud Connect SIM",
  knowsAbout: [
    "Cloud Connect SIM",
    "Multi-IMSI",
    "autonomous carrier switching",
    "African IoT connectivity",
    "cross-border fleet connectivity",
  ],
});

export const websiteSchema = createWebsiteSchema({
  name: "CommsCloud",
  url: siteUrl,
  inLanguage: "en-ZA",
});
