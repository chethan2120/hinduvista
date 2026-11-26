import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(2, "Add a slug.")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens.");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter the admin email."),
  password: z.string().min(1, "Enter the password."),
});

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(80),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  mobile: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .pipe(
      z
        .string()
        .regex(/^(\+91)?[6-9]\d{9}$|^\+[1-9]\d{7,14}$/, "Enter a valid mobile number, including country code if it is not an Indian number."),
    ),
  destination: z.string().trim().min(2, "Tell us which city or destination interests you.").max(140),
  message: z.string().trim().min(10, "Please write a short message.").max(2000),
  company: z.string().optional().default(""),
});

export const citySchema = z.object({
  name: z.string().trim().min(2, "Enter the city name.").max(80),
  slug,
  state: z.string().trim().min(2, "Enter the state.").max(80),
  region: z.string().trim().min(2, "Enter the region.").max(80),
  shortDescription: z.string().trim().min(10, "Add a short introduction.").max(360),
  fullDescription: z.string().trim().min(20, "Add the city overview.").max(8000),
  bestTimeToVisit: z.string().trim().max(2000).optional().default(""),
  travelInfo: z.string().trim().max(4000).optional().default(""),
  featured: z.boolean().optional().default(false),
  status: z.enum(["draft", "published"]),
  displayOrder: z.coerce.number().int().min(0).max(999),
  isSample: z.boolean().optional().default(false),
  heroImageId: z.string().trim().optional().nullable(),
  galleryIds: z.array(z.string()).optional().default([]),
});

export const attractionSchema = z.object({
  cityId: z.string().min(1, "Choose a city."),
  categoryId: z.string().trim().optional().nullable(),
  name: z.string().trim().min(2, "Enter the attraction name.").max(120),
  slug,
  shortDescription: z.string().trim().min(10, "Add a short description.").max(360),
  description: z.string().trim().min(20, "Add the description.").max(8000),
  location: z.string().trim().max(240).optional().default(""),
  historicalInfo: z.string().trim().max(8000).optional().default(""),
  visitorInfo: z.string().trim().max(4000).optional().default(""),
  duration: z.string().trim().max(120).optional().default(""),
  status: z.enum(["draft", "published"]),
  displayOrder: z.coerce.number().int().min(0).max(999),
  isSample: z.boolean().optional().default(false),
  coverImageId: z.string().trim().optional().nullable(),
  galleryIds: z.array(z.string()).optional().default([]),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(40),
  slug,
});

export const routeSchema = z.object({
  cityId: z.string().min(1, "Choose a city."),
  name: z.string().trim().min(2, "Name this sightseeing sequence.").max(120),
  description: z.string().trim().max(2000).optional().default(""),
  status: z.enum(["draft", "published"]),
  displayOrder: z.coerce.number().int().min(0).max(999).optional().default(0),
  attractionIds: z.array(z.string().min(1)).min(1, "Add at least one attraction."),
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email("Enter a valid email."),
  currentPassword: z.string().min(1, "Enter your current password."),
  newPassword: z.string().max(100).optional().default(""),
});

export const settingsSchema = z.object({
  values: z.record(z.string(), z.string().max(20000)),
});
