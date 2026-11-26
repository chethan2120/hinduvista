import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { saveCity } from "@/lib/records";
import { citySchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const parsed = citySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const existing = await prisma.city.findUnique({ where: { id } });
    if (!existing) return jsonError("That city was not found.", 404);
    const result = await saveCity(id, parsed.data);
    if (!result.ok) return jsonError(result.error);
    return NextResponse.json({ city: result.city });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
