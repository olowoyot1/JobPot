# OAATZ CONSULT LTD — Placement Marketplace

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
git commit -m "Initial commit — OAATZ Consult marketplace"
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
- **Admin user management**: there's a single admin login via env vars, not a
  multi-admin system with roles.
- **Emails**: no confirmation or notification emails are sent yet.
- **Rate limiting / abuse protection**: not implemented — add before public launch.

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
