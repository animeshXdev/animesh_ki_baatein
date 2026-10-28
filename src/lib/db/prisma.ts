import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  let rawUrl = process.env.DATABASE_URL || "file:./data/blog.db";
  let dbPath = rawUrl.replace(/^file:\.\/?/, "");
  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), "data", path.basename(dbPath));

  // Ensure WAL mode and busy timeout are configured on the database file
  try {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    const rawDb = new Database(absolutePath, { timeout: 10000 });
    rawDb.pragma("journal_mode = WAL");
    rawDb.pragma("synchronous = NORMAL");
    rawDb.close();
  } catch (err) {
    console.warn("Could not set SQLite pragmas:", err);
  }

  const adapter = new PrismaBetterSqlite3({
    url: `file:${absolutePath}`,
    timeout: 10000,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
