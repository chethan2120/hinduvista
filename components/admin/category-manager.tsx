"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteButton } from "@/components/admin/delete-button";
import { inputClass } from "@/components/admin/fields";
import { slugify } from "@/lib/utils";

export function CategoryManager({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name) }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not add the category.");
      return;
    }
    setName("");
    router.refresh();
  }

  return (
    <div className="mt-12 border border-line p-5">
      <h2 className="font-serif text-2xl">Categories</h2>
      <ul className="mt-4 divide-y divide-line">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between py-2 text-sm">
            <span>{category.name}</span>
            <DeleteButton url={`/api/admin/categories/${category.id}`} confirmText={`Delete the category ${category.name}? Attractions keep their text and lose only this label.`} />
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap gap-2">
        <input className="border border-line px-3 py-2 text-sm" value={name} onChange={(event) => setName(event.target.value)} placeholder="New category" required />
        <button className={`${inputClass} mt-0 w-auto bg-slatebrand px-4 text-ivory`} type="submit">
          Add
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-[#8C3A3A]">{error}</p> : null}
    </div>
  );
}
