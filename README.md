# Hindu Vista

A travel website and desk for Hindu Vista: public city pages, a connected sightseeing sequence, enquiries with optional WhatsApp, and an admin dashboard that writes to a database.

Demonstration cities are sample content. They are not confirmed Hindu Vista tours. Business contact details stay blank until they are entered in the dashboard.

## Requirements

- Node.js 20 or newer
- npm

## Run it locally

```bash
npm install
npx prisma generate
npm run images
npx prisma db push
npm run db:seed
npm run dev
```

Open <http://localhost:3000>.

The desk is at <http://localhost:3000/admin>.

Copy `.env.example` to `.env` first if you do not already have one. The repository’s local `.env` is gitignored.

### Local demonstration login

This password is for the local demonstration only. Change it in Profile before any public deployment.

- Email: `admin@gmial.com`
- Password: `demo123`

`npm run db:seed` creates that administrator if the email does not exist. It does not reset the password if you have already changed it. Seeding does replace cities, attractions, sequences, photographs in the library, and website text. Enquiries already stored are kept.

## What the desk can edit

- Cities, including photographs, order, and draft or published
- Attractions and categories
- Sightseeing sequences: order, several sequences per city, draft or published
- Media uploads, search, and deletion when a file is unused
- Enquiries, marked new, contacted, or closed
- Homepage, about, contact introduction, and website settings
- The administrator’s name, email, and password

A published city appears on the homepage without a code change. Its attractions appear on the city page and in any sequence that includes them.

## WhatsApp and email

WhatsApp uses the official `https://wa.me/` link. The number is the `whatsapp_number` setting: digits only, with the country code, for example `91` followed by the mobile number. It is blank until a real number is saved. The enquiry is stored before the visitor is offered WhatsApp.

Enquiry email is sent only when all of these are set:

```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
```

and a notification email is saved in Website settings. Until then, enquiries are still stored in the dashboard.

## Photographs

`npm run images` downloads verified Wikimedia Commons photographs and writes:

- files in `public/images/`
- `data/image-manifest.json`
- `docs/image-manifest.md`

Credits are on `/credits`. See `docs/hindu-vista-research.md` for what was and was not verified about the company.

## Database

The local database is SQLite at `prisma/dev.db`, through Prisma. The schema is in `prisma/schema.prisma`. A SQL snapshot is in `prisma/migrations/202611260000_init/migration.sql` after setup.

The browser never receives a database password. Admin routes check the signed session cookie, and the server checks the session again before writing.

SQLite is the right fit for this demonstration and for a single Node server with a persistent disk. It is a poor fit for a host that wipes the filesystem on every deploy. For that, point `DATABASE_URL` at PostgreSQL and change the Prisma datasource provider to `postgresql`, then run `npx prisma db push` or a migration against that database. The models use ordinary relations and do not depend on SQLite-only column types.

Uploaded images live in `public/uploads`. That folder also has to persist.

## Deploy

1. Use Node 20+ on a host with a persistent disk.
2. Set `DATABASE_URL`, `AUTH_SECRET` (a long random string), `NEXT_PUBLIC_SITE_URL`, and the admin variables. Do not commit `.env`.
3. Change the admin password immediately.
4. `npm install`
5. `npx prisma generate`
6. `npx prisma db push`
7. `npm run db:seed` only if you want the sample cities. Skip it on a site that already has real content.
8. `npm run build`
9. `npm start`

Add the WhatsApp number, public contact details, Hindi wordmark, and logo when the client confirms them. Remove or unpublish sample cities before launch if they are not real offerings.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local site |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run images` | Download the Commons photograph set |
| `npm run db:seed` | Load sample content |
| `npx prisma db push` | Apply the schema to the database |
