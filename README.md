# Frazer Raiser

A Next.js 16 + Convex app for showcasing and privately managing the restoration of a 1948 Frazer.

## Stack
- Next.js 16 (App Router, RSC, Server Actions)
- Convex (DB, queries/mutations)
- UploadThing (image upload)
- WorkOS (Auth)
- PostHog (Analytics)
- Tailwind CSS v4 + ShadCN UI

## Local development
1. Install deps
   - `npm i` (or `bun install`)
2. Copy `.env.example` to `.env.local` and set values (see Env Vars)
3. Start Convex dev: `npx convex dev`
4. Run app: `npm run dev`

## Environment variables
Server:
- `NODE_ENV`
- `WORKOS_CLIENT_ID`
- `WORKOS_API_KEY`
- `WORKOS_COOKIE_PASSWORD` (32 characters, used for session cookie encryption)
- `CONVEX_DEPLOYMENT`
- `UPLOADTHING_TOKEN`

Client:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST` (e.g. `https://us.i.posthog.com`)

## Deployment
### Vercel
1. Import the repo to Vercel
2. Set all env vars from above in Vercel Project Settings
3. Configure domains
4. Deploy

### Convex
1. Create a Convex project and production deployment
2. Set `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in Vercel
3. Deploy functions using Convex dashboard or `npx convex deploy`

### WorkOS
1. Create a WorkOS project (Client ID/API Key)
2. Configure redirect URIs (absolute):
   - Local: `http://localhost:3000/api/auth/workos`
   - Prod: `https://<your-domain>/api/auth/workos`
3. Add allowed origins for your Vercel domain
4. Set `WORKOS_COOKIE_PASSWORD` to a 32-character random string

### UploadThing
1. Create an app and token
2. Set `UPLOADTHING_TOKEN` in Vercel

### PostHog
1. Create a project, copy the public key and host
2. Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Theming
Tailwind CSS variables (OKLCH) define a dark theme with a deep maroon primary and subtle chrome accents. See `src/styles/globals.css`.
