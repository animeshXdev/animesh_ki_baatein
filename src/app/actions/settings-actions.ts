"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { updateSiteSettings } from "@/features/settings/settings-service";

export async function updateSettingsAction(data: {
  siteName?: string;
  tagline?: string;
  description?: string;
  siteUrl?: string;
  logoUrl?: string;
  authorName?: string;
  authorBio?: string;
  authorAvatar?: string;
  defaultOgImage?: string;
  googleSearchConsole?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  articlesPerPage?: number;
  aboutContent?: string;
  privacyContent?: string;
  termsContent?: string;
}) {
  try {
    await requireAdmin();

    const updated = await updateSiteSettings(data);

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return { success: true, settings: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update settings." };
  }
}
