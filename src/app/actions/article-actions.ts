"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/features/articles/article-service";
import prisma from "@/lib/db/prisma";

export async function createArticleAction(data: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  coverImageAlt?: string;
  categoryId: string;
  tagIds?: string[];
  status?: "DRAFT" | "PUBLISHED";
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}) {
  try {
    const admin = await requireAdmin();

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Article title is required." };
    }

    if (!data.categoryId) {
      return { success: false, error: "Please select a category." };
    }

    const article = await createArticle(data, admin.id);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");

    return { success: true, article };
  } catch (error: any) {
    console.error("Create article action error:", error);
    return { success: false, error: error.message || "Failed to create article." };
  }
}

export async function updateArticleAction(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    coverImageAlt?: string;
    categoryId?: string;
    tagIds?: string[];
    status?: "DRAFT" | "PUBLISHED";
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
  }
) {
  try {
    await requireAdmin();

    const updated = await updateArticle(id, data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/admin/articles");
    revalidatePath(`/admin/articles/${id}/edit`);
    revalidatePath("/admin");

    return { success: true, article: updated };
  } catch (error: any) {
    console.error("Update article action error:", error);
    return { success: false, error: error.message || "Failed to update article." };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    await requireAdmin();

    await deleteArticle(id);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete article." };
  }
}

export async function togglePublishAction(id: string) {
  try {
    await requireAdmin();

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return { success: false, error: "Article not found" };

    const newStatus = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const publishedAt = newStatus === "PUBLISHED" && !article.publishedAt ? new Date() : article.publishedAt;

    await prisma.article.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt,
      },
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    revalidatePath("/admin/articles");
    revalidatePath("/admin");

    return { success: true, status: newStatus };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle status." };
  }
}

export async function toggleFeaturedAction(id: string) {
  try {
    await requireAdmin();

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return { success: false, error: "Article not found" };

    const updated = await prisma.article.update({
      where: { id },
      data: { featured: !article.featured },
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");

    return { success: true, featured: updated.featured };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle featured status." };
  }
}
