import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

async function main() {
  const logoPath = "./public/logo.png";
  if (!fs.existsSync(logoPath)) {
    throw new Error("public/logo.png does not exist!");
  }

  console.log("🎨 Processing official brand logo into all required icon formats...");

  // 1. Generate 512x512 Master Icon
  const buf512 = await sharp(logoPath)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("./public/icon.png", buf512);
  fs.writeFileSync("./public/icon-512.png", buf512);

  // 2. Generate 192x192 Icon (for PWA / Android)
  const buf192 = await sharp(logoPath)
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("./public/icon-192.png", buf192);

  // 3. Generate 180x180 Apple Touch Icon
  const buf180 = await sharp(logoPath)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("./public/apple-icon.png", buf180);
  fs.writeFileSync("./src/app/apple-icon.png", buf180);

  // 4. Generate 32x32 Small Icon (Browser Tab)
  const buf32 = await sharp(logoPath)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync("./public/icon-32.png", buf32);
  fs.writeFileSync("./src/app/icon.png", buf32);

  // 5. Generate standard multi-image ICO (32x32 + 16x16)
  const buf16 = await sharp(logoPath)
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // ICO header for 2 images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(2, 4); // Count = 2

  // Entry 1: 32x32
  const entry1 = Buffer.alloc(16);
  entry1.writeUInt8(32, 0); // Width
  entry1.writeUInt8(32, 1); // Height
  entry1.writeUInt8(0, 2);  // Colors
  entry1.writeUInt8(0, 3);  // Reserved
  entry1.writeUInt16LE(1, 4); // Planes
  entry1.writeUInt16LE(32, 6); // BPP
  entry1.writeUInt32LE(buf32.length, 8); // Size
  entry1.writeUInt32LE(6 + 16 * 2, 12); // Offset: 38

  // Entry 2: 16x16
  const entry2 = Buffer.alloc(16);
  entry2.writeUInt8(16, 0); // Width
  entry2.writeUInt8(16, 1); // Height
  entry2.writeUInt8(0, 2);  // Colors
  entry2.writeUInt8(0, 3);  // Reserved
  entry2.writeUInt16LE(1, 4); // Planes
  entry2.writeUInt16LE(32, 6); // BPP
  entry2.writeUInt32LE(buf16.length, 8); // Size
  entry2.writeUInt32LE(6 + 16 * 2 + buf32.length, 12); // Offset: 38 + buf32.length

  const icoBuffer = Buffer.concat([header, entry1, entry2, buf32, buf16]);
  fs.writeFileSync("./public/favicon.ico", icoBuffer);
  fs.writeFileSync("./src/app/favicon.ico", icoBuffer);

  // 6. Generate SVG favicon wrapping the transparent logo
  const base64Png = buf512.toString("base64");
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Png}" x="0" y="0" width="512" height="512" />
</svg>`;
  fs.writeFileSync("./public/favicon.svg", svgContent.trim());

  console.log("✅ All branding icon assets successfully generated!");
}

main().catch((err) => {
  console.error("Error generating brand icons:", err);
  process.exit(1);
});
