"use client";

import { ChangeEvent, useState, type ReactNode } from "react";

export type MediaOption = {
  id: string;
  url: string;
  alt: string;
  destination: string;
  category: string;
};

export const inputClass = "mt-2 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-slatebrand";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-ink">
      {label}
      {children}
    </label>
  );
}

export function MediaSelect({
  label,
  value,
  assets,
  onChange,
}: {
  label: string;
  value: string;
  assets: MediaOption[];
  onChange: (value: string) => void;
}) {
  const linked = value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://");
  const current = assets.find((asset) => asset.id === value);
  const preview = linked ? value : current?.url || "";
  return (
    <Field label={label}>
      <span className="mt-2 grid gap-3">
        {preview ? (
          <span className="block h-44 max-w-sm overflow-hidden bg-slatebrand">
            <img src={preview} alt={current?.alt || label} className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className="block text-sm text-mute">No photograph chosen yet.</span>
        )}
        {current ? <span className="text-sm text-ink">{current.destination ? `${current.destination} — ` : ""}{current.alt}</span> : null}
        <select className={inputClass} value={linked ? "" : value} onChange={(event) => onChange(event.target.value)}>
          <option value="">None</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {(asset.destination ? `${asset.destination} — ` : "") + asset.alt}
            </option>
          ))}
        </select>
        <input
          className={inputClass}
          placeholder="Or paste an image link"
          value={linked ? value : ""}
          onChange={(event) => onChange(event.target.value.trim())}
        />
      </span>
    </Field>
  );
}

export function GalleryPicker({
  assets,
  selected,
  onChange,
}: {
  assets: MediaOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm">Gallery photographs</legend>
      <div className="mt-3 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
        {assets.map((asset) => {
          const on = selected.includes(asset.id);
          return (
            <button
              type="button"
              key={asset.id}
              onClick={() => onChange(on ? selected.filter((id) => id !== asset.id) : [...selected, asset.id])}
              className={`relative h-20 bg-slatebrand ring-2 ${on ? "ring-gold" : "ring-transparent"}`}
              aria-pressed={on}
            >
              <img src={asset.url} alt={asset.alt} className="absolute inset-0 h-full w-full object-cover" />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function UploadControl({ onUploaded }: { onUploaded: (asset: MediaOption) => void }) {
  const [alt, setAlt] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (alt.trim().length < 3) {
      setError("Add a short description before choosing the file.");
      event.target.value = "";
      return;
    }
    setPending(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    body.set("alt", alt.trim());
    body.set("destination", destination.trim());
    body.set("category", "upload");
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    onUploaded(data.asset);
    setAlt("");
    setDestination("");
    event.target.value = "";
  }

  return (
    <div className="border border-line p-4">
      <p className="text-sm">Upload a photograph</p>
      <input className={inputClass} placeholder="What is in the photograph?" value={alt} onChange={(event) => setAlt(event.target.value)} />
      <input className={inputClass} placeholder="City or place, if any" value={destination} onChange={(event) => setDestination(event.target.value)} />
      <input className="mt-3 block text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={pending} />
      {error ? <p className="mt-2 text-sm text-[#8C3A3A]">{error}</p> : null}
    </div>
  );
}

export function SaveBar({ pending, error, href }: { pending: boolean; error: string; href?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button type="submit" disabled={pending} className="bg-slatebrand px-5 py-3 text-sm text-ivory disabled:opacity-60">
        {pending ? "Saving" : "Save"}
      </button>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="text-sm underline decoration-gold underline-offset-4">
          Preview
        </a>
      ) : null}
      {error ? <p className="text-sm text-[#8C3A3A]">{error}</p> : null}
    </div>
  );
}
