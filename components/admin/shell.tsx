"use client";

import Link from "next/link";
import { Wordmark } from "@/components/site/wordmark";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const groups = [
  {
    label: "Start",
    links: [{ href: "/admin", label: "Overview", hint: "See how many cities, places, and enquiries are on the site." }],
  },
  {
    label: "What visitors see",
    links: [
      { href: "/admin/cities", label: "Cities", hint: "Add a city, write its introduction, choose a photograph, then publish it." },
      { href: "/admin/attractions", label: "Tourist places", hint: "Add the monuments and places that belong to a city." },
      { href: "/admin/routes", label: "Sightseeing order", hint: "Choose the order of places on a city’s connected path." },
      { href: "/admin/media", label: "Photographs", hint: "Upload pictures and see which ones are already in use." },
    ],
  },
  {
    label: "Messages",
    links: [{ href: "/admin/enquiries", label: "Enquiries", hint: "Read messages from the form and mark them contacted or closed." }],
  },
  {
    label: "The pages",
    links: [
      { href: "/admin/homepage", label: "Homepage text", hint: "Change the headlines and introductions on the public homepage." },
      { href: "/admin/about", label: "About and contact", hint: "Edit the About page and the words on the contact page." },
      { href: "/admin/settings", label: "Settings", hint: "Save the WhatsApp number and other site details when you have them." },
      { href: "/admin/profile", label: "Your login", hint: "Change the name, email, or password for this desk." },
    ],
  },
];

const links = groups.flatMap((group) => group.links);

export function AdminShell({ name, children }: { name: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = links.find((link) => (link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href)));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[17rem_1fr]">
      {menuOpen ? <button type="button" className="fixed inset-0 z-40 bg-slatedeep/50 lg:hidden" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}
      <aside id="desk-menu" className={`hv-menu-scroll fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-slatebrand text-ivory transition-transform lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-full lg:translate-x-0 lg:self-start ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-6">
          <Wordmark />
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gold">Staff desk</p>
        </div>
        <nav className="space-y-6 px-4 pb-10" aria-label="Dashboard">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[0.65rem] uppercase tracking-[0.18em] text-ivory/45">{group.label}</p>
              <div className="mt-2 space-y-1">
                {group.links.map((link) => {
                  const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      aria-current={active ? "page" : undefined}
                      className={`block px-3 py-2 text-sm ${active ? "bg-white/10 text-gold" : "text-ivory/80 hover:bg-white/5"}`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div>
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button type="button" className="lg:hidden" aria-expanded={menuOpen} aria-controls="desk-menu" onClick={() => setMenuOpen((value) => !value)}>
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              <span className="block h-px w-6 bg-ink" />
              <span className="mt-1.5 block h-px w-6 bg-ink" />
              <span className="mt-1.5 block h-px w-4 bg-goldink" />
            </button>
            <p className="text-sm text-mute">Signed in as {name}</p>
          </div>
          <button type="button" onClick={logout} className="border border-line px-3 py-1.5 text-sm text-ink hover:border-slatebrand">
            Log out
          </button>
        </div>
        <div className="px-5 py-8 md:px-8">
          {current ? <p className="mb-6 max-w-2xl text-sm leading-relaxed text-mute">{current.hint}</p> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
