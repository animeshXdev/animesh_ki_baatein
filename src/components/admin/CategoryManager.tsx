"use client";

import React, { useState } from "react";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/utils/swal";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/actions/category-actions";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { slugify } from "@/lib/utils/slug";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  _count?: { articles: number };
}

interface CategoryManagerProps {
  initialCategories: CategoryRecord[];
}

const PRESET_COLORS = [
  "#7434E8", // Purple
  "#F59E0B", // Amber
  "#10B981", // Green
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#EAB308", // Yellow
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#8B5CF6", // Violet
];

const PRESET_ICONS = [
  "Laptop",
  "Briefcase",
  "Sparkles",
  "Palette",
  "Clock",
  "Target",
  "Activity",
  "Wallet",
  "Code",
  "Book",
  "Coffee",
  "Heart",
  "Lightbulb",
  "Folder",
];

export function CategoryManager({
  initialCategories,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#7434E8");
  const [icon, setIcon] = useState("Folder");
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setColor("#7434E8");
    setIcon("Folder");
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setColor(cat.color || "#7434E8");
    setIcon(cat.icon || "Folder");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim() ? slugify(slug) : slugify(name),
          description: description.trim() || undefined,
          color,
          icon,
        });

        if (res.success && res.category) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? { ...c, ...res.category, _count: c._count }
                : c
            )
          );
          toast.success("Category updated successfully");
          setModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update category");
        }
      } else {
        const res = await createCategoryAction({
          name: name.trim(),
          slug: slug.trim() ? slugify(slug) : slugify(name),
          description: description.trim() || undefined,
          color,
          icon,
        });

        if (res.success && res.category) {
          setCategories((prev) => [
            ...prev,
            { ...res.category, _count: { articles: 0 } },
          ]);
          toast.success("Category created successfully");
          setModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create category");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: CategoryRecord) => {
    const articleCount = cat._count?.articles ?? 0;
    if (articleCount > 0) {
      toast.error(
        `Cannot delete "${cat.name}": ${articleCount} article(s) are assigned to it. Reassign articles first.`
      );
      return;
    }

    const confirmed = await confirmAction({
      title: "Delete Category?",
      text: `Are you sure you want to delete category "${cat.name}"? This action cannot be undone.`,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      isDestructive: true,
    });
    if (!confirmed) return;

    try {
      const res = await deleteCategoryAction(cat.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        toast.success("Category deleted");
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#667085]">
          Manage publication taxonomy, pastel accents, and topic navigation.
        </p>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const cardColor = cat.color || "#7434E8";
          const count = cat._count?.articles ?? 0;

          return (
            <div
              key={cat.id}
              className="rounded-3xl bg-white border border-[#E9E7F1] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#7434E8]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${cardColor}15`,
                      color: cardColor,
                    }}
                  >
                    <CategoryIcon name={cat.icon || cat.slug} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#202A3D]">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#98A2B3]">
                      /category/{cat.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg border border-[#E9E7F1] hover:bg-[#FAF9FE] text-[#667085] hover:text-[#7434E8]"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {cat.description && (
                <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}

              <div className="pt-3 border-t border-[#F2F1F8] flex items-center justify-between text-xs">
                <span className="text-[#667085]">
                  {count} {count === 1 ? "article" : "articles"}
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: cardColor }}
                  title={`Color: ${cardColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-2xl z-10 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F1F8]">
              <h3 className="font-heading font-bold text-lg text-[#202A3D]">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:text-[#202A3D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Technology"
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. technology"
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2 text-xs font-mono text-[#7434E8] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary for SEO and category page..."
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8] resize-y"
                />
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-2">
                  Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform ${
                        color === c ? "scale-110 ring-2 ring-[#7434E8] ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-xl border-0 p-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Icon Presets */}
              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-[#FAF9FE] rounded-xl border border-[#E9E7F1]">
                  {PRESET_ICONS.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setIcon(ic)}
                      className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                        icon === ic
                          ? "bg-[#7434E8] text-white shadow-xs"
                          : "bg-white text-[#667085] hover:text-[#202A3D]"
                      }`}
                      title={ic}
                    >
                      <CategoryIcon name={ic} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F2F1F8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E7F1] text-xs font-semibold text-[#667085] hover:bg-[#FAF9FE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
