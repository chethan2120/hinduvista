import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { saveAttraction } from "@/lib/records";
import { writeLinearRoute } from "@/lib/routes";
import { attractionSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const parsed = attractionSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const existing = await prisma.attraction.findUnique({ where: { id } });
    if (!existing) return jsonError("That attraction was not found.", 404);
    const result = await saveAttraction(id, parsed.data);
    if (!result.ok) return jsonError(result.error);
    return NextResponse.json({ attraction: result.attraction });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const affected = await prisma.sightseeingRouteNode.findMany({
      where: { attractionId: id },
      select: { routeId: true },
    });
    const routeIds = [...new Set(affected.map((node) => node.routeId))];
    const plans = [];
    for (const routeId of routeIds) {
      const route = await prisma.sightseeingRoute.findUnique({
        where: { id: routeId },
        include: { city: true, nodes: { orderBy: { sortOrder: "asc" } } },
      });
      if (!route) continue;
      plans.push({
        routeId,
        cityName: route.city.name,
        attractionIds: route.nodes
          .filter((node) => node.kind === "attraction" && node.attractionId && node.attractionId !== id)
          .map((node) => node.attractionId as string),
      });
    }
    await prisma.attraction.delete({ where: { id } });
    for (const plan of plans) {
      if (!plan.attractionIds.length) {
        await prisma.sightseeingRoute.delete({ where: { id: plan.routeId } });
      } else {
        await prisma.$transaction((tx) => writeLinearRoute(tx, plan.routeId, plan.cityName, plan.attractionIds));
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
