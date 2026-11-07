import { ImageResponse } from "next/og";

import { profile } from "@/config/profile";

export const alt = `${profile.name} — Accounting, Finance & Technology`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "linear-gradient(135deg, #0b0d13 0%, #151a33 100%)",
        color: "#f8fafc",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#818cf8", letterSpacing: 4 }}>
        PORTFOLIO &amp; BLOG
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 36, color: "#94a3b8" }}>
          {profile.headline}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#94a3b8" }}>
        {profile.location.city}, {profile.location.country}
      </div>
    </div>,
    { ...size },
  );
}
