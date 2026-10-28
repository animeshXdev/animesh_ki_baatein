"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth/session";
import {
  submitContactMessage,
  subscribeNewsletter,
  toggleMessageRead,
  deleteContactMessage,
} from "@/features/messages/message-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function submitContactAction(formData: FormData) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";

    const rate = checkRateLimit(`contact:${ip}`, 3, 10 * 60);
    if (!rate.success) {
      return {
        success: false,
        error: "Too many messages sent. Please wait a few minutes before trying again.",
      };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    await submitContactMessage({ name, email, subject, message });

    return {
      success: true,
      message: "Thank you for reaching out! Your message has been sent successfully.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to send message." };
  }
}

export async function subscribeNewsletterAction(formData: FormData) {
  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";

    const rate = checkRateLimit(`newsletter:${ip}`, 3, 10 * 60);
    if (!rate.success) {
      return {
        success: false,
        error: "Too many attempts. Please try again later.",
      };
    }

    const email = formData.get("email") as string;
    await subscribeNewsletter(email);

    return {
      success: true,
      message: "Thank you for subscribing! You'll receive our latest articles directly.",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to subscribe." };
  }
}

export async function toggleMessageReadAction(id: string, isRead: boolean) {
  try {
    await requireAdmin();

    await toggleMessageRead(id, isRead);

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update message status." };
  }
}

export async function deleteContactMessageAction(id: string) {
  try {
    await requireAdmin();

    await deleteContactMessage(id);

    revalidatePath("/admin/messages");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete message." };
  }
}
