import React from "react";
import type { Metadata } from "next";
import { getAllComments } from "@/features/comments/comment-service";
import { CommentModeration } from "@/components/admin/CommentModeration";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Comment Moderation",
};

export default async function AdminCommentsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const comments = await getAllComments();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
          Comment Moderation
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review, approve, and moderate public reader comments before publication.
        </p>
      </div>

      <CommentModeration initialComments={comments} />
    </div>
  );
}
