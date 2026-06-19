import type { Metadata } from "next";
import { InternalLinkGuard } from "@/components/navigation/internal-link-guard";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://commscloud.com";
const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CommsCloud - IoT Connectivity for Africa",
    template: "%s | CommsCloud",
  },
  description:
    "CommsCloud provides Cloud Connect SIM connectivity for African IoT, fleet, asset, utility and security deployments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CommsCloud",
    title: "CommsCloud - IoT Connectivity for Africa",
    description:
      "Cloud Connect SIM connectivity for African IoT deployments that need carrier resilience across borders.",
    images: [{ url: "/api/og?title=CommsCloud" }],
  },
  robots: isProduction
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <InternalLinkGuard />
        {children}
      </body>
    </html>
  );
}
