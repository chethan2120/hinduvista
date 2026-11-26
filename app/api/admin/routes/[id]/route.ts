import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { saveRoute } from "@/lib/records";
import { routeSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const parsed = routeSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const existing = await prisma.sightseeingRoute.findUnique({ where: { id } });
    if (!existing) return jsonError("That sequence was not found.", 404);
    const result = await saveRoute(id, parsed.data);
    if (!result.ok) return jsonError(result.error);
    return NextResponse.json({ route: result.route });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    await prisma.sightseeingRoute.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
