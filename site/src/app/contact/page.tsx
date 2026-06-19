import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Contact CommsCloud",
  description:
    "Speak with CommsCloud about resilient IoT connectivity, multi-network SIMs and deployments across Africa.",
  alternates: {
    canonical: "/contact/",
  },
};

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path d="M4 6.75h16v10.5H4z" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4.75 7.5 7.25 5.25 7.25-5.25" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M7.2 3.75H4.75a1 1 0 0 0-1 1c0 8.56 6.94 15.5 15.5 15.5a1 1 0 0 0 1-1V16.8l-4.05-1.35-1.02 2.04a12.8 12.8 0 0 1-8.67-8.67L8.55 7.8 7.2 3.75Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

const contactDetails = [
  {
    label: "Email",
    value: "sales@commscloud.com",
    href: "mailto:sales@commscloud.com",
    icon: <MailIcon />,
  },
  {
    label: "Phone",
    value: "+27 21 551 5526",
    href: "tel:+27215515526",
    icon: <PhoneIcon />,
  },
  {
    label: "Address",
    value: "70 Langerman Avenue, Milnerton, Cape Town",
    href: "https://maps.google.com/?q=70+Langerman+Avenue+Milnerton+Cape+Town",
    icon: <LocationIcon />,
  },
] as const;

const inputClassName =
  "min-h-14 w-full border border-[#d7d8df] bg-white px-4 text-base text-brand-navy outline-none transition placeholder:text-[#9699a4] focus:border-[#18bdb1] focus:ring-2 focus:ring-[#18bdb1]/15";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-brand-navy">
      <SiteHeader />
      <main>
        <section className="border-b border-[#e6e5ec] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-24">
            <div className="lg:pt-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">
                Contact CommsCloud
              </p>
              <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-brand-navy md:text-7xl">
                Let&apos;s solve your IoT connectivity challenge.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#666a70] md:text-xl">
                Tell us about your devices, deployment regions and network requirements. You&apos;ll speak with a specialist who understands IoT connectivity across Africa.
              </p>

              <div className="mt-12 grid gap-4">
                {contactDetails.map((detail) => (
                  <a
                    key={detail.label}
                    href={detail.href}
                    target={detail.label === "Address" ? "_blank" : undefined}
                    rel={detail.label === "Address" ? "noreferrer" : undefined}
                    className="group flex min-h-24 items-center gap-5 rounded-full border border-[#e2e1e9] bg-white px-5 py-4 transition hover:border-[#18bdb1] focus-visible:border-[#18bdb1]"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0eff5] text-brand-navy transition group-hover:bg-[#18bdb1] group-hover:text-white">
                      {detail.icon}
                    </span>
                    <span>
                      <span className="block text-base font-semibold text-brand-navy">
                        {detail.label}
                      </span>
                      <span className="mt-1 block text-base text-[#777b82]">
                        {detail.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border border-[#b9b4c9] bg-[#fafafd] p-6 shadow-[0_24px_70px_rgba(21,28,100,0.08)] md:p-10">
              <div className="mb-9">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#18bdb1]">
                  Start a conversation
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-brand-navy">
                  Tell us about your deployment
                </h2>
              </div>

              <form action="mailto:sales@commscloud.com" method="post" encType="text/plain" className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2 text-base font-semibold text-brand-navy">
                  Name*
                  <input className={inputClassName} type="text" name="name" placeholder="Your full name" required />
                </label>
                <label className="grid gap-2 text-base font-semibold text-brand-navy">
                  Work email*
                  <input className={inputClassName} type="email" name="email" placeholder="name@company.com" required />
                </label>
                <label className="grid gap-2 text-base font-semibold text-brand-navy">
                  Company*
                  <input className={inputClassName} type="text" name="company" placeholder="Company name" required />
                </label>
                <label className="grid gap-2 text-base font-semibold text-brand-navy">
                  Deployment size*
                  <select className={inputClassName} name="deployment-size" defaultValue="" required>
                    <option value="" disabled>Select device volume</option>
                    <option value="1-100">1–100 devices</option>
                    <option value="101-1000">101–1,000 devices</option>
                    <option value="1001-10000">1,001–10,000 devices</option>
                    <option value="10000+">10,000+ devices</option>
                  </select>
                </label>
                <label className="grid gap-2 text-base font-semibold text-brand-navy sm:col-span-2">
                  Message*
                  <textarea
                    className={`${inputClassName} min-h-44 resize-y py-4`}
                    name="message"
                    placeholder="Tell us where your devices operate and what connectivity challenges you need to solve."
                    required
                  />
                </label>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#18bdb1] px-8 text-base font-semibold text-white transition hover:bg-brand-navy focus-visible:bg-brand-navy"
                  >
                    Send enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="bg-[#f2f1f6] px-5 py-24 text-center md:px-8 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">
              Built for IoT. Designed for you.
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.045em] text-brand-navy md:text-6xl">
              Ready to connect with confidence?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#666a70]">
              Explore resilient multi-network connectivity built for deployments that cannot afford to disappear.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:sales@commscloud.com"
                className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#18bdb1] px-8 text-base font-semibold text-white transition hover:bg-brand-navy"
              >
                Get started
              </a>
              <Link
                href="/commscloud-coverage-map/"
                className="inline-flex min-h-14 items-center justify-center rounded-lg border border-brand-navy px-8 text-base font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
              >
                View coverage
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
