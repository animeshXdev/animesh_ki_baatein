import prisma from "@/lib/db/prisma";
import { slugify, calculateReadingTime, stripHtml } from "@/lib/utils/slug";
import { sanitizeHtml } from "@/lib/security/sanitize";

export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  status?: string; // "PUBLISHED", "DRAFT", or "ALL"
  featured?: boolean;
  sort?: "newest" | "popular" | "oldest";
}

export async function getArticles(params: ArticleQueryParams = {}) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(params.limit || 9, 50));
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.status && params.status !== "ALL") {
    where.status = params.status;
  } else if (!params.status) {
    where.status = "PUBLISHED";
  }

  if (params.featured !== undefined) {
    where.featured = params.featured;
  }

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }

  if (params.tagSlug) {
    where.tags = {
      some: {
        tag: { slug: params.tagSlug },
      },
    };
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim();
    where.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { plainText: { contains: q } },
      { category: { name: { contains: q } } },
      { tags: { some: { tag: { name: { contains: q } } } } },
    ];
  }

  let orderBy: any = { publishedAt: "desc" };
  if (params.sort === "popular") {
    orderBy = { views: "desc" };
  } else if (params.sort === "oldest") {
    orderBy = { publishedAt: "asc" };
  }

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: {
              where: { status: "APPROVED" },
            },
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    hasMore: skip + articles.length < totalCount,
  };
}

export async function getArticleBySlug(slug: string, allowDraft = false) {
  let article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!article) {
    // Check if there is a redirect record
    const redirectRecord = await prisma.slugRedirect.findUnique({
      where: { oldSlug: slug },
    });
    if (redirectRecord) {
      return { redirectTo: redirectRecord.newSlug };
    }
    return null;
  }

  if (!allowDraft && article.status !== "PUBLISHED") {
    return null;
  }

  return article;
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string,
  limit = 3
) {
  return prisma.article.findMany({
    where: {
      id: { not: articleId },
      status: "PUBLISHED",
      categoryId,
    },
    take: limit,
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getFeaturedArticles(limit = 6) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      featured: true,
    },
    take: limit,
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getPopularArticles(limit = 5) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    take: limit,
    orderBy: { views: "desc" },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

export async function getLatestArticles(limit = 4) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    take: limit,
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
}

// In-memory set to prevent multiple refreshes within 30 minutes from inflating view count
const recentViews = new Map<string, number>();

export async function recordArticleView(articleId: string, clientIp: string) {
  const key = `${articleId}:${clientIp}`;
  const now = Date.now();
  const lastViewTime = recentViews.get(key);

  if (lastViewTime && now - lastViewTime < 30 * 60 * 1000) {
    return; // Ignored duplicate refresh
  }
  recentViews.set(key, now);

  const todayStr = new Date().toISOString().split("T")[0];

  try {
    await prisma.$transaction([
      prisma.article.update({
        where: { id: articleId },
        data: { views: { increment: 1 } },
      }),
      prisma.articleViewDaily.upsert({
        where: {
          articleId_date: {
            articleId,
            date: todayStr,
          },
        },
        update: { views: { increment: 1 } },
        create: {
          articleId,
          date: todayStr,
          views: 1,
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to record article view:", error);
  }
}

export async function createArticle(
  data: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    coverImageAlt?: string;
    categoryId: string;
    tagIds?: string[];
    status?: "DRAFT" | "PUBLISHED";
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
  },
  authorId: string
) {
  const baseSlug = slugify(data.slug || data.title);
  let finalSlug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const sanitizedContent = sanitizeHtml(data.content);
  const plainText = stripHtml(sanitizedContent);
  const readingTime = calculateReadingTime(plainText);
  const isPublished = data.status === "PUBLISHED";

  return prisma.article.create({
    data: {
      title: data.title.trim(),
      slug: finalSlug,
      excerpt: data.excerpt?.trim() || null,
      content: sanitizedContent,
      plainText,
      coverImage: data.coverImage || null,
      coverImageAlt: data.coverImageAlt || null,
      categoryId: data.categoryId,
      authorId,
      status: data.status || "DRAFT",
      featured: data.featured || false,
      readingTime,
      seoTitle: data.seoTitle?.trim() || data.title.trim(),
      seoDescription: data.seoDescription?.trim() || data.excerpt?.trim() || null,
      ogImage: data.ogImage || data.coverImage || null,
      publishedAt: isPublished ? new Date() : null,
      tags: {
        create: (data.tagIds || []).map((tagId) => ({
          tagId,
        })),
      },
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function updateArticle(
  id: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    coverImageAlt?: string;
    categoryId?: string;
    tagIds?: string[];
    status?: "DRAFT" | "PUBLISHED";
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
  }
) {
  const existing = await prisma.article.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!existing) throw new Error("Article not found");

  let slug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    const baseSlug = slugify(data.slug);
    let checkSlug = baseSlug;
    let counter = 1;
    while (true) {
      const found = await prisma.article.findUnique({ where: { slug: checkSlug } });
      if (!found || found.id === id) {
        slug = checkSlug;
        break;
      }
      checkSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Save slug redirect mapping to prevent breaking old links
    await prisma.slugRedirect.upsert({
      where: { oldSlug: existing.slug },
      update: { newSlug: slug, articleId: id },
      create: { oldSlug: existing.slug, newSlug: slug, articleId: id },
    });
  }

  let sanitizedContent = existing.content;
  let plainText = existing.plainText;
  let readingTime = existing.readingTime;

  if (data.content !== undefined) {
    sanitizedContent = sanitizeHtml(data.content);
    plainText = stripHtml(sanitizedContent);
    readingTime = calculateReadingTime(plainText);
  }

  let publishedAt = existing.publishedAt;
  if (data.status === "PUBLISHED" && !existing.publishedAt) {
    publishedAt = new Date();
  }

  // Update article tags if provided
  if (data.tagIds !== undefined) {
    await prisma.articleTag.deleteMany({ where: { articleId: id } });
    if (data.tagIds.length > 0) {
      await prisma.articleTag.createMany({
        data: data.tagIds.map((tagId) => ({
          articleId: id,
          tagId,
        })),
      });
    }
  }

  return prisma.article.update({
    where: { id },
    data: {
      title: data.title?.trim() ?? existing.title,
      slug,
      excerpt: data.excerpt !== undefined ? data.excerpt.trim() || null : existing.excerpt,
      content: sanitizedContent,
      plainText,
      coverImage: data.coverImage !== undefined ? data.coverImage : existing.coverImage,
      coverImageAlt: data.coverImageAlt !== undefined ? data.coverImageAlt : existing.coverImageAlt,
      categoryId: data.categoryId ?? existing.categoryId,
      status: data.status ?? existing.status,
      featured: data.featured !== undefined ? data.featured : existing.featured,
      readingTime,
      seoTitle: data.seoTitle?.trim() ?? existing.seoTitle,
      seoDescription: data.seoDescription !== undefined ? data.seoDescription.trim() || null : existing.seoDescription,
      ogImage: data.ogImage !== undefined ? data.ogImage : existing.ogImage,
      publishedAt,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}
