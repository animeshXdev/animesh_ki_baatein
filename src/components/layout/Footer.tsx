import React from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  siteName?: string;
  tagline?: string;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
}

export function Footer({
  siteName = "Animesh ki Baatein",
  tagline = "Thoughtful articles for a brighter, smarter tomorrow.",
  githubUrl = "https://github.com",
  twitterUrl = "https://twitter.com",
  linkedinUrl = "https://linkedin.com",
  youtubeUrl = "https://youtube.com",
  instagramUrl = "https://instagram.com",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-[#E9E7F1] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-[#E9E7F1] pb-10">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-white border border-[#E9E7F1] shadow-sm shadow-[#7434E8]/10 flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-[#7434E8]/20">
                <Image
                  src="/logo.png"
                  alt="Animesh ki Baatein Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-bold text-lg text-[#202A3D]">
                Animesh <span className="text-[#7434E8]">ki Baatein</span>
              </span>
            </Link>
            <p className="text-sm text-[#667085] max-w-sm">{tagline}</p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[#667085]">
            <Link href="/" className="hover:text-[#7434E8] transition-colors">
              Home
            </Link>
            <Link href="/blog" className="hover:text-[#7434E8] transition-colors">
              Articles
            </Link>
            <Link href="/blog" className="hover:text-[#7434E8] transition-colors">
              Categories
            </Link>
            <Link href="/about" className="hover:text-[#7434E8] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#7434E8] transition-colors">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#7434E8] transition-colors">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-[#7434E8] transition-colors">
              Terms
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-[#667085]">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full border border-[#E9E7F1] flex items-center justify-center hover:text-[#7434E8] hover:border-[#7434E8] hover:bg-[#FAF9FE] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full border border-[#E9E7F1] flex items-center justify-center hover:text-[#7434E8] hover:border-[#7434E8] hover:bg-[#FAF9FE] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-[#E9E7F1] flex items-center justify-center hover:text-[#7434E8] hover:border-[#7434E8] hover:bg-[#FAF9FE] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-[#E9E7F1] flex items-center justify-center hover:text-[#7434E8] hover:border-[#7434E8] hover:bg-[#FAF9FE] transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] gap-4">
          <p>© {currentYear} {siteName}. All rights reserved.</p>
          <p className="text-[#667085]">
            Crafted for curious minds and lifelong learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
