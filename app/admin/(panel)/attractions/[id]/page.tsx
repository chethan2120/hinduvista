import { notFound } from "next/navigation";
import { AttractionForm, type AttractionValues } from "@/components/admin/attraction-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Edit attraction" };

export default async function EditAttractionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [attraction, cities, categories, assets] = await Promise.all([
    prisma.attraction.findUnique({ where: { id }, include: { gallery: { orderBy: { sortOrder: "asc" } } } }),
    prisma.city.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.attractionCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  if (!attraction) notFound();
  const initial: AttractionValues = {
    id: attraction.id,
    cityId: attraction.cityId,
    categoryId: attraction.categoryId || "",
    name: attraction.name,
    slug: attraction.slug,
    shortDescription: attraction.shortDescription,
    description: attraction.description,
    location: attraction.location,
    historicalInfo: attraction.historicalInfo,
    visitorInfo: attraction.visitorInfo,
    duration: attraction.duration,
    status: attraction.status === "published" ? "published" : "draft",
    displayOrder: attraction.displayOrder,
    isSample: attraction.isSample,
    coverImageId: attraction.coverImageId || "",
    galleryIds: attraction.gallery.map((item) => item.mediaId),
  };

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">{attraction.name}</h1>
      <AttractionForm
        initial={initial}
        cities={cities.map((city) => ({ id: city.id, name: city.name, slug: city.slug }))}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        assets={assets.map((asset) => ({ id: asset.id, url: asset.urlMedium || asset.url, alt: asset.alt, destination: asset.destination, category: asset.category }))}
      />
    </div>
  );
}
