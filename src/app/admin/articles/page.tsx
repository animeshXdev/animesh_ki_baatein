import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/db/prisma";
import { ArticleTable } from "@/components/admin/ArticleTable";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Article Management",
};

export default async function AdminArticlesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        category: {
          select: { name: true, color: true },
        },
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
            Article Management
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Create, edit, organize, and publish articles across the platform.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      <ArticleTable initialArticles={articles} categories={categories} />
    </div>
  );
}
