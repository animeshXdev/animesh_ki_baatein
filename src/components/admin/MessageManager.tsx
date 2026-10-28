"use client";

import React, { useState } from "react";
import {
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { confirmAction } from "@/lib/utils/swal";
import {
  toggleMessageReadAction,
  deleteContactMessageAction,
} from "@/app/actions/message-actions";

interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

interface MessageManagerProps {
  initialMessages: ContactMessageRecord[];
}

export function MessageManager({ initialMessages }: MessageManagerProps) {
  const [messages, setMessages] = useState<ContactMessageRecord[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageRecord | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await toggleMessageReadAction(id, !currentRead);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !currentRead } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: !currentRead } : null));
        }
        toast.success(currentRead ? "Marked as unread" : "Marked as read");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: "Delete Message?",
      text: "Are you sure you want to permanently delete this contact message?",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      isDestructive: true,
    });
    if (!confirmed) return;

    try {
      const res = await deleteContactMessageAction(id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        toast.success("Message deleted");
      }
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleOpenMessage = async (m: ContactMessageRecord) => {
    setSelectedMessage(m);
    if (!m.isRead) {
      await handleToggleRead(m.id, false);
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
      {/* Filter Tabs */}
      <div className="rounded-2xl bg-white border border-[#E9E7F1] p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9FE] border border-[#E9E7F1] text-xs">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-[#7434E8] shadow-xs"
                : "text-[#667085]"
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filter === "unread"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-[#667085]"
            }`}
          >
            Unread ({messages.filter((m) => !m.isRead).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("read")}
            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              filter === "read"
                ? "bg-white text-emerald-600 shadow-xs"
                : "text-[#667085]"
            }`}
          >
            Read ({messages.filter((m) => m.isRead).length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] overflow-hidden shadow-xs divide-y divide-[#F2F1F8]">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((m) => (
            <div
              key={m.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#FAF9FE] ${
                !m.isRead ? "bg-purple-50/30 font-medium" : ""
              }`}
            >
              <div
                onClick={() => handleOpenMessage(m)}
                className="flex-1 cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2">
                  {!m.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#7434E8]" />
                  )}
                  <span className="text-sm font-bold text-[#202A3D]">
                    {m.name}
                  </span>
                  <span className="text-xs text-[#98A2B3]">
                    &lt;{m.email}&gt;
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#202A3D]">
                  {m.subject}
                </p>
                <p className="text-xs text-[#667085] line-clamp-1">
                  {m.message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs text-[#667085]">
                <span>{formatDate(m.createdAt)}</span>

                <button
                  type="button"
                  onClick={() => handleToggleRead(m.id, m.isRead)}
                  className="p-1.5 rounded-lg border border-[#E9E7F1] hover:bg-white text-[#667085]"
                  title={m.isRead ? "Mark unread" : "Mark read"}
                >
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${
                      m.isRead ? "text-emerald-600" : "text-gray-300"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-[#667085]">
            No messages found.
          </div>
        )}
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="relative w-full max-w-xl rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2F1F8]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#202A3D]">
                  {selectedMessage.subject}
                </h3>
                <p className="text-xs text-[#667085]">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-[#667085] hover:text-[#202A3D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2 text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-line bg-[#FAF9FE] p-4 rounded-2xl border border-[#E9E7F1]">
              {selectedMessage.message}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#667085]">
              <span>Received: {formatDate(selectedMessage.createdAt)}</span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="px-4 py-2 rounded-xl bg-[#7434E8] text-white font-semibold hover:bg-[#6028C9]"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
