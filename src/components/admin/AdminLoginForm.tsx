"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { loginAdminAction } from "@/app/actions/auth-actions";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password);

    try {
      const res = await loginAdminAction(formData);
      if (res.success) {
        toast.success("Welcome back! Redirecting to CMS...");
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Authentication failed.");
        toast.error(res.error || "Invalid credentials.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#FAF9FE]">
      {/* Soft ambient decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative w-16 h-16 rounded-3xl bg-white border border-[#E9E7F1] shadow-lg shadow-[#7434E8]/15 flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#7434E8]/25 group-hover:border-[#7434E8]/40">
              <Image
                src="/logo.png"
                alt="Animesh CMS Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
            Animesh CMS Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#667085]">
            Sign in to manage articles, categories, comments and settings.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 sm:p-10 shadow-xl shadow-purple-950/5 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-semibold shadow-md shadow-[#7434E8]/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#F2F1F8] flex items-center justify-center gap-2 text-xs text-[#98A2B3]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure session authorization with rate limiting</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#667085] hover:text-[#7434E8] transition-colors"
          >
            ← Return to Public Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
