"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { saveUploadedFile } from "@/lib/security/upload";
import { deleteMedia } from "@/features/media/media-service";

export async function uploadMediaAction(formData: FormData) {
  try {
    await requireAdmin();

    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as any) || "media";
    const altText = (formData.get("altText") as string) || "";

    if (!file || file.size === 0) {
      return { success: false, error: "Please select an image file to upload." };
    }

    const result = await saveUploadedFile(file, folder, altText);

    revalidatePath("/admin/media");

    return { success: true, media: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload file." };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    await requireAdmin();

    await deleteMedia(id);

    revalidatePath("/admin/media");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete media." };
  }
}
