import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Why CommsCloud?",
    links: [
      { label: "Cloud Connect SIM", href: "/the-best-iot-sim-card/cloud-connect-sim-card/" },
      { label: "Coverage Map", href: "/commscloud-coverage-map/" },
      { label: "Private APN & VPN", href: "/private-apn-vpn/" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "CMP Features", href: "/connectivity-management-portal/" },
      { label: "Pricing", href: "/commscloud-pricing/" },
      { label: "Dash Cam Technology", href: "/dashcams/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "IoT SIM Guide", href: "/iot-sim-card/" },
      { label: "Cellular IoT", href: "/cellular-iot-solutions/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
] as const;

const legalLinks = [
  { label: "Terms of Service", href: "/terms-of-service/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Cookie Policy", href: "/cookie-policy/" },
] as const;

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/comms-cloud/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
        <path
          fill="currentColor"
          d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.3 8.1h4.4V23H.3V8.1Zm7.3 0h4.2v2.03h.06c.59-1.11 2.02-2.28 4.16-2.28 4.45 0 5.27 2.93 5.27 6.74V23h-4.38v-7.45c0-1.78-.03-4.06-2.47-4.06-2.48 0-2.86 1.94-2.86 3.93V23H7.6V8.1Z"
        />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/CommsCloud",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
        <path
          fill="currentColor"
          d="M18.9 2h3.68l-8.04 9.19L24 22h-7.4l-5.8-6.98L4.17 22H.49l8.6-9.83L0 2h7.58l5.24 6.43L18.9 2Zm-1.29 18.1h2.04L6.47 3.8H4.28L17.61 20.1Z"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/CommsCloudSA/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
        <path
          fill="currentColor"
          d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07Z"
        />
      </svg>
    ),
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8d6e1] bg-white px-5 py-20 text-[#1e2428] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1.65fr]">
          <div>
            <Image
              src="/brand/commscloud-logo.png"
              alt="CommsCloud"
              width={173}
              height={46}
              className="h-12 w-auto"
            />
            <p className="mt-8 max-w-xs text-2xl font-semibold leading-tight tracking-[-0.03em]">
              The smarter way to connect IoT teams.
            </p>
            <p className="mt-4 text-lg leading-7 text-[#8b9298]">
              Built for global deployments from Cape Town.
            </p>
            <div className="mt-8 flex items-center gap-5">
              {socialLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#101a64] transition duration-200 hover:-translate-y-1 hover:text-[#18bdb1] focus-visible:-translate-y-1 focus-visible:text-[#18bdb1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#18bdb1]"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:gap-8">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1e2428]">
                  {column.title}
                </h2>
                <div className="mt-6 grid gap-4">
                  {column.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg leading-7 text-[#8b9298] transition hover:text-[#18bdb1]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-[#e5e7eb] pt-10">
          <div className="flex flex-col gap-5 text-lg text-[#8b9298] md:flex-row md:items-center md:justify-between">
            <p>Copyright CommsCloud, Cape Town, South Africa</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((item, index) => (
                <span key={item.href} className="inline-flex items-center gap-4">
                  <Link href={item.href} className="transition hover:text-[#18bdb1]">
                    {item.label}
                  </Link>
                  {index < legalLinks.length - 1 ? <span aria-hidden="true">/</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
