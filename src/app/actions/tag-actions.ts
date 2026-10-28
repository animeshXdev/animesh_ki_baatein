"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  createTag,
  updateTag,
  deleteTag,
} from "@/features/tags/tag-service";

export async function createTagAction(data: { name: string; slug?: string }) {
  try {
    await requireAdmin();

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Tag name is required." };
    }

    const tag = await createTag(data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/tags");

    return { success: true, tag };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create tag." };
  }
}

export async function updateTagAction(
  id: string,
  data: { name?: string; slug?: string }
) {
  try {
    await requireAdmin();

    const updated = await updateTag(id, data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/tags");

    return { success: true, tag: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update tag." };
  }
}

export async function deleteTagAction(id: string) {
  try {
    await requireAdmin();

    await deleteTag(id);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/tags");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete tag." };
  }
}
