# Hindu Vista testing report

Date: 26 November 2026. The checks below were run against a production build (`npm run build`, then `npm start` on http://localhost:3000) with the seeded SQLite database.

## Build

- `npx prisma db push` created `prisma/dev.db`.
- `npm run db:seed` loaded 6 cities, 20 attractions, sightseeing sequences, media records, and settings.
- `npm run build` (Next.js 15.5.29) completed with exit code 0. Type checking passed as part of that build.
- The server log stayed clear of application errors during the browser session.

## Public site

Checked in the browser and with HTTP requests.

- Homepage renders the wordmark, navigation (Home, Explore Cities, About, Contact, Enquire), Taj Mahal hero, introduction, six stacked city frames, attraction links, and the enquiry form.
- City frames are large landscape blocks, one under another. Jaipur, Udaipur, Agra, Delhi, Varanasi, and Mysuru are linked to `/cities/[slug]`.
- `/cities/jaipur` shows the city hero, sample notice, best time, travel note, two sequence tabs, and a connected path: starting point, attraction nodes, end of sightseeing.
- Clicking Amber Fort opened `/cities/jaipur/attractions/amber-fort` with the fort photograph, location, and enquiry link.
- At a 375px layout width the desktop navigation is replaced by an Open menu button. Opening it exposes Home, Explore Cities, About, Contact, and Enquire.
- Unauthenticated `GET /admin` returns 307 to `/admin/login`.
- Invalid enquiry JSON (`not-an-email`) returns HTTP 400 with “Enter a valid email address.”

## Enquiry

A real form submission was saved: name Meera Sharma, destination Jaipur, status new, timestamp 26 Nov 2026, 2:28 pm (Asia/Kolkata). The page then showed “Enquiry received” and the note that WhatsApp stays hidden until a business number is saved. The dashboard status control was changed to contacted and the select read `contacted` afterwards. That test row was deleted after the check so the desk does not open with a fake customer.

## Dashboard

Signed in as `admin@hinduvista.local`.

- Overview showed 6 published cities, 20 published attractions, 1 enquiry (before the test row was removed), and 0 drafts. Counts came from the database.
- A published city named Hampi was added from the form. It appeared in Manage Cities and on `/cities` without a code change. `/cities/hampi` returned 200. Delete removed it. `/cities/hampi` then returned 404.
- Sightseeing: Amber Fort was moved below City Palace and saved. The public Jaipur page then listed City Palace, Amber Fort, Jantar Mantar, Hawa Mahal. The original order was saved again and the public page returned to Amber Fort first.

## Photographs

Twenty Commons photographs, each with a 960px WebP copy (40 files). Qutb Minar is `File:Qutb Minar 2011.jpg`. Udaipur City Palace is `File:City Palace Udaipur Rajasthan India.JPG`. The Itimad-ud-Daulah image is a verified interior, and the alt text says so. No image-generation model was used.

## Not exercised in this session

- Uploading a new photograph through the media form.
- Creating or deleting an attraction from the form (seeded attractions and their pages were loaded).
- Saving homepage, about, settings, or profile forms.
- A live WhatsApp chat, because no business number is configured.
- SMTP delivery, because no mail credentials are configured.
- Layouts at 320px, 768px, 1024px, and 1440px as separate screenshot passes. Desktop was the wide browser window (about 2074px CSS pixels before phone emulation). Phone layout was checked at 375px.
