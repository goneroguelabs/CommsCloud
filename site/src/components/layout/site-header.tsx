"use client";

import Image from "next/image";
import Link from "next/link";
import type { FocusEvent } from "react";
import { useEffect, useRef, useState } from "react";

const navigation = [
  {
    label: "Solutions",
    href: "/the-best-iot-sim-card/cloud-connect-sim-card/",
    intro: {
      title: "Solutions",
      body: "Connect, secure, and manage IoT deployments across Africa and beyond.",
    },
    sections: [
      {
        title: "Connectivity",
        items: [
          {
            label: "Cloud Connect\nSIM",
            href: "/the-best-iot-sim-card/cloud-connect-sim-card/",
            description: "Multi-network SIMs for resilient IoT deployments.",
            icon: "sim",
          },
          {
            label: "IoT SIM cards",
            href: "/the-best-iot-sim-card/iot-sim-cards-for-africa/",
            description: "Plastic, eSIM and iSIM options for connected devices.",
            icon: "device",
          },
          {
            label: "Single SKU",
            href: "/the-best-iot-sim-card/single-sku/",
            description: "One SIM profile strategy for regional scale.",
            icon: "layers",
          },
        ],
      },
      {
        title: "Management",
        items: [
          {
            label: "Connectivity\nManagement\u00a0Portal",
            href: "/connectivity-management-portal/",
            description: "Manage signalling events, policies and SIM status.",
            icon: "dashboard",
          },
          {
            label: "Private APN & VPN",
            href: "/private-apn-vpn/",
            description: "Keep device data on\nprivate secure routes\nfor every deployment.",
            icon: "shield",
          },
          {
            label: "24/7 support",
            href: "/the-best-iot-sim-card/iot-sim-cards-for-africa/sla/",
            description: "Escalation paths\nwith connectivity\nspecialists.",
            icon: "support",
          },
        ],
      },
      {
        title: "Use cases",
        items: [
          {
            label: "Dash cam technology",
            href: "/dashcams/",
            description: "Reliable data paths for video and telematics fleets.",
            icon: "camera",
          },
          {
            label: "Remote monitoring",
            href: "/remote-monitoring-systems/",
            description: "Connect meters,\nsensors and field\nassets.",
            icon: "monitor",
          },
          {
            label: "Cellular\u00a0IoT\u00a0solutions",
            href: "/cellular-iot-solutions/",
            description: "Plan connectivity\nfor industrial IoT\noperations.",
            icon: "signal",
          },
        ],
      },
    ],
    aside: {
      title: "Platform",
      items: [
        { label: "Coverage map", href: "/commscloud-coverage-map/" },
        { label: "Pricing", href: "/commscloud-pricing/" },
        { label: "Device onboarding", href: "/oem-library-2/oem-library/onboarding-testing-iot-devices-hardware/" },
        { label: "OEM library", href: "/oem-library-2/" },
      ],
    },
  },
  {
    label: "Resources",
    href: "/news-insights/",
    intro: {
      title: "Resources",
      body: "Practical guides for cellular IoT, SIM strategy, network coverage and deployment planning.",
    },
    sections: [
      {
        title: "Guides",
        items: [
          {
            label: "IoT SIM card guide",
            href: "/iot-sim-card/",
            description: "Understand SIM formats, provisioning and coverage.",
            icon: "book",
          },
          {
            label: "IoT connectivity in Africa",
            href: "/iot-connectivity-in-africa/",
            description: "Plan deployments around operators, latency and roaming.",
            icon: "globe",
          },
          {
            label: "Best IoT SIM cards",
            href: "/the-best-iot-sim-card/",
            description: "Compare what matters for enterprise IoT projects.",
            icon: "badge",
          },
        ],
      },
      {
        title: "Operations",
        items: [
          {
            label: "Connectivity strategy",
            href: "/connectivity-as-a-strategy/",
            description: "Use connectivity as a business resilience layer.",
            icon: "growth",
          },
          {
            label: "Online SIM inventory",
            href: "/connectivity-management-portal/",
            description: "Track and control SIM fleets from one console.",
            icon: "inventory",
          },
          {
            label: "Knowledge and training",
            href: "/news-insights/",
            description: "Training material for teams managing IoT fleets.",
            icon: "training",
          },
        ],
      },
    ],
    aside: {
      title: "Featured resources",
      items: [
        { label: "Cellular IoT solutions", href: "/cellular-iot-solutions/" },
        { label: "Remote monitoring systems", href: "/remote-monitoring-systems/" },
        { label: "What is an iSIM?", href: "/the-best-iot-sim-card/what-is-an-isim/" },
      ],
    },
  },
  {
    label: "Company",
    href: "/about-us/",
    intro: {
      title: "Company",
      body: "Meet the team helping enterprises deploy resilient IoT connectivity across complex markets.",
    },
    sections: [
      {
        title: "CommsCloud",
        items: [
          {
            label: "About us",
            href: "/about-us/",
            description: "Our approach to flexible cellular IoT connectivity.",
            icon: "building",
          },
          {
            label: "Contact",
            href: "/contact/",
            description: "Speak to the team about your deployment.",
            icon: "message",
          },
          {
            label: "Coverage footprint",
            href: "/commscloud-coverage-map/",
            description: "See supported countries and mobile operators.",
            icon: "pin",
          },
        ],
      },
      {
        title: "Specialist areas",
        items: [
          {
            label: "Africa connectivity",
            href: "/the-best-iot-sim-card/iot-sim-cards-for-africa/",
            description: "Coverage and support for regional deployments.",
            icon: "globe",
          },
          {
            label: "Security",
            href: "/private-apn-vpn/",
            description: "Private network options for device traffic.",
            icon: "shield",
          },
          {
            label: "Support model",
            href: "/the-best-iot-sim-card/iot-sim-cards-for-africa/sla/",
            description: "Service levels for operational teams.",
            icon: "support",
          },
        ],
      },
    ],
    aside: {
      title: "Quick links",
      items: [
        { label: "Get in touch", href: "/contact/" },
        { label: "Pricing", href: "/commscloud-pricing/" },
        { label: "Coverage map", href: "/commscloud-coverage-map/" },
      ],
    },
  },
] as const;

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMegaMenu(href: string) {
    clearCloseTimer();
    setOpenMenu(href);
  }

  function scheduleCloseMenu() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = menuPanelRef.current;
    const focusableElements = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusableElements?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuTriggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusableElements?.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  function closeMobileMenu({ restoreFocus = false } = {}) {
    setIsMobileMenuOpen(false);
    if (restoreFocus) menuTriggerRef.current?.focus();
  }

  return (
    <header className="site-header sticky top-0 z-40 border-b border-brand-line/40 bg-[#f5f6f8]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[4.5rem] w-full max-w-[1320px] items-center gap-3 px-4 sm:gap-4 sm:px-5 md:px-8 lg:h-24 lg:gap-6"
      >
        <Link href="/" className="flex shrink-0 items-center">
          <span className="sr-only">CommsCloud home</span>
          <Image
            src="/brand/commscloud-logo.png"
            alt="CommsCloud"
            width={173}
            height={46}
            preload
            className="h-9 w-auto sm:h-10 lg:h-11"
          />
        </Link>

        <div className="ml-auto hidden items-center gap-6 text-[1.12rem] font-medium text-[#142b3a] xl:gap-7 lg:flex">
          {navigation.map((item) => (
            <div key={item.href} className="flex items-center">
              <Link
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:bg-white hover:text-[#12bfb2] hover:shadow-[0_8px_24px_rgba(27,42,74,0.08)] focus:bg-white focus:text-[#12bfb2]"
                href={item.href}
                onBlur={scheduleCloseMenu}
                onFocus={() => openMegaMenu(item.href)}
                onMouseEnter={() => openMegaMenu(item.href)}
                onMouseLeave={scheduleCloseMenu}
              >
                {item.label}
                <ChevronDown />
              </Link>
              <MegaMenu
                isOpen={openMenu === item.href}
                item={item}
                onMouseEnter={() => openMegaMenu(item.href)}
                onMouseLeave={scheduleCloseMenu}
              />
            </div>
          ))}

          <Link href="/contact/" className="inline-flex items-center rounded-full px-3 py-2 transition hover:bg-white hover:text-[#12bfb2] hover:shadow-[0_8px_24px_rgba(27,42,74,0.08)] focus:bg-white focus:text-[#12bfb2]">
            Contact
          </Link>
          <Link
            href="/contact/"
            className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#18bdb1] px-6 text-base font-semibold text-white transition hover:bg-brand-navy focus:bg-brand-navy"
          >
            Get started
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link
            href="/contact/"
            className="hidden min-h-11 items-center justify-center rounded-lg bg-[#18bdb1] px-4 text-sm font-semibold text-white transition hover:bg-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy sm:inline-flex"
          >
            Get started
          </Link>
          <button
            ref={menuTriggerRef}
            type="button"
            className="mobile-menu-trigger"
            aria-label="Open navigation"
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {isMobileMenuOpen ? (
        <div className="mobile-navigation-layer lg:hidden">
          <button
            type="button"
            className="mobile-navigation-backdrop"
            aria-label="Close navigation"
            onClick={() => closeMobileMenu({ restoreFocus: true })}
          />
          <div
            ref={menuPanelRef}
            id="mobile-navigation"
            className="mobile-navigation-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
          >
            <div className="mobile-navigation-header">
              <div>
                <p className="mobile-navigation-eyebrow">Menu</p>
                <h2 id="mobile-navigation-title">Explore CommsCloud</h2>
              </div>
              <button
                type="button"
                className="mobile-navigation-close"
                aria-label="Close navigation"
                onClick={() => closeMobileMenu({ restoreFocus: true })}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mobile-navigation-content">
              {navigation.map((item) => (
                <section key={item.href} className="mobile-navigation-group">
                  <Link
                    href={item.href}
                    className="mobile-navigation-primary"
                    onClick={() => closeMobileMenu()}
                  >
                    {item.label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                  <div className="mobile-navigation-links">
                    {item.sections.map((section) => (
                      <div key={section.title} className="contents">
                        {section.items.map((menuItem) => (
                          <Link
                            key={menuItem.href}
                            href={menuItem.href}
                            onClick={() => closeMobileMenu()}
                          >
                            {menuItem.label.replace(/\s+/g, " ")}
                          </Link>
                        ))}
                      </div>
                    ))}
                    {item.aside.items.map((asideItem) => (
                      <Link
                        key={asideItem.href}
                        href={asideItem.href}
                        onClick={() => closeMobileMenu()}
                      >
                        {asideItem.label}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mobile-navigation-actions">
              <Link href="/contact/" onClick={() => closeMobileMenu()}>
                Contact
              </Link>
              <Link href="/contact/" onClick={() => closeMobileMenu()}>
                Get started
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

type NavigationItem = (typeof navigation)[number];
type MenuIconName = NavigationItem["sections"][number]["items"][number]["icon"];

const menuIconImages: Record<MenuIconName, string> = {
  badge: "/brand/menu-icons/benchmarking.png",
  book: "/brand/menu-icons/detailed-site-design.png",
  building: "/brand/menu-icons/administrator.png",
  camera: "/brand/menu-icons/data.png",
  dashboard: "/brand/menu-icons/project-management.png",
  device: "/brand/menu-icons/iot.png",
  globe: "/brand/menu-icons/cloud.png",
  growth: "/brand/menu-icons/cost-savings.png",
  inventory: "/brand/menu-icons/billing-recon.png",
  layers: "/brand/menu-icons/it-integration.png",
  message: "/brand/menu-icons/voice.png",
  monitor: "/brand/menu-icons/data-mining-analytics.png",
  pin: "/brand/menu-icons/mobility.png",
  shield: "/brand/menu-icons/cloud.png",
  signal: "/brand/menu-icons/iot-service.png",
  sim: "/brand/menu-icons/iot-service.png",
  support: "/brand/menu-icons/employee.png",
  training: "/brand/menu-icons/detailed-site-design.png",
};

function MegaMenu({
  isOpen,
  item,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  item: NavigationItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onMouseLeave();
    }
  }

  return (
    <div
      aria-hidden={!isOpen}
      className={`pointer-events-none fixed inset-x-0 top-24 z-50 px-5 pt-3 transition duration-200 md:px-8 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      >
      <div
        className={`mx-auto max-w-[82rem] origin-top overflow-hidden rounded-2xl border border-brand-line/35 bg-white shadow-[0_28px_70px_rgba(21,28,100,0.16)] ring-1 ring-white/70 transition duration-200 ${
          isOpen ? "pointer-events-auto translate-y-0" : "pointer-events-none translate-y-2"
        }`}
        onBlur={handleBlur}
        onFocus={onMouseEnter}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="grid grid-cols-[200px_1fr_190px] gap-5 px-7 py-7">
          <div>
            <h2 className="text-[2rem] font-medium tracking-[-0.04em] text-[#18bdb1]">
              {item.intro.title}
            </h2>
            <p className="mt-3 max-w-[20rem] text-[1rem] leading-7 text-[#243b4a]">
              {item.intro.body}
            </p>
          </div>

          <div className="grid items-start gap-x-7 gap-y-8" style={{ gridTemplateColumns: `repeat(${Math.min(item.sections.length, 3)}, minmax(0, 1fr))` }}>
            {item.sections.map((section) => (
              <div key={section.title} className="grid content-start">
                <p className="h-5 text-base font-semibold leading-5 text-[#18bdb1]">{section.title}</p>
                <div className="mt-5 grid gap-3">
                  {section.items.map((menuItem) => (
                    <Link
                      key={menuItem.href}
                      href={menuItem.href}
                      className="group/item grid min-w-0 grid-cols-[2.35rem_minmax(0,1fr)] items-start gap-3 rounded-lg p-2 text-[#102b3a] transition hover:bg-[#f5f6f8] hover:text-[#18bdb1]"
                    >
                      <span className="mega-menu-icon text-[#18bdb1]">
                        <MegaMenuIcon name={menuItem.icon} />
                      </span>
                      <span>
                        <span className="block whitespace-pre-line text-[1rem] font-semibold leading-5">
                          {menuItem.label}
                        </span>
                        <span className="mt-1 block max-w-[16rem] whitespace-pre-line text-[0.9rem] font-normal leading-5 text-[#5d6a75]">
                          {menuItem.description}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-xl bg-[#f5f6f8] px-6 py-6">
            <p className="mb-5 text-base font-semibold text-[#18bdb1]">{item.aside.title}</p>
            <div className="grid gap-4">
              {item.aside.items.map((asideItem) => (
                <Link
                  key={asideItem.href}
                  href={asideItem.href}
                  className="rounded-lg px-2 py-1.5 text-[1.02rem] font-semibold leading-6 text-[#102b3a] transition hover:bg-white hover:text-[#18bdb1]"
                >
                  {asideItem.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MegaMenuIcon({ name }: { name: MenuIconName }) {
  return (
    <Image
      src={menuIconImages[name]}
      alt=""
      width={48}
      height={48}
      className={`mega-menu-icon-image ${name === "dashboard" ? "translate-x-px" : ""}`}
    />
  );
}
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
