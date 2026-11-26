import { AboutForm } from "@/components/admin/editors";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "About and contact" };

export default async function AboutAdminPage() {
  const [settings, assets] = await Promise.all([
    getSettings(),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">About and contact</h1>
      <AboutForm
        settings={settings}
        assets={assets.map((asset) => ({ id: asset.id, url: asset.urlMedium || asset.url, alt: asset.alt, destination: asset.destination, category: asset.category }))}
      />
    </div>
  );
}
