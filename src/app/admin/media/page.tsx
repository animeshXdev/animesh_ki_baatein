import React from "react";
import type { Metadata } from "next";
import { getAllMedia } from "@/features/media/media-service";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Media Library",
};

export default async function AdminMediaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const mediaItems = await getAllMedia();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
          Media Library
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Upload, preview, organize, and manage image assets locally for articles and branding.
        </p>
      </div>

      <MediaLibrary initialMedia={mediaItems} />
    </div>
  );
}
