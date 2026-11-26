import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, SampleNote } from "@/components/site/markup";
import { Photo } from "@/components/site/photo";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { paragraphs } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { slug: string; attractionSlug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, attractionSlug } = await params;
  const attraction = await prisma.attraction.findFirst({
    where: { slug: attractionSlug, city: { slug } },
    include: { city: true, coverImage: true },
  });
  if (!attraction) return { title: "Place" };
  return {
    title: `${attraction.name}, ${attraction.city.name}`,
    description: attraction.shortDescription,
    robots: attraction.status === "published" ? undefined : { index: false, follow: false },
    openGraph: {
      title: `${attraction.name}, ${attraction.city.name}`,
      description: attraction.shortDescription,
      images: attraction.coverImage ? [{ url: attraction.coverImage.url, alt: attraction.coverImage.alt }] : undefined,
    },
  };
}

export default async function AttractionPage({ params }: { params: Promise<Params> }) {
  const { slug, attractionSlug } = await params;
  const [attraction, session, settings] = await Promise.all([
    prisma.attraction.findFirst({
      where: { slug: attractionSlug, city: { slug } },
      include: {
        city: true,
        category: true,
        coverImage: true,
        gallery: { orderBy: { sortOrder: "asc" }, include: { media: true } },
      },
    }),
    getSessionUser(),
    getSettings(),
  ]);

  if (!attraction || (attraction.status !== "published" && !session)) notFound();
  if (attraction.city.status !== "published" && !session) notFound();

  const related = await prisma.attraction.findMany({
    where: {
      cityId: attraction.cityId,
      id: { not: attraction.id },
      ...(session ? {} : { status: "published" }),
    },
    orderBy: { displayOrder: "asc" },
    take: 3,
    include: { coverImage: true },
  });

  const images = [
    attraction.coverImage,
    ...attraction.gallery.map((item) => item.media).filter((media) => media.id !== attraction.coverImageId),
  ].filter((image): image is NonNullable<typeof image> => Boolean(image));

  const destination = `${attraction.name}, ${attraction.city.name}`;

  return (
    <article>
      <section className="relative min-h-[68vh] bg-slatebrand">
        <Photo src={attraction.coverImage?.url} alt={attraction.coverImage?.alt || attraction.name} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-slatedeep via-transparent to-transparent" />
        <div className="absolute bottom-0 mx-auto w-full max-w-page px-5 py-12 text-ivory md:px-10">
          <Link href={`/cities/${attraction.city.slug}`} className="text-[0.72rem] uppercase tracking-[0.2em] text-gold">
            {attraction.city.name}
          </Link>
          <h1 className="mt-3 font-serif text-5xl font-semibold md:text-6xl">{attraction.name}</h1>
        </div>
      </section>
      <div className="mx-auto grid max-w-page gap-12 px-5 py-16 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {attraction.isSample ? <SampleNote>{settings.sample_notice}</SampleNote> : null}
          <p className="mt-4 text-lg leading-relaxed">{attraction.shortDescription}</p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-mute">
            {paragraphs(attraction.description).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {attraction.historicalInfo ? (
            <div className="mt-10">
              <h2 className="font-serif text-3xl">History and context</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-mute">
                {paragraphs(attraction.historicalInfo).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <aside className="h-fit space-y-6 border border-line p-6 lg:col-span-5">
          <Eyebrow>{attraction.category?.name || "Place"}</Eyebrow>
          {attraction.location ? (
            <div>
              <h2 className="font-serif text-2xl">Location</h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">{attraction.location}</p>
            </div>
          ) : null}
          {attraction.duration ? (
            <div>
              <h2 className="font-serif text-2xl">Visiting time</h2>
              <p className="mt-2 text-sm text-mute">{attraction.duration}</p>
            </div>
          ) : null}
          {attraction.visitorInfo ? (
            <div>
              <h2 className="font-serif text-2xl">Visitor information</h2>
              <p className="mt-2 text-sm leading-relaxed text-mute">{attraction.visitorInfo}</p>
            </div>
          ) : null}
          <Link href={`/contact?destination=${encodeURIComponent(destination)}`} className="inline-flex bg-slatebrand px-5 py-3 text-sm text-ivory">
            Enquire about this place
          </Link>
        </aside>
      </div>
      {images.length > 1 ? (
        <section className="mx-auto grid max-w-page gap-4 px-5 md:grid-cols-2 md:px-10">
          {images.slice(1).map((image) => (
            <figure key={image.id} className="relative min-h-72 bg-slatebrand">
              <Photo src={image.url} alt={image.alt} sizes="(min-width: 768px) 50vw, 100vw" />
            </figure>
          ))}
        </section>
      ) : null}
      {related.length ? (
        <section className="mx-auto max-w-page px-5 py-16 md:px-10">
          <h2 className="font-serif text-3xl">Also in {attraction.city.name}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.id} href={`/cities/${attraction.city.slug}/attractions/${item.slug}`} className="group block">
                <div className="relative h-48 overflow-hidden bg-slatebrand">
                  <Photo src={item.coverImage?.url} alt={item.coverImage?.alt || item.name} sizes="33vw" className="motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]" />
                </div>
                <h3 className="mt-3 font-serif text-2xl">{item.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
