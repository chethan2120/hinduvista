"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  linkHref: string;
  imageClassName?: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<HTMLUListElement, ExpandingCardsProps>(
  ({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(defaultActiveIndex);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gridStyle = React.useMemo(() => {
      if (activeIndex === null) return {};
      if (isDesktop) {
        return { gridTemplateColumns: items.map((_, index) => (index === activeIndex ? "5fr" : "1fr")).join(" ") };
      }
      return { gridTemplateRows: items.map((_, index) => (index === activeIndex ? "5fr" : "1fr")).join(" ") };
    }, [activeIndex, items, isDesktop]);

    return (
      <ul
        className={cn(
          "grid w-full gap-2",
          "h-[640px] md:h-[520px]",
          "transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
          className,
        )}
        style={{
          ...gridStyle,
          ...(isDesktop ? { gridTemplateRows: "1fr" } : { gridTemplateColumns: "1fr" }),
        }}
        ref={ref}
        {...props}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="group relative min-h-0 min-w-0 cursor-pointer overflow-hidden border border-line bg-slatebrand md:min-w-[72px]"
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            tabIndex={0}
            data-active={activeIndex === index}
          >
            <img
              src={item.imgSrc}
              alt={item.title}
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-center transition-all duration-300 ease-out",
                "scale-105 grayscale group-data-[active=true]:scale-100 group-data-[active=true]:grayscale-0",
                item.imageClassName,
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slatedeep/85 via-slatedeep/25 to-transparent" />
            <article className="absolute inset-0 flex flex-col justify-end gap-2 p-4">
              <h3 className="hidden origin-left rotate-90 text-sm font-light uppercase tracking-wider text-ivory/80 transition-opacity duration-300 md:block group-data-[active=true]:opacity-0">
                {item.title}
              </h3>
              <div className="text-ivory opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100">{item.icon}</div>
              <h3 className="font-serif text-2xl text-ivory opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100">{item.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-ivory/80 opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100">
                {item.description}
              </p>
              <Link
                href={item.linkHref}
                className="mt-1 inline-flex w-fit items-center gap-3 text-sm text-gold opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100"
              >
                Open this place
                <span className="h-px w-8 bg-gold" />
              </Link>
            </article>
          </li>
        ))}
      </ul>
    );
  },
);
ExpandingCards.displayName = "ExpandingCards";
