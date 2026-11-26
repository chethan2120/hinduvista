"use client";

import { useRouter } from "next/navigation";

export function DeleteButton({ url, confirmText }: { url: string; confirmText: string }) {
  const router = useRouter();

  async function onClick() {
    if (!confirm(confirmText)) return;
    const response = await fetch(url, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.error || "Could not delete.");
      return;
    }
    router.refresh();
  }

  return (
    <button type="button" onClick={onClick} className="text-sm text-[#8C3A3A]">
      Delete
    </button>
  );
}
