import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Article",
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const [article, categories, tags] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: {
        tags: {
          select: { tagId: true },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!article) {
    notFound();
  }

  const initialData = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    coverImageAlt: article.coverImageAlt,
    categoryId: article.categoryId,
    tagIds: article.tags.map((t) => t.tagId),
    status: article.status,
    featured: article.featured,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    ogImage: article.ogImage,
  };

  return (
    <ArticleForm
      initialData={initialData}
      categories={categories}
      tags={tags}
    />
  );
}
