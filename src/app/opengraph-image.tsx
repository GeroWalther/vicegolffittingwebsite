import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vice Fitting Mallorca — Official Vice Golf Fitter on Mallorca";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top right, #C9F03A 0%, #ffffff 55%)",
          fontFamily: "Inter, sans-serif",
          color: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#525252",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#C9F03A",
            }}
          />
          Vice Fitting · Mallorca
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 130,
              lineHeight: 1,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              maxWidth: 1000,
            }}
          >
            Dial in your weapons.
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#404040",
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Personal Vice Golf club fittings across Mallorca. €90 / 60 min — credited back when you order clubs.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#525252",
            fontFamily: "monospace",
          }}
        >
          <span>vicegolf-mallorca.com</span>
          <span>Mallorca · ES</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
