import fs from "node:fs";
import path from "node:path";
import prisma from "@/lib/db/prisma";

export async function getAllMedia() {
  return prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  // Check if any article is using this media URL
  const inUse = await prisma.article.findFirst({
    where: {
      OR: [
        { coverImage: media.url },
        { content: { contains: media.url } },
      ],
    },
  });

  if (inUse) {
    throw new Error(
      `Cannot delete image: it is currently referenced in article "${inUse.title}".`
    );
  }

  // Delete physical file
  const safeFilename = path.basename(media.path);
  const subFolder = media.path.includes("articles")
    ? "articles"
    : media.path.includes("avatars")
    ? "avatars"
    : media.path.includes("branding")
    ? "branding"
    : "media";
  const fullPath = path.join(process.cwd(), "public", "uploads", subFolder, safeFilename);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.warn("Could not delete physical file:", err);
    }
  }

  return prisma.media.delete({ where: { id } });
}
