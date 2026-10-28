import prisma from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slug";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: {
            where: { status: "PUBLISHED" },
          },
        },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          articles: {
            where: { status: "PUBLISHED" },
          },
        },
      },
    },
  });
}

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  const baseSlug = slugify(data.slug || data.name);
  let finalSlug = baseSlug;
  let counter = 1;

  while (await prisma.category.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return prisma.category.create({
    data: {
      name: data.name.trim(),
      slug: finalSlug,
      description: data.description?.trim() || null,
      color: data.color || "#7434E8",
      icon: data.icon || "Folder",
    },
  });
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error("Category not found");

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    const baseSlug = slugify(data.slug);
    let checkSlug = baseSlug;
    let counter = 1;
    while (true) {
      const found = await prisma.category.findUnique({ where: { slug: checkSlug } });
      if (!found || found.id === id) {
        slug = checkSlug;
        break;
      }
      checkSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: data.name?.trim() ?? existing.name,
      slug,
      description: data.description !== undefined ? data.description.trim() || null : existing.description,
      color: data.color ?? existing.color,
      icon: data.icon ?? existing.icon,
    },
  });
}

export async function deleteCategory(id: string) {
  const articleCount = await prisma.article.count({
    where: { categoryId: id },
  });

  if (articleCount > 0) {
    throw new Error(
      `Cannot delete category: ${articleCount} article(s) are assigned to it. Please reassign or delete the articles first.`
    );
  }

  return prisma.category.delete({ where: { id } });
}
