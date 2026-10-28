import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/features/settings/settings-service";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Website Settings",
};

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
          Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Customize website metadata, public author bio, legal documentation, and social connections.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
