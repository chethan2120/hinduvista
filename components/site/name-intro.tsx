"use client";

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/site/wordmark";

export function NameIntro() {
  const [phase, setPhase] = useState<"open" | "close" | "done">("open");
  const plane = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = window.setTimeout(() => setPhase("close"), reduce ? 500 : 4600);
    const done = window.setTimeout(() => setPhase("done"), reduce ? 700 : 5300);
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

  useEffect(() => {
    const node = plane.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const width = () => window.innerWidth;
    const height = () => window.innerHeight;
    let x = width() * 0.18;
    let y = height() * 0.28;
    let heading = -0.35;
    let frame = 0;

    const nextTarget = () => {
      const bend = (Math.random() - 0.5) * 1.1;
      const travel = Math.min(width(), height()) * (0.28 + Math.random() * 0.22);
      const aim = heading + bend;
      return {
        x: Math.min(width() - 48, Math.max(48, x + Math.cos(aim) * travel)),
        y: Math.min(height() - 48, Math.max(48, y + Math.sin(aim) * travel)),
      };
    };

    let target = nextTarget();
    let raf = 0;

    const tick = () => {
      const dx = target.x - x;
      const dy = target.y - y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance < 70) target = nextTarget();
      const desired = Math.atan2(target.y - y, target.x - x);
      let delta = desired - heading;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      heading += Math.max(-0.028, Math.min(0.028, delta));
      const speed = 1.35 + Math.sin(frame / 90) * 0.15;
      x += Math.cos(heading) * speed;
      y += Math.sin(heading) * speed;
      x = Math.min(width() - 36, Math.max(36, x));
      y = Math.min(height() - 36, Math.max(36, y));
      frame += 1;
      node.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${(heading * 180) / Math.PI}deg)`;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[70] overflow-hidden bg-slatebrand text-ivory transition-transform duration-700 ease-in-out ${
        phase === "close" ? "-translate-y-full" : "translate-y-0"
      }`}
      role="presentation"
    >
      <div ref={plane} className="pointer-events-none absolute left-0 top-0 text-gold will-change-transform" aria-hidden>
        <svg viewBox="0 0 64 32" className="h-7 w-14 -translate-x-1/2 -translate-y-1/2 md:h-8 md:w-16">
          <path fill="currentColor" d="M2 18h18l8-12h6l-4 12h16l6-6h6L54 18l4 6h-6l-6-6H30l4 12h-6L20 18H2z" />
        </svg>
      </div>
      <div className="grid h-full place-items-center">
        <div className={`hv-name ${phase === "close" ? "opacity-0" : ""}`}>
          <Wordmark tone="inverse" large />
        </div>
      </div>
    </div>
  );
}
