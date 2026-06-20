import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CountUpStats } from "@/components/home/count-up-stats";
import { DottedGlobe } from "@/components/home/dotted-globe";
import { FaqShowcase } from "@/components/home/faq-showcase";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { findMigrationRoute } from "@/lib/migration-content";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const homeRoute = findMigrationRoute("/");

export const metadata: Metadata = {
  title: homeRoute?.seoTitle ?? "IoT Connectivity for Africa",
  description:
    homeRoute?.description ??
    "CommsCloud keeps IoT devices online when they cross African borders.",
  alternates: {
    canonical: "/",
  },
};

const heroSlides = [
  {
    title: "Built for IoT. Designed for You.",
    body: "View signalling events, apply policies, troubleshoot devices, suspend SIMs, all in one place. RESTful APIs make integration with your platform seamless.",
    href: "/connectivity-management-portal/",
    cta: "Explore CMP features",
  },
  {
    title: "One SIM. Any Format. Anywhere.",
    body: "Plastic, eSIM, iSIM, ready for any device or deployment. From dashcams in DRC to smart meters in Kenya, one SKU simplifies it all.",
    href: "/the-best-iot-sim-card/cloud-connect-sim-card/",
    cta: "Learn more",
  },
  {
    title: "Smarter SIMs for Scale.",
    body: "Multi-IMSI with geo-redundant core networks auto switches to the best available operator. Eliminate roaming failures, manual switching, and costly downtime.",
    href: "/the-best-iot-sim-card/iot-sim-cards-for-africa/multi-imsi/",
    cta: "See how it works",
  },
];

const handoffPillars = [
  {
    title: "Built for IoT. Designed for You.",
    description:
      "View signalling events, apply policies, troubleshoot devices and suspend SIMs in one place. RESTful APIs make integration with your platform straightforward.",
    icon: "/images/connectivity-principles/single-pane-management.png",
    points: [
      "Signalling events and SIM status",
      "Policy control from the CMP",
      "RESTful API integration",
    ],
  },
  {
    title: "One\u00a0SIM.\u00a0Any\u00a0Format.\nAnywhere.",
    description:
      "Plastic, eSIM and iSIM options are ready for any device or deployment. From dashcams in DRC to smart meters in Kenya, one SKU simplifies rollout.",
    icon: "/images/connectivity-principles/sim-formats.png",
    points: [
      "Plastic, eSIM and iSIM formats",
      "One SKU for device variants",
      "Deployment support across regions",
    ],
  },
  {
    title: "Smarter SIMs for Scale.",
    description:
      "Multi-IMSI with geo-redundant core networks auto-switches to the best available operator, reducing roaming failures and manual switching.",
    icon: "/images/connectivity-principles/global-access.png",
    points: [
      "Multi-IMSI operator switching",
      "Geo-redundant core networks",
      "Lower roaming and downtime risk",
    ],
  },
] as const;

const networkBenefits = [
  {
    text: "A single contract with access to our library of IMSI providers",
    description:
      "Use one commercial agreement to reach multiple operator networks, reducing procurement work as deployments expand across regions.",
    icon: "contract",
  },
  {
    text: "Globally compliant SIM cards",
    description:
      "Deploy GSMA-compliant SIMs across supported markets with profiles designed for regional requirements and long-term IoT use.",
    icon: "compliance",
  },
  {
    text: "One integration via REST API",
    description:
      "Connect your platform once to activate SIMs, monitor usage, apply controls and manage devices through the Cloud Connect CMP.",
    icon: "integration",
  },
  {
    text: "A single point of contact for 24/7 support",
    description:
      "Work with one CommsCloud support team for connectivity, device configuration and network troubleshooting across your deployment.",
    icon: "support",
  },
  {
    text: "Plastic, embedded or integrated SIM cards",
    description:
      "Choose 2FF, 3FF, 4FF, MFF2, eUICC or iSIM formats to match devices ranging from trackers and cameras to industrial equipment.",
    icon: "sim",
  },
  {
    text: "All managed through a single pane of glass",
    description:
      "View signalling events, usage and SIM status in one portal, then apply policies or suspend connections without visiting the device.",
    icon: "dashboard",
  },
] as const;

const heroStats = [
  { value: 650, suffix: "+", label: "MNOs" },
  { value: 180, suffix: "+", label: "Countries" },
  { value: 24, suffix: "/7", label: "Support" },
];

const operatingPrinciples = [
  {
    title: "High Performance",
    image: "/images/connectivity-principles/high-performance.png",
  },
  {
    title: "Global Access",
    image: "/images/connectivity-principles/global-access.png",
  },
  {
    title: "CloudConnect IoT SIM Card",
    image: "/images/connectivity-principles/cloudconnect-iot-sim.png",
  },
  {
    title: "Enhanced Network Security",
    image: "/images/connectivity-principles/enhanced-network-security.png",
  },
  {
    title: "Powerful SIM Management",
    image: "/images/connectivity-principles/powerful-sim-management.png",
  },
];

const capabilityCards = [
  {
    title: "CloudConnect IoT SIM Card",
    body: "More advanced and more cost-effective than eUICC solutions, with Remote SIM Provisioning, autonomous switching and unique device protection.",
    href: "/the-best-iot-sim-card/cloud-connect-sim-card/",
  },
  {
    title: "Global Access",
    body: "A library of providers offers access to networks wherever your device operates, with localised or roaming profiles on the same SIM card.",
    href: "/commscloud-coverage-map/",
  },
  {
    title: "High Performance",
    body: "Multiple packet gateways on several continents deliver low latency and high bandwidth for connected deployments.",
    href: "/iot-sim-card/",
  },
  {
    title: "Enhanced Network Security",
    body: "Use a secure global APN or build your own data path for direct traffic delivery to your data centre or cloud provider.",
    href: "/private-apn-vpn/",
  },
  {
    title: "Powerful SIM Management",
    body: "Cloud-based connectivity management, billing and core-network controls help get IoT projects running faster.",
    href: "/connectivity-management-portal/",
  },
  {
    title: "Deployment Support",
    body: "Work with connectivity specialists for onboarding, testing and regional rollout support across your IoT fleet.",
    href: "/the-best-iot-sim-card/iot-sim-cards-for-africa/sla/",
  },
];

const faqs = [
  {
    question: "How do I choose a connectivity partner for my IoT project?",
    answer:
      "Start with the use case: latency, uninterrupted service, multi-country coverage, SIM format, firewall behaviour and whether the device can operate with multi-IMSI profiles.",
  },
  {
    question:
      "How can I connect devices in multiple locations, regions and countries?",
    answer:
      "Choose a partner that can provide a multi-IMSI SIM card so devices can connect to multiple operators for cost efficiency, coverage and latency management.",
  },
  {
    question: "What is an IMSI?",
    answer:
      "IMSI stands for International Mobile Subscriber Identity. It is a unique number used by mobile network operators and forms part of the SIM profile.",
  },
  {
    question: "What makes multi-IMSI useful for IoT devices?",
    answer:
      "IoT devices often move across regions. Multi-IMSI profiles allow devices to switch between available networks instead of depending on one operator relationship.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={[organizationSchema, websiteSchema]} />
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <main className="landing-page">
          <section className="hero-fullscreen relative overflow-hidden bg-brand-surface text-brand-navy">
            <div className="hero-network-bg absolute inset-0" aria-hidden="true">
              <div className="hero-grid-haze" />
              <DottedGlobe />
            </div>
            <div className="absolute inset-x-0 bottom-0 z-0 h-px bg-brand-gold/70" />
            <div className="hero-inner relative z-10 mx-auto flex max-w-7xl items-center px-5 py-20 md:px-8">
              <div className="hero-copy max-w-5xl">
                <p className="hero-kicker mb-5 text-sm font-bold uppercase text-brand-gold">
                  Cloud Connect
                </p>
                <h1 className="hero-title text-5xl font-bold leading-[0.96] md:text-7xl xl:text-8xl">
                  {heroSlides[0].title}
                </h1>
                <p className="hero-body mt-7 max-w-4xl text-xl leading-9 text-brand-muted md:text-2xl md:leading-10">
                  {heroSlides[0].body}
                </p>
                <CountUpStats stats={heroStats} variant="hero" />
                <Link
                  href={heroSlides[0].href}
                  className="cta-motion mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-8 font-bold uppercase text-brand-navy transition hover:bg-brand-navy hover:text-white"
                >
                  {heroSlides[0].cta}
                </Link>
              </div>
            </div>
          </section>

          <section className="landing-handoff section-reveal px-5 py-16 text-white md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="landing-handoff-heading" data-reveal="up">
                <p className="landing-handoff-eyebrow">Cloud Connect</p>
                <h2>IoT Connectivity Built for Growth</h2>
              </div>

              <div className="landing-handoff-grid" data-reveal="up">
                {handoffPillars.map((pillar) => (
                  <article key={pillar.title} className="landing-handoff-item">
                    <Image
                      src={pillar.icon}
                      alt=""
                      width={96}
                      height={96}
                      className="landing-handoff-icon"
                    />
                    <h3>{pillar.title}</h3>
                    <p>{pillar.description}</p>
                    <ul>
                      {pillar.points.map((point) => (
                        <li key={point}>
                          <span
                            className="landing-handoff-check"
                            aria-hidden="true"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section-reveal px-5 py-16 md:px-8 md:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr]">
              <div data-reveal="left">
                <h2 className="max-w-5xl text-4xl font-bold leading-tight text-brand-navy md:text-6xl">
                  IoT Connectivity Solutions and Services for Your IoT Projects
                  Specialising in Africa &amp; Covering the World
                </h2>
                <p className="mt-6 max-w-4xl text-xl leading-9 text-brand-muted">
                  Our IoT connectivity solutions provide reliable and highly
                  secure IoT cellular connectivity services for your projects,
                  ensuring integration and management globally.
                </p>
                <p className="mt-4 max-w-4xl text-xl leading-9 text-brand-muted">
                  With access to over 650+ MNOs in over 180+ countries. We make
                  connecting anything using an IoT SIM card easy.
                </p>
              </div>

              <div className="connectivity-principle-grid" data-reveal="right">
                {operatingPrinciples.map((item, index) => (
                  <article
                    key={item.title}
                    className={`connectivity-principle ${index === operatingPrinciples.length - 1 ? "connectivity-principle-last" : ""}`}
                    data-reveal="item"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      width={300}
                      height={300}
                      className="connectivity-principle-image"
                    />
                    <h3 className="connectivity-principle-title">
                      {item.title}
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="network-timeline-section section-reveal border-y border-brand-line bg-brand-surface px-5 py-16 md:px-8 md:py-24">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="lg:sticky lg:top-32 lg:self-start" data-reveal="left">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Core IoT network
                </p>
                <h2 className="mt-3 max-w-4xl text-3xl font-bold text-brand-navy md:text-5xl">
                  Scale your IoT project with a network built for control.
                </h2>
              </div>
              <div className="network-timeline relative" data-reveal="right">
                {networkBenefits.map((benefit) => (
                  <article
                    key={benefit.text}
                    className="timeline-step"
                  >
                    <span className="timeline-node timeline-icon-node">
                      <TimelineIcon name={benefit.icon} />
                    </span>
                    <div className="timeline-content">
                      <h3 className="text-xl font-bold leading-8 text-brand-navy md:text-2xl">
                        {benefit.text}
                      </h3>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-brand-muted md:text-lg">
                        {benefit.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section-reveal px-5 py-16 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 max-w-3xl" data-reveal="up">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Our approach to IoT connectivity made simple
                </p>
                <h2 className="mt-3 text-3xl font-bold text-brand-navy md:text-5xl">
                  We provide a multi-network SIM card that gives any connected
                  device the best coverage.
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {capabilityCards.map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="capability-card group flex min-h-[24.5rem] flex-col rounded-[18px] bg-[#f3f4f6] p-10 no-underline"
                    data-reveal="item"
                  >
                    <h3 className="capability-card-title">
                      {card.title === "Global Access" ? (
                        <>
                          Global
                          <br />
                          Access
                        </>
                      ) : (
                        card.title
                      )}
                    </h3>
                    <p className="capability-card-body">
                      {card.body}
                    </p>
                    <span className="capability-card-link">
                      Read more
                      <ArrowRightIcon />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="faq-section px-5 py-16 md:px-8 md:py-24">
            <div className="faq-layout mx-auto grid gap-12 lg:grid-cols-[0.42fr_0.58fr]">
              <div className="faq-heading">
                <p className="faq-eyebrow">
                  <span aria-hidden="true">?</span>
                  FAQ
                </p>
                <h2>Frequently Asked Questions</h2>
                <p>
                  Have a question about cellular connectivity, multi-IMSI
                  profiles or IoT deployments? Talk to our team.
                </p>
                <Link href="/contact/" className="faq-contact-link">
                  Talk to CommsCloud
                  <span aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                </Link>
              </div>
              <FaqShowcase faqs={faqs} />
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="arrow-right-icon"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path d="M3.75 10h12.5M11.25 5l5 5-5 5" />
    </svg>
  );
}

type TimelineIconName = (typeof networkBenefits)[number]["icon"];

const timelineIconImages: Partial<Record<TimelineIconName, string>> = {
  contract: "/brand/menu-icons/administrator.png",
  compliance: "/brand/menu-icons/cloud.png",
  integration: "/brand/menu-icons/it-integration.png",
  support: "/brand/menu-icons/employee.png",
  sim: "/brand/menu-icons/iot-service.png",
  dashboard: "/brand/menu-icons/project-management.png",
};

function TimelineIcon({ name }: { name: TimelineIconName }) {
  const image = timelineIconImages[name];

  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={40}
        height={40}
        className={`timeline-image-icon timeline-image-icon-${name}`}
      />
    );
  }

  const common = {
    className: "size-8",
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true,
  };

  switch (name) {
    case "contract":
      return (
        <svg {...common}>
          <path className="icon-line" d="M9 5h11l4 4v18H9V5Z M20 5v5h5" />
          <path className="icon-line" d="M13 14h8 M13 18h8" />
          <path className="icon-accent" d="M13 23l2 2 4-5" />
        </svg>
      );
    case "compliance":
      return (
        <svg {...common}>
          <path className="icon-line" d="M16 4l9 4v7c0 6-4 10-9 13-5-3-9-7-9-13V8l9-4Z" />
          <path className="icon-accent" d="M11 16l4 4 7-8" />
        </svg>
      );
    case "integration":
      return (
        <svg {...common}>
          <circle className="icon-line" cx="16" cy="16" r="4" />
          <path className="icon-line" d="M16 4v8 M16 20v8 M4 16h8 M20 16h8" />
          <circle className="icon-accent" cx="16" cy="4" r="2" />
          <circle className="icon-accent" cx="28" cy="16" r="2" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <path className="icon-line" d="M8 18v-3a8 8 0 0 1 16 0v3 M8 18v4h4v-6H8v2Z M24 18v4h-4v-6h4v2Z M20 25h-4" />
          <path className="icon-accent" d="M16 25h-3" />
        </svg>
      );
    case "sim":
      return (
        <svg {...common}>
          <path className="icon-line" d="M10 4h8l4 4v20H10V4Z M14 16h8 M14 20h8 M14 12h4" />
          <path className="icon-accent" d="M14 24h8" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common}>
          <path className="icon-line" d="M6 8h20v14H6V8Z M12 26h8 M16 22v4" />
          <path className="icon-line" d="M10 17h3l2-4 3 6 2-3h2" />
          <path className="icon-accent" d="M22 12h.1" />
        </svg>
      );
  }
}

