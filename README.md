# NMT India Holidays — Tours & Travel Website

A modern, fast, SEO-friendly tours & travel website with a self-service admin
panel. Built with **Next.js 16 (App Router)**, **Payload CMS 3**, **Tailwind CSS v4**
and **TypeScript**.

## Features

- 🧭 **Admin panel** (`/admin`) to add/edit tours, packages, destinations, blog posts,
  testimonials and site settings — no code needed.
- 🗺️ **Drag-to-reorder day-wise itinerary** per tour.
- 📱 **Fully responsive** mobile-first design.
- 💬 **Per-tour WhatsApp enquiry** (pre-filled message) + site-wide floating WhatsApp button.
- 📝 **Contact & enquiry forms** — every submission is stored in the admin (Leads → Enquiries)
  and optionally emailed via Resend. No lead is lost.
- 🔎 **Tour search & filters** (destination, theme, duration, budget).
- ⭐ Testimonials, blog, destination landing pages.
- 🚀 **SEO**: per-page metadata, `sitemap.xml`, `robots.txt`, and JSON-LD structured data.
- 🌐 **Multi-language** (English, हिन्दी, मराठी, ಕನ್ನಡ) — cookie-based switcher; UI via
  next-intl and CMS content via Payload localization (translate any field per-locale in admin).
- 📊 Optional Google Analytics 4.

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19                |
| CMS / Admin    | Payload CMS 3 (embedded in the same app)          |
| Styling        | Tailwind CSS v4                                    |
| Database       | SQLite locally · Postgres (Neon/Supabase) in prod |
| Email          | Resend (optional)                                 |
| Deployment     | Vercel                                            |

## Getting started (local)

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env
#   - PAYLOAD_SECRET is required (any long random string)
#   - Leave DATABASE_URI BLANK to use a local SQLite file (zero setup)

# 3. Seed sample content (optional but recommended for a populated demo)
npm run seed

# 4. Run the dev server
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (the **first visit prompts you to create an admin user**)

## Importing the real NMT catalogue

The legacy site (nmtindiaholidays.com) is a client-rendered SPA. A headless-browser
scraper pulls its tours and contact details:

```bash
npx playwright install chromium   # one-time
npm run scrape                    # writes scripts/output/nmt-content.json
npm run scrape -- --import        # also imports tours as DRAFTS + sets contact info
```

Imported tours land as **drafts** — review, add itinerary/pricing/images, then publish in the admin.

## Demo mode (no database required)

For a quick prototype/demo without any database, the public site can render a
built-in **static demo dataset** (`src/lib/demoData.ts`) — a full home page,
destinations, and clickable tour/itinerary pages.

- **Local:** run `DEMO_MODE=true npm run dev` (PowerShell: `$env:DEMO_MODE="true"; npm run dev`).
- **On Vercel:** demo mode turns on **automatically** when no `DATABASE_URI` is set.
  To force it explicitly, add an env var `DEMO_MODE=true` in
  **Vercel → Settings → Environment Variables**, then redeploy.
- To go live with real data later, connect a database (`DATABASE_URI`) and either
  remove `DEMO_MODE` or set `DEMO_MODE=false`. Real DB content then takes over
  automatically (demo is only a fallback).

## The database adapter switch

`src/payload.config.ts` chooses the adapter from `DATABASE_URI`:

- **blank** → SQLite file `nmt.db` (great for local dev, zero config)
- **`postgres://…`** → Postgres adapter (Neon/Supabase) for production

## Deploying to Vercel + Neon

1. Create a free Postgres database at [neon.tech](https://neon.tech) and copy the connection string.
2. Push this repo to GitHub and import it into [Vercel](https://vercel.com).
3. Set environment variables in Vercel (see `.env.example`):
   - `PAYLOAD_SECRET`, `DATABASE_URI` (the Neon `postgres://…` URL), `NEXT_PUBLIC_SITE_URL`
   - Optional: `RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL`, `NEXT_PUBLIC_GA_ID`
4. Deploy. Visit `/admin` on the deployed URL to create your admin user.

> **Media/images:** uploads are stored on the local filesystem by default. On Vercel
> (ephemeral filesystem) configure persistent storage — e.g. the `@payloadcms/storage-vercel-blob`
> or `@payloadcms/storage-s3` adapter — before going live. See `docs` in `payload.config.ts`.

## Project structure

```
src/
  app/(frontend)/        # public website (home, tours, destinations, blog, about, contact)
  app/(payload)/         # Payload admin (auto-generated)
  app/actions/           # server actions (enquiry/contact form)
  collections/           # Tours, Destinations, Testimonials, BlogPosts, Enquiries, Media, Users
  globals/               # SiteSettings (contact, WhatsApp, hero)
  components/            # UI: Hero, TourCard, ItineraryTimeline, WhatsApp, forms, …
  lib/                   # queries, payload client, whatsapp, media helpers
scripts/                 # seed.ts, scrape-nmt.ts, screenshot.ts
```

## Useful scripts

| Command                   | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start the dev server                     |
| `npm run build` / `start` | Production build / serve                 |
| `npm run seed`            | Seed sample destinations/tours           |
| `npm run scrape`          | Scrape the legacy site to JSON           |
| `npx tsx scripts/update-brand.ts` | Apply real brand + contact details, upload logo |
| `npx tsx scripts/translate.ts`    | Machine-translate key CMS fields (hi/mr/kn) |
| `npm run generate:types`  | Regenerate Payload TypeScript types      |

## Languages / i18n

- UI strings live in `messages/{en,hi,mr,kn}.json` (next-intl, cookie-based — no URL change).
- The header language switcher sets a `NEXT_LOCALE` cookie and re-renders.
- CMS content is localized in Payload: open any tour/destination in `/admin` and switch
  the locale selector at the top to translate its fields. `scripts/translate.ts` seeds the
  most visible fields (destination names, tour titles, tagline); other fields fall back to
  English until translated.
