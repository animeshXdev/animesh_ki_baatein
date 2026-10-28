import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, Code, Heart, ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/features/settings/settings-service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `About ${settings.authorName} & ${settings.siteName}`,
    description: `Learn more about ${settings.authorName}, our mission, and the philosophy behind ${settings.siteName}.`,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="w-full py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7434E8]/10 text-[#7434E8] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behind The Publication</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#202A3D]">
            About Animesh ki Baatein
          </h1>
          <p className="text-lg text-[#667085] max-w-2xl mx-auto leading-relaxed">
            {settings.tagline}
          </p>
        </div>

        {/* Author Bio Card */}
        <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-md shrink-0 bg-purple-50">
            <Image
              src={
                settings.authorAvatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
              }
              alt={settings.authorName}
              fill
              sizes="176px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7434E8]">
                Founder & Editor-in-Chief
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#202A3D]">
                {settings.authorName}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
              {settings.authorBio ||
                "Senior full-stack architect, writer, and technology enthusiast sharing deep insights on software engineering, productivity, and modern living."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-[#E9E7F1] text-xs font-semibold text-[#202A3D] hover:border-[#7434E8] hover:text-[#7434E8] hover:bg-[#FAF9FE] transition-all"
                >
                  GitHub
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-[#E9E7F1] text-xs font-semibold text-[#202A3D] hover:border-[#7434E8] hover:text-[#7434E8] hover:bg-[#FAF9FE] transition-all"
                >
                  LinkedIn
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-[#E9E7F1] text-xs font-semibold text-[#202A3D] hover:border-[#7434E8] hover:text-[#7434E8] hover:bg-[#FAF9FE] transition-all"
                >
                  X / Twitter
                </a>
              )}
              <Link
                href="/contact"
                className="px-4 py-2 rounded-xl bg-[#7434E8] text-white text-xs font-semibold hover:bg-[#6028C9] transition-all shadow-sm"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial Philosophy */}
        <div className="rounded-3xl bg-white border border-[#E9E7F1] p-8 sm:p-12 shadow-sm space-y-6">
          <div
            className="prose-editorial max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                settings.aboutContent ||
                `
                <h2>Our Editorial Philosophy</h2>
                <p>At <strong>Animesh ki Baatein</strong>, our mission is to deliver thorough, beautifully constructed perspectives on modern computing, digital craftsmanship, and mindful intentionality.</p>
                <p>We believe in high signal-to-noise ratio: skipping superficial buzzwords to focus on foundational architectural principles, enduring frameworks, and practical mental models that make a tangible difference in how you work and live.</p>
              `,
            }}
          />
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E9E7F1] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7434E8] flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Deep Technical Mastery
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Real code examples, performance profiles, and architectural patterns tested in production environments.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E9E7F1] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Uncompromising Clarity
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Distilling convoluted ideas into accessible mental models without sacrificing depth or nuance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E9E7F1] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-[#202A3D]">
              Intentional Living
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Balancing technological ambition with health, deep focus, and meaningful human connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
