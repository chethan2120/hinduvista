"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/delete-button";
import { UploadControl, inputClass } from "@/components/admin/fields";

export function LibraryTools() {
  const router = useRouter();
  return <UploadControl onUploaded={() => router.refresh()} />;
}

export function MediaCard({
  asset,
}: {
  asset: {
    id: string;
    preview: string;
    full: string;
    alt: string;
    destination: string;
    category: string;
    license: string;
  };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [alt, setAlt] = useState(asset.alt);
  const [destination, setDestination] = useState(asset.destination);
  const [category, setCategory] = useState(asset.category);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch(`/api/admin/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt, destination, category }),
    });
    const data = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Could not save this photograph.");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  return (
    <li className="border border-line bg-white">
      <button type="button" className="relative block h-44 w-full bg-slatebrand" onClick={() => setOpen(true)} aria-label={`Open ${asset.alt}`}>
        <img src={asset.preview} alt={asset.alt} className="h-full w-full object-cover" />
      </button>
      <div className="space-y-2 p-4 text-sm">
        <p>{asset.alt}</p>
        <p className="text-mute">
          {asset.destination || "Unassigned"} · {asset.category}
        </p>
        <p className="text-xs text-mute">{asset.license}</p>
        <div className="flex gap-4">
          <button type="button" className="text-sm" onClick={() => setEditing((value) => !value)}>
            Edit
          </button>
          <DeleteButton url={`/api/admin/media/${asset.id}`} confirmText="Delete this photograph from the library?" />
        </div>
        {editing ? (
          <form onSubmit={onSave} className="grid gap-2 pt-2">
            <input className={inputClass} value={alt} onChange={(event) => setAlt(event.target.value)} aria-label="Description" />
            <input className={inputClass} value={destination} onChange={(event) => setDestination(event.target.value)} aria-label="City or place" placeholder="City or place" />
            <input className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Group" placeholder="Group" />
            {error ? <p className="text-sm text-[#8C3A3A]">{error}</p> : null}
            <button type="submit" disabled={pending} className="w-fit bg-slatebrand px-4 py-2 text-sm text-ivory disabled:opacity-60">
              {pending ? "Saving" : "Save"}
            </button>
          </form>
        ) : null}
      </div>
      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slatedeep/90 p-6" role="dialog" aria-modal="true" aria-label={asset.alt}>
          <button type="button" className="absolute right-5 top-5 text-sm text-ivory" onClick={() => setOpen(false)}>
            Close
          </button>
          <img src={asset.full} alt={asset.alt} className="max-h-[88vh] max-w-full object-contain" />
        </div>
      ) : null}
    </li>
  );
}
