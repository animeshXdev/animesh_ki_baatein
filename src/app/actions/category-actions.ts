"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/features/categories/category-service";

export async function createCategoryAction(data: {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}) {
  try {
    await requireAdmin();

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Category name is required." };
    }

    const category = await createCategory(data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/categories");

    return { success: true, category };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create category." };
  }
}

export async function updateCategoryAction(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
  }
) {
  try {
    await requireAdmin();

    const updated = await updateCategory(id, data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/categories");

    return { success: true, category: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await requireAdmin();

    await deleteCategory(id);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete category." };
  }
}
