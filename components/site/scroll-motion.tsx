"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    document.documentElement.classList.add("hv-motion");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-fx]"));
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          seen.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    for (const node of nodes) {
      const box = node.getBoundingClientRect();
      const visible = box.top < window.innerHeight * 0.9 && box.bottom > 40;
      if (visible) node.classList.add("is-in");
      else seen.observe(node);
    }
    return () => seen.disconnect();
  }, [pathname]);

  return null;
}
