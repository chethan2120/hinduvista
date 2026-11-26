"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/admin/fields";

type Attraction = { id: string; name: string; status: string };
type RouteNode = { kind: string; attractionId: string | null };
type RouteRecord = {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published";
  displayOrder: number;
  nodes: RouteNode[];
};
type CityRecord = {
  id: string;
  name: string;
  slug: string;
  attractions: Attraction[];
  routes: RouteRecord[];
};

export function RouteStudio({ initialCities }: { initialCities: CityRecord[] }) {
  const [cities, setCities] = useState(initialCities);
  const [cityId, setCityId] = useState(initialCities[0]?.id || "");
  const [routeId, setRouteId] = useState<string | "new">(initialCities[0]?.routes[0]?.id || "new");
  const [name, setName] = useState(initialCities[0]?.routes[0]?.name || "");
  const [description, setDescription] = useState(initialCities[0]?.routes[0]?.description || "");
  const [status, setStatus] = useState<"draft" | "published">(initialCities[0]?.routes[0]?.status || "draft");
  const [displayOrder, setDisplayOrder] = useState(initialCities[0]?.routes[0]?.displayOrder || 1);
  const [attractionIds, setAttractionIds] = useState<string[]>(
    initialCities[0]?.routes[0]?.nodes.filter((node) => node.kind === "attraction" && node.attractionId).map((node) => node.attractionId!) || [],
  );
  const [addId, setAddId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const city = useMemo(() => cities.find((item) => item.id === cityId), [cities, cityId]);

  function loadRoute(nextCity: CityRecord, id: string | "new") {
    setCityId(nextCity.id);
    setRouteId(id);
    const route = nextCity.routes.find((item) => item.id === id);
    setName(route?.name || "");
    setDescription(route?.description || "This is an editorial sequence for reading the city. It is not a measured route, and it does not state distances or travel times.");
    setStatus(route?.status || "draft");
    setDisplayOrder(route?.displayOrder || nextCity.routes.length + 1);
    setAttractionIds(route?.nodes.filter((node) => node.kind === "attraction" && node.attractionId).map((node) => node.attractionId!) || []);
    setAddId("");
    setError("");
    setMessage("");
  }

  async function reload(preferredCityId = cityId, preferredRouteId = routeId) {
    const response = await fetch("/api/admin/routes");
    const data = await response.json();
    const nextCities = data.cities as CityRecord[];
    setCities(nextCities);
    const nextCity = nextCities.find((item) => item.id === preferredCityId) || nextCities[0];
    if (!nextCity) return;
    const nextRoute = nextCity.routes.find((item) => item.id === preferredRouteId);
    loadRoute(nextCity, nextRoute?.id || nextCity.routes[0]?.id || "new");
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= attractionIds.length) return;
    const next = [...attractionIds];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setAttractionIds(next);
  }

  async function save() {
    setPending(true);
    setError("");
    setMessage("");
    const payload = { cityId, name, description, status, displayOrder, attractionIds };
    const response = await fetch(routeId === "new" ? "/api/admin/routes" : `/api/admin/routes/${routeId}`, {
      method: routeId === "new" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error || "The sequence could not be saved.");
      return;
    }
    await reload(cityId, data.route.id);
    setMessage("Sequence saved.");
  }

  async function remove() {
    if (routeId === "new") return;
    if (!confirm("Delete this sightseeing sequence?")) return;
    const response = await fetch(`/api/admin/routes/${routeId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("The sequence could not be deleted.");
      return;
    }
    await reload(cityId, "new");
  }

  if (!city) return <p>Add a city before building a sightseeing sequence.</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <div>
        <label className="block text-sm">
          City
          <select
            className={inputClass}
            value={cityId}
            onChange={(event) => {
              const next = cities.find((item) => item.id === event.target.value);
              if (next) loadRoute(next, next.routes[0]?.id || "new");
            }}
          >
            {cities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 space-y-2">
          {city.routes.map((route) => (
            <button key={route.id} type="button" onClick={() => loadRoute(city, route.id)} className={`block w-full px-3 py-2 text-left text-sm ${route.id === routeId ? "bg-slatebrand text-ivory" : "bg-white"}`}>
              {route.name}
            </button>
          ))}
          <button type="button" onClick={() => loadRoute(city, "new")} className="block w-full border border-line px-3 py-2 text-left text-sm">
            New sequence
          </button>
        </div>
      </div>
      <div className="grid max-w-2xl gap-4">
        <p className="text-sm text-mute">
          The public page draws a connected path from this order: a starting point, each attraction, then the end of sightseeing. Do not add distances or travel times unless you have verified them.
        </p>
        <label className="text-sm">
          Sequence name
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="text-sm">
          Description
          <textarea className={inputClass} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Status
            <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as "draft" | "published")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="text-sm">
            Display order
            <input className={inputClass} type="number" min={0} value={displayOrder} onChange={(event) => setDisplayOrder(Number(event.target.value))} />
          </label>
        </div>
        <ol className="space-y-2 border border-line p-4">
          <li className="text-sm text-mute">Begin in {city.name}</li>
          {attractionIds.map((id, index) => {
            const attraction = city.attractions.find((item) => item.id === id);
            return (
              <li key={`${id}-${index}`} className="flex items-center justify-between gap-3 border-t border-line py-2">
                <span>
                  {String(index + 1).padStart(2, "0")} {attraction?.name || "Removed attraction"}
                </span>
                <span className="flex gap-2 text-sm">
                  <button type="button" onClick={() => move(index, -1)}>Up</button>
                  <button type="button" onClick={() => move(index, 1)}>Down</button>
                  <button type="button" onClick={() => setAttractionIds(attractionIds.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
                </span>
              </li>
            );
          })}
          <li className="border-t border-line pt-2 text-sm text-mute">End of sightseeing</li>
        </ol>
        <div className="flex flex-wrap gap-2">
          <select className="border border-line bg-white px-3 py-2 text-sm" value={addId} onChange={(event) => setAddId(event.target.value)}>
            <option value="">Add an attraction</option>
            {city.attractions.map((attraction) => (
              <option key={attraction.id} value={attraction.id}>
                {attraction.name}
                {attraction.status === "draft" ? " (draft)" : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="border border-slatebrand px-3 py-2 text-sm"
            onClick={() => {
              if (!addId) return;
              setAttractionIds([...attractionIds, addId]);
              setAddId("");
            }}
          >
            Add node
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={save} disabled={pending} className="bg-slatebrand px-5 py-3 text-sm text-ivory disabled:opacity-60">
            {pending ? "Saving" : "Save sequence"}
          </button>
          {routeId !== "new" ? (
            <button type="button" onClick={remove} className="text-sm text-[#8C3A3A]">
              Delete sequence
            </button>
          ) : null}
          <a href={`/cities/${city.slug}#sightseeing`} target="_blank" rel="noreferrer" className="text-sm underline decoration-gold underline-offset-4">
            Preview
          </a>
        </div>
        {error ? <p className="text-sm text-[#8C3A3A]">{error}</p> : null}
        {message ? <p className="text-sm text-ink">{message}</p> : null}
      </div>
    </div>
  );
}
