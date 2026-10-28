# Animesh ki Baatein — Premium Next.js Blog & CMS Platform

A production-ready, editorial blog website and secure Admin CMS built with Next.js App Router, Tailwind CSS 4, Tiptap, and SQLite with Prisma ORM.

Designed with a Soft UI & Bento Grid aesthetic matching modern SaaS digital publications.

---

## 🌟 Key Features

### 📖 Public Editorial Blog
- **Bento Grid Homepage**: Hero layout featuring primary spotlight card, secondary featured cards, live search, and popular tag filters.
- **Dynamic Taxonomy**: Browse by Category cards with custom pastel accents, Lucide icons, and real article counts.
- **Featured & Popular Articles**: Editorial 3-column grid and ranked top 5 list with live view counts.
- **Article Archive (`/blog`)**: Real database-backed search, category filtering, newest/popular sorting, and server-side pagination.
- **Reading Experience (`/blog/[slug]`)**:
  - Automatically generated Table of Contents with active scrollspy and stable anchor IDs
  - Subtle top reading progress indicator
  - Editorial typography with support for headings, code blocks, blockquotes, tables, and images
  - Social sharing (X/Twitter, LinkedIn, Web Share API, and clipboard copy with feedback)
  - Related articles recommendation engine
  - Moderated comment system (visitor name + private email + sanitized comment)
- **Static Content**: About page with author bio, Contact form with SQLite message storage, and dynamic Privacy Policy & Terms pages.
- **Newsletter**: "Stay Updated" banner with verified email subscriptions.
- **SEO & Structured Data**: Dynamic metadata, OpenGraph tags, Twitter Cards, `BlogPosting` JSON-LD schema, dynamic XML sitemap (`/sitemap.xml`), and robots directive (`/robots.txt`).

### 🛡️ Secure Admin CMS
- **Session Authentication**: Cryptographic token hashing (SHA-256), HttpOnly and SameSite cookies, database-backed sessions with expiration and revocation.
- **Brute-Force Protection**: Sliding-window rate limiting on login, comments, and contact submissions.
- **Fixed Sidebar Dashboard**: SaaS layout (no redundant desktop hamburger) with metric overview cards and Recharts analytics (7-day daily views and top articles).
- **Tiptap Rich-Text Editor**: Toolbar supporting H2–H4 headings, bold, italic, underline, strikethrough, lists, blockquotes, code blocks, tables, image insertion, links, and undo/redo.
- **Article Management**: Create, edit, draft/publish toggle, featured spotlight toggle, and slug redirects (preserves old URLs upon slug changes).
- **Category & Tag Management**: Full CRUD with color picker, icon selector, and delete restrictions if articles are assigned.
- **Media Library**: Upload JPEG, PNG, WebP, GIF (magic bytes signature validation, max 5MB, unique filenames). Served directly through the secure `/media/[...path]` route handler to ensure production persistence.
- **Comment Moderation**: Review pending visitor comments, approve, reject, or delete.
- **Contact Messages**: Read messages, mark as read/unread, and delete.
- **Website Settings**: Configure branding, author bio, social links, SEO defaults, and editable legal pages.
- **Admin Profile**: Update display name, email, avatar, bio, and change password with current password verification.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js (App Router, React 19) |
| **Language** | TypeScript (Strict) |
| **Styling** | Tailwind CSS 4 with custom design tokens |
| **Icons** | Lucide React |
| **Database** | Local SQLite (`data/blog.db`) |
| **ORM** | Prisma 7 with `@prisma/adapter-better-sqlite3` |
| **Rich Text Editor** | Tiptap (StarterKit, Link, Image, Table, Underline) |
| **Charts** | Recharts |
| **Toasts** | Sonner |
| **Security** | bcryptjs, Node.js Crypto, custom HTML sanitizer |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 20+ (Node.js 22 LTS recommended)
- npm or pnpm

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create your `.env` file (copied from `.env.example`):
```env
NODE_ENV="development"
APP_URL="http://localhost:3000"

DATABASE_URL="file:./data/blog.db"

ADMIN_EMAIL="animesh@example.com"
ADMIN_PASSWORD="Admin@Password123!"
SESSION_SECRET="animesh-ki-baatein-super-secure-session-secret-2026-very-strong"
```

### 4. Database Initialization & Seeding
Create the SQLite database, run migrations, and populate initial demo articles, categories, settings, and the administrator account:
```bash
# Apply Prisma migrations
npx prisma migrate dev --name init

# Seed initial admin account, categories, tags, and articles
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

- **Admin Login Route**: `/admin/login`
- **Email**: `animesh@example.com`
- **Password**: `Admin@Password123!`

*(You can change your email, password, and profile anytime inside `/admin/profile`)*

---

## 📁 Project Structure

```text
animesh_ki_baatein/
├── data/
│   └── blog.db                  # Persistent SQLite database (WAL mode)
├── prisma/
│   ├── migrations/              # Database migration history
│   ├── schema.prisma            # Normalized database models
│   └── seed.ts                  # Idempotent database seeder
├── public/
│   └── uploads/                 # Local uploaded media directory
│       ├── articles/
│       ├── avatars/
│       ├── branding/
│       └── media/
├── scripts/
│   └── test-platform.ts         # End-to-end service and DB test suite
├── src/
│   ├── app/
│   │   ├── (public)/            # Public blog routes (Home, Blog, About, Contact, etc.)
│   │   ├── actions/             # Secure Next.js Server Actions
│   │   ├── admin/               # Admin CMS routes (Dashboard, Articles, Categories, etc.)
│   │   ├── media/               # Media serving route handler (/media/[...path])
│   │   ├── globals.css          # Design tokens and editorial prose styling
│   │   ├── layout.tsx           # Root HTML layout with Google Fonts
│   │   ├── robots.ts            # Dynamic robots.txt
│   │   └── sitemap.ts           # Dynamic XML sitemap
│   ├── components/
│   │   ├── admin/               # Admin components (Sidebar, TiptapEditor, ArticleForm, Charts)
│   │   ├── blog/                # Blog components (HeroSection, Bento cards, TOC, Comments)
│   │   ├── layout/              # Navbar & Footer
│   │   └── ui/                  # Reusable icons and UI utilities
│   ├── features/                # Domain-driven service layers (articles, categories, etc.)
│   └── lib/                     # Database client, auth, security, sanitizer, and utilities
└── package.json
```

---

## 📦 Production Deployment

This project uses a persistent local SQLite database and local uploads. For production, deploy to a VPS or container with persistent disk storage (e.g., Ubuntu, DigitalOcean Droplet, Hetzner, AWS EC2, or Railway with persistent volumes).

### Production Build & Run:
```bash
# 1. Build the production bundle
npm run build

# 2. Start the production server
npm start
```

### Database Backup & Reliability:
- SQLite uses **Write-Ahead Logging (WAL)** and a 10-second busy timeout for concurrent transactions.
- To backup the live database safely without locking the server, copy `data/blog.db` or run:
  ```bash
  sqlite3 data/blog.db ".backup 'data/backup-$(date +%F).db'"
  ```
- Back up `data/blog.db` and the `public/uploads/` directory regularly.

---

## 🧪 Verification Tests

Run the included automated verification suite:
```bash
npx tsx scripts/test-platform.ts
```
Expected output:
```text
🎉 Test Suite Completed: 33 PASSED, 0 FAILED
```
