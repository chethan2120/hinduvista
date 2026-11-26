import { ProfileForm } from "@/components/admin/editors";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Profile</h1>
      <ProfileForm name={user.name} email={user.email} />
    </div>
  );
}
