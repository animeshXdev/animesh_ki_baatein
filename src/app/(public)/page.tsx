import React from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/blog/HeroSection";
import { CategoryList } from "@/components/blog/CategoryList";
import { FeaturedGrid } from "@/components/blog/FeaturedGrid";
import { TwoColumnSection } from "@/components/blog/TwoColumnSection";
import { NewsletterBanner } from "@/components/blog/NewsletterBanner";
import {
  getFeaturedArticles,
  getLatestArticles,
  getPopularArticles,
} from "@/features/articles/article-service";
import { getAllCategories } from "@/features/categories/category-service";
import { getSiteSettings } from "@/features/settings/settings-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const title = `${settings.siteName} — ${settings.tagline}`;
  const description = settings.description;

  return {
    title,
    description,
    alternates: { canonical: appUrl },
    openGraph: {
      title,
      description,
      url: appUrl,
      siteName: settings.siteName,
      type: "website",
      images: [
        {
          url: `${appUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${settings.siteName} — ${settings.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${appUrl}/twitter-image`],
    },
  };
}

export default async function HomePage() {
  const [featuredArticles, latestArticles, popularArticles, categories] =
    await Promise.all([
      getFeaturedArticles(6),
      getLatestArticles(4),
      getPopularArticles(5),
      getAllCategories(),
    ]);

  const mainArticle = featuredArticles.length > 0 ? featuredArticles[0] : null;
  const subArticles = featuredArticles.slice(1, 3);
  const secondaryFeatured = featuredArticles.slice(3, 6);

  return (
    <div className="flex flex-col">
      <HeroSection
        mainArticle={mainArticle}
        subArticles={subArticles}
        popularTags={["Technology", "Productivity", "Business", "Lifestyle", "Design"]}
      />

      <CategoryList categories={categories} />

      {secondaryFeatured.length > 0 && (
        <FeaturedGrid articles={secondaryFeatured} />
      )}

      <TwoColumnSection
        latestArticles={latestArticles}
        popularArticles={popularArticles}
      />

      <NewsletterBanner />
    </div>
  );
}
