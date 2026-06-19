import type { Metadata } from "next";
import { CoverageExplorer, type CoverageRow } from "@/components/coverage/coverage-explorer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import countriesGeo from "@/data/coverage/countries.geo.json";
import networkCoverageRows from "@/data/coverage/network-coverage.json";

type Position = [number, number];
type Polygon = Position[][];
type MultiPolygon = Polygon[];
type CountryFeature = {
  id?: string;
  properties: {
    name: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: Polygon | MultiPolygon;
  };
};

const mapFeatures = (countriesGeo as unknown as { features: CountryFeature[] })
  .features
  .filter((feature) => feature.properties.name !== "Antarctica")
  .map((feature) => ({
    id: feature.id ?? feature.properties.name,
    name: feature.properties.name,
    path: geometryToPath(feature.geometry),
  }));

const mutedCountries = new Set([
  "Greenland",
  "Western Sahara",
  "Somalia",
  "Yemen",
  "Syria",
]);

const coverageRows = networkCoverageRows as CoverageRow[];

const stats = [
  ["650+", "mobile network operators"],
  ["180+", "countries and territories"],
  ["24/7", "IoT support coverage"],
] as const;

export const metadata: Metadata = {
  title: "Coverage Map",
  description:
    "Explore CommsCloud IoT SIM coverage across mobile network operators, regions, countries and access technologies.",
  alternates: {
    canonical: "/commscloud-coverage-map/",
  },
};

export default function CoverageMapPage() {
  return (
    <div className="min-h-screen bg-brand-surface text-brand-navy">
      <SiteHeader />
      <main className="coverage-shell landing-page">
        <section className="coverage-hero">
          <div className="coverage-copy">
            <p className="coverage-eyebrow">Coverage map</p>
            <h1>CommsCloud coverage across Africa and the world.</h1>
            <p>
              View the coverage footprint behind Cloud Connect SIMs: 650+ MNOs,
              180+ countries, regional profiles, corridor support and IoT access
              technologies.
            </p>
          </div>
          <dl className="coverage-stats">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="coverage-map-panel" aria-label="Coverage map">
          <div className="coverage-map-heading">
            <p>Real country map</p>
            <span>
              Highlighted areas represent the global CommsCloud coverage
              footprint. Muted regions show limited or conditional availability.
            </span>
          </div>
          <WorldCoverageMap />
          <div className="coverage-map-legend" aria-hidden="true">
            <span className="is-covered">Coverage footprint</span>
            <span className="is-limited">Limited or conditional</span>
          </div>
        </section>

        <CoverageExplorer rows={coverageRows} />
      </main>
      <SiteFooter />
    </div>
  );
}

function WorldCoverageMap() {
  return (
    <svg
      className="coverage-world"
      viewBox="0 0 1200 560"
      role="img"
      aria-label="CommsCloud country coverage map"
    >
      <defs>
        <filter id="coverageSoftShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="5" floodOpacity="0.18" />
        </filter>
      </defs>
      <g className="coverage-grid-lines">
        {Array.from({ length: 11 }, (_, index) => (
          <path
            key={`v-${index}`}
            d={`M${80 + index * 104} 0V560`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <path
            key={`h-${index}`}
            d={`M0 ${64 + index * 88}H1200`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      <g className="coverage-land" filter="url(#coverageSoftShadow)">
        {mapFeatures.map((feature) => (
          <path
            key={feature.id}
            className={
              mutedCountries.has(feature.name)
                ? "coverage-land-country coverage-land-muted"
                : "coverage-land-country"
            }
            d={feature.path}
          >
            <title>{feature.name}</title>
          </path>
        ))}
      </g>
    </svg>
  );
}

function geometryToPath(geometry: CountryFeature["geometry"]) {
  if (geometry.type === "Polygon") {
    return polygonToPath(geometry.coordinates as Polygon);
  }

  return (geometry.coordinates as MultiPolygon)
    .map((polygon) => polygonToPath(polygon))
    .join(" ");
}

function polygonToPath(polygon: Polygon) {
  return polygon
    .map((ring) =>
      ring
        .map(([longitude, latitude], index) => {
          const [x, y] = project(longitude, latitude);
          return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ")
        .concat(" Z"),
    )
    .join(" ");
}

function project(longitude: number, latitude: number) {
  const x = ((longitude + 180) / 360) * 1200;
  const y = ((90 - latitude) / 180) * 560;
  return [x, y] as const;
}
