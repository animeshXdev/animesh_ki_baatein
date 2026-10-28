"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileEdit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle,
  Clock,
  Eye,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/utils/swal";
import {
  deleteArticleAction,
  togglePublishAction,
  toggleFeaturedAction,
} from "@/app/actions/article-actions";

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  views: number;
  publishedAt: Date | string | null;
  updatedAt: Date | string;
  category: {
    name: string;
    color?: string | null;
  };
}

interface ArticleTableProps {
  initialArticles: ArticleRow[];
  categories: { id: string; name: string }[];
}

export function ArticleTable({
  initialArticles,
  categories,
}: ArticleTableProps) {
  const [articles, setArticles] = useState<ArticleRow[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredArticles = articles.filter((art) => {
    if (statusFilter !== "ALL" && art.status !== statusFilter) return false;
    if (selectedCategory !== "ALL" && art.category.name !== selectedCategory)
      return false;
    if (search.trim() && !art.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await togglePublishAction(id);
      if (res.success && res.status) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: res.status } : a))
        );
        toast.success(`Article marked as ${res.status.toLowerCase()}`);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await toggleFeaturedAction(id);
      if (res.success && res.featured !== undefined) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, featured: res.featured } : a))
        );
        toast.success(
          res.featured ? "Featured on homepage" : "Removed from featured"
        );
      } else {
        toast.error(res.error || "Failed to update featured flag");
      }
    } catch {
      toast.error("Failed to update featured flag");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirmAction({
      title: "Delete Article?",
      text: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Keep article",
      isDestructive: true,
    });
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await deleteArticleAction(id);
      if (res.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        toast.success("Article deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete article");
      }
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Unpublished";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title..."
            className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#7434E8]"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FAF9FE] border border-[#E9E7F1] text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-[#7434E8] shadow-xs"
                  : "text-[#667085]"
              }`}
            >
              All ({articles.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PUBLISHED")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === "PUBLISHED"
                  ? "bg-white text-[#7434E8] shadow-xs"
                  : "text-[#667085]"
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("DRAFT")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                statusFilter === "DRAFT"
                  ? "bg-white text-[#7434E8] shadow-xs"
                  : "text-[#667085]"
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9FE] border-b border-[#E9E7F1] text-[#667085] font-semibold">
                <th className="py-3.5 px-5">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Views</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F1F8]">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#FAF9FE] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#202A3D] max-w-sm truncate">
                      {art.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7434E8]/10 text-[#7434E8] font-semibold text-[11px]">
                        {art.category.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(art.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          art.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {art.status === "PUBLISHED" ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(art.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          art.featured
                            ? "bg-amber-50 border-amber-300 text-amber-600"
                            : "border-transparent text-gray-300 hover:text-gray-400"
                        }`}
                        title={art.featured ? "Featured" : "Not featured"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            art.featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-[#667085] font-medium">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#98A2B3]" />
                        {art.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#667085]">
                      {formatDate(art.publishedAt)}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1.5">
                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="p-1.5 rounded-lg border border-[#E9E7F1] hover:bg-[#FAF9FE] hover:text-[#7434E8] inline-flex items-center text-[#667085]"
                        title="Edit Article"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </Link>

                      {art.status === "PUBLISHED" && (
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-[#E9E7F1] hover:bg-[#FAF9FE] hover:text-[#7434E8] inline-flex items-center text-[#667085]"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      <button
                        type="button"
                        disabled={deletingId === art.id}
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 inline-flex items-center cursor-pointer disabled:opacity-50"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#667085]">
                    No articles found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
