"use client";

import { useEffect, useState } from "react";
import { Wordmark } from "@/components/site/wordmark";

const CITIES = ["Jaipur", "Udaipur", "Agra", "Delhi", "Varanasi", "Mysuru"];

export function NameIntro() {
  const [phase, setPhase] = useState<"open" | "close" | "done">("open");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = window.setTimeout(() => setPhase("close"), reduce ? 500 : 5600);
    const done = window.setTimeout(() => setPhase("done"), reduce ? 700 : 6400);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[70] overflow-hidden bg-slatebrand text-ivory transition-transform duration-700 ease-in-out ${
        phase === "close" ? "-translate-y-full" : "translate-y-0"
      }`}
      role="presentation"
    >
      <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-gold/50 md:left-10 md:top-10" />
      <div className="pointer-events-none absolute right-6 top-6 h-8 w-8 border-r border-t border-gold/50 md:right-10 md:top-10" />
      <div className="pointer-events-none absolute bottom-6 left-6 h-8 w-8 border-b border-l border-gold/50 md:bottom-10 md:left-10" />
      <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-gold/50 md:bottom-10 md:right-10" />
      <p className="absolute left-7 top-1/2 hidden -translate-y-1/2 text-[0.68rem] uppercase tracking-[0.28em] text-gold/80 [writing-mode:vertical-rl] md:block">
        Travel in India
      </p>
      <ul className="pointer-events-none absolute inset-x-0 top-[8%] z-20 flex justify-center gap-4 px-16 md:gap-8">
        {CITIES.map((city, index) => (
          <li key={city} className="hv-rise text-[0.62rem] uppercase tracking-[0.18em] text-ivory/55 md:text-xs" style={{ animationDelay: `${400 + index * 120}ms` }}>
            {city}
          </li>
        ))}
      </ul>
      <div className="relative z-20 grid h-full place-items-center px-6">
        <div className={`text-center ${phase === "close" ? "opacity-0 transition-opacity duration-300" : ""}`}>
          <p className="hv-rise mb-6 text-[0.68rem] uppercase tracking-[0.32em] text-gold" style={{ animationDelay: "40ms" }}>
            Hindu Vista
          </p>
          <Wordmark tone="inverse" large sequence />
          <span className="hv-rule mx-auto mt-5 block h-px w-36 bg-gold" />
          <p className="hv-rise mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/70" style={{ animationDelay: "1500ms" }}>
            A travel desk for the place itself. Six sample cities, then the landing page.
          </p>
        </div>
      </div>
    </div>
  );
}
