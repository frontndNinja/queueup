# QueueUp

QueueUp is a Next.js App Router project for shared watch queues (movies/series), with:

- NextAuth (`next-auth` v4) + Google login
- Prisma ORM + PostgreSQL
- Tailwind CSS v4
- Server-side auth/permission checks for protected routes

---

## Requirements

- Node `>= 20.9` (project has been run on Node 21)
- `pnpm`
- A PostgreSQL database (local, Neon, etc.)

---

## Install and Run

```bash
pnpm install
pnpm dev
```

App runs on:

- `http://localhost:3000` (or next free port)

---

## Environment Variables

Create `.env` in project root.

Minimum required vars:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-long-random-secret"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Notes:

- `.env` is now the default/shared env file for this project.
- `.env.local` can still be used as a local override for Next.js if needed.
- Prisma CLI reads `.env` by default, so `dotenv -e` is usually not required anymore.

---

## Authentication Notes

- Auth config: `lib/auth.ts`
- Route handler: `app/api/auth/[...nextauth]/route.ts`
- Session strategy: JWT
- `session.user.id` is populated via callbacks

Current redirect behavior in auth callback:

- Login default -> `/dashboard`
- Logout callback (`/api/auth/logout` or `/?signedOut=1`) -> `/`

---

## Prisma Workflow

Schema file:

- `prisma/schema.prisma`

Seed file:

- `prisma/seed.ts`

Script:

- `pnpm prisma:seed` runs `tsx prisma/seed.ts`

### 1) Validate schema

```bash
pnpm prisma validate
```

### 2) Generate Prisma Client

```bash
pnpm prisma generate
```

### 3) Apply database changes

Create migration (recommended):

```bash
pnpm prisma migrate dev --name <change-name>
```

Apply existing migrations (prod-style):

```bash
pnpm prisma migrate deploy
```

Quick sync without migration files:

```bash
pnpm prisma db push
```

### 4) Seed data

```bash
pnpm prisma:seed
```

### 5) Inspect DB

```bash
pnpm prisma studio
```

---

## Common Dev Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm -s tsc --noEmit
```

---

## Google OAuth Setup (Quick)

1. Create OAuth Web App in Google Cloud
2. Add redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env` (or `.env.local` if you prefer local override)
4. Restart dev server

---

## Deploy (Vercel)

Set these env vars in Vercel project settings (Production/Preview as needed):

- `DATABASE_URL`
- `NEXTAUTH_URL` (your deployed domain)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Important:

- Redeploy after changing Vercel env vars.
- If you see `[next-auth][error][NO_SECRET]`, `NEXTAUTH_SECRET` is missing in that environment scope or deployment needs redeploy.
