import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return prisma.adminUser.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true, role: true },
  });
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
