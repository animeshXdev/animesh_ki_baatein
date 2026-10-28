import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Tag as TagIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { getTagBySlug } from "@/features/tags/tag-service";
import { getArticles } from "@/features/articles/article-service";

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = await getTagBySlug(resolvedParams.slug);

  if (!tag) {
    return { title: "Tag Not Found" };
  }

  return {
    title: `Articles tagged with #${tag.name}`,
    description: `Read all articles and guides tagged with #${tag.name} on Animesh ki Baatein.`,
  };
}

export default async function TagListingPage({
  params,
  searchParams,
}: TagPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = Number.parseInt(resolvedSearchParams.page || "1", 10);

  const tag = await getTagBySlug(resolvedParams.slug);
  if (!tag) {
    notFound();
  }

  const { articles, totalCount, totalPages, hasMore } = await getArticles({
    tagSlug: tag.slug,
    page,
    limit: 9,
    status: "PUBLISHED",
  });

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Recently";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tag Header */}
        <div className="bg-white rounded-3xl border border-[#E9E7F1] p-8 sm:p-12 mb-12 shadow-sm text-center max-w-4xl mx-auto space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#7434E8] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>

          <div className="w-16 h-16 rounded-2xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center mx-auto shadow-sm">
            <TagIcon className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#202A3D]">
            #{tag.name}
          </h1>

          <p className="text-sm text-[#667085]">
            Showing all published articles tagged under #{tag.name}
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9FE] border border-[#E9E7F1] text-xs font-semibold text-[#7434E8]">
            <span>{totalCount} Articles</span>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-[22px] bg-white border border-[#E9E7F1] overflow-hidden hover:border-[#7434E8]/40 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 hover:-translate-y-1"
              >
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
                </div>

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

                  <div className="pt-5 mt-5 border-t border-[#F2F1F8] flex items-center justify-between text-xs text-[#667085]">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E9E7F1] p-10 space-y-3">
            <h3 className="text-lg font-heading font-bold text-[#202A3D]">
              No articles found for #{tag.name}
            </h3>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] text-white text-xs font-semibold hover:bg-[#6028C9]"
            >
              Browse All Articles
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/tag/${tag.slug}?page=${page - 1}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#E9E7F1] text-xs font-semibold text-[#202A3D]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Link>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/tag/${tag.slug}?page=${p}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    p === page
                      ? "bg-[#7434E8] text-white shadow-sm"
                      : "bg-white border border-[#E9E7F1] text-[#667085]"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {hasMore && (
              <Link
                href={`/tag/${tag.slug}?page=${page + 1}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#E9E7F1] text-xs font-semibold text-[#202A3D]"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
