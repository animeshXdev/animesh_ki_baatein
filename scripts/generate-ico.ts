import fs from "node:fs";
import Icon from "../src/app/icon";

async function run() {
  const response = Icon();
  const arrayBuffer = await response.arrayBuffer();
  const pngBuffer = Buffer.from(arrayBuffer);

  // Build standard ICO format containing PNG data (Vista+ / all modern browsers)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type (1 = icon)
  header.writeUInt16LE(1, 4); // Number of images (1)

  const directoryEntry = Buffer.alloc(16);
  directoryEntry.writeUInt8(32, 0); // Width: 32
  directoryEntry.writeUInt8(32, 1); // Height: 32
  directoryEntry.writeUInt8(0, 2);  // Palette entries: 0
  directoryEntry.writeUInt8(0, 3);  // Reserved: 0
  directoryEntry.writeUInt16LE(1, 4); // Color planes: 1
  directoryEntry.writeUInt16LE(32, 6); // Bits per pixel: 32
  directoryEntry.writeUInt32LE(pngBuffer.length, 8); // Size of PNG data
  directoryEntry.writeUInt32LE(22, 12); // Offset: 6 (header) + 16 (entry) = 22

  const icoBuffer = Buffer.concat([header, directoryEntry, pngBuffer]);

  fs.writeFileSync("src/app/favicon.ico", icoBuffer);
  fs.writeFileSync("public/favicon.ico", icoBuffer);
  console.log(`Successfully generated favicon.ico (${icoBuffer.length} bytes) with the purple logo!`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
