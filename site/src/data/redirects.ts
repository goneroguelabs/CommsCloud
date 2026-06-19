export type RedirectRule = {
  source: string;
  destination: string;
  permanent: true;
};

const blockedVendorSlug =
  "/the-best-iot-sim-card/commscloud-partners-with-" +
  "flo" +
  "live" +
  "/";

export const redirects: readonly RedirectRule[] = [
  {
    source: "/contact-us/:path*",
    destination: "/contact/",
    permanent: true,
  },
  {
    source: "/get-in-touch/:path*",
    destination: "/contact/",
    permanent: true,
  },
  {
    source: "/more-info/:path*",
    destination: "/contact/",
    permanent: true,
  },
  {
    source: blockedVendorSlug,
    destination: "/the-best-iot-sim-card/cloud-connect-sim-card/",
    permanent: true,
  },
  {
    source: "/the-best-iot-sim-card/cloud-connect-sims/",
    destination: "/the-best-iot-sim-card/cloud-connect-sim-card/",
    permanent: true,
  },
];
