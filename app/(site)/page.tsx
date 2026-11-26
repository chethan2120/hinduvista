import type { Metadata } from "next";
import { CityScrollMap, type MapStop } from "@/components/site/city-scroll-map";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Eyebrow } from "@/components/site/markup";
import { Photo } from "@/components/site/photo";
import { PlaceCards, type PlaceCard } from "@/components/site/place-cards";
import { StorySlideshow } from "@/components/site/story-slideshow";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { Reveal } from "@/components/site/reveal";
import { readWhyItems } from "@/lib/defaults";
import { prisma } from "@/lib/prisma";
import { getSettings, resolvePicture } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { absolute: settings.brand_name },
    description: settings.seo_description,
    openGraph: {
      title: settings.brand_name,
      description: settings.seo_description,
    },
  };
}

export default async function HomePage() {
  const settings = await getSettings();
  const [hero, aboutOne, aboutTwo, introOne, introTwo, cities, leads] = await Promise.all([
    resolvePicture(settings.hero_image),
    resolvePicture(settings.about_image_primary),
    resolvePicture(settings.about_image_secondary),
    resolvePicture(settings.intro_image_primary),
    resolvePicture(settings.intro_image_secondary),
    prisma.city.findMany({
      where: { status: "published" },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    }),
    prisma.city.findMany({
      where: { status: "published" },
      orderBy: { displayOrder: "asc" },
      include: {
        attractions: {
          where: { status: "published" },
          orderBy: { displayOrder: "asc" },
          take: 1,
          include: { coverImage: true, category: true },
        },
      },
    }),
  ]);
  const why = readWhyItems(settings.why_items);
  const places = leads.flatMap((city) => city.attractions.map((attraction) => ({ city, attraction })));
  const aboutPhotos = [aboutOne || introOne, aboutTwo || introTwo].filter((image): image is NonNullable<typeof aboutOne> => Boolean(image?.url));

  return (
    <>
      <section id="top" className="bg-slatebrand text-ivory">
        <div className="relative min-h-[100svh] overflow-hidden">
          <Photo
            src={hero?.url}
            alt={hero?.alt || ""}
            priority
            sizes="100vw"
            className="hero-settle"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slatedeep/85 via-slatedeep/45 to-transparent" />
          <div className="relative mx-auto flex min-h-[100svh] max-w-page items-end px-5 py-16 md:px-10 md:py-24">
            <div className="max-w-2xl">
              <Eyebrow tone="light">{settings.hero_eyebrow}</Eyebrow>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] md:text-7xl">{settings.hero_title}</h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/85">{settings.hero_text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#cities" className="bg-gold px-5 py-3 text-sm text-slatedeep">
                  See the cities
                </a>
                <a href="#enquire" className="border border-ivory/50 px-5 py-3 text-sm hover:border-gold hover:text-gold">
                  Enquire now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-page px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Eyebrow>About us</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">{settings.about_title}</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-mute">
              <p>
                Hindu Vista is a travel desk for someone who wants the place itself: a fort court, a river ghat, a palace at dusk. You begin with one city, read the places that give it a shape, and ask for a journey arranged around them.
              </p>
              <p>
                The desk is named on this website. A confirmed public listing, office address, registration and telephone number were not available when this demonstration was prepared, so they are not printed here. Those details appear only after they are confirmed and saved.
              </p>
              <p>
                The cities and monuments are sample destinations, researched from public heritage sources so the design can be judged with real places. Publishing a city here does not mean Hindu Vista currently operates a tour there.
              </p>
              <p>
                The name on the mark is Hinduvista, with हिन्दुविस्टा beside it. The letters are VI, a gold ह, and TA, set in Playfair Display on Deep Slate and Warm White. Read the page from the city map, then the reason for the desk, then the enquiry.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {aboutPhotos.map((image) => (
              <figure key={image.id} className="relative min-h-72 overflow-hidden bg-slatebrand">
                <Photo src={image.urlMedium || image.url} alt={image.alt} sizes="(min-width: 1024px) 28vw, 50vw" />
              </figure>
            ))}
          </div>
        </div>
        <dl className="mt-12 grid gap-6 border-t border-line pt-8 md:grid-cols-3">
          <div>
            <dt className="font-serif text-xl">How a visit starts</dt>
            <dd className="mt-2 text-sm leading-relaxed text-mute">Choose a city on the map, read the place named at that stop, then send an enquiry if you want the desk to arrange around it.</dd>
          </div>
          <div>
            <dt className="font-serif text-xl">What is stored</dt>
            <dd className="mt-2 text-sm leading-relaxed text-mute">The form keeps your name, email, mobile number, the city you name, and your message. WhatsApp opens only after a business number is saved.</dd>
          </div>
          <div>
            <dt className="font-serif text-xl">What is still open</dt>
            <dd className="mt-2 text-sm leading-relaxed text-mute">A public address, registration, telephone and email are shown only after they are confirmed. The cities here are a demonstration, not a list of departures.</dd>
          </div>
        </dl>
      </section>

      <div id="cities">
      <CityScrollMap
        stops={mapStops(cities, places)}
        eyebrow={settings.cities_eyebrow}
        title={settings.cities_title}
        note={settings.cities_note}
      />
      </div>

      <section id="why" className="border-y border-line bg-ivory">
        <div className="mx-auto max-w-page px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Why us</Eyebrow>
              <h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">A desk for the place itself.</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-mute lg:col-span-8 lg:pt-10">
              <p>
                Hindu Vista is built for someone who wants to look at a city before asking for a journey. The map moves through Jaipur, Udaipur, Agra, Delhi, Varanasi and Mysuru. Each stop shows the place and a photograph. An enquiry is kept for the desk, and a reply is what confirms a journey.
              </p>
              <p>
                The monuments on this page are a demonstration drawn from public heritage sources. A photograph, a sequence, and a description can be changed from the desk. Nothing on the page states a price, a driving time, or a departure date.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {whyPhotos.map((photo) => (
              <figure key={photo.src} className="overflow-hidden bg-slatebrand">
                <img src={photo.src} alt={photo.alt} className="h-56 w-full object-cover" />
                <figcaption className="bg-white px-3 py-2 text-xs uppercase tracking-[0.16em] text-ink">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {why.map((item, index) => (
              <article key={item.title} className="border-t border-line pt-6">
                <p className="font-serif text-2xl text-goldink">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-serif text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{item.text}</p>
                {whyDetail[item.title] ? <p className="mt-3 text-sm leading-relaxed text-mute">{whyDetail[item.title]}</p> : null}
              </article>
            ))}
            <article className="border-t border-line pt-6">
              <p className="font-serif text-2xl text-goldink">04</p>
              <h3 className="mt-3 font-serif text-2xl">A credit for every photograph</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">
                The pictures are photographs of real places, kept on this site. The photographer and the licence for each one are listed on the credits page, so a picture is not presented as an invented view.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-page px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>{settings.attractions_eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">{settings.attractions_title}</h2>
        <div className="mt-12">
          <PlaceCards items={placeCards(places)} />
        </div>
      </section>

      <section id="frames" className="mx-auto max-w-page px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>{settings.inspiration_eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">{settings.inspiration_title}</h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mute">{settings.inspiration_text}</p>
        <div className="mt-8">
          <ZoomParallax images={frameImages} />
        </div>
      </section>

      <section id="stories" className="bg-slatebrand text-ivory">
        <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
          <Eyebrow tone="light">Testimonials</Eyebrow>
          <h2 className="mt-3 max-w-xl font-serif text-3xl font-semibold italic leading-tight md:text-4xl">Here is what our happy travellers want to tell.</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">
            Sample lines written for this demonstration. They are not reviews from people who have travelled with Hindu Vista.
          </p>
          <div className="mt-6">
            <StorySlideshow stories={stories} />
          </div>
        </div>
      </section>

      <section id="questions" className="mx-auto max-w-page px-5 py-20 md:px-10 md:py-28">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">Questions the page can answer.</h2>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {questions.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="cursor-pointer list-none font-serif text-2xl marker:content-none">
                <span className="flex items-start justify-between gap-6">
                  {item.q}
                  <span className="mt-2 h-px w-6 shrink-0 bg-gold transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="enquire" className="border-t border-line">
        <div className="mx-auto grid max-w-page gap-10 px-5 py-20 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>Enquiry</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl font-semibold">{settings.enquiry_title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mute">{settings.enquiry_text}</p>
          </div>
          <div className="lg:col-span-8">
            <EnquiryForm destinations={cities.map((city) => city.name)} />
          </div>
        </div>
      </section>
    </>
  );
}

const stories = [
  {
    place: "Jaipur",
    line: "The map settled on Amber Fort before I had to ask what the city was for.",
    image: "/images/attractions/jaipur-amber-fort-960.webp",
    alt: "Amber Fort in Jaipur",
    imageTwo: "/images/attractions/jaipur-hawa-mahal-960.webp",
    altTwo: "Hawa Mahal in Jaipur",
  },
  {
    place: "Udaipur",
    line: "The lake stayed on the page long enough for me to know this was the city I wanted to write about.",
    image: "/images/attractions/udaipur-lake-pichola-960.webp",
    alt: "Lake Pichola in Udaipur",
    imageTwo: "/images/attractions/udaipur-city-palace-960.webp",
    altTwo: "City Palace in Udaipur",
  },
  {
    place: "Varanasi",
    line: "I could read the ghat and the shrine, then write to the desk without a price appearing first.",
    image: "/images/attractions/varanasi-dashashwamedh-ghat-960.webp",
    alt: "Dashashwamedh Ghat in Varanasi",
    imageTwo: "/images/attractions/varanasi-kashi-vishwanath-960.webp",
    altTwo: "Kashi Vishwanath in Varanasi",
  },
  {
    place: "Agra",
    line: "One photograph of the riverfront was enough. I sent the enquiry the same evening.",
    image: "/images/attractions/agra-taj-mahal-960.webp",
    alt: "The Taj Mahal in Agra",
    imageTwo: "/images/attractions/agra-fort-960.webp",
    altTwo: "Agra Fort",
  },
  {
    place: "Mysuru",
    line: "One city stayed on the page long enough to decide whether to send a message.",
    image: "/images/attractions/mysuru-palace-960.webp",
    alt: "Amba Vilas Palace in Mysuru",
    imageTwo: "/images/attractions/mysuru-chamundi-hill-960.webp",
    altTwo: "Chamundi Hill in Mysuru",
  },
];

const whyPhotos = [
  { src: "/images/attractions/jaipur-amber-fort-960.webp", alt: "Amber Fort in Jaipur", caption: "Jaipur" },
  { src: "/images/attractions/udaipur-lake-pichola-960.webp", alt: "Lake Pichola in Udaipur", caption: "Udaipur" },
  { src: "/images/attractions/agra-taj-mahal-960.webp", alt: "The Taj Mahal in Agra", caption: "Agra" },
];

const questions = [
  {
    q: "Are these confirmed Hindu Vista tours?",
    a: "No. Jaipur, Udaipur, Agra, Delhi, Varanasi and Mysuru are sample destinations so the page can be judged with real places. A journey is confirmed only when the desk replies to an enquiry.",
  },
  {
    q: "How do I write to the desk?",
    a: "Use the enquiry form. It asks for your name, email, mobile number, the city you have in mind, and a message. That message is stored before anything else happens.",
  },
  {
    q: "Will the form open WhatsApp?",
    a: "Only after a confirmed business number has been saved. Until that number exists, the enquiry stays on the desk and a chat is not offered.",
  },
  {
    q: "Where is the office, and what is the telephone number?",
    a: "A public address, telephone and email are not printed yet. They appear only after they are confirmed. The form is the way to reach the desk in the meantime.",
  },
  {
    q: "Do the photographs invent the monuments?",
    a: "No. They are photographs of the places named on the page. The photographer and the licence for each picture are listed on the credits page.",
  },
];

const whyDetail: Record<string, string> = {
  "One city at a time":
    "The map opens on India with all six places marked. As you scroll it moves into one city, shows that city’s photograph, then pulls back before the next. Jaipur opens on Amber Fort.",
  "A sequence you can follow":
    "A city page joins its places from a start to an end. The desk can change that order. It is a way to read the city, not a timetable and not a distance.",
  "An enquiry that is kept":
    "You leave a name, an email, a mobile number, the city, and a message. The desk can mark that message new, contacted, or closed. A WhatsApp chat is offered only when a number has been added.",
};

const CITY_POINTS: Record<string, [number, number]> = {
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  agra: [27.1751, 78.0421],
  delhi: [28.6139, 77.209],
  varanasi: [25.3176, 82.9739],
  mysuru: [12.2958, 76.6394],
};

const frameImages = [
  { src: "/images/attractions/agra-taj-mahal.webp", alt: "The Taj Mahal in Agra" },
  { src: "/images/attractions/jaipur-hawa-mahal.webp", alt: "Hawa Mahal in Jaipur" },
  { src: "/images/attractions/mysuru-palace.webp", alt: "Amba Vilas Palace in Mysuru" },
  { src: "/images/attractions/delhi-india-gate.webp", alt: "India Gate in Delhi" },
  { src: "/images/attractions/jaipur-amber-fort.webp", alt: "Amber Fort in Jaipur" },
  { src: "/images/attractions/varanasi-dashashwamedh-ghat.webp", alt: "Dashashwamedh Ghat in Varanasi" },
  { src: "/images/attractions/udaipur-lake-pichola.webp", alt: "Lake Pichola in Udaipur" },
];

function quickPhoto(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("/images/") && url.endsWith(".webp") && !url.endsWith("-960.webp")) {
    return url.replace(/\.webp$/, "-960.webp");
  }
  return url;
}

const placeIcons: Record<string, PlaceCard["icon"]> = {
  "amber-fort": "castle",
  "city-palace": "building",
  "agra-fort": "landmark",
  "qutb-minar": "tower",
  "kashi-vishwanath": "landmark",
  "chamundi-hill": "mountain",
};

function placeCards(
  places: {
    city: { slug: string; name: string };
    attraction: { id: string; slug: string; name: string; shortDescription: string; coverImage?: { url: string; alt: string } | null };
  }[],
): PlaceCard[] {
  return places.flatMap(({ city, attraction }) => {
    if (!attraction.coverImage?.url) return [];
    return [
      {
        id: attraction.id,
        title: attraction.name,
        description: `${city.name}. ${attraction.shortDescription}`,
        imgSrc: quickPhoto(attraction.coverImage.url),
        linkHref: `/cities/${city.slug}/attractions/${attraction.slug}`,
        icon: placeIcons[attraction.slug] || "landmark",
        imageClassName: attraction.slug === "qutb-minar" ? "object-contain object-bottom" : "object-center",
      },
    ];
  });
}

function mapStops(
  cities: { slug: string; name: string; state: string; region: string; shortDescription: string }[],
  places: {
    city: { slug: string };
    attraction: { slug: string; name: string; coverImage?: { url: string; alt: string } | null };
  }[],
): MapStop[] {
  const leads = new Map(places.map((place) => [place.city.slug, place.attraction]));
  return cities.flatMap((city) => {
    const point = CITY_POINTS[city.slug];
    if (!point) return [];
    const place = leads.get(city.slug);
    return [
      {
        slug: city.slug,
        name: city.name,
        state: city.state,
        region: city.region,
        shortDescription: city.shortDescription,
        lat: point[0],
        lng: point[1],
        placeName: place?.name || city.name,
        placeHref: place ? `/cities/${city.slug}/attractions/${place.slug}` : `/cities/${city.slug}`,
        imageUrl: quickPhoto(place?.coverImage?.url),
        imageAlt: place?.coverImage?.alt || place?.name || city.name,
      },
    ];
  });
}
