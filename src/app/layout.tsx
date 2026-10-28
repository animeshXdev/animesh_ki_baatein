import type { Metadata, Viewport } from "next";
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

const appUrl = process.env.APP_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#7434E8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
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
    "Business",
    "Lifestyle",
  ],
  authors: [{ name: "Animesh Prakash", url: appUrl }],
  creator: "Animesh Prakash",
  publisher: "Animesh ki Baatein",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.svg"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you",
    description:
      "Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle, and modern architecture.",
    siteName: "Animesh ki Baatein",
    url: appUrl,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Animesh ki Baatein — Ideas, stories and knowledge for a smarter you",
    description:
      "Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle, and modern architecture.",
    creator: "@animeshprakash",
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 630,
        alt: "Animesh ki Baatein Preview",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#202A3D] antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
