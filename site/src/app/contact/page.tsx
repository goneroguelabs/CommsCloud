import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSelect } from "@/components/forms/animated-select";
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
        strokeLinejoin="round"
        strokeWidth="1.7"
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

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M5.5 17.5c4.7 0 4.3-11 9-11 2.2 0 4 1.8 4 4s-1.8 4-4 4H9.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <circle cx="5.5" cy="17.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18.5" cy="6.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path d="M4 18.25h3.1v-4.1H4v4.1Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.45 18.25h3.1V9.75h-3.1v8.5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.9 18.25H20V5.5h-3.1v12.75Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d="M12 3.75 19 6.4v5.4c0 4.4-2.9 7.1-7 8.45-4.1-1.35-7-4.05-7-8.45V6.4l7-2.65Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path d="m9 12 2 2 4-4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
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
    label: "Cape Town office",
    value: "70 Langerman Avenue, Milnerton",
    href: "https://maps.google.com/?q=70+Langerman+Avenue+Milnerton+Cape+Town",
    icon: <LocationIcon />,
    external: true,
  },
] as const;

const proofPoints = [
  { value: "650+", label: "MNO relationships" },
  { value: "180+", label: "countries supported" },
  { value: "24/7", label: "specialist support" },
] as const;

const responseSteps = [
  "We map your device profile, regions and traffic patterns.",
  "We recommend SIM, APN, policy and support options.",
  "You get a deployment path with coverage and next steps.",
] as const;

const capabilities = [
  {
    title: "Coverage routing",
    text: "Plan resilient network paths across target regions before rollout.",
    icon: <RouteIcon />,
  },
  {
    title: "Private connectivity",
    text: "Keep device traffic controlled with APN and VPN options.",
    icon: <ShieldIcon />,
  },
  {
    title: "Live operations",
    text: "Monitor signalling, usage and support needs from one operating model.",
    icon: <SignalIcon />,
  },
] as const;

const inputClassName =
  "min-h-14 w-full rounded-xl border border-[#d8d6e1] bg-white px-4 text-base font-medium text-brand-navy outline-none transition placeholder:text-[#8d909a] focus:border-[#18bdb1] focus:ring-4 focus:ring-[#18bdb1]/15";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-brand-navy">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden border-b border-[#e6e5ec] bg-[#fbfbfe]">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(24,189,177,0.14),transparent_25rem),radial-gradient(circle_at_84%_16%,rgba(97,90,132,0.18),transparent_27rem)]" />
          <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[linear-gradient(90deg,rgba(27,42,74,0.045)_1px,transparent_1px),linear-gradient(rgba(27,42,74,0.045)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:linear-gradient(180deg,#000,transparent)]" />

          <div className="mx-auto grid max-w-[86rem] gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18bdb1]">
                Contact CommsCloud
              </p>
              <h1 className="mt-5 max-w-3xl text-[clamp(3.25rem,5.1vw,6.35rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-brand-navy">
                Build the IoT network plan before devices ship.
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-9 text-[#595a5c]">
                Tell us where your devices operate, what they connect to and what cannot fail. We will help shape the coverage, SIM and management setup around the deployment.
              </p>

              <div className="mt-10 hidden gap-3 sm:grid-cols-3 lg:grid">
                {proofPoints.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/80 bg-white/72 p-5 shadow-[0_18px_52px_rgba(21,28,100,0.07)] backdrop-blur"
                  >
                    <strong className="block text-4xl font-semibold tracking-[-0.045em] text-brand-navy">
                      {item.value}
                    </strong>
                    <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#686b74]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 hidden gap-3 lg:grid">
                {capabilities.map((item) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[3.5rem_1fr] items-center gap-4 rounded-2xl border border-[#e2e1e9] bg-white/78 p-4 shadow-[0_14px_40px_rgba(21,28,100,0.055)] backdrop-blur"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eff5] text-brand-navy">
                      {item.icon}
                    </span>
                    <span>
                      <strong className="block text-base font-semibold text-brand-navy">{item.title}</strong>
                      <span className="mt-1 block text-sm leading-6 text-[#666a70]">{item.text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-5 -top-5 hidden h-28 w-28 rounded-full border border-[#18bdb1]/25 bg-[#18bdb1]/10 blur-sm lg:block" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[#d8d6e1] bg-white shadow-[0_34px_110px_rgba(21,28,100,0.16)]">
                <div className="bg-brand-navy px-6 py-6 text-white md:px-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#18bdb1]">
                        Start a conversation
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">
                        Deployment brief
                      </h2>
                    </div>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                      Reply within 1 business day
                    </span>
                  </div>
                </div>

                <form
                  action="mailto:sales@commscloud.com"
                  className="grid gap-5 bg-[#fafafd] p-6 md:grid-cols-2 md:p-8"
                  encType="text/plain"
                  method="post"
                >
                  <label className="grid gap-2 text-base font-semibold text-brand-navy">
                    Name*
                    <input className={inputClassName} name="name" placeholder="Your full name" required type="text" />
                  </label>
                  <label className="grid gap-2 text-base font-semibold text-brand-navy">
                    Work email*
                    <input className={inputClassName} name="email" placeholder="name@company.com" required type="email" />
                  </label>
                  <label className="grid gap-2 text-base font-semibold text-brand-navy">
                    Company*
                    <input className={inputClassName} name="company" placeholder="Company name" required type="text" />
                  </label>
                  <div className="grid gap-2 text-base font-semibold text-brand-navy">
                    <span>Deployment size*</span>
                    <AnimatedSelect
                      className={inputClassName}
                      name="deployment-size"
                      options={[
                        { label: "1 to 100 devices", value: "1-100" },
                        { label: "101 to 1,000 devices", value: "101-1000" },
                        { label: "1,001 to 10,000 devices", value: "1001-10000" },
                        { label: "10,000+ devices", value: "10000+" },
                      ]}
                      placeholder="Select device volume"
                      required
                    />
                  </div>
                  <label className="grid gap-2 text-base font-semibold text-brand-navy md:col-span-2">
                    Message*
                    <textarea
                      className={`${inputClassName} min-h-40 resize-y py-4`}
                      name="message"
                      placeholder="Tell us where your devices operate, your data requirements and the connectivity challenges you need to solve."
                      required
                    />
                  </label>
                  <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#18bdb1] px-8 text-base font-semibold text-white shadow-[0_16px_38px_rgba(24,189,177,0.28)] transition hover:-translate-y-0.5 hover:bg-brand-navy focus-visible:bg-brand-navy"
                      type="submit"
                    >
                      Send enquiry
                    </button>
                    <p className="max-w-sm text-sm font-medium leading-6 text-[#686b74]">
                      Prefer email? Send the same brief to{" "}
                      <a className="font-semibold text-brand-navy underline decoration-[#18bdb1]/45 underline-offset-4" href="mailto:sales@commscloud.com">
                        sales@commscloud.com
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="grid gap-5 lg:hidden">
              <div className="grid gap-3 sm:grid-cols-3">
                {proofPoints.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/80 bg-white/72 p-5 shadow-[0_18px_52px_rgba(21,28,100,0.07)] backdrop-blur"
                  >
                    <strong className="block text-4xl font-semibold tracking-[-0.045em] text-brand-navy">
                      {item.value}
                    </strong>
                    <span className="mt-1 block text-sm font-semibold uppercase tracking-[0.08em] text-[#686b74]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {capabilities.map((item) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[3.5rem_1fr] items-center gap-4 rounded-2xl border border-[#e2e1e9] bg-white/78 p-4 shadow-[0_14px_40px_rgba(21,28,100,0.055)] backdrop-blur"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eff5] text-brand-navy">
                      {item.icon}
                    </span>
                    <span>
                      <strong className="block text-base font-semibold text-brand-navy">{item.title}</strong>
                      <span className="mt-1 block text-sm leading-6 text-[#666a70]">{item.text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-[86rem] gap-6 lg:grid-cols-3">
            {contactDetails.map((detail) => (
              <a
                key={detail.label}
                className="group relative isolate overflow-hidden rounded-[1.6rem] border border-[#e2e1e9] bg-[#fbfbfe] p-6 shadow-[0_18px_55px_rgba(21,28,100,0.06)] transition hover:-translate-y-1 hover:border-[#18bdb1] hover:bg-white hover:shadow-[0_26px_70px_rgba(21,28,100,0.1)]"
                href={detail.href}
                rel={"external" in detail ? "noreferrer" : undefined}
                target={"external" in detail ? "_blank" : undefined}
              >
                <span className="absolute -right-12 -top-12 -z-10 h-32 w-32 rounded-full bg-[#18bdb1]/0 blur-2xl transition group-hover:bg-[#18bdb1]/18" />
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#18bdb1] via-[#b9b4c9] to-transparent opacity-0 transition group-hover:opacity-100" />

                <span className="flex items-start justify-between gap-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0eff5] text-brand-navy ring-1 ring-[#d8d6e1]/70 transition group-hover:bg-[#18bdb1] group-hover:text-white group-hover:ring-[#18bdb1]">
                    {detail.icon}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 translate-x-1 items-center justify-center rounded-full border border-[#d8d6e1] text-brand-navy opacity-0 transition group-hover:translate-x-0 group-hover:border-[#18bdb1] group-hover:bg-[#18bdb1] group-hover:text-white group-hover:opacity-100"
                  >
                    →
                  </span>
                </span>

                <span className="mt-8 block text-sm font-semibold uppercase tracking-[0.14em] text-[#18bdb1]">
                  {detail.label}
                </span>
                <span className="mt-2 block text-[1.35rem] font-semibold leading-tight tracking-[-0.035em] text-brand-navy">
                  {detail.value}
                </span>
                <span className="mt-5 inline-flex text-sm font-semibold text-[#686b74] transition group-hover:text-brand-navy">
                  {detail.label === "Email"
                    ? "Send a deployment brief"
                    : detail.label === "Phone"
                      ? "Speak with a specialist"
                      : "Open office location"}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-[#f2f1f6] px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-[86rem] gap-10 rounded-[2rem] bg-brand-navy p-6 text-white shadow-[0_28px_90px_rgba(21,28,100,0.2)] md:p-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#18bdb1]">
                What happens next
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.05em] md:text-6xl">
                A practical plan, not a generic callback.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
                The goal is to turn your first message into a clear deployment route: coverage, management, private networking and support model.
              </p>
            </div>

            <div className="grid gap-4">
              {responseSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid grid-cols-[3.5rem_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#18bdb1] text-lg font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-lg font-medium leading-7 text-white/88">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-[86rem]">
            <div className="relative isolate overflow-hidden rounded-[2.4rem] bg-brand-navy px-6 py-10 text-white shadow-[0_34px_110px_rgba(21,28,100,0.22)] md:px-10 md:py-12 lg:px-14">
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:52px_52px] opacity-60" />
              <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#18bdb1]/28 blur-3xl" />
              <div className="absolute -bottom-32 left-12 -z-10 h-72 w-72 rounded-full bg-[#615a84]/60 blur-3xl" />

              <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/82">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#18bdb1] shadow-[0_0_18px_rgba(24,189,177,0.8)]" />
                    Coverage first. Operations next.
                  </div>
                  <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.96] tracking-[-0.055em] md:text-6xl">
                    Check the footprint, then build the deployment route with us.
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                    Start with regional coverage, then move into SIM strategy, private networking and operational support when your rollout needs a real plan.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem] lg:grid-cols-1">
                  <Link
                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#18bdb1] px-7 text-base font-semibold text-white shadow-[0_18px_45px_rgba(24,189,177,0.32)] transition hover:-translate-y-0.5 hover:bg-white hover:text-brand-navy"
                    href="/commscloud-coverage-map/"
                  >
                    View coverage map
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">&rarr;</span>
                  </Link>
                  <a
                    className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/18 bg-white/8 px-7 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/36 hover:bg-white/14"
                    href="tel:+27215515526"
                  >
                    Call the team
                  </a>
                </div>
              </div>

              <div className="mt-9 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                {["Coverage footprint", "SIM deployment", "Private APN & VPN"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white/80">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
