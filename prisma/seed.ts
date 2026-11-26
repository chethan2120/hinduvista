import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { DEFAULT_SETTINGS } from "../lib/defaults";
import { writeLinearRoute } from "../lib/routes";
import { demoCities, imageRoles } from "./content";

const prisma = new PrismaClient();

type ManifestAsset = {
  key: string;
  file: string;
  medium: string;
  filename: string;
  alt: string;
  category: string;
  destination: string;
  usage: string;
  source: string;
  sourceUrl: string;
  author: string;
  license: string;
  provenance: string;
  width: number;
  height: number;
};

const categories = [
  "Heritage",
  "Historical",
  "Spiritual",
  "Nature",
  "Adventure",
  "Wildlife",
  "Cultural",
  "Beaches",
  "Architecture",
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const manifestPath = path.join(process.cwd(), "data", "image-manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { assets: ManifestAsset[] };
  const assets = new Map(manifest.assets.map((asset) => [asset.key, asset]));

  for (const city of demoCities) {
    for (const attraction of city.attractions) {
      if (!assets.has(attraction.image)) {
        throw new Error(`Missing photograph for ${attraction.image}. Run npm run images.`);
      }
    }
    if (!assets.has(city.cover)) {
      throw new Error(`Missing city photograph ${city.cover}.`);
    }
  }

  const email = (process.env.ADMIN_EMAIL || "admin@gmial.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Hindu Vista Admin";
  if (!password) throw new Error("Set ADMIN_PASSWORD before seeding.");

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email,
        name,
        role: "admin",
        passwordHash: await bcrypt.hash(password, 8),
      },
    });
  }

  await prisma.sightseeingRouteEdge.deleteMany();
  await prisma.sightseeingRouteNode.deleteMany();
  await prisma.sightseeingRoute.deleteMany();
  await prisma.attractionMedia.deleteMany();
  await prisma.cityMedia.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.city.deleteMany();
  await prisma.attractionCategory.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.setting.deleteMany();

  const media: Record<string, { id: string }> = {};
  for (const asset of manifest.assets) {
    media[asset.key] = await prisma.mediaAsset.create({
      data: {
        filename: asset.filename,
        url: `/images/${asset.file}`,
        urlMedium: `/images/${asset.medium}`,
        alt: asset.alt,
        category: asset.category,
        destination: asset.destination,
        usage: asset.usage,
        source: asset.source,
        sourceUrl: asset.sourceUrl,
        author: asset.author,
        license: asset.license,
        provenance: asset.provenance,
        width: asset.width,
        height: asset.height,
      },
    });
  }

  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const created = await prisma.attractionCategory.create({
      data: { name: category, slug: slugify(category) },
    });
    categoryIds[category] = created.id;
  }

  for (const [index, city] of demoCities.entries()) {
    const createdCity = await prisma.city.create({
      data: {
        name: city.name,
        slug: city.slug,
        state: city.state,
        region: city.region,
        shortDescription: city.shortDescription,
        fullDescription: city.fullDescription,
        bestTimeToVisit: city.bestTimeToVisit,
        travelInfo: city.travelInfo,
        featured: true,
        status: "published",
        displayOrder: index + 1,
        isSample: true,
        heroImageId: media[city.cover].id,
      },
    });

    const attractionIds: Record<string, string> = {};
    for (const [attractionIndex, attraction] of city.attractions.entries()) {
      const created = await prisma.attraction.create({
        data: {
          cityId: createdCity.id,
          categoryId: categoryIds[attraction.category],
          name: attraction.name,
          slug: attraction.slug,
          shortDescription: attraction.shortDescription,
          description: attraction.description,
          location: attraction.location,
          historicalInfo: attraction.historicalInfo,
          visitorInfo: attraction.visitorInfo,
          duration: "",
          status: "published",
          displayOrder: attractionIndex + 1,
          isSample: true,
          coverImageId: media[attraction.image].id,
        },
      });
      attractionIds[attraction.key] = created.id;
      await prisma.attractionMedia.create({
        data: { attractionId: created.id, mediaId: media[attraction.image].id, sortOrder: 0 },
      });
      await prisma.cityMedia.create({
        data: { cityId: createdCity.id, mediaId: media[attraction.image].id, sortOrder: attractionIndex },
      });
    }

    for (const [routeIndex, route] of city.routes.entries()) {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const createdRoute = await tx.sightseeingRoute.create({
          data: {
            cityId: createdCity.id,
            name: route.name,
            description: route.description,
            status: "published",
            displayOrder: routeIndex + 1,
          },
        });
        await writeLinearRoute(
          tx,
          createdRoute.id,
          city.name,
          route.keys.map((key) => attractionIds[key]),
        );
      });
    }
  }

  const settings = {
    ...DEFAULT_SETTINGS,
    hero_image: media[imageRoles.hero[0]].id,
    hero_image_secondary: media[imageRoles.hero[1]].id,
    hero_image_tertiary: media[imageRoles.hero[2]].id,
    intro_image_primary: media[imageRoles.intro[0]].id,
    intro_image_secondary: media[imageRoles.intro[1]].id,
    about_image_primary: media[imageRoles.about[0]].id,
    about_image_secondary: media[imageRoles.about[1]].id,
    inspiration_1: media[imageRoles.inspiration[0]].id,
    inspiration_2: media[imageRoles.inspiration[1]].id,
    inspiration_3: media[imageRoles.inspiration[2]].id,
    inspiration_4: media[imageRoles.inspiration[3]].id,
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.create({ data: { key, value } });
  }

  console.log("Seeded Hindu Vista demonstration content.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
