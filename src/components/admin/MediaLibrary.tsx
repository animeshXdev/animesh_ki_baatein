"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Copy,
  Trash2,
  Check,
  FileImage,
  Folder,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/utils/swal";
import { uploadMediaAction, deleteMediaAction } from "@/app/actions/media-actions";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  altText?: string | null;
  createdAt: Date | string;
}

interface MediaLibraryProps {
  initialMedia: MediaItem[];
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState<"articles" | "media" | "avatars" | "branding">("articles");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        const res = await uploadMediaAction(formData);
        if (res.success && res.media) {
          successCount++;
          setMediaList((prev) => [
            {
              ...res.media,
              path: `public/uploads/${folder}/${res.media.filename}`,
              createdAt: new Date(),
            },
            ...prev,
          ]);
        } else {
          toast.error(res.error || `Failed to upload ${file.name}`);
        }
      } catch (err: any) {
        toast.error(err.message || `Error uploading ${file.name}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)!`);
    }
  };

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Image URL copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async (media: MediaItem) => {
    const confirmed = await confirmAction({
      title: "Delete Media File?",
      text: `Delete "${media.originalName}"? This will delete the file permanently.`,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      isDestructive: true,
    });
    if (!confirmed) return;

    setDeletingId(media.id);
    try {
      const res = await deleteMediaAction(media.id);
      if (res.success) {
        setMediaList((prev) => prev.filter((m) => m.id !== media.id));
        toast.success("Image deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete image");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Upload New Images
            </h3>
            <p className="text-xs text-[#667085]">
              Upload JPEG, PNG, WebP or GIF up to 5MB. Files are verified and served locally.
            </p>
          </div>

          {/* Folder Target Dropdown */}
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-[#7434E8]" />
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value as any)}
              className="bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3 py-1.5 text-xs text-[#202A3D] font-medium focus:outline-none focus:border-[#7434E8]"
            >
              <option value="articles">Folder: articles/</option>
              <option value="media">Folder: media/</option>
              <option value="avatars">Folder: avatars/</option>
              <option value="branding">Folder: branding/</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <label className="border-2 border-dashed border-[#E9E7F1] hover:border-[#7434E8]/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAF9FE] hover:bg-white group">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7434E8] group-hover:scale-105 transition-transform mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-[#202A3D]">
            {uploading ? "Uploading files..." : "Click or drag images here to upload"}
          </p>
          <p className="text-[11px] text-[#98A2B3] mt-1">
            PNG, JPG, WebP, GIF up to 5MB
          </p>
        </label>
      </div>

      {/* Media Gallery Grid */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F1F8]">
          <h3 className="font-heading font-bold text-base text-[#202A3D]">
            All Stored Media ({mediaList.length})
          </h3>
          <p className="text-xs text-[#667085]">
            Click the copy icon to copy image URL to clipboard.
          </p>
        </div>

        {mediaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((m) => (
              <div
                key={m.id}
                className="group rounded-2xl border border-[#E9E7F1] bg-[#FAF9FE] overflow-hidden flex flex-col justify-between hover:border-[#7434E8]/50 hover:shadow-md transition-all"
              >
                {/* Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  <Image
                    src={m.url}
                    alt={m.altText || m.filename}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info & Actions */}
                <div className="p-2.5 space-y-1 text-left">
                  <p className="text-[11px] font-bold text-[#202A3D] truncate" title={m.originalName}>
                    {m.originalName}
                  </p>
                  <p className="text-[10px] text-[#98A2B3]">
                    {formatFileSize(m.size)}
                  </p>

                  <div className="pt-2 flex items-center justify-between gap-1 border-t border-[#E9E7F1]">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(m.id, m.url)}
                      className="p-1 rounded-lg text-[#667085] hover:text-[#7434E8] hover:bg-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === m.id}
                      onClick={() => handleDelete(m)}
                      className="p-1 rounded-lg text-[#667085] hover:text-red-600 hover:bg-white transition-colors disabled:opacity-50"
                      title="Delete Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-2">
            <FileImage className="w-10 h-10 text-[#98A2B3] mx-auto" />
            <p className="text-xs text-[#667085]">
              No media uploaded yet. Use the upload box above to add images.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
