import "dotenv/config";
import prisma from "../src/lib/db/prisma";
import { verifyPassword, hashPassword } from "../src/lib/auth/password";
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
  getPopularArticles,
} from "../src/features/articles/article-service";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../src/features/categories/category-service";
import {
  getAllTags,
  createTag,
  deleteTag,
} from "../src/features/tags/tag-service";
import {
  submitComment,
  getCommentsForArticle,
  updateCommentStatus,
  deleteComment,
} from "../src/features/comments/comment-service";
import {
  submitContactMessage,
  subscribeNewsletter,
  getContactMessages,
  toggleMessageRead,
  deleteContactMessage,
} from "../src/features/messages/message-service";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../src/features/settings/settings-service";
import { getDashboardStats } from "../src/features/analytics/analytics-service";
import { processHeadingsAndExtractToc } from "../src/lib/utils/toc";

async function runTests() {
  console.log("🚀 Starting comprehensive end-to-end verification...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Admin Verification
    console.log("📋 1. Admin Authentication & Hashing");
    const admin = await prisma.admin.findUnique({
      where: { email: process.env.ADMIN_EMAIL || "animesh@example.com" },
    });
    assert(!!admin, "Admin record exists in database");
    if (admin) {
      const validPw = await verifyPassword("Admin@Password123!", admin.passwordHash);
      assert(validPw, "Admin password verification succeeds");
      const invalidPw = await verifyPassword("WrongPassword!", admin.passwordHash);
      assert(!invalidPw, "Admin invalid password rejected");
    }

    // 2. Settings Verification
    console.log("\n📋 2. Website Settings");
    const settings = await getSiteSettings();
    assert(settings.siteName === "Animesh ki Baatein", "Site name is 'Animesh ki Baatein'");
    assert(!!settings.tagline, "Tagline exists");

    // 3. Articles Query & Pagination
    console.log("\n📋 3. Articles Query & Search");
    const articlesRes = await getArticles({ page: 1, limit: 5 });
    assert(articlesRes.articles.length > 0, `Fetched ${articlesRes.articles.length} published articles`);
    assert(articlesRes.totalCount >= 10, `Total published count is ${articlesRes.totalCount}`);

    const searchRes = await getArticles({ search: "Next.js" });
    assert(searchRes.articles.length > 0, "Keyword search for 'Next.js' returns matching articles");

    const featured = await getFeaturedArticles(4);
    assert(featured.length > 0, `Fetched ${featured.length} featured articles`);

    const popular = await getPopularArticles(5);
    assert(popular.length > 0, `Fetched ${popular.length} popular articles`);

    // 4. Article Details & Table of Contents
    console.log("\n📋 4. Article Details & TOC Generation");
    const article = await getArticleBySlug("complete-guide-modern-web-development-2026");
    assert(!!article && !("redirectTo" in article), "Fetched article by slug");
    if (article && !("redirectTo" in article)) {
      const { processedHtml, toc } = processHeadingsAndExtractToc(article.content);
      assert(toc.length > 0, `Generated ${toc.length} TOC entries from headings`);
      assert(processedHtml.includes('id="'), "Headings contain generated stable id attributes");
    }

    // 5. Category CRUD
    console.log("\n📋 5. Category Management");
    const categoriesBefore = await getAllCategories();
    assert(categoriesBefore.length >= 8, `Fetched ${categoriesBefore.length} categories`);

    const newCat = await createCategory({
      name: "Test Taxonomy",
      description: "Temporary category for test",
      color: "#8B5CF6",
    });
    assert(newCat.slug === "test-taxonomy", "Category created with valid slug");

    const updatedCat = await updateCategory(newCat.id, {
      name: "Updated Test Taxonomy",
    });
    assert(updatedCat.name === "Updated Test Taxonomy", "Category updated successfully");

    await deleteCategory(updatedCat.id);
    const catCheck = await prisma.category.findUnique({ where: { id: updatedCat.id } });
    assert(!catCheck, "Category deleted successfully");

    // 6. Tag CRUD
    console.log("\n📋 6. Tag Management");
    const newTag = await createTag({ name: "Testing123" });
    assert(newTag.slug === "testing123", "Tag created with valid slug");
    await deleteTag(newTag.id);
    const tagCheck = await prisma.tag.findUnique({ where: { id: newTag.id } });
    assert(!tagCheck, "Tag deleted successfully");

    // 7. Article CRUD & Slug Redirect
    console.log("\n📋 7. Article Creation, Slug Redirect & Deletion");
    if (admin) {
      const techCat = categoriesBefore[0];
      const createdArt = await createArticle(
        {
          title: "Temporary Architectural Test Post",
          excerpt: "Short test excerpt",
          content: "<h2>Test Heading</h2><p>Article test content.</p>",
          categoryId: techCat.id,
          status: "DRAFT",
        },
        admin.id
      );
      assert(createdArt.title === "Temporary Architectural Test Post", "Draft article created");

      // Update slug to test slug redirect preservation
      const updatedArt = await updateArticle(createdArt.id, {
        title: "Renamed Architectural Test Post",
        slug: "renamed-architectural-test-post",
      });
      assert(updatedArt.slug === "renamed-architectural-test-post", "Article slug updated");

      // Verify redirect mapping exists
      const redirectRecord = await prisma.slugRedirect.findUnique({
        where: { oldSlug: createdArt.slug },
      });
      assert(
        redirectRecord?.newSlug === "renamed-architectural-test-post",
        "SlugRedirect mapping created and preserved"
      );

      // Clean up test article
      await deleteArticle(createdArt.id);
      const artCheck = await prisma.article.findUnique({ where: { id: createdArt.id } });
      assert(!artCheck, "Test article deleted cleanly");
    }

    // 8. Comment Submission & Moderation
    console.log("\n📋 8. Comments System");
    if (article && !("redirectTo" in article)) {
      const comment = await submitComment({
        articleId: article.id,
        name: "Test Reviewer",
        email: "reviewer@test.com",
        content: "This is an automated test comment for moderation.",
      });
      assert(comment.status === "PENDING", "Submitted comment is PENDING by default");

      await updateCommentStatus(comment.id, "APPROVED");
      const approvedComments = await getCommentsForArticle(article.id);
      assert(
        approvedComments.some((c) => c.id === comment.id),
        "Approved comment is now visible in article comments"
      );

      await deleteComment(comment.id);
      const commentCheck = await prisma.comment.findUnique({ where: { id: comment.id } });
      assert(!commentCheck, "Comment deleted cleanly");
    }

    // 9. Contact Message & Newsletter
    console.log("\n📋 9. Contact Messages & Newsletter");
    const msg = await submitContactMessage({
      name: "Inquiry Sender",
      email: "inquiry@example.com",
      subject: "Test Inquiry Subject",
      message: "Testing contact form submission end to end.",
    });
    assert(!msg.isRead, "Message saved with isRead = false");

    await toggleMessageRead(msg.id, true);
    const readMessages = await getContactMessages("read");
    assert(readMessages.some((m) => m.id === msg.id), "Message marked as read");

    await deleteContactMessage(msg.id);
    const msgCheck = await prisma.contactMessage.findUnique({ where: { id: msg.id } });
    assert(!msgCheck, "Contact message deleted cleanly");

    const sub = await subscribeNewsletter("newsletter_test@example.com");
    assert(!!sub.id, "Newsletter subscriber saved in SQLite");
    await prisma.newsletterSubscriber.delete({ where: { id: sub.id } });

    // 10. Dashboard Analytics
    console.log("\n📋 10. Dashboard Analytics");
    const stats = await getDashboardStats();
    assert(stats.totalArticles > 0, `Dashboard reports ${stats.totalArticles} articles`);
    assert(stats.totalViews > 0, `Dashboard reports ${stats.totalViews} total views`);
    assert(stats.dailyViews.length === 7, `Dashboard contains 7-day daily views trend`);

    console.log(`\n🎉 Test Suite Completed: ${passed} PASSED, ${failed} FAILED`);
  } catch (err) {
    console.error("Test execution failed:", err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
