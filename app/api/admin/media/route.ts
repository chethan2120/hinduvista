import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

function present(asset: {
  id: string;
  url: string;
  alt: string;
  destination: string;
  category: string;
}) {
  return {
    id: asset.id,
    url: asset.url,
    alt: asset.alt,
    destination: asset.destination,
    category: asset.category,
  };
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return jsonError("Unauthorized", 401);
    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") || "").trim();
    const destination = String(form.get("destination") || "").trim();
    const category = String(form.get("category") || "upload").trim() || "upload";
    if (!(file instanceof File)) return jsonError("Choose an image file.");
    if (alt.length < 3) return jsonError("Describe the photograph in a few words.");
    if (file.size > 8 * 1024 * 1024) return jsonError("Use an image under 8 MB.");

    const bytes = Buffer.from(await file.arrayBuffer());
    const id = randomUUID();
    const filename = `${id}.webp`;
    const mediumName = `${id}-960.webp`;
    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    let meta;
    try {
      meta = await sharp(bytes).rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(directory, filename));
      await sharp(bytes).rotate().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(directory, mediumName));
    } catch {
      return jsonError("That file could not be read as a photograph.");
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        url: `/uploads/${filename}`,
        urlMedium: `/uploads/${mediumName}`,
        alt,
        category,
        destination,
        usage: "Uploaded from the dashboard",
        source: "Hindu Vista desk upload",
        provenance: "admin_upload",
        width: meta.width,
        height: meta.height,
      },
    });
    return NextResponse.json({ asset: present(asset) });
  } catch (error) {
    return handleRouteError(error);
  }
}
