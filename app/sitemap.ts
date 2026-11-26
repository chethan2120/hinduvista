import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cities = await prisma.city.findMany({
    where: { status: "published" },
    include: { attractions: { where: { status: "published" }, select: { slug: true, updatedAt: true } } },
  });

  const staticRoutes: MetadataRoute.Sitemap = ["", "/cities", "/about", "/contact", "/credits"].map((path) => ({
    url: `${base}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const cityRoutes: MetadataRoute.Sitemap = cities.flatMap((city) => [
    {
      url: `${base}/cities/${city.slug}`,
      lastModified: city.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...city.attractions.map((attraction) => ({
      url: `${base}/cities/${city.slug}/attractions/${attraction.slug}`,
      lastModified: attraction.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]);

  return [...staticRoutes, ...cityRoutes];
}
