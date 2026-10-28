import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/features/settings/settings-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Privacy Policy | ${settings.siteName}`,
    description: `Read the official Privacy Policy for ${settings.siteName}.`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 sm:p-14 shadow-sm">
          <div
            className="prose-editorial max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                settings.privacyContent ||
                `
                <h2>Privacy Policy</h2>
                <p>At <strong>${settings.siteName}</strong>, we respect your privacy and process personal information with utmost care and confidentiality.</p>
                <p>We do not sell, rent, or share personal visitor information with third parties.</p>
              `,
            }}
          />
        </div>
      </div>
    </div>
  );
}
