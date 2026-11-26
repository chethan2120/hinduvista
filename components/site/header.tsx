"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/site/wordmark";

const links = [
  { href: "/#about", id: "about", label: "About" },
  { href: "/#cities", id: "cities", label: "Cities" },
  { href: "/#why", id: "why", label: "Why us" },
  { href: "/#stories", id: "stories", label: "Stories" },
  { href: "/#questions", id: "questions", label: "Questions" },
];

export function Header({ brand, hindi }: { brand: string; hindi: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(pathname === "/");
  const [active, setActive] = useState("");
  const home = pathname === "/";
  const current = overHero ? "" : active;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!home) {
      setOverHero(false);
      setActive("");
      return;
    }

    const hero = document.getElementById("top");
    const onScroll = () => {
      if (!hero) {
        setOverHero(window.scrollY < 40);
        return;
      }
      setOverHero(hero.getBoundingClientRect().bottom > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const nodes = [...links.map((link) => link.id), "enquire"]
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0.05, 0.2] },
    );
    nodes.forEach((node) => observer.observe(node));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [home]);

  const light = !overHero || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow,height] duration-500 ${
          light ? "border-b border-line bg-ivory/95 text-ink shadow-sm backdrop-blur" : "border-b border-transparent bg-transparent text-ivory"
        }`}
      >
        <div className={`mx-auto flex max-w-page items-center justify-between px-5 transition-[min-height,padding] duration-500 md:px-10 ${light ? "min-h-16 py-2" : "min-h-[4.5rem] py-3"}`}>
          <Link href="/#top" className="block" aria-label={`${brand}${hindi ? `, ${hindi}` : ""}`}>
            <Wordmark tone={light ? "ink" : "inverse"} />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((link) => {
              const on = current === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={on ? "true" : undefined}
                  className={`relative text-sm tracking-wide transition-colors duration-300 ${
                    on ? (light ? "text-goldink" : "text-gold") : light ? "text-ink/75 hover:text-ink" : "text-ivory/85 hover:text-ivory"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${on ? "w-full" : "w-0"}`} />
                </Link>
              );
            })}
            <Link
              href="/#enquire"
              className={`border px-4 py-2 text-sm transition-colors duration-300 ${
                current === "enquire"
                  ? "border-gold bg-gold text-slatedeep"
                  : light
                    ? "border-slatebrand text-slatebrand hover:bg-slatebrand hover:text-ivory"
                    : "border-gold text-gold hover:bg-gold hover:text-slatedeep"
              }`}
            >
              Enquire
            </Link>
          </nav>
          <button
            type="button"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`block h-px w-6 ${light ? "bg-ink" : "bg-ivory"}`} />
            <span className={`mt-1.5 block h-px w-6 ${light ? "bg-ink" : "bg-ivory"}`} />
            <span className="mt-1.5 block h-px w-4 bg-gold" />
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" className="hv-menu-scroll max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-ivory px-5 py-6 text-ink lg:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-5">
              {links.map((link) => (
                <Link key={link.id} href={link.href} className={`font-serif text-3xl ${current === link.id ? "text-goldink" : ""}`}>
                  {link.label}
                </Link>
              ))}
              <Link href="/#enquire" className="mt-2 w-fit border border-slatebrand px-4 py-2 text-sm text-slatebrand">
                Enquire
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
      {home ? null : <div aria-hidden className="h-[4.5rem]" />}
    </>
  );
}
