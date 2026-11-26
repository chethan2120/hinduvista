import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href?: string;
}

export interface HoverRevealCardsProps {
  items: CardItem[];
  className?: string;
  cardClassName?: string;
}

const cardClass = (cardClassName?: string) =>
  cn(
    "relative h-80 cursor-pointer overflow-hidden bg-cover bg-center shadow-lg transition-all duration-500 ease-in-out",
    "group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]",
    "hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    cardClassName,
  );

function CardFace({ item }: { item: CardItem }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <p className="text-sm font-light uppercase tracking-widest opacity-80">{item.subtitle}</p>
        <h3 className="mt-1 text-2xl font-semibold">{item.title}</h3>
      </div>
    </>
  );
}

const HoverRevealCards = ({ items, className, cardClassName }: HoverRevealCardsProps) => {
  return (
    <div
      role="list"
      className={cn("group grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4", className)}
    >
      {items.map((item) => {
        const style = item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined;
        const classNameForCard = cardClass(cardClassName);
        if (item.href) {
          return (
            <div key={item.id} role="listitem">
              <Link href={item.href} aria-label={`${item.title}, ${item.subtitle}`} className={classNameForCard} style={style}>
                <CardFace item={item} />
              </Link>
            </div>
          );
        }
        return (
          <div
            key={item.id}
            role="listitem"
            aria-label={`${item.title}, ${item.subtitle}`}
            tabIndex={0}
            className={classNameForCard}
            style={style}
          >
            <CardFace item={item} />
          </div>
        );
      })}
    </div>
  );
};

export default HoverRevealCards;
