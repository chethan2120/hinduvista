const routeNote =
  "This is an editorial sequence for reading the city. It is not a measured walking or driving route, and it does not state distances or travel times.";

const visitorMonument =
  "Opening rules, fees and weekly closures are published by the Archaeological Survey of India or the site authority and change. Confirm the current notice before a visit. This demonstration does not quote ticket prices.";

const visitorTemple =
  "Temple timings, dress guidance and photography rules are set by the temple administration and change for festivals. Confirm them locally. This demonstration does not quote a clock time or a fee.";

const northSeason =
  "October to March is the usual season for walking between monuments in this part of northern India. Summers are very hot. Carry the forecast for the week of travel. This is general seasonal guidance, not a Hindu Vista operating calendar.";

export type DemoAttraction = {
  key: string;
  image: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  location: string;
  historicalInfo: string;
  visitorInfo: string;
};

export type DemoRoute = {
  name: string;
  description: string;
  keys: string[];
};

export type DemoCity = {
  name: string;
  slug: string;
  state: string;
  region: string;
  cover: string;
  shortDescription: string;
  fullDescription: string;
  bestTimeToVisit: string;
  travelInfo: string;
  attractions: DemoAttraction[];
  routes: DemoRoute[];
};

export const demoCities: DemoCity[] = [
  {
    name: "Jaipur",
    slug: "jaipur",
    state: "Rajasthan",
    region: "Eastern Rajasthan",
    cover: "jaipur-hawa",
    shortDescription:
      "The planned pink city of the Kachwaha court, with palace facades, a hill fort and an open-air observatory.",
    fullDescription:
      "Jaipur was founded in 1727 by Maharaja Sawai Jai Singh II as a planned capital. The old city is known for its coloured facades, bazaars and palace courts.\n\nThis demonstration gathers four documented places so the website can be reviewed with a real city. It is sample content, not a confirmed Hindu Vista departure.",
    bestTimeToVisit: northSeason,
    travelInfo:
      "Jaipur's principal monuments are looked after by different authorities, including the Archaeological Survey of India and palace trusts. Confirm tickets, cameras and weekly closures with the site that manages each place. This page does not quote fares or travel times between them.",
    attractions: [
      {
        key: "amber",
        image: "jaipur-amber",
        name: "Amber Fort",
        slug: "amber-fort",
        category: "Heritage",
        shortDescription: "A Rajput fort-palace above Maota Lake, part of the Hill Forts of Rajasthan.",
        description:
          "Amer Fort, also called Amber Fort, stands above Maota Lake on the northern edge of Jaipur. Palace courts were developed here by the Kachwaha rulers, with major building through the sixteenth and seventeenth centuries.",
        location: "Amer, Jaipur, Rajasthan",
        historicalInfo:
          "The fort is part of the Hill Forts of Rajasthan, inscribed on the UNESCO World Heritage List in 2013. The sequence on this website is for reading the city. It is not a measured approach to the fort.",
        visitorInfo: visitorMonument,
      },
      {
        key: "palace",
        image: "jaipur-palace",
        name: "City Palace",
        slug: "city-palace",
        category: "Heritage",
        shortDescription: "Palace courts in the old city, still connected with the Jaipur royal house.",
        description:
          "The City Palace stands in the heart of the old city planned by Sawai Jai Singh II. Courtyards, gates and the Chandra Mahal belong to a complex that still has a connection with the Jaipur royal family. Parts are open to visitors as courtyards and museums.",
        location: "Old City, Jaipur, Rajasthan",
        historicalInfo:
          "The palace grew with the city from the eighteenth century. Access to private apartments and museum rooms changes, so the public route through the complex should be confirmed on the day.",
        visitorInfo: visitorMonument,
      },
      {
        key: "jantar",
        image: "jaipur-jantar",
        name: "Jantar Mantar",
        slug: "jantar-mantar",
        category: "Heritage",
        shortDescription: "An early eighteenth-century observatory of monumental masonry instruments.",
        description:
          "The Jantar Mantar in Jaipur is an astronomical observatory built in the early eighteenth century for Sawai Jai Singh II. UNESCO describes a set of about twenty main fixed instruments, made for observing the sky with the naked eye, and calls this the most complete and best preserved of India's historic observatories.",
        location: "Near the City Palace, Jaipur, Rajasthan",
        historicalInfo:
          "The observatory was inscribed on the UNESCO World Heritage List in 2010. Several instruments are among the largest of their kind. The site is protected as a monument of national importance.",
        visitorInfo: visitorMonument,
      },
      {
        key: "hawa",
        image: "jaipur-hawa",
        name: "Hawa Mahal",
        slug: "hawa-mahal",
        category: "Architecture",
        shortDescription: "The Palace of Winds, a five-storey facade of screened windows above the bazaar.",
        description:
          "The Hawa Mahal, the Palace of Winds, was built in 1799 for Maharaja Sawai Pratap Singh. Its street face rises five storeys in a honeycomb of small screened windows, the jharokhas, so the city could be seen while the viewer remained unseen.",
        location: "Badi Chaupar, Old City, Jaipur",
        historicalInfo:
          "The palace is as much a facade as a residence: the famous elevation faces the street, and the rooms behind it are comparatively shallow. It is one of the images most often used for Jaipur, which is why the demonstration uses a photograph of that eastern front.",
        visitorInfo: visitorMonument,
      },
    ],
    routes: [
      {
        name: "Fort, palace and observatory",
        description: routeNote,
        keys: ["amber", "palace", "jantar", "hawa"],
      },
      {
        name: "The old city",
        description: `A shorter reading of the palace quarter. ${routeNote}`,
        keys: ["hawa", "palace", "jantar"],
      },
    ],
  },
  {
    name: "Udaipur",
    slug: "udaipur",
    state: "Rajasthan",
    region: "Mewar",
    cover: "udaipur-palace",
    shortDescription: "The lake city of Mewar, with palace buildings along Pichola and an island court in the water.",
    fullDescription:
      "Udaipur was founded in 1559 by Maharana Udai Singh II after the Mewar court left Chittorgarh. The city is arranged around artificial lakes, with palace buildings along the water.\n\nThe three places here are a sample of that lakeside setting. They are not a confirmed Hindu Vista itinerary.",
    bestTimeToVisit: northSeason,
    travelInfo:
      "Boat access on Lake Pichola and entry to palace museums are managed locally and change with the season and the water level. This page does not quote a crossing time or a fare.",
    attractions: [
      {
        key: "palace",
        image: "udaipur-palace",
        name: "City Palace",
        slug: "city-palace",
        category: "Heritage",
        shortDescription: "A long palace complex along the eastern side of Lake Pichola.",
        description:
          "The City Palace of Udaipur spreads along Lake Pichola. Maharana Udai Singh II began the complex in the sixteenth century, and later Maharanas continued to add courts. Parts of the palace are a museum, and parts remain with the Mewar family.",
        location: "Lake Pichola, Udaipur, Rajasthan",
        historicalInfo:
          "The complex is a sequence of palaces, courtyards and gates rather than a single building. Which rooms are open to visitors should be confirmed with the palace on the day.",
        visitorInfo: visitorMonument,
      },
      {
        key: "pichola",
        image: "udaipur-pichola",
        name: "Lake Pichola",
        slug: "lake-pichola",
        category: "Nature",
        shortDescription: "The artificial lake that holds Udaipur's island palaces.",
        description:
          "Lake Pichola is an artificial lake in the centre of Udaipur, enlarged under the rulers of Mewar. Island buildings in the water include Jag Mandir and the Lake Palace. The lake is as much a part of the city's architecture as the palaces on its edge.",
        location: "Udaipur, Rajasthan",
        historicalInfo:
          "The lake is generally dated to the fourteenth century and was enlarged after Udaipur became the Mewar capital. Water levels change with the rains, and they change what can be seen and boarded.",
        visitorInfo:
          "Boating is arranged by local operators under the rules in force at the time. This demonstration does not name a jetty, a duration or a price.",
      },
      {
        key: "jagmandir",
        image: "udaipur-jagmandir",
        name: "Jag Mandir",
        slug: "jag-mandir",
        category: "Heritage",
        shortDescription: "An island palace in Lake Pichola, associated with the Mewar court.",
        description:
          "Jag Mandir is an island palace in Lake Pichola. The Gul Mahal on the island is associated with the years when Prince Khurram, later the emperor Shah Jahan, took refuge at the Mewar court.",
        location: "Lake Pichola, Udaipur, Rajasthan",
        historicalInfo:
          "The island was developed by the Maharanas of Mewar in the seventeenth century. Landing depends on the boat rules and the level of the lake.",
        visitorInfo:
          "Treat the island as a place that may be seen from the water or visited when landing is permitted. No crossing time is stated here.",
      },
    ],
    routes: [
      {
        name: "Palace and lake",
        description: routeNote,
        keys: ["palace", "pichola", "jagmandir"],
      },
    ],
  },
  {
    name: "Agra",
    slug: "agra",
    state: "Uttar Pradesh",
    region: "Western Uttar Pradesh",
    cover: "agra-taj",
    shortDescription: "The Mughal capital on the Yamuna, with the Taj Mahal and the red fort beside its gardens.",
    fullDescription:
      "Agra was a capital of the Mughal empire, and the riverbank still holds two of its World Heritage monuments: the Taj Mahal and Agra Fort. A third marble tomb, Itimad-ud-Daulah, stands nearby.\n\nThese notes are sample demonstration content prepared from UNESCO and other public heritage descriptions. They are not a Hindu Vista package.",
    bestTimeToVisit: northSeason,
    travelInfo:
      "The Taj Mahal and Agra Fort are in the care of the Archaeological Survey of India. Entry rules, including which days the mausoleum is closed, are published by the ASI and should be read before travel. Fares are not quoted on this page.",
    attractions: [
      {
        key: "fort",
        image: "agra-fort",
        name: "Agra Fort",
        slug: "agra-fort",
        category: "Historical",
        shortDescription: "A red-sandstone Mughal fort enclosing palaces and audience halls.",
        description:
          "UNESCO describes Agra Fort as an important Mughal monument near the gardens of the Taj Mahal: a red-sandstone fortress whose enclosure walls run for about 2.5 kilometres, holding palaces such as the Jahangiri Mahal and the Khas Mahal, audience halls, and two mosques.",
        location: "Agra, Uttar Pradesh, on the Yamuna near the Taj Mahal",
        historicalInfo:
          "The fort served the Mughal court from Akbar's reign onward, with major palace buildings added for Shah Jahan. It is a UNESCO World Heritage Site, listed separately from the Taj Mahal.",
        visitorInfo: visitorMonument,
      },
      {
        key: "itimad",
        image: "agra-itimad",
        name: "Itimad-ud-Daulah",
        slug: "itimad-ud-daulah",
        category: "Architecture",
        shortDescription: "The marble tomb of Mirza Ghiyas Beg, commissioned by Nur Jahan.",
        description:
          "The tomb of Mirza Ghiyas Beg, titled Itimad-ud-Daulah, was commissioned by his daughter Nur Jahan in the early seventeenth century. Its marble inlay is widely discussed alongside the later work at the Taj Mahal.",
        location: "Beside the Yamuna, Agra, Uttar Pradesh",
        historicalInfo:
          "Visitors sometimes call the tomb the Baby Taj. That is a nickname, not the building's name. The monument commemorates Mirza Ghiyas Beg, father of Nur Jahan and grandfather of Mumtaz Mahal.",
        visitorInfo: visitorMonument,
      },
      {
        key: "taj",
        image: "agra-taj",
        name: "Taj Mahal",
        slug: "taj-mahal",
        category: "Heritage",
        shortDescription: "The white-marble mausoleum built by Shah Jahan for Mumtaz Mahal.",
        description:
          "The Taj Mahal is a white-marble mausoleum on the bank of the Yamuna in Agra, built by order of the Mughal emperor Shah Jahan in memory of Mumtaz Mahal. UNESCO records the mausoleum as under construction from 1631 and completed in 1648, with the mosque, guest house and main gateway finished by 1653, and names Ustad Ahmad Lahori as the main architect.",
        location: "Eastern Agra, on the bank of the Yamuna, Uttar Pradesh",
        historicalInfo:
          "The tomb stands at the end of a charbagh rather than in its centre, a placement UNESCO notes for the depth it gives the view. The cenotaphs on the upper level mark the graves in the chamber below. The complex has been a World Heritage Site since 1983.",
        visitorInfo: visitorMonument,
      },
    ],
    routes: [
      {
        name: "Fort, tomb and the Taj",
        description: routeNote,
        keys: ["fort", "itimad", "taj"],
      },
    ],
  },
  {
    name: "Delhi",
    slug: "delhi",
    state: "Delhi",
    region: "National Capital Territory",
    cover: "delhi-red-fort",
    shortDescription: "Four monuments that mark the Sultanate, the Mughal court and the imperial capital.",
    fullDescription:
      "Delhi holds several cities in one. The places on this page belong to different centuries: the Qutb complex of the Delhi Sultanate, Humayun's garden tomb, Shah Jahan's Red Fort, and the war memorial Edwin Lutyens placed at the end of the ceremonial axis.\n\nThey are shown as sample destinations. Hindu Vista has not confirmed them as tour offerings.",
    bestTimeToVisit: northSeason,
    travelInfo:
      "Three of these monuments are UNESCO sites in the care of the Archaeological Survey of India. India Gate sits in the civic landscape of New Delhi. Check the current entry notice for each protected monument. Distances between them are not stated here.",
    attractions: [
      {
        key: "qutb",
        image: "delhi-qutb",
        name: "Qutb Minar",
        slug: "qutb-minar",
        category: "Heritage",
        shortDescription: "The sandstone minaret of the Qutb complex, begun in the late twelfth century.",
        description:
          "The Qutb Minar is a tapering sandstone minaret in Mehrauli. Construction began under Qutb-ud-Din Aibak in the late twelfth century and was continued by later sultans of Delhi. The same complex holds the Quwwat-ul-Islam mosque and the iron pillar.",
        location: "Mehrauli, Delhi",
        historicalInfo:
          "The Qutb complex is a UNESCO World Heritage Site. The minaret was extended and repaired over several reigns after Aibak. It is a monument of the Delhi Sultanate, earlier than the Mughal tombs and forts elsewhere in the city.",
        visitorInfo: visitorMonument,
      },
      {
        key: "humayun",
        image: "delhi-humayun",
        name: "Humayun's Tomb",
        slug: "humayuns-tomb",
        category: "Heritage",
        shortDescription: "A garden tomb commissioned for the emperor Humayun by Bega Begum.",
        description:
          "Humayun's Tomb was commissioned by his widow, Bega Begum, and completed in 1570. The architect associated with the tomb is Mirak Mirza Ghiyas. The building sits in a charbagh, a form later Mughal mausoleums, including the Taj Mahal, continued.",
        location: "Nizamuddin, Delhi",
        historicalInfo:
          "UNESCO inscribed the tomb in 1993. It is the first of the great Mughal garden tombs in Delhi and a direct ancestor, in type, of the Taj Mahal.",
        visitorInfo: visitorMonument,
      },
      {
        key: "redfort",
        image: "delhi-red-fort",
        name: "Red Fort",
        slug: "red-fort",
        category: "Historical",
        shortDescription: "Shah Jahan's palace-citadel in Shahjahanabad.",
        description:
          "The Red Fort was the palace-citadel of Shah Jahan's new city of Shahjahanabad, built in the mid-seventeenth century of red sandstone and marble. Audience halls, private palaces and a mosque stand inside the walls.",
        location: "Shahjahanabad, Delhi",
        historicalInfo:
          "The fort is a UNESCO World Heritage Site. It remained a centre of Mughal authority and, later, a symbol in the city's public life: the Independence Day address is delivered from its ramparts.",
        visitorInfo: visitorMonument,
      },
      {
        key: "indiagate",
        image: "delhi-india-gate",
        name: "India Gate",
        slug: "india-gate",
        category: "Historical",
        shortDescription: "Edwin Lutyens's war memorial at the end of the ceremonial axis.",
        description:
          "India Gate was designed by Edwin Lutyens as the All India War Memorial and inaugurated in 1931. It commemorates Indian soldiers who died in the First World War and the Third Anglo-Afghan War. Their names are inscribed on the monument.",
        location: "Kartavya Path, New Delhi",
        historicalInfo:
          "The memorial belongs to the imperial capital planned by Lutyens and Herbert Baker. This page does not repeat casualty figures. The names on the stone are the record.",
        visitorInfo:
          "The memorial stands in a public landscape. Gatherings and access around it are managed by the civic authorities and can change. There is no ticket price to quote here.",
      },
    ],
    routes: [
      {
        name: "Four centuries of the capital",
        description: routeNote,
        keys: ["qutb", "humayun", "redfort", "indiagate"],
      },
    ],
  },
  {
    name: "Varanasi",
    slug: "varanasi",
    state: "Uttar Pradesh",
    region: "Eastern Uttar Pradesh",
    cover: "varanasi-ghat",
    shortDescription: "A living pilgrimage city on the Ganga, with riverfront ghats and the shrine of Kashi Vishwanath.",
    fullDescription:
      "Varanasi, also called Kashi and Banaras, stands on the Ganga in eastern Uttar Pradesh and is one of India's principal pilgrimage cities.\n\nThis page presents the Vishwanath temple, Sarnath, and Dashashwamedh Ghat. The notes are sample text from public religious and archaeological descriptions. They are not a confirmed Hindu Vista departure, and they do not set ritual instructions.",
    bestTimeToVisit:
      "October to March is the most comfortable season on the riverfront. Festivals change the character of the ghats, so confirm dates locally. This is seasonal guidance, not an operating calendar.",
    travelInfo:
      "The ghats, the temple and the archaeological site at Sarnath are managed by different authorities. Boat landings, darshan arrangements and monument tickets should be confirmed with those authorities. This page does not quote a fare or a procession time.",
    attractions: [
      {
        key: "kashi",
        image: "varanasi-kashi",
        name: "Kashi Vishwanath",
        slug: "kashi-vishwanath",
        category: "Spiritual",
        shortDescription: "A Jyotirlinga shrine of Shiva in the old city, reached by a riverside corridor.",
        description:
          "Kashi Vishwanath is among the twelve Jyotirlinga shrines of Shiva. The temple in the old city is associated with the rebuilding commissioned by Ahilyabai Holkar of Indore in 1780. A broad corridor now leads between the river and the temple.",
        location: "Old city, Varanasi, Uttar Pradesh",
        historicalInfo:
          "The shrine's sanctity is much older than the present building. Earlier temples on the site were destroyed and rebuilt over several centuries. The photograph used here is of the temple's outer approach. It is not a picture of the sanctum.",
        visitorInfo: visitorTemple,
      },
      {
        key: "sarnath",
        image: "varanasi-sarnath",
        name: "Sarnath",
        slug: "sarnath",
        category: "Historical",
        shortDescription: "The deer park of the Buddha's first sermon, marked by the Dhamek Stupa.",
        description:
          "Sarnath, on the outskirts of Varanasi, is identified by Buddhist tradition as the deer park where the Buddha gave his first sermon. The Dhamek Stupa is the great stupa on the archaeological site.",
        location: "Sarnath, Varanasi district, Uttar Pradesh",
        historicalInfo:
          "The lion capital excavated at Sarnath, now the national emblem of India, is kept in the site museum. The brick stupa and the excavated monasteries remain on the ground. The page does not give a distance from the ghats.",
        visitorInfo: visitorMonument,
      },
      {
        key: "ghat",
        image: "varanasi-ghat",
        name: "Dashashwamedh Ghat",
        slug: "dashashwamedh-ghat",
        category: "Cultural",
        shortDescription: "A principal bathing ghat, and the setting of the evening Ganga aarti.",
        description:
          "Dashashwamedh is one of the principal bathing ghats on the Varanasi riverfront. An evening Ganga aarti is performed here. The steps meet the river, and the life of the ghat changes between morning bathing and the evening ceremony.",
        location: "Riverfront, Varanasi, Uttar Pradesh",
        historicalInfo:
          "The ghat's name is tied to a tradition of a sacrifice performed here. Whatever the age of that story, the ghat as travellers see it is a working riverfront, not a closed monument.",
        visitorInfo:
          "The aarti is organised locally and its timing shifts. This page deliberately does not print a clock time. Photography of rituals should follow the guidance of the people conducting them.",
      },
    ],
    routes: [
      {
        name: "Temple, Sarnath and the river",
        description: routeNote,
        keys: ["kashi", "sarnath", "ghat"],
      },
    ],
  },
  {
    name: "Mysuru",
    slug: "mysuru",
    state: "Karnataka",
    region: "Southern Karnataka",
    cover: "mysuru-palace",
    shortDescription: "The Wodeyar capital, known for Amba Vilas Palace and the temple hill above the city.",
    fullDescription:
      "Mysuru was the capital of the Wodeyar kingdom and remains one of southern India's most legible royal cities. The palace, the hill temple of the royal goddess, and a neo-Gothic cathedral give three different readings of the same place.\n\nThis is sample demonstration content, not a statement that Hindu Vista operates a Mysuru tour.",
    bestTimeToVisit:
      "October to March is generally pleasant. Mysuru Dasara, usually in October, is the city's major festival, and the palace is illuminated for it. Confirm the year's dates before planning around the festival.",
    travelInfo:
      "The palace publishes its own opening days and illumination schedule. The temple on Chamundi Hill and the cathedral keep separate timings. None of those times are copied onto this page, because they change.",
    attractions: [
      {
        key: "chamundi",
        image: "mysuru-chamundi",
        name: "Chamundi Hill",
        slug: "chamundi-hill",
        category: "Spiritual",
        shortDescription: "The hilltop temple of Chamundeshwari, tutelary goddess of the Wodeyar house.",
        description:
          "Chamundi Hill overlooks Mysuru and carries the temple of Chamundeshwari, the tutelary goddess of the Wodeyar royal house. A road and a stepped path both reach the temple.",
        location: "Chamundi Hill, Mysuru, Karnataka",
        historicalInfo:
          "The goddess and the hill are bound to the identity of the Mysuru court. The temple has been renovated over time. This page does not state a step count or a driving time.",
        visitorInfo: visitorTemple,
      },
      {
        key: "philomena",
        image: "mysuru-philomena",
        name: "St. Philomena's Cathedral",
        slug: "st-philomena",
        category: "Architecture",
        shortDescription: "A neo-Gothic cathedral recognised by its tall spires.",
        description:
          "St. Philomena's Cathedral is a neo-Gothic Catholic church in Mysuru, recognised in the city by its tall spires. It belongs to the twentieth-century landscape of Mysuru, alongside the rebuilt palace.",
        location: "Ashoka Road, Mysuru, Karnataka",
        historicalInfo:
          "The church was built in the twentieth century for the city's Catholic community. Service times belong to the parish and are not reproduced here.",
        visitorInfo:
          "Visitors are guests of a working church. Follow the parish notice on entry, photography and services. No Mass time is printed on this demonstration page.",
      },
      {
        key: "palace",
        image: "mysuru-palace",
        name: "Mysore Palace",
        slug: "mysore-palace",
        category: "Architecture",
        shortDescription: "Amba Vilas Palace, the Indo-Saracenic seat of the Wodeyars.",
        description:
          "Amba Vilas, the Mysore Palace, is the seat of the Wodeyar dynasty. The palace visitors see today was built in the early twentieth century after fire destroyed its predecessor. Henry Irwin was the architect, working in an Indo-Saracenic manner. During Mysuru Dasara the facade is illuminated.",
        location: "Mysuru, Karnataka",
        historicalInfo:
          "The Wodeyars ruled Mysuru for centuries. The present building is a twentieth-century replacement of an older palace, which is why its domes and ceremonial rooms look as they do. Weekly closure and the illumination schedule should be taken from the palace, not from this page.",
        visitorInfo: visitorMonument,
      },
    ],
    routes: [
      {
        name: "Hill, church and palace",
        description: routeNote,
        keys: ["chamundi", "philomena", "palace"],
      },
    ],
  },
];

export const imageRoles = {
  hero: ["agra-taj", "udaipur-pichola", "varanasi-ghat"],
  intro: ["jaipur-hawa", "jaipur-amber"],
  about: ["delhi-humayun", "jaipur-jantar"],
  inspiration: ["mysuru-palace", "delhi-qutb", "agra-taj", "delhi-india-gate"],
};
