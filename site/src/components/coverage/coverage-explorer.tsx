"use client";

import { Fragment, useMemo, useState } from "react";

type TechKey = "twoG" | "threeG" | "lte" | "fiveG" | "lteM" | "nbIot";

export type CoverageRow = {
  id: string;
  plmn: string;
  mccmnc: string;
  country: string;
  countryCode: string;
  region: string;
  continent: string;
  operator: string;
  imsiProvider: string;
  imsiProviders: string[];
  sourceRows: number;
  notes: string;
  blocked: boolean;
  tech: Record<TechKey | "psmEdrx", boolean>;
};

const techFilters: Array<{ key: TechKey; label: string }> = [
  { key: "twoG", label: "2G" },
  { key: "threeG", label: "3G" },
  { key: "lte", label: "LTE" },
  { key: "fiveG", label: "5G" },
  { key: "lteM", label: "LTE-M" },
  { key: "nbIot", label: "NB-IOT" },
];

const pageSize = 15;

export function CoverageExplorer({ rows }: { rows: CoverageRow[] }) {
  const [location, setLocation] = useState("");
  const [network, setNetwork] = useState("");
  const [selectedTech, setSelectedTech] = useState<TechKey[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const locationQuery = location.trim().toLowerCase();
    const networkQuery = network.trim().toLowerCase();

    return rows.filter((row) => {
      if (
        locationQuery &&
        !`${row.country} ${row.region} ${row.continent}`
          .toLowerCase()
          .includes(locationQuery)
      ) {
        return false;
      }

      if (
        networkQuery &&
        !`${row.mccmnc} ${row.plmn} ${row.operator} ${row.imsiProvider} ${row.imsiProviders.join(" ")}`
          .toLowerCase()
          .includes(networkQuery)
      ) {
        return false;
      }

      return selectedTech.every((key) => Boolean(row.tech[key]));
    });
  }, [location, network, rows, selectedTech]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const pageItems = getPageItems(currentPage, totalPages);

  function toggleTech(key: TechKey) {
    setSelectedTech((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function clearFilters() {
    setLocation("");
    setNetwork("");
    setSelectedTech([]);
    setExpandedRows([]);
    setPage(1);
  }

  function toggleRow(rowKey: string) {
    setExpandedRows((current) =>
      current.includes(rowKey)
        ? current.filter((item) => item !== rowKey)
        : [...current, rowKey],
    );
  }

  function downloadCsv() {
    const header = [
      "MCC/MNC",
      "PLMN",
      "Country/Territory",
      "Region",
      "Network",
      "IMSI Providers",
      "2G",
      "3G",
      "LTE",
      "5G",
      "LTE-M",
      "NB-IOT",
    ];
    const body = filteredRows.map((row) => [
      row.mccmnc,
      row.plmn,
      row.country,
      row.region,
      row.operator,
      row.imsiProviders.join("; "),
      formatTech(row.tech.twoG),
      formatTech(row.tech.threeG),
      formatTech(row.tech.lte),
      formatTech(row.tech.fiveG),
      formatTech(row.tech.lteM),
      formatTech(row.tech.nbIot),
    ]);
    const csv = [header, ...body]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "commscloud-coverage-profiles.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="coverage-console" aria-label="Network coverage table">
      <div className="coverage-filter-card">
        <div className="coverage-tech-filters" aria-label="Data filters">
          <p>Data filters</p>
          <div>
            {techFilters.map((filter) => (
              <label key={filter.key}>
                <input
                  checked={selectedTech.includes(filter.key)}
                  onChange={() => toggleTech(filter.key)}
                  type="checkbox"
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="coverage-toolbar">
          <label>
            <span>Location</span>
            <input
              onChange={(event) => {
                setLocation(event.target.value);
                setPage(1);
              }}
              placeholder="Search countries or regions"
              type="search"
              value={location}
            />
          </label>
          <label>
            <span>Search networks</span>
            <input
              onChange={(event) => {
                setNetwork(event.target.value);
                setPage(1);
              }}
              placeholder="Search MCC/MNC, PLMN, operator or IMSI"
              type="search"
              value={network}
            />
          </label>
          <button className="coverage-clear" onClick={clearFilters} type="button">
            Clear filters
          </button>
          <button className="coverage-download" onClick={downloadCsv} type="button">
            Download network list
          </button>
        </div>
      </div>

      <div className="coverage-table-wrap">
        <table className="coverage-table">
          <thead>
            <tr>
              <th />
              <th>MCC/MNC</th>
              <th>Country/Territory</th>
              <th>Region</th>
              <th>Network</th>
              <th>Technology</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const currentRowKey = rowKey(row);
              const isExpanded = expandedRows.includes(currentRowKey);

              return (
                <Fragment key={currentRowKey}>
                  <tr className={`coverage-data-row${isExpanded ? " is-expanded" : ""}`}>
                    <td>
                      <button
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Hide" : "Show"} details for ${row.operator}`}
                        className="coverage-row-marker"
                        onClick={() => toggleRow(currentRowKey)}
                        onMouseEnter={() => setExpandedRows([currentRowKey])}
                        onMouseLeave={() => setExpandedRows((current) =>
                          current.includes(currentRowKey) ? [] : current,
                        )}
                        onFocus={() => setExpandedRows([currentRowKey])}
                        onBlur={() => setExpandedRows((current) =>
                          current.includes(currentRowKey) ? [] : current,
                        )}
                        type="button"
                      >
                        <span aria-hidden="true" />
                      </button>
                    </td>
                    <td>
                      <span className="coverage-code">{row.mccmnc}</span>
                    </td>
                    <td>{row.country}</td>
                    <td>{row.region}</td>
                    <td>{row.operator}</td>
                    <td>{renderTechBadges(row)}</td>
                  </tr>
                  {isExpanded ? (
                    <tr className="coverage-detail-row">
                      <td colSpan={6}>
                        <div className="coverage-detail-panel">
                          <div>
                            <span>PLMN</span>
                            <strong>{row.plmn || "-"}</strong>
                          </div>
                          <div>
                            <span>MCC/MNC</span>
                            <strong>{row.mccmnc}</strong>
                          </div>
                          <div>
                            <span>Country/Territory</span>
                            <strong>{row.country}</strong>
                          </div>
                          <div>
                            <span>Region</span>
                            <strong>{row.region}</strong>
                          </div>
                          <div>
                            <span>IMSI providers</span>
                            <strong>{row.imsiProviders.join(", ")}</strong>
                          </div>
                          <div className="coverage-detail-tech">
                            <span>Access technologies</span>
                            <strong>{availableTech(row)}</strong>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filteredRows.length === 0 ? (
          <div className="coverage-empty">
            No coverage profiles match those filters.
          </div>
        ) : null}
      </div>

      <div className="coverage-pagination" aria-live="polite">
        <p>
          {filteredRows.length > 0
            ? `Showing ${startIndex + 1} to ${Math.min(startIndex + pageSize, filteredRows.length)} of ${filteredRows.length} entries`
            : "Showing 0 of 0 entries"}
        </p>
        {totalPages > 1 ? (
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              type="button"
            >
              Previous
            </button>
            {pageItems.map((item, index) =>
              item === "..." ? (
                <span key={`ellipsis-${index}`}>...</span>
              ) : (
                <button
                  className={item === currentPage ? "is-active" : ""}
                  key={item}
                  onClick={() => setPage(item)}
                  type="button"
                >
                  {item}
                </button>
              ),
            )}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              type="button"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function rowKey(row: CoverageRow) {
  return row.id;
}

function formatTech(value: boolean) {
  return value ? "Yes" : "";
}

function availableTech(row: CoverageRow) {
  const labels: Array<[TechKey, string]> = [
    ["twoG", "2G"],
    ["threeG", "3G"],
    ["lte", "LTE"],
    ["fiveG", "5G"],
    ["lteM", "LTE-M"],
    ["nbIot", "NB-IOT"],
  ];

  return labels
    .filter(([key]) => Boolean(row.tech[key]))
    .map(([, label]) => label)
    .join(", ");
}

function renderTechBadges(row: CoverageRow) {
  const labels: Array<[TechKey, string, string]> = [
    ["twoG", "2G", "is-two-g"],
    ["threeG", "3G", "is-three-g"],
    ["lte", "4G", "is-lte"],
    ["fiveG", "5G", "is-five-g"],
    ["lteM", "LTE-M", "is-lte-m"],
    ["nbIot", "NB-IOT", "is-nb-iot"],
  ];
  const available = labels.filter(([key]) => row.tech[key]);

  if (available.length === 0) {
    return <span className="coverage-validated">-</span>;
  }

  return (
    <div className="coverage-tech-badges">
      {available.map(([, label, className]) => (
        <span className={className} key={label}>
          {label}
        </span>
      ))}
    </div>
  );
}

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages] as const;
}
