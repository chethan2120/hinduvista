import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminShell } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await connection();
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");
  return <AdminShell name={user.name}>{children}</AdminShell>;
}
