import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, Calendar, Clock, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getArticles } from "@/features/articles/article-service";
import { getAllCategories } from "@/features/categories/category-service";

const appUrl = process.env.APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "All Articles & Archive",
  description:
    "Browse in-depth articles, architectural guides, and perspectives on technology, productivity, and modern living.",
  alternates: { canonical: `${appUrl}/blog` },
  openGraph: {
    title: "All Articles & Publication Archive | Animesh ki Baatein",
    description:
      "Browse in-depth articles, architectural guides, and perspectives on technology, productivity, and modern living.",
    url: `${appUrl}/blog`,
    siteName: "Animesh ki Baatein",
    type: "website",
    images: [
      {
        url: `${appUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Articles Archive on Animesh ki Baatein",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Articles & Publication Archive | Animesh ki Baatein",
    description:
      "Browse in-depth articles, architectural guides, and perspectives on technology, productivity, and modern living.",
    images: [`${appUrl}/twitter-image`],
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: "newest" | "popular" | "oldest";
  }>;
}

export default async function BlogListingPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = Number.parseInt(resolvedParams.page || "1", 10);
  const categorySlug = resolvedParams.category || undefined;
  const search = resolvedParams.search || undefined;
  const sort = resolvedParams.sort || "newest";

  const [articlesData, categories] = await Promise.all([
    getArticles({
      page,
      limit: 9,
      categorySlug,
      search,
      sort,
      status: "PUBLISHED",
    }),
    getAllCategories(),
  ]);

  const { articles, totalCount, totalPages, hasMore } = articlesData;

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Recently";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const hasActiveFilters = Boolean(categorySlug || search || sort !== "newest");

  return (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7434E8]/10 text-[#7434E8] text-xs font-bold uppercase tracking-wider">
            Explore All Content
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#202A3D]">
            Articles & Publication Archive
          </h1>
          <p className="text-base text-[#667085] leading-relaxed">
            Discover architectural deep-dives, actionable frameworks, and essays designed to elevate your thinking.
          </p>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="bg-white rounded-3xl border border-[#E9E7F1] p-4 sm:p-5 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <form action="/blog" method="GET" className="w-full md:w-96 relative flex items-center">
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Search articles by title or keyword..."
                className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8]/20 focus:border-[#7434E8]"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 rounded-full bg-[#7434E8] text-white text-xs font-semibold hover:bg-[#6028C9] shrink-0"
              >
                Search
              </button>
            </form>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <span className="text-xs font-medium text-[#667085]">Sort:</span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF9FE] border border-[#E9E7F1] text-xs">
                <Link
                  href={`/blog?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(search ? { search } : {}),
                    sort: "newest",
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sort === "newest"
                      ? "bg-white text-[#7434E8] font-bold shadow-xs"
                      : "text-[#667085] hover:text-[#202A3D]"
                  }`}
                >
                  Newest
                </Link>
                <Link
                  href={`/blog?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(search ? { search } : {}),
                    sort: "popular",
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    sort === "popular"
                      ? "bg-white text-[#7434E8] font-bold shadow-xs"
                      : "text-[#667085] hover:text-[#202A3D]"
                  }`}
                >
                  Popular
                </Link>
              </div>

              {hasActiveFilters && (
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filters</span>
                </Link>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#F2F1F8]">
            <Link
              href={`/blog?${new URLSearchParams({
                ...(search ? { search } : {}),
                sort,
              }).toString()}`}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !categorySlug
                  ? "bg-[#7434E8] text-white shadow-sm"
                  : "bg-[#FAF9FE] text-[#667085] border border-[#E9E7F1] hover:text-[#7434E8]"
              }`}
            >
              All Categories
            </Link>
            {categories.map((cat) => {
              const isSelected = categorySlug === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/blog?${new URLSearchParams({
                    category: cat.slug,
                    ...(search ? { search } : {}),
                    sort,
                  }).toString()}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#7434E8] text-white shadow-sm"
                      : "bg-[#FAF9FE] text-[#667085] border border-[#E9E7F1] hover:text-[#7434E8]"
                  }`}
                >
                  {cat.name} ({cat._count?.articles ?? 0})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-[#667085] mb-6 px-1">
          <p>
            Showing <span className="font-semibold text-[#202A3D]">{articles.length}</span> of{" "}
            <span className="font-semibold text-[#202A3D]">{totalCount}</span> articles
            {search && <span> for &ldquo;{search}&rdquo;</span>}
          </p>
        </div>

        {/* Article Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const catColor = article.category.color || "#7434E8";

              return (
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
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E9E7F1] p-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#202A3D]">
              No articles found
            </h3>
            <p className="text-sm text-[#667085] max-w-md mx-auto">
              We couldn&apos;t find any articles matching your search criteria. Try modifying your filters or searching for different keywords.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] text-white text-xs font-semibold hover:bg-[#6028C9]"
            >
              Reset Filters
            </Link>
          </div>
        )}

        {/* Server-Side Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(search ? { search } : {}),
                  sort,
                  page: (page - 1).toString(),
                }).toString()}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#E9E7F1] text-xs font-semibold text-[#202A3D] hover:bg-[#FAF9FE] hover:border-[#7434E8]/40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Link>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isCurrent = p === page;
                return (
                  <Link
                    key={p}
                    href={`/blog?${new URLSearchParams({
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(search ? { search } : {}),
                      sort,
                      page: p.toString(),
                    }).toString()}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-[#7434E8] text-white shadow-sm"
                        : "bg-white border border-[#E9E7F1] text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(categorySlug ? { category: categorySlug } : {}),
                  ...(search ? { search } : {}),
                  sort,
                  page: (page + 1).toString(),
                }).toString()}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#E9E7F1] text-xs font-semibold text-[#202A3D] hover:bg-[#FAF9FE] hover:border-[#7434E8]/40"
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
