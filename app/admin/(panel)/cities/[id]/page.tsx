import { notFound } from "next/navigation";
import { CityForm, type CityValues } from "@/components/admin/city-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit city" };

export default async function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [city, assets] = await Promise.all([
    prisma.city.findUnique({ where: { id }, include: { gallery: { orderBy: { sortOrder: "asc" } } } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  if (!city) notFound();
  const initial: CityValues = {
    id: city.id,
    name: city.name,
    slug: city.slug,
    state: city.state,
    region: city.region,
    shortDescription: city.shortDescription,
    fullDescription: city.fullDescription,
    bestTimeToVisit: city.bestTimeToVisit,
    travelInfo: city.travelInfo,
    featured: city.featured,
    status: city.status === "published" ? "published" : "draft",
    displayOrder: city.displayOrder,
    isSample: city.isSample,
    heroImageId: city.heroImageId || "",
    galleryIds: city.gallery.map((item) => item.mediaId),
  };

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">{city.name}</h1>
      <CityForm
        initial={initial}
        assets={assets.map((asset) => ({
          id: asset.id,
          url: asset.urlMedium || asset.url,
          alt: asset.alt,
          destination: asset.destination,
          category: asset.category,
        }))}
      />
    </div>
  );
}
