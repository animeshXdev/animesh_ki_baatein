import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import prisma from "@/lib/db/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  // If not logged in, children might be the login page itself or will be redirected by middleware/subpages
  if (!admin) {
    return <div className="min-h-screen bg-[#FAF9FE]">{children}</div>;
  }

  // Admin is logged in: fetch badge counts for pending comments & unread messages
  const [pendingCommentsCount, unreadMessagesCount] = await Promise.all([
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF9FE] flex flex-col">
      <AdminSidebar
        adminName={admin.name}
        adminEmail={admin.email}
        adminAvatar={admin.avatar}
        pendingCommentsCount={pendingCommentsCount}
        unreadMessagesCount={unreadMessagesCount}
      />
      <main className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
