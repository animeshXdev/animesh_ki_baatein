import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7434E8 0%, #9353F3 100%)",
          borderRadius: "36px",
          color: "white",
          fontFamily: "sans-serif",
          boxShadow: "0 8px 16px rgba(116, 52, 232, 0.35)",
        }}
      >
        <div
          style={{
            fontSize: "92px",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          A
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
