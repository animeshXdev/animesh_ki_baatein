import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import { TagManager } from "@/components/admin/TagManager";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tag Management",
};

export default async function AdminTagsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const tags = await prisma.tag.findMany({
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
          Tag Management
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Create and manage tags for granular categorization and search indexing.
        </p>
      </div>

      <TagManager initialTags={tags} />
    </div>
  );
}
