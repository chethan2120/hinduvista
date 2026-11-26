import { AttractionForm, type AttractionValues } from "@/components/admin/attraction-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "New attraction" };

export default async function NewAttractionPage() {
  const [cities, categories, assets] = await Promise.all([
    prisma.city.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.attractionCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const initial: AttractionValues = {
    cityId: cities[0]?.id || "",
    categoryId: "",
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    location: "",
    historicalInfo: "",
    visitorInfo: "",
    duration: "",
    status: "draft",
    displayOrder: 1,
    isSample: false,
    coverImageId: "",
    galleryIds: [],
  };

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Add an attraction</h1>
      <AttractionForm
        initial={initial}
        cities={cities.map((city) => ({ id: city.id, name: city.name, slug: city.slug }))}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        assets={assets.map((asset) => ({ id: asset.id, url: asset.urlMedium || asset.url, alt: asset.alt, destination: asset.destination, category: asset.category }))}
      />
    </div>
  );
}
