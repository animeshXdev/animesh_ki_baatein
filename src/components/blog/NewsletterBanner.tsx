"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletterAction } from "@/app/actions/message-actions";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);

    try {
      const res = await subscribeNewsletterAction(formData);
      if (res.success) {
        setSubscribed(true);
        toast.success(res.message);
        setEmail("");
      } else {
        toast.error(res.error || "Subscription failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-[#F7F3FE] border border-[#E9DFFC] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          {/* Left Description */}
          <div className="flex items-center gap-5 max-w-xl text-left">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#7434E8] shadow-sm flex items-center justify-center shrink-0 border border-[#E9DFFC]">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7434E8]">
                Stay Updated
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#202A3D] mt-0.5">
                Get the latest articles delivered to your inbox.
              </h3>
              <p className="text-sm text-[#667085] mt-1">
                Join our newsletter and never miss thoughtful insights or guides.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-white border border-[#E9E7F1] text-emerald-600 font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>You&apos;re subscribed! Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <div className="relative flex items-center bg-white border border-[#E9E7F1] rounded-full p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-[#7434E8]/20 focus-within:border-[#7434E8]">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent px-4 py-2.5 text-sm text-[#202A3D] placeholder-[#98A2B3] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-semibold shadow-sm transition-all shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? "..." : "Subscribe"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#667085] text-center lg:text-left pl-3">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
