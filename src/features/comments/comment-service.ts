import prisma from "@/lib/db/prisma";
import { stripHtml } from "@/lib/utils/slug";

export async function getCommentsForArticle(articleId: string) {
  return prisma.comment.findMany({
    where: {
      articleId,
      status: "APPROVED",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      content: true,
      createdAt: true,
    },
  });
}

export async function submitComment(data: {
  articleId: string;
  name: string;
  email: string;
  content: string;
}) {
  const cleanName = data.name.trim().slice(0, 60);
  const cleanEmail = data.email.trim().toLowerCase().slice(0, 100);
  const cleanContent = stripHtml(data.content).trim().slice(0, 2000);

  if (!cleanName || cleanName.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error("Please provide a valid email address.");
  }

  if (!cleanContent || cleanContent.length < 4) {
    throw new Error("Comment must be at least 4 characters long.");
  }

  // Ensure article exists and is published
  const article = await prisma.article.findUnique({
    where: { id: data.articleId },
  });

  if (!article || article.status !== "PUBLISHED") {
    throw new Error("Cannot comment on this article.");
  }

  return prisma.comment.create({
    data: {
      articleId: data.articleId,
      name: cleanName,
      email: cleanEmail,
      content: cleanContent,
      status: "PENDING",
    },
  });
}

export async function getAllComments(status?: string, articleId?: string) {
  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  if (articleId) {
    where.articleId = articleId;
  }

  return prisma.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}

export async function updateCommentStatus(
  id: string,
  status: "APPROVED" | "REJECTED" | "PENDING"
) {
  return prisma.comment.update({
    where: { id },
    data: { status },
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
