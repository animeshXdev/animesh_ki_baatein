"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Lock, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  updateAdminProfileAction,
  changeAdminPasswordAction,
} from "@/app/actions/auth-actions";

interface ProfileManagerProps {
  admin: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    bio?: string | null;
  };
}

export function ProfileManager({ admin }: ProfileManagerProps) {
  // Profile state
  const [name, setName] = useState(admin.name);
  const [email, setEmail] = useState(admin.email);
  const [avatar, setAvatar] = useState(admin.avatar || "");
  const [bio, setBio] = useState(admin.bio || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSavingProfile(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("avatar", avatar.trim());
    formData.append("bio", bio.trim());

    try {
      const res = await updateAdminProfileAction(formData);
      if (res.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    try {
      const res = await changeAdminPasswordAction(formData);
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to change password.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Profile Details (7 cols) */}
      <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2F1F8]">
          <User className="w-4 h-4 text-[#7434E8]" />
          <h3 className="font-heading font-bold text-base text-[#202A3D]">
            Admin Account & Bio
          </h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center gap-4 pb-2">
            {avatar ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#E9E7F1] bg-gray-100 shrink-0">
                <Image
                  src={avatar}
                  alt={name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center font-bold text-xl shrink-0">
                {name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#202A3D] mb-1">
                Avatar Image URL
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="/media/avatars/... or https://..."
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-3.5 py-2 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Admin Login Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Author Biography
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8] resize-y"
            />
          </div>

          <div className="pt-3 border-t border-[#F2F1F8] flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? "Saving..." : "Update Profile"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password (5 cols) */}
      <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F2F1F8]">
          <Lock className="w-4 h-4 text-[#7434E8]" />
          <h3 className="font-heading font-bold text-base text-[#202A3D]">
            Change Password
          </h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              New Password * (Min 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202A3D] mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl px-4 py-2.5 text-xs text-[#202A3D] focus:outline-none focus:border-[#7434E8]"
            />
          </div>

          <div className="pt-3 border-t border-[#F2F1F8]">
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#202A3D] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {changingPassword ? "Updating Password..." : "Update Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
