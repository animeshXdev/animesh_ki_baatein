"use client";

import React, { useState } from "react";
import { Tags, Plus, Edit2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createTagAction,
  updateTagAction,
  deleteTagAction,
} from "@/app/actions/tag-actions";
import { slugify } from "@/lib/utils/slug";

interface TagRecord {
  id: string;
  name: string;
  slug: string;
  _count?: { articles: number };
}

interface TagManagerProps {
  initialTags: TagRecord[];
}

export function TagManager({ initialTags }: TagManagerProps) {
  const [tags, setTags] = useState<TagRecord[]>(initialTags);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagRecord | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingTag(null);
    setName("");
    setSlug("");
    setModalOpen(true);
  };

  const openEditModal = (t: TagRecord) => {
    setEditingTag(t);
    setName(t.name);
    setSlug(t.slug);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingTag) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tag name is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingTag) {
        const res = await updateTagAction(editingTag.id, {
          name: name.trim(),
          slug: slug.trim() ? slugify(slug) : slugify(name),
        });
        if (res.success && res.tag) {
          setTags((prev) =>
            prev.map((t) =>
              t.id === editingTag.id ? { ...t, ...res.tag, _count: t._count } : t
            )
          );
          toast.success("Tag updated");
          setModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update tag");
        }
      } else {
        const res = await createTagAction({
          name: name.trim(),
          slug: slug.trim() ? slugify(slug) : slugify(name),
        });
        if (res.success && res.tag) {
          setTags((prev) => [...prev, { ...res.tag, _count: { articles: 0 } }]);
          toast.success("Tag created");
          setModalOpen(false);
        } else {
          toast.error(res.error || "Failed to create tag");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (t: TagRecord) => {
    const confirmed = window.confirm(`Delete tag #${t.name}?`);
    if (!confirmed) return;

    try {
      const res = await deleteTagAction(t.id);
      if (res.success) {
        setTags((prev) => prev.filter((item) => item.id !== t.id));
        toast.success("Tag deleted");
      } else {
        toast.error(res.error || "Failed to delete tag");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tag");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#667085]">
          Granular article labels and cross-cutting categorization.
        </p>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Tag</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tags.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl bg-white border border-[#E9E7F1] p-3.5 shadow-xs flex items-center justify-between group hover:border-[#7434E8]/40 transition-colors"
          >
            <div className="overflow-hidden">
              <span className="font-semibold text-xs text-[#202A3D] group-hover:text-[#7434E8] truncate block">
                #{t.name}
              </span>
              <span className="text-[10px] text-[#667085]">
                {t._count?.articles ?? 0} articles
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => openEditModal(t)}
                className="p-1 rounded text-[#667085] hover:text-[#7434E8]"
                title="Edit tag"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t)}
                className="p-1 rounded text-[#667085] hover:text-red-600"
                title="Delete tag"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F1F8]">
              <h3 className="font-heading font-bold text-base text-[#202A3D]">
                {editingTag ? "Edit Tag" : "Create New Tag"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#667085] hover:text-[#202A3D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                  Tag Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Next.js"
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
                  placeholder="e.g. nextjs"
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2 text-xs font-mono text-[#7434E8] focus:outline-none focus:border-[#7434E8]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#F2F1F8]">
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
                  className="px-5 py-2 rounded-xl bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingTag
                    ? "Update Tag"
                    : "Create Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
