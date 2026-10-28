import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  let logoBase64 = "";
  try {
    const logoFile = path.join(process.cwd(), "public/icon-512.png");
    if (fs.existsSync(logoFile)) {
      const data = fs.readFileSync(logoFile);
      logoBase64 = `data:image/png;base64,${data.toString("base64")}`;
    }
  } catch (e) {
    // fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#FAF9FE",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {logoBase64 ? (
              <img
                src={logoBase64}
                alt="Logo"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "16px",
                  marginRight: "16px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "#7434E8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: 900,
                  marginRight: "16px",
                }}
              >
                A
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#202A3D",
                  letterSpacing: "-0.5px",
                }}
              >
                <span>Animesh&nbsp;</span>
                <span style={{ color: "#7434E8" }}>ki Baatein</span>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#667085",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Premium Digital Publication
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: "999px",
              background: "rgba(116, 52, 232, 0.08)",
              border: "1.5px solid rgba(116, 52, 232, 0.2)",
              color: "#7434E8",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            INSIGHTS FOR A BETTER TOMORROW
          </div>
        </div>

        {/* Center Main Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "54px",
              fontWeight: 800,
              color: "#202A3D",
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              marginBottom: "20px",
            }}
          >
            <span>Ideas, stories and knowledge for a&nbsp;</span>
            <span style={{ color: "#7434E8" }}>smarter you.</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "22px",
              color: "#667085",
              lineHeight: 1.5,
              maxWidth: "880px",
            }}
          >
            Explore in-depth articles, practical guides and fresh perspectives on
            technology, business, lifestyle, and modern architecture.
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "28px",
            borderTop: "1.5px solid #E9E7F1",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "999px",
                background: "#7434E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "18px",
                fontWeight: 700,
                marginRight: "14px",
              }}
            >
              AP
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#202A3D",
                }}
              >
                Animesh Prakash
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "13px",
                  color: "#667085",
                }}
              >
                Full-Stack Architect &amp; Author
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#7434E8",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            <span>Read on animeshkibaatein.com &rarr;</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
