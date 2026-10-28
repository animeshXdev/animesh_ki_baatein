import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { ProfileManager } from "@/components/admin/ProfileManager";

export const metadata: Metadata = {
  title: "Admin Profile",
};

export default async function AdminProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
          Administrator Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Manage your credentials, author avatar, public biography, and security settings.
        </p>
      </div>

      <ProfileManager admin={admin} />
    </div>
  );
}
