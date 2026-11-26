import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError, zodMessage } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { enquiryStatusSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const parsed = enquiryStatusSchema.safeParse(await request.json());
    if (!parsed.success) return jsonError(zodMessage(parsed.error));
    const enquiry = await prisma.enquiry.update({ where: { id }, data: { status: parsed.data.status } });
    return NextResponse.json({ enquiry });
  } catch (error) {
    return handleRouteError(error);
  }
}
