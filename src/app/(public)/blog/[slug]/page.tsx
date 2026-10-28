import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Tag as TagIcon,
  BookOpen,
} from "lucide-react";
import {
  getArticleBySlug,
  getRelatedArticles,
  recordArticleView,
} from "@/features/articles/article-service";
import { processHeadingsAndExtractToc } from "@/lib/utils/toc";
import { ArticleReadingProgress } from "@/components/blog/ArticleReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { CommentSection } from "@/components/blog/CommentSection";
import { getCurrentAdmin } from "@/lib/auth/session";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug, true);

  if (!article || "redirectTo" in article) {
    return {
      title: "Article Not Found",
    };
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const articleUrl = `${appUrl}/blog/${article.slug}`;

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      url: articleUrl,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              alt: article.coverImageAlt || article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticleDetailsPage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const currentAdmin = await getCurrentAdmin();
  const allowDraft = Boolean(currentAdmin);

  const articleResult = await getArticleBySlug(resolvedParams.slug, allowDraft);

  if (!articleResult) {
    notFound();
  }

  if ("redirectTo" in articleResult) {
    redirect(`/blog/${articleResult.redirectTo}`);
  }

  const article = articleResult;

  // Record view asynchronously with duplicate suppression
  const headersList = await headers();
  const clientIp =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "127.0.0.1";

  // Only record views for published public visits
  if (article.status === "PUBLISHED" && !currentAdmin) {
    await recordArticleView(article.id, clientIp);
  }

  const relatedArticles = await getRelatedArticles(
    article.id,
    article.categoryId,
    3
  );

  const { processedHtml, toc } = processHeadingsAndExtractToc(article.content);

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const currentUrl = `${appUrl}/blog/${article.slug}`;

  const formatDate = (dateValue?: Date | string | null) => {
    if (!dateValue) return "Recently";
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // JSON-LD Structured Data for BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Animesh ki Baatein",
      logo: {
        "@type": "ImageObject",
        url: `${appUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
  };

  return (
    <article className="w-full pb-20">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading Progress Indicator */}
      <ArticleReadingProgress />

      {/* Hero Header Banner */}
      <div className="w-full bg-gradient-to-b from-purple-50/50 via-[#FAF9FE] to-[#FAF9FE] pt-10 pb-12 border-b border-[#E9E7F1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Back link & Category Badge */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#7434E8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </Link>

            <Link
              href={`/category/${article.category.slug}`}
              className="px-3.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs"
              style={{
                backgroundColor: `${article.category.color || "#7434E8"}15`,
                color: article.category.color || "#7434E8",
              }}
            >
              {article.category.name}
            </Link>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#202A3D] leading-[1.2] tracking-tight">
            {article.title}
          </h1>

          {/* Optional Excerpt */}
          {article.excerpt && (
            <p className="text-lg sm:text-xl text-[#667085] leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Author & Meta Row */}
          <div className="pt-4 border-t border-[#E9E7F1] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {article.author.avatar ? (
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#7434E8] text-white flex items-center justify-center font-bold text-sm">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-heading font-bold text-sm text-[#202A3D]">
                  {article.author.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#667085]">
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

            {/* Social Share Buttons */}
            <ShareButtons title={article.title} url={currentUrl} />
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar TOC + Article Body) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Body (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Featured Image */}
            {article.coverImage && (
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-lg border border-[#E9E7F1] bg-gray-100">
                <Image
                  src={article.coverImage}
                  alt={article.coverImageAlt || article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Mobile Table of Contents */}
            {toc.length > 0 && <TableOfContents toc={toc} />}

            {/* Editorial Content */}
            <div
              className="prose-editorial max-w-none"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Article Tags */}
            {article.tags.length > 0 && (
              <div className="pt-6 border-t border-[#E9E7F1] flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#667085] flex items-center gap-1 mr-1">
                  <TagIcon className="w-3.5 h-3.5 text-[#7434E8]" />
                  Tags:
                </span>
                {article.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 rounded-full bg-white border border-[#E9E7F1] hover:border-[#7434E8] hover:text-[#7434E8] text-xs font-medium text-[#667085] transition-all"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Profile Card */}
            <div className="rounded-3xl bg-white border border-[#E9E7F1] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm">
              {article.author.avatar ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#7434E8]/10 text-[#7434E8] flex items-center justify-center font-bold text-xl shrink-0">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7434E8]">
                  About the Author
                </span>
                <h4 className="text-base font-heading font-bold text-[#202A3D]">
                  {article.author.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  {article.author.bio ||
                    "Senior full-stack architect, writer, and technology enthusiast sharing deep insights on software engineering, productivity, and modern living."}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection
              articleId={article.id}
              initialComments={article.comments}
            />
          </div>

          {/* Desktop Right Sidebar: Table of Contents & Sticky info (4 cols) */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            {toc.length > 0 && <TableOfContents toc={toc} />}

            {/* Related Articles Box in Sidebar */}
            {relatedArticles.length > 0 && (
              <div className="rounded-2xl bg-white border border-[#E9E7F1] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#202A3D] pb-3 border-b border-[#F2F1F8]">
                  <BookOpen className="w-4 h-4 text-[#7434E8]" />
                  <span>Related Articles</span>
                </div>
                <div className="space-y-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="group block space-y-1"
                    >
                      <h5 className="text-xs font-bold text-[#202A3D] group-hover:text-[#7434E8] transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                      <p className="text-[11px] text-[#667085]">
                        {formatDate(rel.publishedAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
