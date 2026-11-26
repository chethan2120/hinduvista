import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/defaults";

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  const values = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    values[row.key] = row.value;
  }
  return values;
}

export async function mediaById(id: string | undefined | null) {
  if (!id) return null;
  return prisma.mediaAsset.findUnique({ where: { id } });
}

export async function resolvePicture(value: string | undefined | null) {
  if (!value) return null;
  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
    return { id: value, url: value, urlMedium: value, alt: "Hindu Vista" };
  }
  return mediaById(value);
}
