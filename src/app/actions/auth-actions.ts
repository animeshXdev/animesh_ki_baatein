"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import prisma from "@/lib/db/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import {
  createAdminSession,
  invalidateCurrentSession,
  requireAdmin,
} from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function loginAdminAction(formData: FormData) {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = (formData.get("password") as string)?.trim();

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    // Rate limiting: 5 attempts per 15 minutes
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = headersList.get("user-agent") || "";

    const rate = checkRateLimit(`login:${ip}`, 5, 15 * 60);
    if (!rate.success) {
      return {
        success: false,
        error: "Too many login attempts. Please wait 15 minutes before trying again.",
      };
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    await createAdminSession(admin.id, ip, userAgent);
    return { success: true };
  } catch (error: any) {
    console.error("Login action error:", error);
    return { success: false, error: "Authentication failed. Please try again." };
  }
}

export async function logoutAdminAction() {
  await invalidateCurrentSession();
  return { success: true };
}

export async function updateAdminProfileAction(formData: FormData) {
  try {
    const admin = await requireAdmin();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const bio = (formData.get("bio") as string)?.trim();
    const avatar = (formData.get("avatar") as string)?.trim();

    if (!name || name.length < 2) {
      return { success: false, error: "Name must be at least 2 characters." };
    }

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // Check if new email is taken by someone else
    if (email !== admin.email) {
      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing) {
        return { success: false, error: "Email is already in use." };
      }
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name,
        email,
        bio: bio || null,
        avatar: avatar || null,
      },
    });

    revalidatePath("/admin/profile");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update profile." };
  }
}

export async function changeAdminPasswordAction(formData: FormData) {
  try {
    const admin = await requireAdmin();

    const currentPassword = (formData.get("currentPassword") as string)?.trim();
    const newPassword = (formData.get("newPassword") as string)?.trim();
    const confirmPassword = (formData.get("confirmPassword") as string)?.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "All password fields are required." };
    }

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "New password must be at least 8 characters long.",
      };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match." };
    }

    const currentRecord = await prisma.admin.findUnique({
      where: { id: admin.id },
    });

    if (!currentRecord) {
      return { success: false, error: "Admin record not found." };
    }

    const isCurrentValid = await verifyPassword(
      currentPassword,
      currentRecord.passwordHash
    );
    if (!isCurrentValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    const newHash = await hashPassword(newPassword);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to change password." };
  }
}
