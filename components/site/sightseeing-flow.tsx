"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/site/photo";

export type FlowStop = {
  name: string;
  shortDescription: string;
  location: string;
  duration: string;
  category: string;
  imageUrl?: string | null;
  imageAlt: string;
  href: string;
};

export type FlowRoute = {
  id: string;
  name: string;
  description: string;
  startLabel: string;
  endLabel: string;
  stops: FlowStop[];
};

export function SightseeingFlow({ routes }: { routes: FlowRoute[] }) {
  const [active, setActive] = useState(0);
  const route = routes[active];
  if (!route) {
    return <p className="text-mute">A sightseeing sequence has not been published for this city yet.</p>;
  }

  return (
    <div>
      {routes.length > 1 ? (
        <div className="mb-10 flex flex-wrap gap-6" role="tablist" aria-label="Sightseeing sequences">
          {routes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={`border-b pb-2 text-left font-serif text-xl ${index === active ? "border-gold text-ink" : "border-transparent text-mute"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : (
        <h3 className="mb-3 font-serif text-3xl text-ink">{route.name}</h3>
      )}
      <p className="mb-12 max-w-2xl text-sm leading-relaxed text-mute">{route.description}</p>
      <ol className="relative">
        <li className="relative z-10 mx-auto mb-10 max-w-md border border-line bg-ivory px-6 py-8 text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-goldink">Starting point</p>
          <p className="mt-3 font-serif text-3xl">{route.startLabel}</p>
        </li>
        {route.stops.map((stop, index) => {
          const reverse = index % 2 === 1;
          return (
            <li key={stop.href} className="relative grid gap-6 py-6 lg:grid-cols-[1fr_4rem_1fr] lg:gap-0">
              <span className="absolute bottom-0 left-0 top-0 w-px bg-slatebrand/30 lg:left-1/2" aria-hidden />
              <span className="absolute left-[-4px] top-10 h-2.5 w-2.5 rounded-full bg-gold lg:left-1/2 lg:-translate-x-1/2" aria-hidden />
              <Link
                href={stop.href}
                className={`group relative z-10 ml-6 block bg-ivory ring-1 ring-line lg:ml-0 lg:col-start-1 lg:row-start-1 ${reverse ? "lg:col-start-3" : ""}`}
              >
                <div className="grid">
                  <div className="relative min-h-64 overflow-hidden bg-slatebrand">
                    <Photo
                      src={stop.imageUrl}
                      alt={stop.imageAlt}
                      sizes="(min-width: 1024px) 28vw, 100vw"
                      className="motion-safe:transition motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <p className="font-serif text-2xl text-goldink">{String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-2 font-serif text-3xl">{stop.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-mute">{stop.shortDescription}</p>
                    </div>
                    <div className="mt-6">
                      <p className="text-xs uppercase tracking-[0.16em] text-mute">
                        {stop.category}
                        {stop.location ? ` · ${stop.location}` : ""}
                      </p>
                      {stop.duration ? <p className="mt-2 text-sm text-ink">{stop.duration}</p> : null}
                      <span className="mt-4 inline-flex items-center gap-3 text-sm">
                        Explore details
                        <span className="h-px w-8 bg-gold" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
        <li className="relative z-10 mx-auto mt-6 max-w-md border border-line bg-slatebrand px-6 py-8 text-center text-ivory">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-gold">Close</p>
          <p className="mt-3 font-serif text-3xl">{route.endLabel}</p>
        </li>
      </ol>
    </div>
  );
}
