import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { InternalLinkGuard } from "@/components/navigation/internal-link-guard";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://commscloud.com";
const isProduction = process.env.VERCEL_ENV === "production";
const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CommsCloud: IoT Connectivity for Africa",
    template: "%s | CommsCloud",
  },
  description:
    "CommsCloud provides Cloud Connect SIM connectivity for African IoT, fleet, asset, utility and security deployments.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CommsCloud",
    title: "CommsCloud: IoT Connectivity for Africa",
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
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <InternalLinkGuard />
        {children}
      </body>
    </html>
  );
}
