import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import prisma from "@/lib/db/prisma";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function validateMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return true;
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
}

export interface UploadResult {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export async function saveUploadedFile(
  file: File,
  folder: "articles" | "media" | "avatars" | "branding" = "media",
  altText?: string
): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.");
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!validateMagicBytes(buffer)) {
    throw new Error("Corrupted or invalid image file signature.");
  }

  const ext = path.extname(file.name).toLowerCase() || ".png";
  const safeBaseName = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 30);
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const filename = `${safeBaseName}_${uniqueId}${ext}`;

  const uploadsDir = path.resolve(process.cwd(), "public", "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const targetPath = path.join(uploadsDir, filename);
  fs.writeFileSync(targetPath, buffer);

  const relativePath = `public/uploads/${folder}/${filename}`;
  const publicUrl = `/media/${folder}/${filename}`;

  const mediaRecord = await prisma.media.create({
    data: {
      filename,
      originalName: file.name,
      path: relativePath,
      url: publicUrl,
      mimeType: file.type,
      size: file.size,
      altText: altText || safeBaseName,
    },
  });

  return {
    id: mediaRecord.id,
    url: publicUrl,
    filename,
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
  };
}
