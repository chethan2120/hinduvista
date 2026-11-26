import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Arya, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const arya = Arya({
  subsets: ["devanagari", "latin"],
  weight: "700",
  variable: "--font-arya",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2E4053",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Hindu Vista",
    template: "%s | Hindu Vista",
  },
  description:
    "Hindu Vista presents cities and tourist places across India, with sightseeing sequences and a desk for travel enquiries.",
  openGraph: {
    type: "website",
    siteName: "Hindu Vista",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} ${arya.variable}`}>
      <body className="bg-ivory font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
