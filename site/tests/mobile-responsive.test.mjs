import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const headerPath = new URL("../src/components/layout/site-header.tsx", import.meta.url);
const cssPath = new URL("../src/app/globals.css", import.meta.url);

test("mobile header exposes an accessible navigation dialog", async () => {
  const source = await readFile(headerPath, "utf8");

  assert.match(source, /aria-controls="mobile-navigation"/);
  assert.match(source, /aria-expanded=\{isMobileMenuOpen\}/);
  assert.match(source, /id="mobile-navigation"/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-label="Close navigation"/);
});

test("mobile navigation and controls use viewport-safe touch styles", async () => {
  const source = await readFile(cssPath, "utf8");

  assert.match(source, /\.mobile-menu-trigger,[\s\S]{0,100}\.mobile-navigation-close\s*\{[^}]*min-height:\s*2\.75rem/s);
  assert.match(source, /\.mobile-navigation-panel\s*\{[^}]*overflow-y:\s*auto/s);
  assert.match(source, /@media \(max-width:\s*767px\)[\s\S]*\.hero-title\s*\{[^}]*overflow-wrap:\s*anywhere/s);
  assert.match(source, /@media \(max-width:\s*767px\)[\s\S]*\.wp-content img,/s);
});
