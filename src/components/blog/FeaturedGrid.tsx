import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";

interface FeaturedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  readingTime?: number;
  publishedAt?: Date | string | null;
  category: {
    name: string;
    slug: string;
    color?: string | null;
  };
  author?: {
    name: string;
    avatar?: string | null;
  };
}

interface FeaturedGridProps {
  articles: FeaturedArticle[];
}

export function FeaturedGrid({ articles }: FeaturedGridProps) {
  if (!articles || articles.length === 0) return null;

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Recently";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#202A3D]">
              Featured Articles
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Handpicked articles you shouldn&apos;t miss.
            </p>
          </div>
          <Link
            href="/blog"
            className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#7434E8] hover:text-[#6028C9] transition-colors"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const catColor = article.category.color || "#7434E8";

            return (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-[22px] bg-white border border-[#E9E7F1] overflow-hidden hover:border-[#7434E8]/40 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={
                      article.coverImage ||
                      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={article.coverImageAlt || article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill on image */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                      style={{
                        backgroundColor: "#FFFFFFE6",
                        color: catColor,
                      }}
                    >
                      {article.category.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <h3 className="text-lg font-heading font-bold text-[#202A3D] group-hover:text-[#7434E8] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-[#667085] line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 mt-5 border-t border-[#F2F1F8] flex items-center justify-between text-xs text-[#667085]">
                    <div className="flex items-center gap-2">
                      {article.author?.avatar ? (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={article.author.avatar}
                            alt={article.author.name}
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center font-bold text-[10px]">
                          {article.author?.name?.charAt(0) || "A"}
                        </div>
                      )}
                      <span className="font-medium text-[#202A3D] truncate max-w-[100px]">
                        {article.author?.name || "Animesh"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#98A2B3]" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#98A2B3]" />
                        {article.readingTime || 5} min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
