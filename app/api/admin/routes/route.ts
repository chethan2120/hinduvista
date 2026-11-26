import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { loadStudio, saveRoute } from "@/lib/records";
import { routeSchema } from "@/lib/validators";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Unauthorized", 401);
  return NextResponse.json({ cities: await loadStudio() });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const parsed = routeSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const result = await saveRoute(null, parsed.data);
    if (!result.ok) return jsonError(result.error);
    return NextResponse.json({ route: result.route });
  } catch (error) {
    return handleRouteError(error);
  }
}
