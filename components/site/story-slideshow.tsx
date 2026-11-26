"use client";

import { useEffect, useState } from "react";

export type Story = { place: string; line: string };

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
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <figure className="rounded-[1.75rem] border border-white/15 bg-white/5 px-6 py-7 md:px-9 md:py-8">
        <blockquote key={story.place} className="hv-quote max-w-2xl font-serif text-2xl italic leading-snug md:text-3xl">
          {story.line}
        </blockquote>
        <figcaption className="mt-5 text-xs uppercase tracking-[0.16em] text-gold">
          Sample note
          <span className="px-2 text-ivory/40">/</span>
          {story.place}
        </figcaption>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
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
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} className="rounded-full border border-ivory/30 px-4 py-1.5 text-sm text-ivory hover:border-gold hover:text-gold" aria-label="Previous testimonial">
              Prev
            </button>
            <button type="button" onClick={() => go(index + 1)} className="rounded-full border border-ivory/30 px-4 py-1.5 text-sm text-ivory hover:border-gold hover:text-gold" aria-label="Next testimonial">
              Next
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
}
