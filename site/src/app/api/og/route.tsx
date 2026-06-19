import { ImageResponse } from "next/og";

export const runtime = "edge";

const navy = "#1B2A4A";
const gold = "#F5A623";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 120) || "CommsCloud";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f5f6f8",
          color: navy,
          display: "flex",
          height: "100%",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: `3px solid ${navy}`,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: "58px",
            width: "100%",
          }}
        >
          <div style={{ color: gold, fontSize: 34, fontWeight: 800 }}>
            COMMSCLOUD
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div
              style={{
                background: gold,
                height: 10,
                width: 128,
              }}
            />
            <div
              style={{
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.98,
                maxWidth: 940,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>
            IoT connectivity for Africa and beyond
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
