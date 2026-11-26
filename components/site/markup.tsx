import type { ReactNode } from "react";

export function Eyebrow({ children, tone = "ink" }: { children: ReactNode; tone?: "ink" | "light" }) {
  return (
    <p className={`text-[0.72rem] uppercase tracking-[0.24em] ${tone === "light" ? "text-gold" : "text-goldink"}`}>
      {children}
    </p>
  );
}

export function SampleNote({ children }: { children: ReactNode }) {
  return <p className="max-w-2xl text-sm leading-relaxed text-mute">{children}</p>;
}
