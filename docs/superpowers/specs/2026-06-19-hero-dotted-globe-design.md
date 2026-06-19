# Hero Dotted Globe Design

## Goal

Replace the existing abstract globe, route lines, signal labels, and decorative nodes in the landing-page hero with a rotating dotted world globe inspired by the supplied SEBA Bank reference. Preserve the current CommsCloud hero copy, statistics, CTA, palette, spacing, and overall section structure.

## Visual Direction

The globe is an oversized, dimensional point cloud positioned on the right side of the hero and clipped by the viewport. Continent-shaped dots use restrained CommsCloud lavender and grey tones. A small number of larger gold points provide brand emphasis without adding labels or notification cards. The visual remains secondary to the hero copy and does not reduce text contrast.

## Architecture

Create a focused client component responsible for rendering and animating the globe on a canvas. The homepage owns only placement and composition. The component generates a deterministic set of latitude/longitude samples, retains samples that fall within simplified continent silhouettes, projects the resulting points onto a rotating sphere, and draws visible points in depth order.

No third-party 3D dependency will be added. The canvas implementation keeps bundle cost low and exposes enough control to reproduce the reference's soft point-cloud treatment.

## Behavior

- Rotate continuously at a slow, calm speed.
- Scale responsively to fill the right half of the desktop hero and remain partially cropped.
- Reduce the visual footprint on smaller screens so it does not interfere with the headline, statistics, or CTA.
- Use device-pixel-ratio-aware canvas sizing for sharp dots.
- Pause when the page is not visible.
- Render a static frame when `prefers-reduced-motion` is enabled.
- Mark the canvas as decorative and hide it from assistive technology.

## Integration

Remove the current `.hero-globe`, `.hero-routes`, `.hero-node`, `.hero-signal`, and associated decorative markup from the hero. Mount the new globe within the existing `.hero-network-bg` layer. Retain the existing background haze unless visual verification shows that it competes with the point cloud; in that case, reduce only its opacity.

## Verification

- Run lint and production build.
- Verify the desktop hero in a browser at a wide viewport.
- Verify the mobile hero at a narrow viewport.
- Confirm the globe is clipped correctly, text remains readable, animation is smooth, and reduced-motion behavior is respected.

## Scope Exclusions

- No changes to hero copy, statistics, CTA, navigation, or downstream sections.
- No transaction cards, tooltips, or interactive globe controls.
- No new animation or rendering dependency.
