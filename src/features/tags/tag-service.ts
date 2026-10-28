import prisma from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";

export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              article: { status: "PUBLISHED" },
            },
          },
        },
      },
    },
  });
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              article: { status: "PUBLISHED" },
            },
          },
        },
      },
    },
  });
}

export async function createTag(data: { name: string; slug?: string }) {
  const baseSlug = slugify(data.slug || data.name);
  let finalSlug = baseSlug;
  let counter = 1;

  while (await prisma.tag.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return prisma.tag.create({
    data: {
      name: data.name.trim(),
      slug: finalSlug,
    },
  });
}

export async function updateTag(id: string, data: { name?: string; slug?: string }) {
  const existing = await prisma.tag.findUnique({ where: { id } });
  if (!existing) throw new Error("Tag not found");

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    const baseSlug = slugify(data.slug);
    let checkSlug = baseSlug;
    let counter = 1;
    while (true) {
      const found = await prisma.tag.findUnique({ where: { slug: checkSlug } });
      if (!found || found.id === id) {
        slug = checkSlug;
        break;
      }
      checkSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return prisma.tag.update({
    where: { id },
    data: {
      name: data.name?.trim() ?? existing.name,
      slug,
    },
  });
}

export async function deleteTag(id: string) {
  return prisma.tag.delete({ where: { id } });
}
