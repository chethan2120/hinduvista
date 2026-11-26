"use client";

import { Building, Castle, Landmark, Mountain, TowerControl } from "lucide-react";
import { ExpandingCards } from "@/components/ui/expanding-cards";

const icons = {
  castle: Castle,
  building: Building,
  landmark: Landmark,
  tower: TowerControl,
  mountain: Mountain,
} as const;

export type PlaceCard = {
  id: string;
  title: string;
  description: string;
  imgSrc: string;
  linkHref: string;
  icon: keyof typeof icons;
  imageClassName?: string;
};

export function PlaceCards({ items }: { items: PlaceCard[] }) {
  return (
    <ExpandingCards
      items={items.map((item) => {
        const Icon = icons[item.icon];
        return { ...item, icon: <Icon size={22} strokeWidth={1.6} /> };
      })}
      defaultActiveIndex={0}
    />
  );
}
