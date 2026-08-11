# Mr. Sniff's — Web

Storefront for the **Mr. Sniff's** incense brand.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18
- TypeScript
- Shopify Storefront API (product data / cart)
- Fonts via `next/font/google`: Big Shoulders Display, Space Mono, Inter

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in your Shopify credentials
npm run dev
```

Open http://localhost:3000.

### Environment variables

See `.env.local.example`:

- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — lint with `eslint-config-next`

## Deployment

Deploys to [Vercel](https://vercel.com/) from GitHub. Push to the connected
repository and Vercel builds/deploys automatically. Set the environment
variables above in the Vercel project settings.

## Status

This is a structure-only scaffold. Pages and components are stubs; design
tokens (`styles/tokens.css`) are intentionally empty and built in a later step.
