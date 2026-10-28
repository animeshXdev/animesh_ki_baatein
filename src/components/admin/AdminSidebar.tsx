"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { logoutAdminAction } from "@/app/actions/auth-actions";
import { toast } from "sonner";

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
  adminAvatar?: string | null;
  pendingCommentsCount?: number;
  unreadMessagesCount?: number;
}

export function AdminSidebar({
  adminName,
  adminEmail,
  adminAvatar,
  pendingCommentsCount = 0,
  unreadMessagesCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdminAction();
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Articles", href: "/admin/articles", icon: FileText },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Tags", href: "/admin/tags", icon: Tags },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    {
      name: "Comments",
      href: "/admin/comments",
      icon: MessageSquare,
      badge: pendingCommentsCount > 0 ? pendingCommentsCount : undefined,
    },
    {
      name: "Contact Messages",
      href: "/admin/messages",
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { name: "Website Settings", href: "/admin/settings", icon: Settings },
    { name: "Admin Profile", href: "/admin/profile", icon: User },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-r border-[#E9E7F1]">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7434E8] to-[#9254F3] flex items-center justify-center text-white shadow-md shadow-[#7434E8]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-[#202A3D] leading-none">
                Animesh CMS
              </p>
              <p className="text-[10px] text-[#7434E8] font-semibold tracking-wider uppercase mt-1">
                Admin Panel
              </p>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 text-[#667085] hover:text-[#202A3D] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Public Site Pill */}
        <div className="px-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF9FE] border border-[#E9E7F1] text-xs font-semibold text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40 transition-all group"
          >
            <span className="flex items-center gap-1.5">
              <span>View Public Site</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#7434E8] text-white shadow-sm shadow-[#7434E8]/25"
                    : "text-[#667085] hover:text-[#202A3D] hover:bg-[#FAF9FE]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#7434E8]"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white text-[#7434E8]"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="pt-4 border-t border-[#F2F1F8] space-y-3">
        <div className="flex items-center gap-3 px-2">
          {adminAvatar ? (
            <img
              src={adminAvatar}
              alt={adminName}
              className="w-9 h-9 rounded-xl object-cover border border-[#E9E7F1]"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center font-bold text-xs">
              {adminName.charAt(0)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#202A3D] truncate">{adminName}</p>
            <p className="text-[10px] text-[#667085] truncate">{adminEmail}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation Bar (Only on <lg screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E9E7F1] px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#7434E8] flex items-center justify-center text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-sm text-[#202A3D]">
            Animesh CMS
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="p-2 rounded-xl border border-[#E9E7F1] text-[#202A3D]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar (Notice: strictly no hamburger button on desktop as required!) */}
      <aside className="hidden lg:block fixed top-0 bottom-0 left-0 w-64 z-30">
        {sidebarContent}
      </aside>
    </>
  );
}
