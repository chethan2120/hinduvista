"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

export type MapStop = {
  slug: string;
  name: string;
  state: string;
  region: string;
  shortDescription: string;
  lat: number;
  lng: number;
  placeName: string;
  placeHref: string;
  imageUrl: string;
  imageAlt: string;
};

const INDIA: [number, number] = [23.2, 78.8];
const OVERVIEW_ZOOM = 5;
const CITY_ZOOM = 11;

type Stage = { index: number; zoomed: boolean };

function stageFor(progress: number, count: number): Stage {
  const scaled = Math.min(0.9999, Math.max(0, progress)) * count;
  const index = Math.min(count - 1, Math.floor(scaled));
  const local = scaled - index;
  return { index, zoomed: local >= 0.18 && local < 0.78 };
}

export function CityScrollMap({
  stops,
  eyebrow,
  title,
  note,
}: {
  stops: MapStop[];
  eyebrow: string;
  title: string;
  note: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const stageKey = useRef("");
  const [stage, setStage] = useState<Stage>({ index: 0, zoomed: false });
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;

    async function mount() {
      const leaflet = await import("leaflet");
      if (cancelled || !mapEl.current) return;
      const L = leaflet.default ?? leaflet;
      const container = mapEl.current as HTMLElement & { _leaflet_id?: number };
      if (container._leaflet_id) delete container._leaflet_id;
      map = L.map(container, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);
      map.setView(INDIA, OVERVIEW_ZOOM);
      window.setTimeout(() => map?.invalidateSize(), 200);

      markersRef.current = stops.map((stop, index) => {
        const marker = L.marker([stop.lat, stop.lng], {
          icon: pinIcon(L, index === 0),
          keyboard: false,
          title: stop.name,
        });
        marker.bindTooltip(stop.name, { direction: "top", offset: [0, -8] });
        marker.addTo(map!);
        return marker;
      });
      mapRef.current = map;
      setReady(true);
    }

    mount();
    return () => {
      cancelled = true;
      markersRef.current = [];
      setReady(false);
      map?.remove();
      mapRef.current = null;
    };
  }, [stops]);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    function onScroll() {
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const distance = root.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(distance, 0));
      const progress = distance > 0 ? passed / distance : 0;
      const next = stageFor(progress, stops.length);
      setStage((current) => (current.index === next.index && current.zoomed === next.zoomed ? current : next));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, stops.length]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || stops.length === 0) return;
    const stop = stops[stage.index];
    const key = reduced ? "overview" : stage.zoomed ? `in-${stage.index}` : `out-${stage.index}`;
    if (stageKey.current === key) return;
    stageKey.current = key;
    const target = !reduced && stage.zoomed ? ([stop.lat, stop.lng] as [number, number]) : INDIA;
    const zoom = !reduced && stage.zoomed ? CITY_ZOOM : OVERVIEW_ZOOM;
    map.flyTo(target, zoom, { duration: reduced ? 0 : 0.85 });

    void import("leaflet").then((leaflet) => {
      const L = leaflet.default ?? leaflet;
      markersRef.current.forEach((marker, index) => {
        marker.setIcon(pinIcon(L, !reduced && stage.zoomed && index === stage.index));
      });
    });
  }, [ready, reduced, stage, stops]);

  const active = stops[stage.index] ?? stops[0];
  if (!active) return null;

  return (
    <section ref={rootRef} className="relative bg-ivory" style={{ height: reduced ? undefined : `${stops.length * 115}vh` }}>
      <div className={reduced ? "py-16" : "sticky top-[4.5rem] flex h-[calc(100svh-4.5rem)] items-center overflow-hidden"}>
        <div className="mx-auto grid w-full max-w-page items-center gap-6 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-goldink">{eyebrow}</p>
            {stage.zoomed ? (
              <div key={active.slug} className="hv-pop">
                {active.imageUrl ? (
                  <figure className="mt-4 max-w-sm overflow-hidden bg-slatebrand">
                    <img src={active.imageUrl} alt={active.imageAlt || active.placeName} className="h-44 w-full object-cover" />
                    <figcaption className="bg-ivory px-3 py-2 text-xs uppercase tracking-[0.16em] text-ink">{active.placeName}</figcaption>
                  </figure>
                ) : null}
                <p className="mt-4 text-[0.72rem] uppercase tracking-[0.18em] text-mute">Location</p>
                <h2 className="mt-2 font-serif text-4xl font-semibold md:text-5xl">{active.name}</h2>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-mute">
                  {active.state}
                  <span className="px-2 text-line">/</span>
                  {active.region}
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">{active.shortDescription}</p>
              </div>
            ) : (
              <>
                <h2 className="mt-3 font-serif text-3xl font-semibold md:text-5xl">{title}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">{note}</p>
                <p className="mt-4 font-serif text-2xl">{active.name}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-mute">{active.shortDescription}</p>
              </>
            )}
            <Link href={stage.zoomed && active.placeHref ? active.placeHref : `/cities/${active.slug}`} className="mt-6 inline-flex items-center gap-3 text-sm">
              Explore {stage.zoomed && active.placeName ? active.placeName : active.name}
              <span className="h-px w-8 bg-gold" />
            </Link>
            <p className="mt-6 text-[0.65rem] text-mute">
              Map data © <a href="https://www.openstreetmap.org/copyright" className="underline decoration-line underline-offset-2">OpenStreetMap</a>
            </p>
            <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {stops.map((stop, index) => (
                <li key={stop.slug} className={`text-xs uppercase tracking-[0.14em] ${index === stage.index ? "text-ink" : "text-mute"}`}>
                  {String(index + 1).padStart(2, "0")} {stop.name}
                </li>
              ))}
            </ol>
          </div>
          <div className="hv-map-wrap mx-auto h-52 w-full max-w-xl overflow-hidden bg-slatebrand ring-1 ring-line sm:h-64 lg:col-span-6 lg:col-start-7 lg:h-80">
            <div ref={mapEl} className="hv-map h-full w-full" />
            {stage.zoomed && active.imageUrl ? (
              <div key={active.slug} className="hv-pop pointer-events-none absolute bottom-3 left-3 z-[500] w-40 bg-ivory shadow-sm">
                <img src={active.imageUrl} alt="" className="h-24 w-full object-cover" />
                <div className="px-2 py-1.5">
                  <p className="text-[0.62rem] uppercase tracking-[0.16em] text-goldink">Location</p>
                  <p className="font-serif text-base leading-tight">{active.placeName}</p>
                  <p className="text-[0.68rem] uppercase tracking-[0.12em] text-mute">{active.name}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function pinIcon(L: typeof import("leaflet"), active: boolean) {
  return L.divIcon({
    className: active ? "hv-pin is-active" : "hv-pin",
    iconSize: active ? [18, 18] : [12, 12],
    iconAnchor: active ? [9, 9] : [6, 6],
  });
}
