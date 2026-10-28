"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth/session";
import {
  submitComment,
  updateCommentStatus,
  deleteComment,
} from "@/features/comments/comment-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function submitCommentAction(data: {
  articleId: string;
  name: string;
  email: string;
  content: string;
}) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limit: 3 comments per 10 minutes per IP
    const rate = checkRateLimit(`comment:${ip}`, 3, 10 * 60);
    if (!rate.success) {
      return {
        success: false,
        error: "You are submitting comments too quickly. Please wait a few minutes.",
      };
    }

    const comment = await submitComment(data);

    return {
      success: true,
      message:
        "Thank you! Your comment has been submitted and will appear once approved by the administrator.",
      commentId: comment.id,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit comment." };
  }
}

export async function updateCommentStatusAction(
  id: string,
  status: "APPROVED" | "REJECTED" | "PENDING"
) {
  try {
    await requireAdmin();

    const updated = await updateCommentStatus(id, status);

    revalidatePath("/admin/comments");
    revalidatePath("/admin");

    return { success: true, comment: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update comment status." };
  }
}

export async function deleteCommentAction(id: string) {
  try {
    await requireAdmin();

    await deleteComment(id);

    revalidatePath("/admin/comments");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete comment." };
  }
}
