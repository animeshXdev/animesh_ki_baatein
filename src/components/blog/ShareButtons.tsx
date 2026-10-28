"use client";

import React, { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#98A2B3] mr-1">
        Share:
      </span>

      {/* Copy link button */}
      <button
        type="button"
        onClick={handleCopyLink}
        title="Copy article link"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E9E7F1] bg-white text-xs font-medium text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40 hover:bg-[#FAF9FE] transition-all cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Twitter / X */}
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
        className="w-8 h-8 rounded-full border border-[#E9E7F1] bg-white text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40 hover:bg-[#FAF9FE] flex items-center justify-center transition-all"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className="w-8 h-8 rounded-full border border-[#E9E7F1] bg-white text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40 hover:bg-[#FAF9FE] flex items-center justify-center transition-all"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      </a>

      {/* Native Web Share */}
      <button
        type="button"
        onClick={handleNativeShare}
        title="Share"
        className="w-8 h-8 rounded-full border border-[#E9E7F1] bg-white text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40 hover:bg-[#FAF9FE] flex items-center justify-center transition-all cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
