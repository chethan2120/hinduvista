import { SettingsForm } from "@/components/admin/editors";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Website settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
