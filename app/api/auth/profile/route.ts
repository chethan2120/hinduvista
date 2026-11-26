import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const parsed = profileSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const user = await prisma.adminUser.findUnique({ where: { id: admin.id } });
    if (!user) return jsonError("Unauthorized", 401);
    const matches = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!matches) return jsonError("The current password is not correct.");
    const email = parsed.data.email.toLowerCase();
    const clash = await prisma.adminUser.findUnique({ where: { email } });
    if (clash && clash.id !== user.id) return jsonError("That email is already used.");
    const nextPassword = parsed.data.newPassword?.trim();
    if (nextPassword && nextPassword.length < 8) return jsonError("Use at least 8 characters for the new password.");
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        email,
        ...(nextPassword ? { passwordHash: await bcrypt.hash(nextPassword, 12) } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
