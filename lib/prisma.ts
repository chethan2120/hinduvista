import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

if (process.env.VERCEL) {
  const target = "/tmp/hinduvista.db";
  if (!existsSync(target)) {
    copyFileSync(path.join(process.cwd(), "prisma", "dev.db"), target);
  }
  process.env.DATABASE_URL = `file:${target}`;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
