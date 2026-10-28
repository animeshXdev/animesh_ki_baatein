import "dotenv/config";
import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const rawUrl = process.env.DATABASE_URL || "file:./data/blog.db";
let dbPath = rawUrl.replace(/^file:/, "");
if (!path.isAbsolute(dbPath)) {
  dbPath = path.resolve(process.cwd(), dbPath);
}

try {
  const rawDb = new Database(dbPath, { timeout: 10000 });
  rawDb.pragma("journal_mode = WAL");
  rawDb.pragma("synchronous = NORMAL");
  rawDb.close();
} catch (e) {
  // ignore
}

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
  timeout: 10000,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Initial Admin
  const adminEmail = process.env.ADMIN_EMAIL || "animesh@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Password123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: "Animesh Prakash",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      bio: "Senior full-stack architect, writer, and technology enthusiast sharing deep insights on software engineering, productivity, and modern living.",
    },
    create: {
      name: "Animesh Prakash",
      email: adminEmail,
      passwordHash,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      bio: "Senior full-stack architect, writer, and technology enthusiast sharing deep insights on software engineering, productivity, and modern living.",
    },
  });

  console.log(`👤 Admin created / updated: ${admin.email}`);

  // 2. Initial Site Settings
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {
      siteName: "Animesh ki Baatein",
      tagline: "Ideas, stories and knowledge for a smarter you.",
      description: "Thoughtful articles for a brighter, smarter tomorrow. Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle and more.",
      authorName: "Animesh Prakash",
      authorBio: "Senior full-stack architect, writer, and technology enthusiast sharing deep insights on software engineering, productivity, and modern living.",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      githubUrl: "https://github.com",
      twitterUrl: "https://twitter.com",
      linkedinUrl: "https://linkedin.com",
      youtubeUrl: "https://youtube.com",
      instagramUrl: "https://instagram.com",
      articlesPerPage: 9,
      aboutContent: `
        <h2>Welcome to Animesh ki Baatein</h2>
        <p><strong>Animesh ki Baatein</strong> is a curated digital publication dedicated to exploring modern technology, engineering principles, intentional productivity, and conscious lifestyle design.</p>
        <p>Founded by Animesh Prakash, this platform serves as an intellectual haven where complex architectural concepts are distilled into clear, actionable frameworks, and where thoughtful conversations thrive.</p>
        <h3>Our Editorial Mission</h3>
        <p>We believe that true insight comes at the intersection of deep domain mastery and multidisciplinary thinking. Our articles are crafted with meticulous attention to detail, uncompromising depth, and an unwavering commitment to clarity.</p>
      `,
      privacyContent: `
        <h2>Privacy Policy</h2>
        <p>Last updated: October 2026</p>
        <p>At <strong>Animesh ki Baatein</strong>, accessible from our official website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.</p>
        <h3>Information We Collect</h3>
        <p>When you comment on an article or send us a message via our contact form, we collect the name and email address you provide. We never share or sell your personal details with third parties.</p>
        <h3>Analytics & Cookies</h3>
        <p>We use lightweight local aggregate statistics to understand reader engagement without tracking personal identities across the web.</p>
      `,
      termsContent: `
        <h2>Terms and Conditions</h2>
        <p>Last updated: October 2026</p>
        <p>By accessing <strong>Animesh ki Baatein</strong>, you accept these terms and conditions in full. Do not continue to use the website if you do not agree to all of the terms stated on this page.</p>
        <h3>Intellectual Property</h3>
        <p>Unless otherwise stated, Animesh Prakash and/or licensors own the intellectual property rights for all material published on this website.</p>
      `,
    },
    create: {
      id: "default",
      siteName: "Animesh ki Baatein",
      tagline: "Ideas, stories and knowledge for a smarter you.",
      description: "Thoughtful articles for a brighter, smarter tomorrow. Explore in-depth articles, practical guides and fresh perspectives on technology, business, lifestyle and more.",
      authorName: "Animesh Prakash",
      authorBio: "Senior full-stack architect, writer, and technology enthusiast sharing deep insights on software engineering, productivity, and modern living.",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      githubUrl: "https://github.com",
      twitterUrl: "https://twitter.com",
      linkedinUrl: "https://linkedin.com",
      youtubeUrl: "https://youtube.com",
      instagramUrl: "https://instagram.com",
      articlesPerPage: 9,
      aboutContent: "<h2>Welcome to Animesh ki Baatein</h2><p>Curated insights and thoughtful essays on technology and life.</p>",
      privacyContent: "<h2>Privacy Policy</h2><p>Your privacy is important to us.</p>",
      termsContent: "<h2>Terms and Conditions</h2><p>Please read our terms carefully.</p>",
    },
  });

  console.log("⚙️ Site settings created / updated");

  // 3. Categories from reference screenshot
  const categoryDefs = [
    { name: "Technology", slug: "technology", description: "Architecture, frameworks, engineering best practices, and the future of computation.", color: "#7434E8", icon: "Laptop" },
    { name: "Business", slug: "business", description: "Startup strategy, profitable software models, product economics, and execution.", color: "#F59E0B", icon: "Briefcase" },
    { name: "Lifestyle", slug: "lifestyle", description: "Cultivating balance, intentional habits, wellness, and mental clarity in the digital age.", color: "#10B981", icon: "Sparkles" },
    { name: "Design", slug: "design", description: "UI/UX patterns, design systems, modern typography, and intuitive digital interfaces.", color: "#EC4899", icon: "Palette" },
    { name: "Productivity", slug: "productivity", description: "Deep work frameworks, time blocking, focus mastery, and cognitive performance.", color: "#3B82F6", icon: "Clock" },
    { name: "Career", slug: "career", description: "Navigating technical leadership, mentorship, interviewing, and high-impact growth.", color: "#EAB308", icon: "Target" },
    { name: "Health", slug: "health", description: "Physical wellness, ergonomic habits, longevity, and sustainable daily vitality.", color: "#EF4444", icon: "Activity" },
    { name: "Finance", slug: "finance", description: "Personal finance, asset building, financial independence, and smart investing.", color: "#6366F1", icon: "Wallet" },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoryDefs) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`📁 ${Object.keys(categories).length} categories ready`);

  // 4. Tags
  const tagNames = [
    "Next.js", "React", "TypeScript", "Architecture", "Web Development",
    "Productivity", "Deep Work", "Mindset", "Startups", "SaaS",
    "UI/UX", "Tailwind CSS", "Health", "Remote Work", "AI", "Finance"
  ];

  const tags: Record<string, any> = {};
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    tags[name] = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }
  console.log(`🏷️ ${Object.keys(tags).length} tags ready`);

  // 5. Articles matching reference screenshot
  const sampleArticles = [
    {
      title: "The Complete Guide to Modern Web Development in 2026",
      slug: "complete-guide-modern-web-development-2026",
      excerpt: "Explore in-depth articles, practical guides and fresh perspectives on technology, modern web architecture, Next.js App Router, and serverless edge computation.",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&auto=format&fit=crop&q=80",
      coverImageAlt: "Serene mountain landscape representing grand architectural vision",
      categorySlug: "technology",
      featured: true,
      status: "PUBLISHED",
      views: 12450,
      readingTime: 8,
      publishedAt: new Date("2026-10-25T10:00:00Z"),
      tags: ["Next.js", "React", "TypeScript", "Web Development", "Architecture"],
      content: `
        <h2>The Paradigm Shift in Full-Stack Web Engineering</h2>
        <p>The web landscape in 2026 has transitioned decisively beyond traditional single-page application complexities toward refined hybrid architectures that blend instant client interactivity with robust server-driven ergonomics.</p>
        <p>With frameworks like Next.js leading the standard, developers no longer choose between static generation and dynamic server execution. We now orchestrate streaming UI, partial pre-rendering, and granular component boundaries with seamless precision.</p>

        <h2>1. The Rise of Server-First React Components</h2>
        <p>React Server Components represent the most profound evolution in frontend development over the past decade. By shifting data retrieval and computation to the edge, our client bundles remain lightweight and responsive even as application scope expands exponentially.</p>
        <blockquote>
          "Architecture is not just about what tools you select, but where you draw the boundaries between server authority and client delight."
        </blockquote>

        <h2>2. SQLite at the Application Edge</h2>
        <p>For modern editorial and publishing platforms, embedded databases like SQLite provide instantaneous query times, zero network roundtrip latency, and bulletproof transactional integrity. When paired with write-ahead logging (WAL), local databases easily outperform remote distributed instances for read-heavy workloads.</p>

        <h2>3. Practical Code Example: Clean Data Layer</h2>
        <pre><code class="language-typescript">import { prisma } from "@/lib/db/prisma";

export async function getPublishedArticles(page = 1, limit = 9) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      include: { category: true, tags: { include: { tag: true } } },
    }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
  ]);

  return { items, total, totalPages: Math.ceil(total / limit) };
}</code></pre>

        <h2>4. Key Architectural Takeaways</h2>
        <ul>
          <li><strong>Zero unnecessary client JavaScript:</strong> Deliver semantic HTML first, hydrate only interactive micro-components.</li>
          <li><strong>Database locality:</strong> Eliminate network hops between backend compute and data stores.</li>
          <li><strong>Design consistency:</strong> Adopt unified design tokens for color, typography, and bento-grid layouts.</li>
        </ul>
      `,
    },
    {
      title: "10 Productivity Habits That Actually Work",
      slug: "10-productivity-habits-that-actually-work",
      excerpt: "Actionable frameworks and daily micro-habits backed by cognitive science to maximize deep work and reclaim your focus in a distracted world.",
      coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Organized minimal workstation with laptop, notepad, and coffee",
      categorySlug: "productivity",
      featured: true,
      status: "PUBLISHED",
      views: 9820,
      readingTime: 5,
      publishedAt: new Date("2026-10-22T09:30:00Z"),
      tags: ["Productivity", "Deep Work", "Mindset"],
      content: `
        <h2>Cutting Through the Noise of Fake Productivity</h2>
        <p>In our hyper-connected digital culture, motion is frequently confused with progress. True productivity is not about answering emails faster or maintaining twenty open browser tabs; it is the disciplined defense of high-leverage cognitive focus.</p>

        <h2>1. The 90-Minute Focused Horizon</h2>
        <p>Cognitive research demonstrates that sustained peak attention operates on ultradian rhythms of approximately 90 minutes. Structuring your workday into two distinct deep blocks yields far higher creative output than six hours of fragmented multitasking.</p>

        <h2>2. Ruthless Triage of Low-Yield Obligations</h2>
        <p>Every "yes" to a non-essential meeting or reactive chat message is an implicit "no" to your foundational projects. Establish clear boundaries around your core creative hours.</p>

        <h2>Summary Table of Core Habits</h2>
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              <th>Cadence</th>
              <th>Primary Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Time-blocking Deep Blocks</td>
              <td>Daily (Morning)</td>
              <td>High output on core architecture</td>
            </tr>
            <tr>
              <td>Async Communication Batches</td>
              <td>Twice daily</td>
              <td>Elimination of context switching</td>
            </tr>
            <tr>
              <td>Weekly Strategic Review</td>
              <td>Friday afternoon</td>
              <td>Alignment on macro objectives</td>
            </tr>
          </tbody>
        </table>
      `,
    },
    {
      title: "How to Build a Healthier and Happier Life",
      slug: "how-to-build-a-healthier-and-happier-life",
      excerpt: "Practical strategies for physical vitality, mental clarity, and cultivating mindful intentionality in an always-connected era.",
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Man standing peacefully on mountain peak watching morning sunrise",
      categorySlug: "lifestyle",
      featured: true,
      status: "PUBLISHED",
      views: 8140,
      readingTime: 6,
      publishedAt: new Date("2026-10-20T08:15:00Z"),
      tags: ["Health", "Mindset"],
      content: `
        <h2>Intentional Living in an Algorithmic World</h2>
        <p>Our modern environments are engineered to pull our attention outward. Building sustainable wellness requires an deliberate counter-current: designing routines that anchor your nervous system in physical reality.</p>
        <h2>The Triad of Daily Vitality</h2>
        <p>Quality sleep, regular movement outdoors, and unprocessed whole foods remain the irreducible cornerstones of physical and emotional resilience.</p>
      `,
    },
    {
      title: "Building Scalable Applications with Next.js 14",
      slug: "building-scalable-applications-with-nextjs",
      excerpt: "Learn best practices, architecture patterns and deployment strategies for modern web apps built with the App Router.",
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Laptop displaying code on sleek office desk",
      categorySlug: "technology",
      featured: true,
      status: "PUBLISHED",
      views: 7450,
      readingTime: 10,
      publishedAt: new Date("2026-10-21T11:00:00Z"),
      tags: ["Next.js", "React", "Architecture"],
      content: `
        <h2>Scalability Starts at the Data Boundary</h2>
        <p>Scaling a web application isn't just about handling ten thousand concurrent users; it's about keeping codebases maintainable, types sound, and latency minimal across distributed networks.</p>
      `,
    },
    {
      title: "Startup Ideas for 2026: What's Worth Pursuing?",
      slug: "startup-ideas-for-2026-whats-worth-pursuing",
      excerpt: "A practical guide to finding and validating profitable startup ideas in today's market with sustainable micro-SaaS economics.",
      coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Glowing incandescent light bulb symbolizing breakthrough innovation",
      categorySlug: "business",
      featured: true,
      status: "PUBLISHED",
      views: 6890,
      readingTime: 7,
      publishedAt: new Date("2026-10-18T14:20:00Z"),
      tags: ["Startups", "Business", "SaaS"],
      content: `
        <h2>The Renaissance of Lean Micro-Enterprises</h2>
        <p>Capital-intensive ventures with astronomical burn rates are giving way to lean, profitable software studios operated by small teams or solo founders.</p>
      `,
    },
    {
      title: "A Minimalist Guide to Deep Work",
      slug: "a-minimalist-guide-to-deep-work",
      excerpt: "Learn how to eliminate distractions and focus on what really matters with time-tested concentration techniques.",
      coverImage: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Minimalist desktop with plant and notebook",
      categorySlug: "productivity",
      featured: true,
      status: "PUBLISHED",
      views: 6120,
      readingTime: 6,
      publishedAt: new Date("2026-10-15T16:45:00Z"),
      tags: ["Productivity", "Deep Work"],
      content: `
        <h2>The Architecture of an Uncluttered Mind</h2>
        <p>Deep work is the superpower of the knowledge economy. When you learn to eliminate friction, profound insights follow naturally.</p>
      `,
    },
    {
      title: "AI Tools Every Developer Should Know in 2026",
      slug: "ai-tools-every-developer-should-know-in-2026",
      excerpt: "Modern agentic frameworks and developer tooling that amplify technical output and eliminate boilerplate drudgery.",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Abstract glowing digital tech interface",
      categorySlug: "technology",
      featured: false,
      status: "PUBLISHED",
      views: 5840,
      readingTime: 5,
      publishedAt: new Date("2026-10-12T10:00:00Z"),
      tags: ["AI", "Technology"],
      content: `
        <h2>Collaborative Intelligence in Software Engineering</h2>
        <p>The role of the developer is evolving from writing every syntax token manually to directing systems and validating high-level architecture.</p>
      `,
    },
    {
      title: "How to Manage Your Time Like a Pro",
      slug: "how-to-manage-your-time-like-a-pro",
      excerpt: "Proven prioritization matrices and time-boxing rituals to keep your daily schedule intentional and calm.",
      coverImage: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Person sitting at desk overlooking bright window",
      categorySlug: "productivity",
      featured: false,
      status: "PUBLISHED",
      views: 5210,
      readingTime: 6,
      publishedAt: new Date("2026-10-10T12:00:00Z"),
      tags: ["Productivity"],
      content: `
        <h2>Mastering the Eisenhower Matrix</h2>
        <p>Distinguishing urgency from importance is the fundamental skill of executive leadership.</p>
      `,
    },
    {
      title: "The Future of Remote Work",
      slug: "the-future-of-remote-work",
      excerpt: "Navigating asynchronous communication, distributed culture, and international talent collaboration.",
      coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Modern workspace dual monitor setup",
      categorySlug: "business",
      featured: false,
      status: "PUBLISHED",
      views: 4950,
      readingTime: 7,
      publishedAt: new Date("2026-10-08T09:00:00Z"),
      tags: ["Remote Work", "Business"],
      content: `
        <h2>Asynchronous-First Team Dynamics</h2>
        <p>When teams communicate thoughtfully in writing rather than constantly hopping on calls, deep work flourishes.</p>
      `,
    },
    {
      title: "Simple Habits for a Better Mindset",
      slug: "simple-habits-for-a-better-mindset",
      excerpt: "Cultivating stoic equanimity, daily journaling, and gratitude in high-pressure creative professions.",
      coverImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Journal, pen, and coffee mug on rustic wooden table",
      categorySlug: "lifestyle",
      featured: false,
      status: "PUBLISHED",
      views: 4620,
      readingTime: 5,
      publishedAt: new Date("2026-10-05T08:00:00Z"),
      tags: ["Mindset", "Lifestyle"],
      content: `
        <h2>The Power of Morning Pages</h2>
        <p>Starting the morning by clearing mental clutter on paper provides an unshakeable foundation for the day ahead.</p>
      `,
    },
    {
      title: "UI/UX Design Trends to Watch in 2026",
      slug: "ui-ux-design-trends-to-watch-in-2026",
      excerpt: "Soft UI, micro-interactions, bento grids, and typography-forward digital experiences that convert.",
      coverImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Design sketches and UI wireframes on studio desk",
      categorySlug: "design",
      featured: false,
      status: "PUBLISHED",
      views: 6720,
      readingTime: 6,
      publishedAt: new Date("2026-10-18T10:00:00Z"),
      tags: ["UI/UX", "Design Systems"],
      content: `
        <h2>Soft UI and Bento Grids</h2>
        <p>The modern aesthetic merges subtle pastel backdrops with crisp typography and spatial bento groupings.</p>
      `,
    },
    {
      title: "Financial Habits for a Better Future",
      slug: "financial-habits-for-a-better-future",
      excerpt: "Sensible wealth accumulation, low-cost index investing, and building freedom through cash-flowing assets.",
      coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1000&auto=format&fit=crop&q=80",
      coverImageAlt: "Piggy bank, coins, and notebook on wooden desk",
      categorySlug: "finance",
      featured: false,
      status: "PUBLISHED",
      views: 5910,
      readingTime: 8,
      publishedAt: new Date("2026-10-16T11:00:00Z"),
      tags: ["Finance"],
      content: `
        <h2>Automating Long-Term Wealth</h2>
        <p>The most reliable investment strategy is the one that removes emotion and operates on systematic discipline.</p>
      `,
    },
  ];

  for (const art of sampleArticles) {
    const category = categories[art.categorySlug];
    if (!category) continue;

    const existingArticle = await prisma.article.findUnique({
      where: { slug: art.slug },
    });

    const plainText = art.content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();

    const articleData = {
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt,
      content: art.content.trim(),
      plainText,
      coverImage: art.coverImage,
      coverImageAlt: art.coverImageAlt,
      categoryId: category.id,
      authorId: admin.id,
      status: art.status,
      featured: art.featured,
      readingTime: art.readingTime,
      views: art.views,
      seoTitle: `${art.title} | Animesh ki Baatein`,
      seoDescription: art.excerpt,
      publishedAt: art.publishedAt,
    };

    let articleId = existingArticle?.id;
    if (existingArticle) {
      await prisma.article.update({
        where: { id: existingArticle.id },
        data: articleData,
      });
    } else {
      const created = await prisma.article.create({
        data: articleData,
      });
      articleId = created.id;
    }

    if (articleId && art.tags) {
      // Connect tags
      for (const tName of art.tags) {
        const tag = tags[tName];
        if (tag) {
          await prisma.articleTag.upsert({
            where: {
              articleId_tagId: {
                articleId,
                tagId: tag.id,
              },
            },
            update: {},
            create: {
              articleId,
              tagId: tag.id,
            },
          });
        }
      }
    }
  }

  console.log(`📝 ${sampleArticles.length} sample articles seeded`);

  // 6. Sample Approved Comment for demo
  const firstArticle = await prisma.article.findFirst({
    where: { slug: "complete-guide-modern-web-development-2026" },
  });

  if (firstArticle) {
    await prisma.comment.createMany({
      data: [
        {
          articleId: firstArticle.id,
          name: "Rohan Sharma",
          email: "rohan@example.com",
          content: "Fantastic writeup, Animesh! The clarity on server-first components and local SQLite architecture is spot-on.",
          status: "APPROVED",
        },
        {
          articleId: firstArticle.id,
          name: "Priya Nair",
          email: "priya@example.com",
          content: "The bento-grid styling on this blog is stunning! Keep sharing these insightful deep dives.",
          status: "APPROVED",
        },
      ],
    });
  }

  // 7. Seed sample daily views for analytics charts (last 7 days)
  if (firstArticle) {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = Math.floor(150 + Math.random() * 200);

      await prisma.articleViewDaily.upsert({
        where: {
          articleId_date: {
            articleId: firstArticle.id,
            date: dateStr,
          },
        },
        update: { views: count },
        create: {
          articleId: firstArticle.id,
          date: dateStr,
          views: count,
        },
      });
    }
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
