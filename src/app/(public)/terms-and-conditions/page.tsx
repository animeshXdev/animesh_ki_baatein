import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/features/settings/settings-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Terms & Conditions | ${settings.siteName}`,
    description: `Read the official Terms and Conditions for ${settings.siteName}.`,
  };
}

export default async function TermsAndConditionsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 sm:p-14 shadow-sm">
          <div
            className="prose-editorial max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                settings.termsContent ||
                `
                <h2>Terms and Conditions</h2>
                <p>By browsing <strong>${settings.siteName}</strong>, you agree to comply with and be bound by the terms and conditions of use outlined herein.</p>
                <p>All editorial content, trademarks, and code snippets are protected under intellectual property regulations.</p>
              `,
            }}
          />
        </div>
      </div>
    </div>
  );
}
