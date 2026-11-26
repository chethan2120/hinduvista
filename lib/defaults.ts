export const DEFAULT_SETTINGS: Record<string, string> = {
  brand_name: "Hindu Vista",
  hindi_name: "हिन्दुविस्टा",
  tagline: "City by city.",
  hero_eyebrow: "Travel in India",
  hero_title: "India, city by city.",
  hero_text:
    "Hindu Vista is a travel desk for people who want the place itself: a fort court, a river ghat, a palace at dusk. Begin with the cities, then send an enquiry.",
  hero_image: "",
  hero_image_secondary: "",
  hero_image_tertiary: "",
  intro_eyebrow: "The desk",
  intro_title: "A quieter way to choose a city.",
  intro_text:
    "Hindu Vista will help a traveller look at a city, read its principal places, and ask for a journey arranged around them. This introduction can be replaced from the dashboard. The monuments in the demonstration are drawn from public heritage sources. They are not a list of confirmed departures.",
  intro_image_primary: "",
  intro_image_secondary: "",
  cities_eyebrow: "The cities",
  cities_title: "Where a journey can begin.",
  cities_note:
    "Sample demonstration. These destinations show the website. They are not confirmed Hindu Vista tour offerings.",
  attractions_eyebrow: "Places",
  attractions_title: "A first look at the monuments.",
  why_eyebrow: "The practice",
  why_title: "How a journey starts here.",
  why_items: JSON.stringify([
    {
      title: "One city at a time",
      text: "Start with one city. Read the places that give it a shape, then move to the next.",
    },
    {
      title: "A sequence you can follow",
      text: "Sightseeing is arranged as a path you can read. The order is editorial. It is not a claim about driving times.",
    },
    {
      title: "An enquiry that is kept",
      text: "A message is stored for the desk. WhatsApp can open with the same details once a business number is added.",
    },
  ]),
  inspiration_eyebrow: "Frames",
  inspiration_title: "Light, stone and water.",
  inspiration_text:
    "Photographs from the demonstration collection. Each one is a real place, with the photographer and licence on the credits page.",
  inspiration_1: "",
  inspiration_2: "",
  inspiration_3: "",
  inspiration_4: "",
  enquiry_title: "Tell the desk where you want to go.",
  enquiry_text:
    "Your message is stored for Hindu Vista. If a WhatsApp number has been added in settings, you can also open a chat with these details already written.",
  about_eyebrow: "The company",
  about_title: "About Hindu Vista.",
  about_text:
    "Hindu Vista is the travel desk named on this website. A confirmed public listing, office address, registration and telephone number were not available when this demonstration was prepared. Replace this text with the introduction you want travellers to read.\n\nThe cities and monuments are sample destinations, researched from public heritage sources so the design can be judged with real places. Publishing a city here does not mean Hindu Vista currently operates a tour there.",
  about_image_primary: "",
  about_image_secondary: "",
  contact_eyebrow: "The desk",
  contact_title: "Contact.",
  contact_text:
    "Send an enquiry with the form. Phone, email, address and WhatsApp are shown here only after they have been confirmed and saved in the dashboard.",
  contact_email: "",
  contact_phone: "",
  contact_address: "",
  contact_hours: "",
  whatsapp_number: "",
  whatsapp_preface: "Hello Hindu Vista, I sent an enquiry through the website.",
  notification_email: "",
  footer_text:
    "Hindu Vista is a travel desk for reading a city before asking for a journey. This page is a demonstration: the cities and monuments are real places, shown so the design can be judged, and they are not a list of confirmed departures. A public telephone number, email address, and office will be printed here only after they are confirmed and saved. Until then, the enquiry form is the way to write to the desk.",
  seo_description:
    "Hindu Vista presents cities and tourist places across India, with sightseeing sequences and a desk for travel enquiries.",
  sample_notice:
    "Sample demonstration. These destinations show the website. They are not confirmed Hindu Vista tour offerings.",
};

export const HOMEPAGE_KEYS = [
  "hero_eyebrow",
  "hero_title",
  "hero_text",
  "hero_image",
  "hero_image_secondary",
  "hero_image_tertiary",
  "intro_eyebrow",
  "intro_title",
  "intro_text",
  "intro_image_primary",
  "intro_image_secondary",
  "cities_eyebrow",
  "cities_title",
  "cities_note",
  "attractions_eyebrow",
  "attractions_title",
  "why_eyebrow",
  "why_title",
  "why_items",
  "inspiration_eyebrow",
  "inspiration_title",
  "inspiration_text",
  "inspiration_1",
  "inspiration_2",
  "inspiration_3",
  "inspiration_4",
  "enquiry_title",
  "enquiry_text",
] as const;

export const ABOUT_KEYS = [
  "about_eyebrow",
  "about_title",
  "about_text",
  "about_image_primary",
  "about_image_secondary",
] as const;

export const SETTINGS_KEYS = [
  "brand_name",
  "hindi_name",
  "tagline",
  "contact_eyebrow",
  "contact_title",
  "contact_text",
  "contact_email",
  "contact_phone",
  "contact_address",
  "contact_hours",
  "whatsapp_number",
  "whatsapp_preface",
  "notification_email",
  "footer_text",
  "seo_description",
  "sample_notice",
] as const;

export const ALLOWED_SETTING_KEYS = new Set<string>([
  ...Object.keys(DEFAULT_SETTINGS),
]);

export type WhyItem = { title: string; text: string };

export function readWhyItems(raw: string | undefined): WhyItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as WhyItem[];
    if (!Array.isArray(data)) return [];
    return data
      .filter((item) => item && typeof item.title === "string" && typeof item.text === "string")
      .map((item) => ({ title: item.title.trim(), text: item.text.trim() }))
      .filter((item) => item.title && item.text);
  } catch {
    return [];
  }
}
