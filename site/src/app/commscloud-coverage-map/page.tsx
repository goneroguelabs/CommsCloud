import type { Metadata } from "next";
import { CoverageExplorer, type CoverageRow } from "@/components/coverage/coverage-explorer";
import {
  WorldCoverageMap,
  type CoverageMapFeature,
} from "@/components/coverage/world-coverage-map";
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

const mapWidth = 1200;
const mapHeight = 675;

const mutedCountries = new Set([
  "Greenland",
  "Western Sahara",
  "Somalia",
  "Yemen",
  "Syria",
]);

const coverageRows = networkCoverageRows as CoverageRow[];

const techLabels = [
  ["twoG", "2G"],
  ["threeG", "3G"],
  ["lte", "LTE"],
  ["fiveG", "5G"],
  ["lteM", "LTE-M"],
  ["nbIot", "NB-IOT"],
] as const;

const countryCoverage = buildCountryCoverage(coverageRows);

const mapFeatures = (countriesGeo as unknown as { features: CountryFeature[] })
  .features
  .filter((feature) => feature.properties.name !== "Antarctica")
  .map((feature) => ({
    id: feature.id ?? feature.properties.name,
    name: feature.properties.name,
    path: geometryToPath(feature.geometry),
    ...getCountryCoverage(feature.properties.name),
  })) satisfies CoverageMapFeature[];

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
          <WorldCoverageMap features={mapFeatures} />
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
  const clampedLatitude = Math.max(-84.5, Math.min(84.5, latitude));
  const latitudeRadians = (clampedLatitude * Math.PI) / 180;
  const mercatorY =
    (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2;
  const x = ((longitude + 180) / 360) * mapWidth;
  const y = mercatorY * mapHeight;
  return [x, y] as const;
}

function buildCountryCoverage(rows: CoverageRow[]) {
  const coverage = new Map<
    string,
    {
      technologies: Set<string>;
      networks: Set<string>;
    }
  >();

  for (const row of rows) {
    if (row.blocked) continue;

    const key = normalizeCountryName(row.country);
    const current =
      coverage.get(key) ??
      {
        technologies: new Set<string>(),
        networks: new Set<string>(),
      };

    for (const [techKey, label] of techLabels) {
      if (row.tech[techKey]) {
        current.technologies.add(label);
      }
    }

    current.networks.add(`${row.mccmnc}:${row.operator}`);
    coverage.set(key, current);
  }

  return coverage;
}

function getCountryCoverage(countryName: string) {
  const summary = countryCoverage.get(normalizeCountryName(countryName));

  return {
    technologies: summary ? Array.from(summary.technologies) : [],
    networkCount: summary?.networks.size ?? 0,
    limited: mutedCountries.has(countryName) || !summary,
  };
}

function normalizeCountryName(name: string) {
  const aliases: Record<string, string> = {
    congo: "republic of the congo",
    "congo drc": "democratic republic of the congo",
    "democratic republic of congo": "democratic republic of the congo",
    "falkland islands malvinas": "falkland islands",
    "french guyana": "french guiana",
    "republic of serbia": "serbia",
    swaziland: "eswatini",
    "the bahamas": "bahamas",
    tanzania: "united republic of tanzania",
    "united states": "united states of america",
    uzbekistan: "uzbekistan",
  };

  const cleaned = name
    .toLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return (aliases[cleaned] ?? cleaned).replace(/[^a-z0-9]/g, "");
}
