"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  icon?: string | null;
  _count?: { articles: number };
}

interface NavbarProps {
  categories?: CategoryItem[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#E9E7F1] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7434E8] to-[#9254F3] flex items-center justify-center text-white shadow-md shadow-[#7434E8]/20 transition-transform group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl tracking-tight text-[#202A3D]">
              Animesh <span className="text-[#7434E8]">ki Baatein</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-[#7434E8] ${
              pathname === "/" ? "text-[#7434E8] font-semibold" : "text-[#667085]"
            }`}
          >
            Home
          </Link>

          <Link
            href="/blog"
            className={`text-sm font-medium transition-colors hover:text-[#7434E8] ${
              pathname.startsWith("/blog")
                ? "text-[#7434E8] font-semibold"
                : "text-[#667085]"
            }`}
          >
            Articles
          </Link>

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#7434E8] cursor-pointer ${
                pathname.startsWith("/category")
                  ? "text-[#7434E8] font-semibold"
                  : "text-[#667085]"
              }`}
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  categoriesDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-purple-900/10 border border-[#E9E7F1] p-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#FAF9FE] transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${cat.color || "#7434E8"}15`,
                          color: cat.color || "#7434E8",
                        }}
                      >
                        <CategoryIcon name={cat.icon || cat.slug} className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-[#202A3D] truncate group-hover:text-[#7434E8]">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-[#667085]">
                          {cat._count?.articles ?? 0} articles
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-2 text-xs text-[#667085] p-2 text-center">
                    No categories found
                  </p>
                )}
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-[#7434E8] ${
              pathname === "/about"
                ? "text-[#7434E8] font-semibold"
                : "text-[#667085]"
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-[#7434E8] ${
              pathname === "/contact"
                ? "text-[#7434E8] font-semibold"
                : "text-[#667085]"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search articles"
            className="w-10 h-10 rounded-full border border-[#E9E7F1] flex items-center justify-center text-[#667085] hover:text-[#7434E8] hover:border-[#7434E8]/40 hover:bg-[#FAF9FE] transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Explore Articles Pill Button */}
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-medium shadow-md shadow-[#7434E8]/25 hover:shadow-lg hover:shadow-[#7434E8]/35 transition-all transform active:scale-95"
          >
            <span>Explore Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile navigation"
            className="md:hidden w-10 h-10 rounded-xl border border-[#E9E7F1] flex items-center justify-center text-[#202A3D]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="border-t border-[#E9E7F1] bg-[#FAF9FE] px-4 py-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#667085] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search articles, topics or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E9E7F1] rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7434E8] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#7434E8] hover:bg-[#6028C9] text-white text-sm font-medium transition-all"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-3 text-[#667085] hover:text-[#202A3D]"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E9E7F1] bg-white px-6 py-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl pl-10 pr-4 py-2.5 text-sm"
            />
          </form>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 text-base font-medium transition-colors ${
                  pathname === link.href ? "text-[#7434E8] font-semibold" : "text-[#202A3D]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-[#E9E7F1] pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#667085] mb-3">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9FE] text-xs font-medium text-[#202A3D] hover:text-[#7434E8]"
                >
                  <CategoryIcon name={cat.icon || cat.slug} className="w-3.5 h-3.5 text-[#7434E8]" />
                  <span className="truncate">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/blog"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7434E8] text-white text-sm font-medium shadow-md shadow-[#7434E8]/20"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
