# OAATZ COSULT LTD — Placement Marketplace

A Next.js 15 app where candidates create an account, browse destination countries,
and buy placement packages — with an admin dashboard to manage countries, packages,
and orders.

## Stack

- **Next.js 15** (App Router, Server Actions)
- **Prisma + PostgreSQL** (works with Vercel Postgres, Neon, or Supabase)
- **jose** for JWT sessions, **bcryptjs** for password hashing
- **Tailwind CSS** for styling
- No third-party auth or payment provider wired up yet — see "What's not real yet" below.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://..."       # from Neon / Supabase / Vercel Postgres
SESSION_SECRET="..."                  # openssl rand -base64 32
ADMIN_SESSION_SECRET="..."            # openssl rand -base64 32
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="a-strong-password"
```

Push the schema and seed the 44 starter destinations:

```bash
npm run db:push
npm run db:seed
```

Run it:

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login (uses `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## 2. Get a free Postgres database

Pick one (all have free tiers and give you a `DATABASE_URL`):

- **Vercel Postgres** — Vercel dashboard → Storage → Create Database → Postgres
- **Neon** — neon.tech → New Project → copy the connection string
- **Supabase** — supabase.com → New Project → Settings → Database → Connection string

Use the **pooled/connection-pooling** URL if offered (better for serverless).

## 3. Push to GitHub

```bash
cd oaatz-portal
git init
git add .
git commit -m "Initial commit — OAATZ Cosult marketplace"
```

Create an empty repo on GitHub (no README/license, so there's no merge conflict), then:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## 4. Deploy to Vercel

1. Go to vercel.com → **Add New → Project** → import the GitHub repo you just pushed.
2. Framework preset: Next.js (auto-detected).
3. Under **Environment Variables**, add the same five values from your `.env`:
   `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. Click **Deploy**.

Vercel runs `npm install` (which triggers `prisma generate` via `postinstall`), then `next build`.

### First-time database setup on the live database

No terminal needed for this. The `build` script now runs `prisma db push` and the
seed script automatically on every deploy (the seed script checks if data already
exists and skips itself after the first run, so it's safe to run on every build).

As long as `DATABASE_URL` is set in your Vercel project's environment variables
before the build runs, Vercel will create the tables and load the 44 starter
destinations for you automatically the first time it deploys successfully.

If you connected a database via the Storage tab *after* your first deploy, just
trigger a redeploy (Deployments → ⋯ → Redeploy) once `DATABASE_URL` exists — the
next build will create the tables and seed the data.

### Redeploys

Every `git push` to `main` triggers a new Vercel deployment automatically once the
GitHub integration is connected.

## What's not real yet

- **Payments**: the buy flow creates an order with status `pending` — no card is charged.
  Wire up Stripe, Paystack, or Flutterwave in `actions/orders.js` (`createOrder`) before
  taking real payments.
- **Emails**: no confirmation or notification emails are sent yet.
- **Rate limiting / abuse protection**: not implemented — add before public launch.

## Features

- **Candidates**: signup/login, browse destinations, buy packages (optionally tied to a
  batch), upload documents (passport, CV, certificates, photo), track order status.
- **Admin** (`/admin`, env-var login): full control — destinations, packages, batches
  (slot pools), orders, staff accounts, affiliate oversight & commission payouts.
- **Staff** (`/staff`, DB-backed accounts created by admin): can view/update orders and
  review/approve applicant documents — cannot edit destinations, packages, or prices.
- **Affiliates** (`/affiliate/signup`, self-service): get a unique referral link
  (`/signup?ref=CODE`), see referred candidates and their application stage, and track
  commission earned/pending/paid on every order their referrals place.
- **Batches**: an admin-managed slot pool per destination (e.g. "January 2027 Intake —
  50 slots"). Candidates can optionally pick an open batch when buying a package; the
  system prevents buying into a full or closed batch.
- **Homepage content management** (`/admin/content` + `/admin/settings`): the homepage
  above the stats bar and marketplace grid is built from an ordered list of editable
  blocks — hero banner, "how it works" steps, rich text, call-to-action banner, image +
  text, or raw HTML. Add, reorder (↑/↓), hide, edit, or delete sections freely — no code
  changes or redeploys needed. `/admin/settings` controls the site name, tagline, footer
  text, and contact details shown in the header/footer everywhere. The stats bar
  (destination/vacancy counts) and the marketplace grid itself stay as fixed sections
  since they're generated from live data rather than editable text.

## Extra setup: document uploads (Vercel Blob)

Document uploads need a file storage bucket. Vercel Blob is the simplest option since
you're already on Vercel:

1. Vercel → your project → **Storage** tab → **Create Database** → choose **Blob**
2. Name it, create it, **Connect** to your project
3. This auto-injects `BLOB_READ_WRITE_TOKEN` into your project's environment variables
4. For local development, copy that token's value into your local `.env` as well

If this isn't set up yet, document uploads will show an error message rather than
crashing the app — everything else works fine without it.

## Project structure

```
app/                  routes (App Router)
  page.js             homepage + marketplace grid
  signup/, login/      candidate auth pages
  account/            candidate dashboard (protected)
  destinations/[id]/   packages for a country + buy button
  admin/              admin dashboard (protected)
    countries/         list, add, edit destinations + their packages
    orders/            view & update order status
actions/              Server Actions (mutations: auth, countries, packages, orders)
lib/                  Prisma client, JWT helpers, password hashing, session lookups
prisma/schema.prisma  Country, Package, User, Order models
prisma/seed.js        seeds the 44 starter destinations
middleware.js         protects /admin and /account routes
```
