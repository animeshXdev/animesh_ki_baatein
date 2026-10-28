import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: {
    default: "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you",
    template: "%s | Animesh ki Baatein",
  },
  description:
    "Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle, and modern architecture.",
  keywords: [
    "Animesh ki Baatein",
    "Next.js Blog",
    "Technology",
    "Software Architecture",
    "Productivity",
    "Web Development",
  ],
  authors: [{ name: "Animesh Prakash" }],
  openGraph: {
    title: "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you",
    description:
      "Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle, and modern architecture.",
    siteName: "Animesh ki Baatein",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you",
    description:
      "Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle, and modern architecture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#202A3D] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
