import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { saveCity } from "@/lib/records";
import { citySchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const parsed = citySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const result = await saveCity(null, parsed.data);
    if (!result.ok) return jsonError(result.error);
    return NextResponse.json({ city: result.city });
  } catch (error) {
    return handleRouteError(error);
  }
}
