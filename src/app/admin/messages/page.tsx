import React from "react";
import type { Metadata } from "next";
import { getContactMessages } from "@/features/messages/message-service";
import { MessageManager } from "@/components/admin/MessageManager";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact Messages",
};

export default async function AdminMessagesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const messages = await getContactMessages("all");

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
          Contact Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review, read, and manage direct messages submitted through the public contact form.
        </p>
      </div>

      <MessageManager initialMessages={messages} />
    </div>
  );
}
