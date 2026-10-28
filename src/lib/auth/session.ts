import crypto from "node:crypto";
import { cookies } from "next/headers";
import prisma from "@/lib/db/prisma";

export const SESSION_COOKIE_NAME = "akb_admin_session";
export const SESSION_DURATION_DAYS = 14;

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createAdminSession(
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.adminSession.create({
    data: {
      adminId,
      tokenHash,
      expiresAt,
      ipAddress: ipAddress?.slice(0, 45),
      userAgent: userAgent?.slice(0, 255),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { token, expiresAt };
}

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const session = await prisma.adminSession.findUnique({
      where: { tokenHash },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session) return null;
    if (session.revokedAt) return null;
    if (session.expiresAt < new Date()) {
      return null;
    }

    return session.admin;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("Error verifying admin session:", error);
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}

export async function invalidateCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      const tokenHash = hashToken(token);
      await prisma.adminSession.updateMany({
        where: { tokenHash },
        data: { revokedAt: new Date() },
      });
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (error) {
    console.error("Error invalidating session:", error);
  }
}
