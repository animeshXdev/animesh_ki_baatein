"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { toast } from "sonner";
import { submitCommentAction } from "@/app/actions/comment-actions";

interface CommentItem {
  id: string;
  name: string;
  content: string;
  createdAt: Date | string;
}

interface CommentSectionProps {
  articleId: string;
  initialComments: CommentItem[];
}

export function CommentSection({
  articleId,
  initialComments = [],
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!content.trim() || content.trim().length < 4) {
      toast.error("Comment must be at least 4 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await submitCommentAction({
        articleId,
        name: name.trim(),
        email: email.trim(),
        content: content.trim(),
      });

      if (res.success) {
        setSubmittedMessage(res.message || "Comment submitted.");
        toast.success(res.message);
        setName("");
        setEmail("");
        setContent("");
      } else {
        toast.error(res.error || "Failed to submit comment.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue: Date | string) => {
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="w-full mt-16 pt-10 border-t border-[#E9E7F1]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#202A3D]">
            Comments ({comments.length})
          </h3>
          <p className="text-xs text-[#667085] mt-0.5">
            Share your thoughts and join the discussion.
          </p>
        </div>
      </div>

      {/* Submission Feedback */}
      {submittedMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Comment Submitted</p>
            <p className="text-emerald-700 text-xs mt-0.5">{submittedMessage}</p>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-sm mb-12 space-y-4"
      >
        <h4 className="font-heading font-bold text-base text-[#202A3D]">
          Leave a Reply
        </h4>
        <p className="text-xs text-[#667085]">
          Your email address will not be published. Required fields are marked *
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Email * (Kept Private)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
            Comment *
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your constructive thoughts here..."
            className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8] resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-semibold shadow-md shadow-[#7434E8]/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? "Submitting..." : "Post Comment"}</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-white border border-[#E9E7F1] p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center font-bold text-sm">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-sm text-[#202A3D]">
                      {c.name}
                    </h5>
                    <span className="text-[11px] text-[#98A2B3]">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line pl-12">
                {c.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#E9E7F1] p-6">
            <p className="text-sm text-[#667085]">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
