import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_SETTING_KEYS } from "@/lib/defaults";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const entries = Object.entries(parsed.data.values).filter(([key]) => ALLOWED_SETTING_KEYS.has(key));
    if (entries.some(([key, value]) => key === "whatsapp_number" && value.trim() && !/^\d{10,15}$/.test(value.trim()))) {
      return jsonError("Enter the WhatsApp number as digits only, with the country code, or leave it blank.");
    }
    if (entries.some(([key, value]) => key === "contact_email" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))) {
      return jsonError("Enter a valid contact email, or leave it blank.");
    }
    if (
      entries.some(
        ([key, value]) => key === "notification_email" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      )
    ) {
      return jsonError("Enter a valid notification email, or leave it blank.");
    }
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
