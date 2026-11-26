import Link from "next/link";
import { CategoryManager } from "@/components/admin/category-manager";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Attractions" };

export default async function AttractionsAdminPage() {
  const [attractions, categories] = await Promise.all([
    prisma.attraction.findMany({
      orderBy: [{ city: { displayOrder: "asc" } }, { displayOrder: "asc" }],
      include: { city: true, category: true },
    }),
    prisma.attractionCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Attractions</h1>
        <Link href="/admin/attractions/new" className="bg-slatebrand px-4 py-2 text-sm text-ivory">
          Add attraction
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-mute">
            <tr>
              <th className="py-3 pr-4">Place</th>
              <th className="py-3 pr-4">City</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attractions.map((attraction) => (
              <tr key={attraction.id} className="border-b border-line">
                <td className="py-3 pr-4">{attraction.name}</td>
                <td className="py-3 pr-4">{attraction.city.name}</td>
                <td className="py-3 pr-4">{attraction.category?.name || "—"}</td>
                <td className="py-3 pr-4">{attraction.status}</td>
                <td className="py-3">
                  <span className="flex gap-4">
                    <Link href={`/admin/attractions/${attraction.id}`}>Edit</Link>
                    <a href={`/cities/${attraction.city.slug}/attractions/${attraction.slug}`} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                    <DeleteButton url={`/api/admin/attractions/${attraction.id}`} confirmText={`Delete ${attraction.name}?`} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CategoryManager categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
    </div>
  );
}
