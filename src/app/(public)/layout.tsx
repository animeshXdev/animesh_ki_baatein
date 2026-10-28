import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getAllCategories } from "@/features/categories/category-service";
import { getSiteSettings } from "@/features/settings/settings-service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getAllCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE]">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={settings.siteName}
        tagline={settings.tagline}
        githubUrl={settings.githubUrl}
        twitterUrl={settings.twitterUrl}
        linkedinUrl={settings.linkedinUrl}
        youtubeUrl={settings.youtubeUrl}
        instagramUrl={settings.instagramUrl}
      />
    </div>
  );
}
