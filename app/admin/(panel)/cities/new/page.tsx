import { CityForm } from "@/components/admin/city-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "New city" };

export default async function NewCityPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Add a city</h1>
      <CityForm
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
