import type { ReactNode } from "react";
import { connection } from "next/server";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { NameIntro } from "@/components/site/name-intro";
import { ScrollMotion } from "@/components/site/scroll-motion";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  await connection();
  const settings = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: settings.brand_name,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    description: settings.seo_description,
  };

  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-3 focus:py-2">
        Skip to content
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('hv-motion')",
        }}
      />
      <ScrollMotion />
      <NameIntro />
      <Header brand={settings.brand_name} hindi={settings.hindi_name} />
      <main id="content">{children}</main>
      <Footer brand={settings.brand_name} hindi={settings.hindi_name} text={settings.footer_text} />
      <WhatsAppButton number={settings.whatsapp_number} preface={settings.whatsapp_preface} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
