"use client";

import { useEffect, useState } from "react";

export type Story = { place: string; line: string; image: string; alt: string; imageTwo: string; altTwo: string };

export function StorySlideshow({ stories }: { stories: Story[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = stories.length;
  const story = stories[index];

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), 5200);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (!story) return null;

  function go(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <figure className="rounded-[1.75rem] border border-white/15 bg-white/5 px-14 py-6 md:px-16 md:py-7">
        <div key={story.place} className="grid items-center gap-5 md:grid-cols-[9.5rem_1fr_9.5rem]">
          <img src={story.image} alt={story.alt} className="hv-photo h-36 w-full rounded-2xl object-cover md:h-44" />
          <div>
            <blockquote className="hv-quote font-serif text-2xl italic leading-snug md:text-[1.7rem]">{story.line}</blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.16em] text-gold">
              Sample note
              <span className="px-2 text-ivory/40">/</span>
              {story.place}
            </figcaption>
          </div>
          <img src={story.imageTwo} alt={story.altTwo} className="hv-photo hidden h-44 w-full rounded-2xl object-cover md:block" />
        </div>
        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
          {stories.map((item, itemIndex) => (
            <button
              key={item.place}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={item.place}
              onClick={() => setIndex(itemIndex)}
              className={`h-1.5 rounded-full transition-all ${itemIndex === index ? "w-7 bg-gold" : "w-3 bg-ivory/30"}`}
            />
          ))}
        </div>
      </figure>
      <Arrow side="left" label="Previous testimonial" onClick={() => go(index - 1)} />
      <Arrow side="right" label="Next testimonial" onClick={() => go(index + 1)} />
    </div>
  );
}

function Arrow({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const left = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/35 bg-slatebrand text-ivory transition hover:border-gold hover:text-gold ${left ? "left-0" : "right-0"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path d={left ? "M14.5 6.5 8.5 12l6 5.5" : "M9.5 6.5 15.5 12l-6 5.5"} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
