"use client";

import React, { useState, useEffect } from "react";
import { List, ChevronDown } from "lucide-react";
import { type TocItem } from "@/lib/utils/toc";

interface TableOfContentsProps {
  toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (toc.length === 0) return;

    const handleIntersection = () => {
      const headingElements = toc
        .map((item) => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          return;
        }
      }

      if (headingElements.length > 0) {
        setActiveId(headingElements[0].id);
      }
    };

    window.addEventListener("scroll", handleIntersection, { passive: true });
    handleIntersection();

    return () => window.removeEventListener("scroll", handleIntersection);
  }, [toc]);

  if (!toc || toc.length === 0) return null;

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden mb-8 rounded-2xl bg-white border border-[#E9E7F1] p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between font-heading font-semibold text-sm text-[#202A3D]"
        >
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-[#7434E8]" />
            <span>Table of Contents</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#667085] transition-transform ${
              isOpenMobile ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpenMobile && (
          <nav className="mt-4 pt-3 border-t border-[#F2F1F8] space-y-2">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className={`block text-xs py-1 transition-colors ${
                  item.level === 3 ? "pl-4 text-[#667085]" : "font-medium"
                } ${
                  activeId === item.id
                    ? "text-[#7434E8] font-bold"
                    : "text-[#667085] hover:text-[#202A3D]"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <div className="hidden lg:block sticky top-28 rounded-2xl bg-white border border-[#E9E7F1] p-5 shadow-sm">
        <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#202A3D] mb-4 pb-3 border-b border-[#F2F1F8]">
          <List className="w-4 h-4 text-[#7434E8]" />
          <span>Table of Contents</span>
        </div>

        <nav className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {toc.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className={`block text-xs transition-all leading-snug py-1.5 rounded-lg px-2 ${
                  item.level === 3 ? "pl-4 text-[#667085]" : ""
                } ${
                  isActive
                    ? "bg-[#FAF8FE] text-[#7434E8] font-bold border-l-2 border-[#7434E8]"
                    : "text-[#667085] hover:text-[#202A3D] hover:bg-[#FAF9FE]"
                }`}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
