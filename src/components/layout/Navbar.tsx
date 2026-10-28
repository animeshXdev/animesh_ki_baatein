"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-white border border-[#E9E7F1] shadow-sm shadow-[#7434E8]/10 flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-[#7434E8]/20 group-hover:border-[#7434E8]/30">
            <Image
              src="/logo.png"
              alt="Animesh ki Baatein Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
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

      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Left Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white z-50 md:hidden shadow-2xl flex flex-col justify-between border-r border-[#E9E7F1] transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation sidebar"
      >
        {/* Drawer Header with Logo & Close Button */}
        <div className="p-5 border-b border-[#E9E7F1] flex items-center justify-between bg-white">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-white border border-[#E9E7F1] shadow-xs flex items-center justify-center p-1">
              <Image
                src="/logo.png"
                alt="Animesh ki Baatein"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading font-bold text-base tracking-tight text-[#202A3D]">
              Animesh <span className="text-[#7434E8]">ki Baatein</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation sidebar"
            className="w-9 h-9 rounded-xl border border-[#E9E7F1] flex items-center justify-center text-[#667085] hover:text-[#202A3D] hover:bg-[#FAF9FE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9FE] border border-[#E9E7F1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#202A3D] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#7434E8] focus:border-transparent transition-all"
            />
          </form>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] px-3 mb-2">
              Menu
            </p>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#7434E8] text-white shadow-sm shadow-[#7434E8]/20"
                      : "text-[#202A3D] hover:bg-[#FAF9FE] hover:text-[#7434E8]"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="border-t border-[#E9E7F1] pt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] px-3 mb-2.5">
                Categories
              </p>
              <div className="grid grid-cols-1 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#202A3D] hover:bg-[#FAF9FE] hover:text-[#7434E8] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <CategoryIcon
                        name={cat.icon || cat.slug}
                        className="w-3.5 h-3.5 text-[#7434E8] shrink-0"
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {cat._count?.articles !== undefined && (
                      <span className="text-[10px] text-[#98A2B3] bg-[#FAF9FE] px-2 py-0.5 rounded-full border border-[#E9E7F1]">
                        {cat._count.articles}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Action & Footer */}
        <div className="p-5 border-t border-[#E9E7F1] space-y-3 bg-[#FAF9FE]/60">
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#7434E8] hover:bg-[#6028C9] text-white text-xs font-semibold shadow-md shadow-[#7434E8]/25 transition-all"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <p className="text-[11px] text-center text-[#98A2B3]">
            © {new Date().getFullYear()} Animesh ki Baatein
          </p>
        </div>
      </aside>
    </header>
  );
}
