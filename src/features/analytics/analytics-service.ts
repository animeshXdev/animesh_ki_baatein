import prisma from "@/lib/db/prisma";

export async function getDashboardStats() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    totalCategories,
    pendingComments,
    unreadMessages,
    viewsAggregate,
    recentArticles,
    topArticles,
    dailyViewsRaw,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.category.count(),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.article.aggregate({
      _sum: { views: true },
    }),
    prisma.article.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
      },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      take: 5,
      orderBy: { views: "desc" },
      include: {
        category: true,
      },
    }),
    prisma.articleViewDaily.findMany({
      take: 30,
      orderBy: { date: "asc" },
    }),
  ]);

  // Aggregate daily views by date
  const viewsByDateMap = new Map<string, number>();
  // Populate the last 7 days with 0 by default so chart has contiguous points
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    viewsByDateMap.set(dateStr, 0);
  }

  for (const record of dailyViewsRaw) {
    if (viewsByDateMap.has(record.date)) {
      const current = viewsByDateMap.get(record.date) || 0;
      viewsByDateMap.set(record.date, current + record.views);
    }
  }

  const dailyViews = Array.from(viewsByDateMap.entries()).map(([date, views]) => {
    // Format date as "Oct 22"
    const parsed = new Date(date + "T00:00:00Z");
    const label = parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return { date, label, views };
  });

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    totalCategories,
    pendingComments,
    unreadMessages,
    totalViews: viewsAggregate._sum.views || 0,
    recentArticles,
    topArticles,
    dailyViews,
  };
}
