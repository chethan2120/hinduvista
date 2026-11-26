import { prisma } from "@/lib/prisma";
import { writeLinearRoute } from "@/lib/routes";
import type { z } from "zod";
import type { attractionSchema, citySchema, routeSchema } from "@/lib/validators";

type CityInput = z.infer<typeof citySchema>;
type AttractionInput = z.infer<typeof attractionSchema>;
type RouteInput = z.infer<typeof routeSchema>;

async function galleryExists(ids: string[]) {
  const unique = [...new Set(ids)];
  if (!unique.length) return unique;
  const count = await prisma.mediaAsset.count({ where: { id: { in: unique } } });
  return count === unique.length ? unique : null;
}

export async function saveCity(id: string | null, input: CityInput) {
  if (input.heroImageId) {
    const image = await prisma.mediaAsset.findUnique({ where: { id: input.heroImageId } });
    if (!image) return { ok: false as const, error: "Choose a photograph from the library." };
  }
  const clash = await prisma.city.findUnique({ where: { slug: input.slug } });
  if (clash && clash.id !== id) return { ok: false as const, error: "That slug is already used." };
  const gallery = await galleryExists(input.galleryIds || []);
  if (!gallery) return { ok: false as const, error: "One of the gallery photographs no longer exists." };

  const data = {
    name: input.name,
    slug: input.slug,
    state: input.state,
    region: input.region,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    bestTimeToVisit: input.bestTimeToVisit || "",
    travelInfo: input.travelInfo || "",
    featured: Boolean(input.featured),
    status: input.status,
    displayOrder: input.displayOrder,
    isSample: Boolean(input.isSample),
    heroImageId: input.heroImageId || null,
  };
  const city = id ? await prisma.city.update({ where: { id }, data }) : await prisma.city.create({ data });
  await prisma.cityMedia.deleteMany({ where: { cityId: city.id } });
  if (gallery.length) {
    await prisma.cityMedia.createMany({
      data: gallery.map((mediaId, index) => ({ cityId: city.id, mediaId, sortOrder: index })),
    });
  }
  return { ok: true as const, city };
}

export async function saveAttraction(id: string | null, input: AttractionInput) {
  const city = await prisma.city.findUnique({ where: { id: input.cityId } });
  if (!city) return { ok: false as const, error: "Choose a city." };
  if (input.categoryId) {
    const category = await prisma.attractionCategory.findUnique({ where: { id: input.categoryId } });
    if (!category) return { ok: false as const, error: "Choose a category that exists." };
  }
  if (input.coverImageId) {
    const image = await prisma.mediaAsset.findUnique({ where: { id: input.coverImageId } });
    if (!image) return { ok: false as const, error: "Choose a cover photograph from the library." };
  }
  const clash = await prisma.attraction.findFirst({ where: { cityId: input.cityId, slug: input.slug } });
  if (clash && clash.id !== id) return { ok: false as const, error: "That slug is already used in this city." };
  const gallery = await galleryExists(input.galleryIds || []);
  if (!gallery) return { ok: false as const, error: "One of the gallery photographs no longer exists." };

  const data = {
    cityId: input.cityId,
    categoryId: input.categoryId || null,
    name: input.name,
    slug: input.slug,
    shortDescription: input.shortDescription,
    description: input.description,
    location: input.location || "",
    historicalInfo: input.historicalInfo || "",
    visitorInfo: input.visitorInfo || "",
    duration: input.duration || "",
    status: input.status,
    displayOrder: input.displayOrder,
    isSample: Boolean(input.isSample),
    coverImageId: input.coverImageId || null,
  };
  const attraction = id
    ? await prisma.attraction.update({ where: { id }, data })
    : await prisma.attraction.create({ data });
  await prisma.attractionMedia.deleteMany({ where: { attractionId: attraction.id } });
  if (gallery.length) {
    await prisma.attractionMedia.createMany({
      data: gallery.map((mediaId, index) => ({ attractionId: attraction.id, mediaId, sortOrder: index })),
    });
  }
  return { ok: true as const, attraction };
}

export async function saveRoute(id: string | null, input: RouteInput) {
  const city = await prisma.city.findUnique({ where: { id: input.cityId } });
  if (!city) return { ok: false as const, error: "Choose a city." };
  const uniqueIds = input.attractionIds;
  const found = await prisma.attraction.findMany({
    where: { id: { in: uniqueIds }, cityId: city.id },
    select: { id: true },
  });
  if (found.length !== new Set(uniqueIds).size) {
    return { ok: false as const, error: "Every stop must belong to the selected city." };
  }

  const route = await prisma.$transaction(async (tx) => {
    const saved = id
      ? await tx.sightseeingRoute.update({
          where: { id },
          data: {
            cityId: city.id,
            name: input.name,
            description: input.description || "",
            status: input.status,
            displayOrder: input.displayOrder || 0,
          },
        })
      : await tx.sightseeingRoute.create({
          data: {
            cityId: city.id,
            name: input.name,
            description: input.description || "",
            status: input.status,
            displayOrder: input.displayOrder || 0,
          },
        });
    await writeLinearRoute(tx, saved.id, city.name, uniqueIds);
    return saved;
  });
  return { ok: true as const, route };
}

export async function loadStudio() {
  const cities = await prisma.city.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: {
      attractions: { orderBy: { displayOrder: "asc" }, select: { id: true, name: true, status: true } },
      routes: {
        orderBy: { displayOrder: "asc" },
        include: { nodes: { orderBy: { sortOrder: "asc" }, select: { kind: true, attractionId: true } } },
      },
    },
  });
  return cities.map((city) => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    attractions: city.attractions,
    routes: city.routes.map((route) => ({
      id: route.id,
      name: route.name,
      description: route.description,
      status: route.status as "draft" | "published",
      displayOrder: route.displayOrder,
      nodes: route.nodes,
    })),
  }));
}
