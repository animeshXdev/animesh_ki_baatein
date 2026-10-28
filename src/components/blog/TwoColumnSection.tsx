import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Calendar, Clock, Eye } from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  readingTime?: number;
  views?: number;
  publishedAt?: Date | string | null;
  category: {
    name: string;
    slug: string;
    color?: string | null;
  };
}

interface TwoColumnSectionProps {
  latestArticles: ArticleItem[];
  popularArticles: ArticleItem[];
}

export function TwoColumnSection({
  latestArticles,
  popularArticles,
}: TwoColumnSectionProps) {
  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Recently";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatViews = (views?: number) => {
    if (!views) return "0 views";
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k views`;
    }
    return `${views} views`;
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Latest Articles (7 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#202A3D]">
                  Latest Articles
                </h2>
                <p className="text-sm text-[#667085] mt-1">
                  Stay updated with our newest content.
                </p>
              </div>
              <Link
                href="/blog"
                className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#7434E8] hover:text-[#6028C9] transition-colors"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 2x2 Grid of Latest Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {latestArticles.map((article) => {
                const catColor = article.category.color || "#7434E8";

                return (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col rounded-[20px] bg-white border border-[#E9E7F1] overflow-hidden hover:border-[#7434E8]/40 hover:shadow-lg hover:shadow-purple-900/5 transition-all duration-300"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={
                          article.coverImage ||
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                        }
                        alt={article.coverImageAlt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 35vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm"
                          style={{
                            backgroundColor: "#FFFFFFE6",
                            color: catColor,
                          }}
                        >
                          {article.category.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1">
                      <h3 className="text-base font-heading font-bold text-[#202A3D] group-hover:text-[#7434E8] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <div className="pt-3 mt-3 border-t border-[#F2F1F8] flex items-center justify-between text-xs text-[#667085]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#98A2B3]" />
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#98A2B3]" />
                          {article.readingTime || 5} min read
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Column: Popular Articles (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-current" />
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#202A3D]">
                  Popular Articles
                </h2>
              </div>
              <Link
                href="/blog?sort=popular"
                className="group flex items-center gap-1 text-xs font-semibold text-[#7434E8] hover:text-[#6028C9]"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Ranked List */}
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E9E7F1] hover:border-[#7434E8]/40 hover:shadow-md hover:shadow-purple-900/5 transition-all"
                >
                  {/* Rank Number */}
                  <span className="w-6 text-center font-heading font-extrabold text-base text-[#98A2B3] group-hover:text-[#7434E8] transition-colors shrink-0">
                    {index + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={
                        article.coverImage ||
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80"
                      }
                      alt={article.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#202A3D] group-hover:text-[#7434E8] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#667085]">
                      <span className="flex items-center gap-1 font-medium text-[#7434E8]">
                        <Eye className="w-3 h-3" />
                        {formatViews(article.views)}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
