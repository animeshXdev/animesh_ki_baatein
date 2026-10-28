import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
  _count?: {
    articles: number;
  };
}

interface CategoryListProps {
  categories: CategoryItem[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#202A3D]">
              Browse by Category
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Find articles tailored to your specific interests and goals.
            </p>
          </div>
          <Link
            href="/blog"
            className="group hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#7434E8] hover:text-[#6028C9] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = cat._count?.articles ?? 0;
            const cardColor = cat.color || "#7434E8";

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-[18px] bg-white border border-[#E9E7F1] hover:border-[#7434E8]/40 hover:shadow-md hover:shadow-purple-900/5 transition-all duration-200"
              >
                {/* Icon Container with pastel background */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${cardColor}15`,
                    color: cardColor,
                  }}
                >
                  <CategoryIcon name={cat.icon || cat.slug} className="w-5 h-5" />
                </div>

                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-[#202A3D] group-hover:text-[#7434E8] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#667085] font-medium mt-0.5">
                    {count} {count === 1 ? "Article" : "Articles"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
