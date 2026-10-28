import prisma from "@/lib/db/prisma";

export async function getSiteSettings() {
  let settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        id: "default",
        siteName: "Animesh ki Baatein",
        tagline: "Ideas, stories and knowledge for a smarter you.",
        description: "Thoughtful articles for a brighter, smarter tomorrow.",
        authorName: "Animesh Prakash",
      },
    });
  }

  return settings;
}

export async function updateSiteSettings(data: {
  siteName?: string;
  tagline?: string;
  description?: string;
  siteUrl?: string;
  logoUrl?: string;
  authorName?: string;
  authorBio?: string;
  authorAvatar?: string;
  defaultOgImage?: string;
  googleSearchConsole?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  articlesPerPage?: number;
  aboutContent?: string;
  privacyContent?: string;
  termsContent?: string;
}) {
  return prisma.siteSetting.upsert({
    where: { id: "default" },
    update: data,
    create: {
      id: "default",
      ...data,
    },
  });
}
