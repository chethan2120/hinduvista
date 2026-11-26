import { existsSync } from "node:fs";
import path from "node:path";
import { LibraryTools, MediaCard } from "@/components/admin/library-tools";
import { prisma } from "@/lib/prisma";

function previewUrl(url: string) {
  if (!url.endsWith(".webp") || url.endsWith("-960.webp")) return url;
  const smaller = url.replace(/\.webp$/, "-960.webp");
  const file = path.join(process.cwd(), "public", smaller.replace(/^\//, ""));
  return existsSync(file) ? smaller : url;
}

export const metadata = { title: "Media library" };

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const assets = await prisma.mediaAsset.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [{ alt: { contains: q } }, { destination: { contains: q } }, { usage: { contains: q } }],
            }
          : {},
        category ? { category } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  const categories = await prisma.mediaAsset.findMany({ distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl">Media library</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute">
        Photographs stay on this server. Curated demonstration images came from Wikimedia Commons. New uploads are stored in the site&apos;s upload folder.
      </p>
      <form className="mt-6 flex flex-wrap gap-3" action="/admin/media">
        <input name="q" defaultValue={q} placeholder="Search" className="border border-line bg-white px-3 py-2 text-sm" />
        <select name="category" defaultValue={category} className="border border-line bg-white px-3 py-2 text-sm">
          <option value="">All groups</option>
          {categories.map((item) => (
            <option key={item.category} value={item.category}>
              {item.category}
            </option>
          ))}
        </select>
        <button className="bg-slatebrand px-4 py-2 text-sm text-ivory">Search</button>
      </form>
      <div className="mt-6 max-w-xl">
        <LibraryTools />
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <MediaCard
            key={asset.id}
            asset={{
              id: asset.id,
              preview: previewUrl(asset.urlMedium || asset.url),
              full: asset.url,
              alt: asset.alt,
              destination: asset.destination,
              category: asset.category,
              license: asset.license || asset.provenance,
            }}
          />
        ))}
      </ul>
    </div>
  );
}
