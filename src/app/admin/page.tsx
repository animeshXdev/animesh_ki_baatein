import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Eye,
  MessageSquare,
  FolderTree,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileEdit,
  ExternalLink,
} from "lucide-react";
import { getDashboardStats } from "@/features/analytics/analytics-service";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { getCurrentAdmin } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const stats = await getDashboardStats();

  const overviewCards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      sub: `${stats.publishedArticles} published, ${stats.draftArticles} drafts`,
      icon: FileText,
      color: "#7434E8",
      bg: "#7434E815",
    },
    {
      title: "Total Article Views",
      value: stats.totalViews.toLocaleString(),
      sub: "Aggregated reader impressions",
      icon: Eye,
      color: "#2563EB",
      bg: "#2563EB15",
    },
    {
      title: "Pending Comments",
      value: stats.pendingComments,
      sub: stats.pendingComments > 0 ? "Requires admin moderation" : "All moderated",
      icon: MessageSquare,
      color: stats.pendingComments > 0 ? "#DC2626" : "#16A34A",
      bg: stats.pendingComments > 0 ? "#DC262615" : "#16A34A15",
      link: "/admin/comments",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      sub: "Active topic taxonomies",
      icon: FolderTree,
      color: "#F59E0B",
      bg: "#F59E0B15",
      link: "/admin/categories",
    },
  ];

  const formatDate = (dateValue: Date | string) => {
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
            Publication Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Real-time analytics and publishing operations for Animesh ki Baatein.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {overviewCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="rounded-3xl bg-white border border-[#E9E7F1] p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#667085]">
                  {card.title}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: card.bg, color: card.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-heading font-extrabold text-[#202A3D]">
                  {card.value}
                </p>
                <p className="text-xs text-[#667085] mt-1">{card.sub}</p>
              </div>

              {card.link && (
                <div className="pt-2 border-t border-[#F2F1F8]">
                  <Link
                    href={card.link}
                    className="text-[11px] font-semibold text-[#7434E8] hover:text-[#6028C9] inline-flex items-center gap-1"
                  >
                    <span>Manage</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts
        dailyViews={stats.dailyViews}
        topArticles={stats.topArticles}
      />

      {/* Recent Articles Table */}
      <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F1F8]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Recent Articles
            </h3>
            <p className="text-xs text-[#667085]">
              Quickly inspect and manage recently modified articles
            </p>
          </div>
          <Link
            href="/admin/articles"
            className="text-xs font-semibold text-[#7434E8] hover:text-[#6028C9] inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E7F1] text-[#667085] font-semibold">
                <th className="py-3 px-4">Article Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F1F8]">
              {stats.recentArticles.length > 0 ? (
                stats.recentArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#FAF9FE] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#202A3D] max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7434E8]/10 text-[#7434E8] font-medium text-[11px]">
                        {art.category.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {art.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#667085] font-medium">
                      {art.views.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-[#667085]">
                      {formatDate(art.updatedAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="p-1.5 rounded-lg border border-[#E9E7F1] hover:bg-[#FAF9FE] hover:text-[#7434E8] inline-flex items-center text-[#667085]"
                        title="Edit Article"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </Link>
                      {art.status === "PUBLISHED" && (
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-[#E9E7F1] hover:bg-[#FAF9FE] hover:text-[#7434E8] inline-flex items-center text-[#667085]"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#667085]">
                    No articles created yet. Click &ldquo;Write New Article&rdquo; above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
