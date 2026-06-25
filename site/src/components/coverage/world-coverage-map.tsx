"use client";

import { useState } from "react";
import type { PointerEvent } from "react";

export type CoverageMapFeature = {
  id: string;
  name: string;
  path: string;
  technologies: string[];
  networkCount: number;
  limited: boolean;
};

type HoverState = {
  feature: CoverageMapFeature;
  x: number;
  y: number;
};

export function WorldCoverageMap({ features }: { features: CoverageMapFeature[] }) {
  const [hovered, setHovered] = useState<HoverState | null>(null);

  function updateHover(
    feature: CoverageMapFeature,
    event: PointerEvent<SVGPathElement>,
  ) {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;

    setHovered({
      feature,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  return (
    <div className="coverage-map-stage">
      <svg
        className="coverage-world"
        viewBox="0 -115 1200 675"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="CommsCloud country coverage map"
      >
        <defs>
          <filter id="coverageLandShadow" x="-8%" y="-8%" width="116%" height="116%">
            <feDropShadow dx="0" dy="12" stdDeviation="7" floodOpacity="0.16" />
          </filter>
        </defs>
        <g className="coverage-world-inner" filter="url(#coverageLandShadow)">
          {features.map((feature) => {
            const isCovered = feature.networkCount > 0 && !feature.limited;

            return (
              <path
                key={feature.id}
                className={
                  isCovered
                    ? "coverage-land-country is-covered"
                    : "coverage-land-country is-limited"
                }
                d={feature.path}
                tabIndex={0}
                aria-label={`${feature.name}: ${
                  feature.technologies.length > 0
                    ? feature.technologies.join(", ")
                    : "coverage data pending"
                }, ${feature.networkCount} networks`}
                onPointerEnter={(event) => updateHover(feature, event)}
                onPointerMove={(event) => updateHover(feature, event)}
                onPointerLeave={() => setHovered(null)}
                onFocus={(event) => {
                  const svgBounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  const pathBounds = event.currentTarget.getBoundingClientRect();
                  if (!svgBounds) return;
                  setHovered({
                    feature,
                    x: pathBounds.left - svgBounds.left + pathBounds.width / 2,
                    y: pathBounds.top - svgBounds.top + pathBounds.height / 2,
                  });
                }}
                onBlur={() => setHovered(null)}
              />
            );
          })}
        </g>
      </svg>

      {hovered ? (
        <div
          className="coverage-map-tooltip"
          style={{
            left: `${Math.min(hovered.x + 18, 900)}px`,
            top: `${Math.max(hovered.y - 26, 18)}px`,
          }}
        >
          <h2>{hovered.feature.name}</h2>
          <p>Available technologies:</p>
          <strong>
            {hovered.feature.technologies.length > 0
              ? hovered.feature.technologies.join(", ")
              : "Coverage data pending"}
          </strong>
          <p># of networks:</p>
          <strong>{hovered.feature.networkCount}</strong>
        </div>
      ) : null}
    </div>
  );
}
