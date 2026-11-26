import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Cities" };

export default async function CitiesAdminPage() {
  const cities = await prisma.city.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { attractions: true } } },
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">Cities</h1>
        <Link href="/admin/cities/new" className="bg-slatebrand px-4 py-2 text-sm text-ivory">
          Add city
        </Link>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-mute">
            <tr>
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">City</th>
              <th className="py-3 pr-4">Places</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="border-b border-line">
                <td className="py-3 pr-4">{city.displayOrder}</td>
                <td className="py-3 pr-4">
                  <p>{city.name}</p>
                  <p className="text-mute">{city.state}</p>
                </td>
                <td className="py-3 pr-4">{city._count.attractions}</td>
                <td className="py-3 pr-4">{city.status}</td>
                <td className="py-3">
                  <span className="flex gap-4">
                    <Link href={`/admin/cities/${city.id}`}>Edit</Link>
                    <a href={`/cities/${city.slug}`} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                    <DeleteButton url={`/api/admin/cities/${city.id}`} confirmText={`Delete ${city.name} and its places and sequences?`} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
