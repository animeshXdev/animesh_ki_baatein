"use client";

import React, { useState } from "react";
import {
  Globe,
  User,
  Share2,
  FileText,
  Save,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { updateSettingsAction } from "@/app/actions/settings-actions";

interface SettingsData {
  id: string;
  siteName: string;
  tagline: string;
  description: string;
  siteUrl: string;
  logoUrl?: string | null;
  authorName: string;
  authorBio?: string | null;
  authorAvatar?: string | null;
  defaultOgImage?: string | null;
  googleSearchConsole?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  articlesPerPage: number;
  aboutContent?: string | null;
  privacyContent?: string | null;
  termsContent?: string | null;
}

interface SettingsFormProps {
  initialSettings: SettingsData;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "author" | "seo" | "social" | "content">("general");
  const [saving, setSaving] = useState(false);

  // Form states
  const [siteName, setSiteName] = useState(initialSettings.siteName || "");
  const [tagline, setTagline] = useState(initialSettings.tagline || "");
  const [description, setDescription] = useState(initialSettings.description || "");
  const [siteUrl, setSiteUrl] = useState(initialSettings.siteUrl || "");
  const [authorName, setAuthorName] = useState(initialSettings.authorName || "");
  const [authorBio, setAuthorBio] = useState(initialSettings.authorBio || "");
  const [authorAvatar, setAuthorAvatar] = useState(initialSettings.authorAvatar || "");
  const [defaultOgImage, setDefaultOgImage] = useState(initialSettings.defaultOgImage || "");
  const [googleSearchConsole, setGoogleSearchConsole] = useState(initialSettings.googleSearchConsole || "");
  const [githubUrl, setGithubUrl] = useState(initialSettings.githubUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(initialSettings.twitterUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialSettings.linkedinUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(initialSettings.youtubeUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(initialSettings.instagramUrl || "");
  const [articlesPerPage, setArticlesPerPage] = useState(initialSettings.articlesPerPage || 9);
  const [aboutContent, setAboutContent] = useState(initialSettings.aboutContent || "");
  const [privacyContent, setPrivacyContent] = useState(initialSettings.privacyContent || "");
  const [termsContent, setTermsContent] = useState(initialSettings.termsContent || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateSettingsAction({
        siteName: siteName.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        siteUrl: siteUrl.trim(),
        authorName: authorName.trim(),
        authorBio: authorBio.trim() || undefined,
        authorAvatar: authorAvatar.trim() || undefined,
        defaultOgImage: defaultOgImage.trim() || undefined,
        googleSearchConsole: googleSearchConsole.trim() || undefined,
        githubUrl: githubUrl.trim() || undefined,
        twitterUrl: twitterUrl.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        youtubeUrl: youtubeUrl.trim() || undefined,
        instagramUrl: instagramUrl.trim() || undefined,
        articlesPerPage: Number(articlesPerPage) || 9,
        aboutContent: aboutContent.trim() || undefined,
        privacyContent: privacyContent.trim() || undefined,
        termsContent: termsContent.trim() || undefined,
      });

      if (res.success) {
        toast.success("Website settings updated successfully!");
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "author", label: "Author Profile", icon: User },
    { id: "seo", label: "SEO & Indexing", icon: Globe },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "content", label: "Pages & Legal", icon: FileText },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9E7F1] pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#7434E8] text-white shadow-sm"
                  : "bg-white border border-[#E9E7F1] text-[#667085] hover:text-[#202A3D]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-xs space-y-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-base text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              General Site Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Website Name
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Site Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Canonical Site URL
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Articles Per Page (Pagination)
              </label>
              <input
                type="number"
                min={3}
                max={30}
                value={articlesPerPage}
                onChange={(e) => setArticlesPerPage(Number(e.target.value))}
                className="w-32 bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>
          </div>
        )}

        {/* Author Tab */}
        {activeTab === "author" && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-base text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              Public Author Profile
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Author Display Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Author Avatar Image URL
              </label>
              <input
                type="text"
                value={authorAvatar}
                onChange={(e) => setAuthorAvatar(e.target.value)}
                placeholder="/media/avatars/... or https://..."
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Biography (Shown under articles and About page)
              </label>
              <textarea
                rows={4}
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-base text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              Search Engine & Social Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Default Open Graph Share Image URL
              </label>
              <input
                type="text"
                value={defaultOgImage}
                onChange={(e) => setDefaultOgImage(e.target.value)}
                placeholder="https://... or /media/branding/og.png"
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Google Search Console Verification Code
              </label>
              <input
                type="text"
                value={googleSearchConsole}
                onChange={(e) => setGoogleSearchConsole(e.target.value)}
                placeholder="google-site-verification=..."
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-base text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              Configured Social Channels (Shown in Footer)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                  X / Twitter Profile URL
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-base text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              Static Pages & Legal Text (HTML supported)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                About Page Philosophy Content
              </label>
              <textarea
                rows={5}
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs font-mono text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Privacy Policy Content
              </label>
              <textarea
                rows={5}
                value={privacyContent}
                onChange={(e) => setPrivacyContent(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs font-mono text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Terms and Conditions Content
              </label>
              <textarea
                rows={5}
                value={termsContent}
                onChange={(e) => setTermsContent(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs font-mono text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-[#F2F1F8] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Website Settings"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
