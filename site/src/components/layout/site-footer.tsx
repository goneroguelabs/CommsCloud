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

export function SiteFooter() {
  return (
    <footer className="bg-white px-5 py-20 text-[#1e2428] md:px-8">
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
            <p>© CommsCloud · Cape Town, South Africa</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((item, index) => (
                <span key={item.href} className="inline-flex items-center gap-4">
                  <Link href={item.href} className="transition hover:text-[#18bdb1]">
                    {item.label}
                  </Link>
                  {index < legalLinks.length - 1 ? <span aria-hidden="true">·</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
