"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      
      // Show button after 280px scroll
      if (scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Calculate percentage
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Circular progress math
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-90 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#202A3D] shadow-lg shadow-[#7434E8]/15 hover:shadow-xl hover:shadow-[#7434E8]/25 border border-[#E9E7F1] hover:border-[#7434E8]/40 hover:bg-[#7434E8] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7434E8]/50 focus:ring-offset-2"
      >
        {/* SVG Circular Reading / Scroll Progress Bar */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none"
          viewBox="0 0 50 50"
        >
          {/* Background track circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#E9E7F1"
            strokeWidth="2.5"
            className="opacity-40 group-hover:opacity-0 transition-opacity"
          />
          {/* Active progress circle */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#7434E8"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150 ease-out group-hover:stroke-white"
          />
        </svg>

        {/* Up arrow icon with micro-interaction */}
        <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-1" />

        {/* Tooltip on hover */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#202A3D] text-white text-[11px] font-medium rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Back to top
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#202A3D]" />
        </span>
      </button>
    </div>
  );
}
