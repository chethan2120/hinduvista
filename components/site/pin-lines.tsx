"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const LINES = ["One city at a time.", "A sequence you can follow.", "An enquiry that is kept."];

export function PinLines() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const first = useTransform(scrollYProgress, [0, 0.2, 0.32], [1, 1, 0]);
  const second = useTransform(scrollYProgress, [0.32, 0.44, 0.58, 0.7], [0, 1, 1, 0]);
  const third = useTransform(scrollYProgress, [0.7, 0.82, 1], [0, 1, 1]);
  const fades = [first, second, third];

  if (reduce) {
    return (
      <section className="border-y border-line bg-ivory px-6 py-16 text-center" aria-label="How a visit moves">
        {LINES.map((line) => (
          <p key={line} className="mx-auto max-w-xl py-3 font-serif text-4xl font-semibold md:text-5xl">{line}</p>
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} className="relative z-10 h-[140vh] border-y border-line bg-ivory" aria-label="How a visit moves">
      <div className="sticky top-[4.5rem] grid h-[calc(100svh-4.5rem)] place-items-center bg-ivory px-6 text-center">
        {LINES.map((line, index) => (
          <motion.p key={line} style={{ opacity: fades[index] }} className="col-start-1 row-start-1 max-w-xl font-serif text-4xl font-semibold md:text-5xl">
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
