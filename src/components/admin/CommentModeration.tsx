"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/utils/swal";
import {
  updateCommentStatusAction,
  deleteCommentAction,
} from "@/app/actions/comment-actions";

interface CommentRecord {
  id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  createdAt: Date | string;
  article: {
    id: string;
    title: string;
    slug: string;
  };
}

interface CommentModerationProps {
  initialComments: CommentRecord[];
}

export function CommentModeration({
  initialComments,
}: CommentModerationProps) {
  const [comments, setComments] = useState<CommentRecord[]>(initialComments);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const filteredComments = comments.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED" | "PENDING"
  ) => {
    try {
      const res = await updateCommentStatusAction(id, status);
      if (res.success && res.comment) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
        toast.success(`Comment ${status.toLowerCase()} successfully`);
      } else {
        toast.error(res.error || "Failed to update comment");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: "Delete Comment?",
      text: "Are you sure you want to permanently delete this comment?",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      isDestructive: true,
    });
    if (!confirmed) return;

    try {
      const res = await deleteCommentAction(id);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        toast.success("Comment deleted");
      } else {
        toast.error(res.error || "Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const formatDate = (dateValue: Date | string) => {
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="rounded-2xl bg-white border border-[#E9E7F1] p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9FE] border border-[#E9E7F1] text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-white text-[#7434E8] shadow-xs"
                : "text-[#667085]"
            }`}
          >
            All ({comments.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              statusFilter === "PENDING"
                ? "bg-white text-amber-600 shadow-xs"
                : "text-[#667085]"
            }`}
          >
            Pending ({comments.filter((c) => c.status === "PENDING").length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("APPROVED")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              statusFilter === "APPROVED"
                ? "bg-white text-emerald-600 shadow-xs"
                : "text-[#667085]"
            }`}
          >
            Approved ({comments.filter((c) => c.status === "APPROVED").length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("REJECTED")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              statusFilter === "REJECTED"
                ? "bg-white text-red-600 shadow-xs"
                : "text-[#667085]"
            }`}
          >
            Rejected ({comments.filter((c) => c.status === "REJECTED").length})
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((c) => (
            <div
              key={c.id}
              className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F2F1F8]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-[#202A3D]">
                      {c.name}
                    </span>
                    <span className="text-xs text-[#98A2B3] font-mono">
                      ({c.email})
                    </span>
                    {c.status === "PENDING" && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-semibold text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                    {c.status === "APPROVED" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Approved</span>
                      </span>
                    )}
                    {c.status === "REJECTED" && (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold text-[10px] flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#98A2B3]">
                    {formatDate(c.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {c.status !== "APPROVED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(c.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {c.status !== "REJECTED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(c.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                {c.content}
              </p>

              {/* Target Article Reference */}
              <div className="pt-2 text-xs flex items-center gap-1.5 text-[#667085]">
                <span>On article:</span>
                <Link
                  href={`/blog/${c.article.slug}`}
                  target="_blank"
                  className="font-semibold text-[#7434E8] hover:underline inline-flex items-center gap-1"
                >
                  <span>{c.article.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white border border-[#E9E7F1] p-12 text-center text-xs text-[#667085]">
            No comments match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
