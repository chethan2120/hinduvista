import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, SampleNote } from "@/components/site/markup";
import { Photo } from "@/components/site/photo";
import { SightseeingFlow, type FlowRoute } from "@/components/site/sightseeing-flow";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { paragraphs } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const city = await prisma.city.findUnique({ where: { slug }, include: { heroImage: true } });
  if (!city) return { title: "City" };
  return {
    title: `${city.name}, ${city.state}`,
    description: city.shortDescription,
    robots: city.status === "published" ? undefined : { index: false, follow: false },
    openGraph: {
      title: `${city.name}, ${city.state}`,
      description: city.shortDescription,
      images: city.heroImage ? [{ url: city.heroImage.url, alt: city.heroImage.alt }] : undefined,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [city, session, settings] = await Promise.all([
    prisma.city.findUnique({
      where: { slug },
      include: {
        heroImage: true,
        attractions: {
          orderBy: { displayOrder: "asc" },
          include: { coverImage: true, category: true },
        },
        routes: {
          orderBy: { displayOrder: "asc" },
          include: {
            nodes: {
              orderBy: { sortOrder: "asc" },
              include: { attraction: { include: { coverImage: true, category: true } } },
            },
          },
        },
      },
    }),
    getSessionUser(),
    getSettings(),
  ]);

  if (!city || (city.status !== "published" && !session)) notFound();

  const visibleAttractions = city.attractions.filter((item) => item.status === "published" || session);
  const routes: FlowRoute[] = city.routes
    .filter((route) => route.status === "published" || session)
    .map((route) => {
      const start = route.nodes.find((node) => node.kind === "start");
      const end = route.nodes.find((node) => node.kind === "end");
      const stops = route.nodes
        .filter((node) => node.kind === "attraction" && node.attraction && (node.attraction.status === "published" || session))
        .map((node) => {
          const attraction = node.attraction!;
          return {
            name: attraction.name,
            shortDescription: attraction.shortDescription,
            location: attraction.location,
            duration: attraction.duration,
            category: attraction.category?.name || "Place",
            imageUrl: attraction.coverImage?.url,
            imageAlt: attraction.coverImage?.alt || attraction.name,
            href: `/cities/${city.slug}/attractions/${attraction.slug}`,
          };
        });
      return {
        id: route.id,
        name: route.name,
        description: route.description,
        startLabel: start?.label || `Begin in ${city.name}`,
        endLabel: end?.label || "End of sightseeing",
        stops,
      };
    });

  return (
    <article>
      <section className="relative min-h-[70vh] bg-slatebrand text-ivory">
        <Photo src={city.heroImage?.url} alt={city.heroImage?.alt || city.name} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-slatedeep via-slatedeep/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-page px-5 py-12 md:px-10 md:py-16">
          <Eyebrow tone="light">
            {city.state} / {city.region}
          </Eyebrow>
          <h1 className="mt-3 font-serif text-5xl font-semibold md:text-7xl">{city.name}</h1>
        </div>
      </section>
      <div className="mx-auto grid max-w-page gap-12 px-5 py-16 md:px-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {city.isSample ? <SampleNote>{settings.sample_notice}</SampleNote> : null}
          {paragraphs(city.fullDescription).map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-ink/90">
              {paragraph}
            </p>
          ))}
        </div>
        <aside className="space-y-8 border-line lg:col-span-5 lg:border-l lg:pl-10">
          {city.bestTimeToVisit ? (
            <div>
              <h2 className="font-serif text-2xl">Best time to visit</h2>
              <p className="mt-3 text-sm leading-relaxed text-mute">{city.bestTimeToVisit}</p>
            </div>
          ) : null}
          {city.travelInfo ? (
            <div>
              <h2 className="font-serif text-2xl">Travel information</h2>
              <p className="mt-3 text-sm leading-relaxed text-mute">{city.travelInfo}</p>
            </div>
          ) : null}
        </aside>
      </div>
      <section id="sightseeing" className="mx-auto max-w-page px-5 pb-8 md:px-10">
        <Eyebrow>Sightseeing</Eyebrow>
        <h2 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">A path through the city.</h2>
        <div className="mt-10">
          <SightseeingFlow routes={routes} />
        </div>
      </section>
      <section className="mx-auto max-w-page px-5 py-16 md:px-10">
        <h2 className="font-serif text-3xl">Places in {city.name}</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {visibleAttractions.map((attraction) => (
            <li key={attraction.id}>
              <Link href={`/cities/${city.slug}/attractions/${attraction.slug}`} className="flex items-baseline justify-between gap-4 py-4">
                <span className="font-serif text-2xl">{attraction.name}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-mute">{attraction.category?.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`/contact?destination=${encodeURIComponent(city.name)}`} className="mt-10 inline-flex bg-slatebrand px-5 py-3 text-sm text-ivory">
          Enquire about {city.name}
        </Link>
      </section>
    </article>
  );
}
