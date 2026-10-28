import prisma from "@/lib/db/prisma";
import { stripHtml } from "@/lib/utils/slug";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const cleanName = data.name.trim().slice(0, 100);
  const cleanEmail = data.email.trim().toLowerCase().slice(0, 120);
  const cleanSubject = stripHtml(data.subject).trim().slice(0, 200);
  const cleanMessage = stripHtml(data.message).trim().slice(0, 4000);

  if (!cleanName || cleanName.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!cleanSubject) {
    throw new Error("Please enter a subject.");
  }

  if (!cleanMessage || cleanMessage.length < 5) {
    throw new Error("Message must be at least 5 characters long.");
  }

  return prisma.contactMessage.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
    },
  });
}

export async function subscribeNewsletter(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  return prisma.newsletterSubscriber.upsert({
    where: { email: cleanEmail },
    update: {},
    create: { email: cleanEmail },
  });
}

export async function getContactMessages(filter?: "all" | "unread" | "read") {
  const where: any = {};
  if (filter === "unread") where.isRead = false;
  if (filter === "read") where.isRead = true;

  return prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleMessageRead(id: string, isRead: boolean) {
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead },
  });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
