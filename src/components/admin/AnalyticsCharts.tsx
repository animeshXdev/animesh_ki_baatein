"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DailyViewItem {
  date: string;
  label: string;
  views: number;
}

interface TopArticleItem {
  id: string;
  title: string;
  views: number;
}

interface AnalyticsChartsProps {
  dailyViews: DailyViewItem[];
  topArticles: TopArticleItem[];
}

export function AnalyticsCharts({
  dailyViews,
  topArticles,
}: AnalyticsChartsProps) {
  // Format top articles for bar chart
  const barData = topArticles.map((art) => ({
    name: art.title.length > 20 ? art.title.slice(0, 18) + "..." : art.title,
    views: art.views,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Daily Views Area Chart (8 cols) */}
      <div className="lg:col-span-8 rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F2F1F8]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Article Views Trend
            </h3>
            <p className="text-xs text-[#667085]">
              Daily aggregate reader views over the past 7 days
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#7434E8]/10 text-[#7434E8]">
            Last 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          {dailyViews.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyViews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7434E8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7434E8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2F1F8" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={{ stroke: "#E9E7F1" }}
                  tick={{ fill: "#667085", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#E9E7F1" }}
                  tick={{ fill: "#667085", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E9E7F1",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value} views`, "Views"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#7434E8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#667085]">
              No view statistics recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Articles Bar Chart (4 cols) */}
      <div className="lg:col-span-4 rounded-3xl bg-white border border-[#E9E7F1] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F2F1F8]">
          <div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Top Articles
            </h3>
            <p className="text-xs text-[#667085]">Highest viewed articles</p>
          </div>
        </div>

        <div className="h-64 w-full">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F2F1F8" />
                <XAxis type="number" tick={{ fill: "#667085", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#202A3D", fontSize: 10 }}
                  width={90}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E9E7F1",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`${val} views`, "Views"]}
                />
                <Bar dataKey="views" fill="#7434E8" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#667085]">
              No articles to rank yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
