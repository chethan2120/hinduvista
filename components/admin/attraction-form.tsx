"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, GalleryPicker, MediaSelect, SaveBar, UploadControl, inputClass, type MediaOption } from "@/components/admin/fields";
import { slugify } from "@/lib/utils";

type Option = { id: string; name: string; slug?: string };

export type AttractionValues = {
  id?: string;
  cityId: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  location: string;
  historicalInfo: string;
  visitorInfo: string;
  duration: string;
  status: "draft" | "published";
  displayOrder: number;
  isSample: boolean;
  coverImageId: string;
  galleryIds: string[];
  citySlug?: string;
};

export function AttractionForm({
  initial,
  cities,
  categories,
  assets,
}: {
  initial: AttractionValues;
  cities: Option[];
  categories: Option[];
  assets: MediaOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [library, setLibrary] = useState(assets);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function set<K extends keyof AttractionValues>(key: K, value: AttractionValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch(initial.id ? `/api/admin/attractions/${initial.id}` : "/api/admin/attractions", {
      method: initial.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, categoryId: values.categoryId || null, coverImageId: values.coverImageId || null }),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error || "The attraction could not be saved.");
      return;
    }
    router.push("/admin/attractions");
    router.refresh();
  }

  const city = cities.find((item) => item.id === values.cityId);

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="City">
          <select className={inputClass} value={values.cityId} onChange={(event) => set("cityId", event.target.value)} required>
            <option value="">Choose a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select className={inputClass} value={values.categoryId} onChange={(event) => set("categoryId", event.target.value)}>
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Name">
        <input
          className={inputClass}
          value={values.name}
          required
          onChange={(event) => {
            const name = event.target.value;
            set("name", name);
            if (!slugTouched) set("slug", slugify(name));
          }}
        />
      </Field>
      <Field label="Slug">
        <input
          className={inputClass}
          value={values.slug}
          required
          onChange={(event) => {
            setSlugTouched(true);
            set("slug", slugify(event.target.value));
          }}
        />
      </Field>
      <Field label="Short description">
        <textarea className={inputClass} rows={3} value={values.shortDescription} onChange={(event) => set("shortDescription", event.target.value)} required />
      </Field>
      <Field label="Description">
        <textarea className={inputClass} rows={7} value={values.description} onChange={(event) => set("description", event.target.value)} required />
      </Field>
      <Field label="Location">
        <input className={inputClass} value={values.location} onChange={(event) => set("location", event.target.value)} />
      </Field>
      <Field label="Historical or cultural information">
        <textarea className={inputClass} rows={5} value={values.historicalInfo} onChange={(event) => set("historicalInfo", event.target.value)} />
      </Field>
      <Field label="Visitor information">
        <textarea className={inputClass} rows={4} value={values.visitorInfo} onChange={(event) => set("visitorInfo", event.target.value)} />
      </Field>
      <Field label="Estimated visiting duration, only if verified">
        <input className={inputClass} value={values.duration} onChange={(event) => set("duration", event.target.value)} placeholder="Leave blank if you do not have a verified duration" />
      </Field>
      <MediaSelect label="Cover photograph" value={values.coverImageId} assets={library} onChange={(value) => set("coverImageId", value)} />
      <GalleryPicker assets={library} selected={values.galleryIds} onChange={(ids) => set("galleryIds", ids)} />
      <UploadControl onUploaded={(asset) => setLibrary((current) => [asset, ...current])} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Display order">
          <input className={inputClass} type="number" min={0} value={values.displayOrder} onChange={(event) => set("displayOrder", Number(event.target.value))} />
        </Field>
        <Field label="Status">
          <select className={inputClass} value={values.status} onChange={(event) => set("status", event.target.value as AttractionValues["status"])}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.isSample} onChange={(event) => set("isSample", event.target.checked)} />
        Mark as sample demonstration content
      </label>
      <SaveBar pending={pending} error={error} href={city?.slug && values.slug ? `/cities/${city.slug}/attractions/${values.slug}` : undefined} />
    </form>
  );
}
