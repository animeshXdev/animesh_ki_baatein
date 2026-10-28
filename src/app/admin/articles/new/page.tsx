import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Write New Article",
};

export default async function NewArticlePage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return <ArticleForm categories={categories} tags={tags} />;
}
