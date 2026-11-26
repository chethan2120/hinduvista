import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const email = parsed.data.email.toLowerCase();
    const alternate = email.endsWith("@gmail.com")
      ? email.replace(/@gmail\.com$/, "@gmial.com")
      : email.endsWith("@gmial.com")
        ? email.replace(/@gmial\.com$/, "@gmail.com")
        : null;
    const user = await prisma.adminUser.findFirst({
      where: { email: { in: alternate ? [email, alternate] : [email] } },
    });
    const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
    if (!user || !valid || user.role !== "admin") return jsonError("Those details do not match an administrator.", 401);
    const token = await signSession(user.id);
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
