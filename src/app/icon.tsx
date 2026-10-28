import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7434E8 0%, #9353F3 100%)",
          borderRadius: "8px",
          color: "white",
          fontSize: "18px",
          fontWeight: 800,
          fontFamily: "sans-serif",
          boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        }}
      >
        A
      </div>
    ),
    {
      ...size,
    }
  );
}
