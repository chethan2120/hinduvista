"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, GalleryPicker, MediaSelect, SaveBar, UploadControl, inputClass, type MediaOption } from "@/components/admin/fields";
import { slugify } from "@/lib/utils";

export type CityValues = {
  id?: string;
  name: string;
  slug: string;
  state: string;
  region: string;
  shortDescription: string;
  fullDescription: string;
  bestTimeToVisit: string;
  travelInfo: string;
  featured: boolean;
  status: "draft" | "published";
  displayOrder: number;
  isSample: boolean;
  heroImageId: string;
  galleryIds: string[];
};

const empty: CityValues = {
  name: "",
  slug: "",
  state: "",
  region: "",
  shortDescription: "",
  fullDescription: "",
  bestTimeToVisit: "",
  travelInfo: "",
  featured: false,
  status: "draft",
  displayOrder: 0,
  isSample: false,
  heroImageId: "",
  galleryIds: [],
};

export function CityForm({ initial = empty, assets }: { initial?: CityValues; assets: MediaOption[] }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [library, setLibrary] = useState(assets);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof CityValues>(key: K, value: CityValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch(initial.id ? `/api/admin/cities/${initial.id}` : "/api/admin/cities", {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, heroImageId: values.heroImageId || null }),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error || "The city could not be saved.");
      return;
    }
    router.push("/admin/cities");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5">
      <Field label="City name">
        <input
          className={inputClass}
          value={values.name}
          onChange={(event) => {
            const name = event.target.value;
            set("name", name);
            if (!slugTouched) set("slug", slugify(name));
          }}
          required
        />
      </Field>
      <Field label="Slug">
        <input
          className={inputClass}
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true);
            set("slug", slugify(event.target.value));
          }}
          required
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="State">
          <input className={inputClass} value={values.state} onChange={(event) => set("state", event.target.value)} required />
        </Field>
        <Field label="Region">
          <input className={inputClass} value={values.region} onChange={(event) => set("region", event.target.value)} required />
        </Field>
      </div>
      <Field label="Short introduction">
        <textarea className={inputClass} rows={3} value={values.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} required />
      </Field>
      <Field label="Full description">
        <textarea className={inputClass} rows={8} value={values.fullDescription} onChange={(event) => set("fullDescription", event.target.value)} required />
      </Field>
      <Field label="Best time to visit">
        <textarea className={inputClass} rows={3} value={values.bestTimeToVisit} onChange={(event) => set("bestTimeToVisit", event.target.value)} />
      </Field>
      <Field label="Travel information">
        <textarea className={inputClass} rows={4} value={values.travelInfo} onChange={(event) => set("travelInfo", event.target.value)} />
      </Field>
      <MediaSelect label="Featured photograph" value={values.heroImageId} assets={library} onChange={(value) => set("heroImageId", value)} />
      <GalleryPicker assets={library} selected={values.galleryIds} onChange={(ids) => set("galleryIds", ids)} />
      <UploadControl onUploaded={(asset) => setLibrary((current) => [asset, ...current])} />
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Display order">
          <input className={inputClass} type="number" min={0} value={values.displayOrder} onChange={(event) => set("displayOrder", Number(event.target.value))} />
        </Field>
        <Field label="Status">
          <select className={inputClass} value={values.status} onChange={(event) => set("status", event.target.value as CityValues["status"])}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <label className="mt-7 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.featured} onChange={(event) => set("featured", event.target.checked)} />
          Featured
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.isSample} onChange={(event) => set("isSample", event.target.checked)} />
        Mark as sample demonstration content
      </label>
      <SaveBar pending={pending} error={error} href={values.slug ? `/cities/${values.slug}` : undefined} />
    </form>
  );
}
