import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Category Management",
};

export default async function AdminCategoriesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { articles: true },
      },
    },
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
          Category Management
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Organize articles into thematic taxonomy cards with custom colors and icons.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
