import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatWhen } from "@/lib/utils";

export const metadata = { title: "Overview" };

export default async function OverviewPage() {
  const [publishedCities, publishedAttractions, enquiries, draftCities, draftAttractions, recentCities, recentEnquiries, settings] =
    await Promise.all([
      prisma.city.count({ where: { status: "published" } }),
      prisma.attraction.count({ where: { status: "published" } }),
      prisma.enquiry.count(),
      prisma.city.count({ where: { status: "draft" } }),
      prisma.attraction.count({ where: { status: "draft" } }),
      prisma.city.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, status: true, createdAt: true } }),
      prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      getSettings(),
    ]);

  const stats = [
    ["Published cities", publishedCities],
    ["Published attractions", publishedAttractions],
    ["Enquiries", enquiries],
    ["Draft cities", draftCities],
    ["Draft attractions", draftAttractions],
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Overview</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Link href="/admin/cities/new" className="border border-line bg-white px-4 py-4 text-sm hover:border-slatebrand">
          <span className="block font-serif text-xl">Add a city</span>
          <span className="mt-1 block text-mute">A published city appears on the homepage.</span>
        </Link>
        <Link href="/admin/attractions/new" className="border border-line bg-white px-4 py-4 text-sm hover:border-slatebrand">
          <span className="block font-serif text-xl">Add a place</span>
          <span className="mt-1 block text-mute">Attach a monument or attraction to a city.</span>
        </Link>
        <Link href="/admin/enquiries" className="border border-line bg-white px-4 py-4 text-sm hover:border-slatebrand">
          <span className="block font-serif text-xl">Read enquiries</span>
          <span className="mt-1 block text-mute">Messages from the public form are stored here.</span>
        </Link>
      </div>
      {!settings.whatsapp_number ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute">
          WhatsApp is not connected yet. Add a confirmed business number in website settings. Enquiries are still stored.
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={String(label)} className="border border-line bg-white px-4 py-5">
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-mute">{label}</p>
            <p className="mt-3 font-sans text-4xl tabular-nums">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-serif text-2xl">Recently added cities</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {recentCities.map((city) => (
              <li key={city.id} className="flex items-center justify-between py-3 text-sm">
                <Link href={`/admin/cities/${city.id}`}>{city.name}</Link>
                <span className="text-mute">{city.status}</span>
              </li>
            ))}
            {!recentCities.length ? <li className="py-3 text-sm text-mute">No cities yet.</li> : null}
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-2xl">Recent enquiries</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {recentEnquiries.map((enquiry) => (
              <li key={enquiry.id} className="py-3 text-sm">
                <p>{enquiry.fullName}</p>
                <p className="text-mute">
                  {enquiry.destination} · {formatWhen(enquiry.createdAt)} · {enquiry.status}
                </p>
              </li>
            ))}
            {!recentEnquiries.length ? <li className="py-3 text-sm text-mute">No enquiries yet.</li> : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
