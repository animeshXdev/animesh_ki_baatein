"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, Star, Calendar, Clock } from "lucide-react";

interface HeroArticle {
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

interface HeroSectionProps {
  mainArticle?: HeroArticle | null;
  subArticles?: HeroArticle[];
  popularTags?: string[];
}

export function HeroSection({
  mainArticle,
  subArticles = [],
  popularTags = ["Technology", "Productivity", "Business", "Lifestyle", "Design"],
}: HeroSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Recently";
    const d = new Date(dateValue);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="relative w-full pt-8 pb-14 overflow-hidden">
      {/* Background soft ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7434E8]/10 text-[#7434E8] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Insights For A Better Tomorrow</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-heading font-extrabold text-[#202A3D] leading-[1.15] tracking-tight">
              Ideas, stories and knowledge for a{" "}
              <span className="bg-gradient-to-r from-[#7434E8] via-[#8944FA] to-[#A855F7] bg-clip-text text-transparent">
                smarter you.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-xl">
              Explore in-depth articles, practical guides and fresh perspectives
              on technology, business, lifestyle, and software architecture.
            </p>

            {/* Hero Search Bar */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-lg relative flex items-center bg-white border border-[#E9E7F1] rounded-full p-1.5 shadow-sm hover:border-[#7434E8]/40 transition-all focus-within:ring-2 focus-within:ring-[#7434E8]/20 focus-within:border-[#7434E8]"
            >
              <Search className="w-5 h-5 text-[#98A2B3] ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics or keywords..."
                className="w-full bg-transparent px-3 py-2 text-sm text-[#202A3D] placeholder-[#98A2B3] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-semibold shadow-sm transition-all shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Popular Topics Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#667085]">
              <span className="font-medium text-[#202A3D]">Popular:</span>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-white border border-[#E9E7F1] hover:border-[#7434E8] hover:text-[#7434E8] hover:bg-[#FAF9FE] transition-all font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Bento Grid Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Primary Large Featured Card */}
            {mainArticle ? (
              <Link
                href={`/blog/${mainArticle.slug}`}
                className="md:col-span-7 group relative rounded-[24px] overflow-hidden min-h-[380px] lg:min-h-[420px] flex flex-col justify-between p-6 shadow-md shadow-purple-950/5 border border-[#E9E7F1] transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={
                      mainArticle.coverImage ||
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
                    }
                    alt={mainArticle.coverImageAlt || mainArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
                </div>

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Featured</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    {mainArticle.category.name}
                  </span>
                </div>

                {/* Bottom Card Content */}
                <div className="relative z-10 space-y-4">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-white group-hover:text-purple-200 transition-colors leading-snug line-clamp-2">
                    {mainArticle.title}
                  </h2>

                  <div className="flex items-center justify-between pt-2 border-t border-white/15">
                    <div className="flex items-center gap-2.5">
                      {mainArticle.author?.avatar ? (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/50">
                          <Image
                            src={mainArticle.author.avatar}
                            alt={mainArticle.author.name}
                            fill
                            sizes="28px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {mainArticle.author?.name?.charAt(0) || "A"}
                        </div>
                      )}
                      <div className="text-xs text-white/90 font-medium">
                        <span>{mainArticle.author?.name || "Animesh Prakash"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/80">
                      <span>{formatDate(mainArticle.publishedAt)}</span>
                      <span>•</span>
                      <span>{mainArticle.readingTime || 5} min read</span>
                    </div>

                    {/* Arrow Button */}
                    <div className="w-8 h-8 rounded-full bg-white/90 text-[#7434E8] flex items-center justify-center shadow-sm group-hover:bg-[#7434E8] group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {/* Right Two Stacked Cards */}
            <div className="md:col-span-5 flex flex-col gap-4">
              {subArticles.slice(0, 2).map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group relative rounded-[20px] overflow-hidden min-h-[190px] flex flex-col justify-between p-5 shadow-sm border border-[#E9E7F1] transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-0.5"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={
                        article.coverImage ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"
                      }
                      alt={article.coverImageAlt || article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
                  </div>

                  {/* Category Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/20">
                      {article.category.name}
                    </span>
                  </div>

                  {/* Title and Footer */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-base sm:text-lg font-heading font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between pt-1 text-xs text-white/80">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-white/90 text-[#7434E8] flex items-center justify-center shadow-sm group-hover:bg-[#7434E8] group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
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
