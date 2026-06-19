"use client";

import { useEffect } from "react";

const localHosts = new Set(["commscloud.com", "www.commscloud.com"]);
const contactAliases = /^\/(?:contact|contact-us|get-in-touch|more-info)(?:\/|$)/i;

export function InternalLinkGuard() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (!localHosts.has(url.hostname)) {
        return;
      }

      event.preventDefault();
      const pathname = contactAliases.test(url.pathname) ? "/contact/" : url.pathname;
      window.location.assign(`${pathname}${url.search}${url.hash}`);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
