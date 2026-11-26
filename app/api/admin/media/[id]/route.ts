import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const body = (await request.json()) as { alt?: string; destination?: string; category?: string };
    const alt = String(body.alt || "").trim();
    const destination = String(body.destination || "").trim();
    const category = String(body.category || "").trim();
    if (alt.length < 3) return jsonError("Describe the photograph in a few words.");
    if (!category) return jsonError("Choose a group for this photograph.");
    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: { alt, destination, category },
    });
    return NextResponse.json({
      asset: { id: asset.id, url: asset.url, alt: asset.alt, destination: asset.destination, category: asset.category },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const { id } = await context.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return jsonError("That photograph was not found.", 404);

    const [cities, attractions, cityLinks, attractionLinks, settings] = await Promise.all([
      prisma.city.count({ where: { heroImageId: id } }),
      prisma.attraction.count({ where: { coverImageId: id } }),
      prisma.cityMedia.count({ where: { mediaId: id } }),
      prisma.attractionMedia.count({ where: { mediaId: id } }),
      prisma.setting.findMany(),
    ]);
    const usedInSettings = settings.some((setting) => setting.value.includes(id));
    if (cities || attractions || cityLinks || attractionLinks || usedInSettings) {
      return jsonError("This photograph is still used on the website. Remove it from those places first.", 409);
    }

    await prisma.mediaAsset.delete({ where: { id } });
    if (asset.url.startsWith("/uploads/")) {
      await unlink(path.join(process.cwd(), "public", asset.url)).catch(() => undefined);
      if (asset.urlMedium.startsWith("/uploads/")) {
        await unlink(path.join(process.cwd(), "public", asset.urlMedium)).catch(() => undefined);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
