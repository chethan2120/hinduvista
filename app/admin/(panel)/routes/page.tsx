import { RouteStudio } from "@/components/admin/route-studio";
import { loadStudio } from "@/lib/records";

export const metadata = { title: "Sightseeing" };

export default async function RoutesPage() {
  const cities = await loadStudio();
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Sightseeing sequences</h1>
      <RouteStudio initialCities={cities} />
    </div>
  );
}
