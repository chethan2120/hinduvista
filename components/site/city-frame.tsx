import Link from "next/link";
import { Photo } from "@/components/site/photo";

export type CityFrameData = {
  slug: string;
  name: string;
  state: string;
  region: string;
  shortDescription: string;
  imageUrl?: string | null;
  imageAlt: string;
  imageClassName?: string;
  featured: boolean;
};

export function CityFrame({ city, index }: { city: CityFrameData; index: number }) {
  const reverse = index % 2 === 1;
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group grid min-h-[28rem] bg-ivory ring-1 ring-line focus-visible:ring-gold lg:min-h-[34rem] lg:grid-cols-12"
    >
      <div className={`relative min-h-[16rem] overflow-hidden bg-slatebrand lg:col-span-8 lg:min-h-full ${reverse ? "lg:order-2" : ""}`}>
        <Photo
          src={city.imageUrl}
          alt={city.imageAlt}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className={`motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04] ${city.imageClassName || "object-center"}`}
        />
      </div>
      <div className={`flex flex-col justify-between px-6 py-8 md:px-10 md:py-12 lg:col-span-4 ${reverse ? "lg:order-1" : ""}`}>
        <div className="flex items-center justify-between">
          <span className="font-serif text-3xl text-goldink">{String(index + 1).padStart(2, "0")}</span>
          {city.featured ? <span className="text-[0.68rem] uppercase tracking-[0.2em] text-mute">Featured</span> : null}
        </div>
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-mute">
            {city.state}
            <span className="px-2 text-line">/</span>
            {city.region}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">{city.name}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-mute">{city.shortDescription}</p>
          <span className="mt-6 inline-flex items-center gap-3 text-sm tracking-wide text-ink">
            Explore city
            <span className="h-px w-8 bg-gold transition-all group-hover:w-12" />
          </span>
        </div>
      </div>
    </Link>
  );
}
