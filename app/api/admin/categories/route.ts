import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const parsed = categorySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const category = await prisma.attractionCategory.create({ data: parsed.data });
    return NextResponse.json({ category });
  } catch (error) {
    return handleRouteError(error);
  }
}
