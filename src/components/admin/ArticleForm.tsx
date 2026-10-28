"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  Send,
  ArrowLeft,
  Sparkles,
  Upload,
  Globe,
  Star,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import {
  createArticleAction,
  updateArticleAction,
} from "@/app/actions/article-actions";
import { slugify } from "@/lib/utils/slug";

interface CategoryOption {
  id: string;
  name: string;
}

interface TagOption {
  id: string;
  name: string;
}

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    coverImageAlt?: string | null;
    categoryId: string;
    tagIds: string[];
    status: string;
    featured: boolean;
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: string | null;
  };
  categories: CategoryOption[];
  tags: TagOption[];
}

export function ArticleForm({
  initialData,
  categories,
  tags,
}: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [coverImageAlt, setCoverImageAlt] = useState(
    initialData?.coverImageAlt || ""
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || (categories.length > 0 ? categories[0].id : "")
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tagIds || []
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seoDescription || ""
  );
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");

  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  // Auto-generate slug as title changes if not manually modified
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(slugify(val));
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) {
      toast.error("Article title is required.");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Article content cannot be empty.");
      return;
    }

    const isPublish = status === "PUBLISHED";
    if (isPublish) {
      setPublishing(true);
    } else {
      setSavingDraft(true);
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() ? slugify(slug) : slugify(title),
      excerpt: excerpt.trim() || undefined,
      content,
      coverImage: coverImage.trim() || undefined,
      coverImageAlt: coverImageAlt.trim() || undefined,
      categoryId,
      tagIds: selectedTagIds,
      status,
      featured,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      ogImage: ogImage.trim() || undefined,
    };

    try {
      if (isEditing && initialData?.id) {
        const res = await updateArticleAction(initialData.id, payload);
        if (res.success) {
          toast.success(
            isPublish ? "Article published successfully!" : "Draft updated successfully!"
          );
          router.push("/admin/articles");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to update article.");
        }
      } else {
        const res = await createArticleAction(payload);
        if (res.success) {
          toast.success(
            isPublish ? "Article published successfully!" : "Article saved as draft!"
          );
          router.push("/admin/articles");
          router.refresh();
        } else {
          toast.error(res.error || "Failed to create article.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setSavingDraft(false);
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E7F1]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl border border-[#E9E7F1] bg-white text-[#667085] hover:text-[#7434E8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-[#202A3D]">
              {isEditing ? "Edit Article" : "Write New Article"}
            </h1>
            <p className="text-xs text-[#667085]">
              {isEditing
                ? `Updating "${initialData?.title}"`
                : "Craft thoughtful editorial content with rich typography."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={savingDraft || publishing}
            onClick={() => handleSave("DRAFT")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E9E7F1] bg-white text-xs font-semibold text-[#202A3D] hover:bg-[#FAF9FE] hover:border-[#7434E8]/40 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#667085]" />
            <span>{savingDraft ? "Saving..." : "Save as Draft"}</span>
          </button>

          <button
            type="button"
            disabled={savingDraft || publishing}
            onClick={() => handleSave("PUBLISHED")}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{publishing ? "Publishing..." : "Publish Article"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Editor Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Article Title */}
          <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. The Complete Guide to Modern Web Development in 2026"
                className="w-full text-xl sm:text-2xl font-heading font-bold text-[#202A3D] bg-transparent border-b border-[#E9E7F1] pb-2 focus:outline-none focus:border-[#7434E8] placeholder-[#98A2B3]"
              />
            </div>

            {/* Slug row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
              <span className="text-[#667085] font-medium shrink-0">
                Permalink:
              </span>
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-[#98A2B3] font-mono text-[11px] truncate">
                  /blog/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsSlugCustomized(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="article-url-slug"
                  className="flex-1 bg-[#FAF9FE] border border-[#E9E7F1] rounded-lg px-2.5 py-1 text-xs font-mono text-[#7434E8] focus:outline-none focus:border-[#7434E8]"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-1.5">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A compelling 1-2 sentence preview for search engines and article cards..."
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8] resize-y"
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#667085]">
                Article Content *
              </label>
              <span className="text-[11px] text-[#98A2B3]">
                Full formatting & Tiptap enabled
              </span>
            </div>

            <TiptapEditor content={content} onChange={setContent} />
          </div>

          {/* SEO Accordion */}
          <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-4">
            <button
              type="button"
              onClick={() => setShowSeoSettings(!showSeoSettings)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#7434E8]" />
                <span className="font-heading font-bold text-sm text-[#202A3D]">
                  Search Engine Optimization (SEO & Social Previews)
                </span>
              </div>
              <span className="text-xs font-semibold text-[#7434E8]">
                {showSeoSettings ? "Hide Settings" : "Configure"}
              </span>
            </button>

            {showSeoSettings && (
              <div className="pt-4 border-t border-[#F2F1F8] space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                    Custom SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={title || "Defaults to article title"}
                    className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                    Custom SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder={excerpt || "Defaults to article excerpt"}
                    className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                    Custom OpenGraph Social Image URL
                  </label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="Defaults to article cover image"
                    className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Configuration Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Taxonomy & Properties Card */}
          <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-5">
            <h3 className="font-heading font-bold text-sm text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              Publishing Settings
            </h3>

            {/* Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-2">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-[#FAF9FE] rounded-xl border border-[#E9E7F1]">
                {tags.map((t) => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTag(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#7434E8] text-white shadow-xs"
                          : "bg-white border border-[#E9E7F1] text-[#667085] hover:text-[#202A3D]"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9FE] border border-[#E9E7F1] cursor-pointer hover:border-[#7434E8]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#7434E8] rounded border-gray-300 focus:ring-[#7434E8]"
                />
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-xs font-semibold text-[#202A3D]">
                    Feature on Homepage Bento Grid
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
              Featured Cover Image
            </h3>

            {coverImage ? (
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#E9E7F1] bg-gray-50">
                <Image
                  src={coverImage}
                  alt={coverImageAlt || "Cover preview"}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 px-2 py-1 bg-black/70 hover:bg-black text-white text-[10px] rounded-lg"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[#FAF9FE] border-2 border-dashed border-[#E9E7F1] text-center space-y-2">
                <Upload className="w-6 h-6 text-[#98A2B3] mx-auto" />
                <p className="text-xs text-[#667085]">
                  Enter image URL below or pick from Media Library.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/media/articles/... or https://..."
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Descriptive image context"
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>

            <div className="pt-2">
              <Link
                href="/admin/media"
                target="_blank"
                className="text-xs font-semibold text-[#7434E8] hover:text-[#6028C9] inline-flex items-center gap-1"
              >
                <span>Browse Media Library ↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
