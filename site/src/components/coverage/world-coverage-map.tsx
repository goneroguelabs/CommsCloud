"use client";

import { useMemo, useState } from "react";
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

const techOptions = ["2G", "3G", "LTE", "5G", "LTE-M", "NB-IOT"] as const;

export function WorldCoverageMap({ features }: { features: CoverageMapFeature[] }) {
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);

  const filteredFeatures = useMemo(() => {
    if (selectedTech.length === 0) {
      return features;
    }

    return features.map((feature) => ({
      ...feature,
      limited:
        feature.limited ||
        selectedTech.some((tech) => !feature.technologies.includes(tech)),
    }));
  }, [features, selectedTech]);

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

  function toggleTech(tech: string) {
    setSelectedTech((current) =>
      current.includes(tech)
        ? current.filter((item) => item !== tech)
        : [...current, tech],
    );
  }

  return (
    <div className="coverage-map-stage">
      <div className="coverage-map-controls" aria-label="Map zoom controls">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setZoom((current) => Math.min(1.45, current + 0.15))}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => setZoom((current) => Math.max(0.9, current - 0.15))}
        >
          -
        </button>
      </div>

      <svg
        className="coverage-world"
        viewBox="0 62 1200 530"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="CommsCloud country coverage map"
      >
        <g
          className="coverage-world-inner"
          style={{
            transform: `translate(${(1 - zoom) * 600}px, ${(1 - zoom) * 327}px) scale(${zoom})`,
          }}
        >
          {filteredFeatures.map((feature) => {
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

      <div className="coverage-map-tech" aria-label="Filter visible countries by technology">
        {techOptions.map((tech) => (
          <label key={tech}>
            <input
              type="checkbox"
              checked={selectedTech.includes(tech)}
              onChange={() => toggleTech(tech)}
            />
            <span>{tech}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
