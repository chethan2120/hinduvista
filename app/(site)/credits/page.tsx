import type { Metadata } from "next";
import { Eyebrow } from "@/components/site/markup";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Photograph credits",
  description: "Sources and licences for the demonstration photographs on Hindu Vista.",
};

export default async function CreditsPage() {
  const assets = await prisma.mediaAsset.findMany({
    where: { sourceUrl: { not: "" } },
    orderBy: [{ destination: "asc" }, { alt: "asc" }],
  });

  return (
    <article className="mx-auto max-w-page px-5 py-16 md:px-10 md:py-24">
      <Eyebrow>Images</Eyebrow>
      <h1 className="mt-4 font-serif text-5xl font-semibold">Photograph credits</h1>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mute">
        Demonstration photographs are verified files from Wikimedia Commons, stored on this website. They are not presented as photographs made by Hindu Vista, and they are not AI renderings of the monuments. Uploads added later by the desk are kept in the media library.
      </p>
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {assets.map((asset) => (
          <li key={asset.id} className="grid gap-2 py-5 md:grid-cols-12">
            <p className="font-serif text-xl md:col-span-4">{asset.destination || asset.alt}</p>
            <div className="text-sm leading-relaxed text-mute md:col-span-8">
              <p>{asset.alt}</p>
              <p className="mt-1">
                {asset.author} · {asset.license}
              </p>
              <a href={asset.sourceUrl} className="mt-1 inline-block text-ink underline decoration-gold underline-offset-4" rel="noreferrer">
                File page
              </a>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
