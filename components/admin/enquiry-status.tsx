"use client";

import { useRouter } from "next/navigation";

const statuses = ["new", "contacted", "closed"] as const;

export function EnquiryStatus({ id, status }: { id: string; status: string }) {
  const router = useRouter();

  async function onChange(next: string) {
    const response = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!response.ok) {
      alert("The status could not be updated.");
      return;
    }
    router.refresh();
  }

  return (
    <select className="border border-line bg-white px-2 py-1 text-sm" value={status} onChange={(event) => onChange(event.target.value)} aria-label="Enquiry status">
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
