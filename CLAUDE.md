# Sedona Lehua — Project Instructions

Custom Shopify storefront for **Sedona Lehua**, a label selling unique dress
attire. This file overrides the global `~/Development/CLAUDE.md` where they
conflict.

For current project state and history, see [docs/PROJECT.md](docs/PROJECT.md).

---

## Stack

- **Hydrogen** — Shopify's official React framework (React Router 7), server
  entry in `server.ts`, runs on the Oxygen runtime.
- **TypeScript**.
- **Tailwind CSS v4** — styling lives in `app/styles/` (`tailwind.css`,
  `app.css`, `reset.css`). Prefer Tailwind utilities; keep custom CSS minimal.
- **Mock.shop** — the data source until a real Shopify store is connected.

## Data sources

- **Sanity** (project `cqoaq6cf`, dataset `production`, public read) — editorial
  content: hero video + layered images, statement, journal strip, about copy.
  Studio lives in `studio/` (its own package). Storefront reads it server-side via
  `app/lib/sanity.server.ts`; image URLs/srcsets via `app/lib/sanity.ts`.
- **Shopify** — products, cart, checkout. **Not purchased yet.**
- **Demo mode** (`app/lib/store-mode.ts`): while no real store is linked, Shop,
  PDP, home "Ready-to-Wear" and the cart run on `app/lib/demo-catalog.ts` (real
  shoot photos, placeholder names/prices) and a client-side cart
  (`components/DemoCart.tsx`). The original Shopify code paths are kept in the
  same routes (`ShopifyCatalog`, `ShopifyProduct`) for when the store is linked.

To connect the real store later:

```bash
npx shopify hydrogen link      # auth + select store, populates .env
npx shopify hydrogen env pull  # pull remaining env vars
```

Then restyle `ShopifyCatalog` / `ShopifyProduct` to match the demo components
and retire the demo catalog.

## Media pipeline

Raw shoot files go in `brief/assets/` (gitignored). Web versions go in
`brief/web/` and are uploaded to Sanity:

- Photos: `sips -Z 2600` → upload; Sanity's CDN serves AVIF/WebP at request size.
- Hero video: `scripts/encode-hero.sh` (needs ffmpeg) → ~3–4 MB silent H.264,
  16:9 desktop + 9:16 mobile + posters.
- Upload/seed: `cd studio && npm run seed` (home page) or
  `npx sanity exec scripts/upload-demo-assets.ts --with-user-token` (writes
  `app/data/demo-assets.json` for the demo catalog).

## Commands

```bash
npm run dev        # local dev server (use `-- --port 3001` if 3000 is taken)
npm run build      # production build
npm run preview    # build + preview on Oxygen runtime
npm run typecheck  # react-router typegen && tsc --noEmit
npm run lint       # eslint
npm run codegen    # regenerate GraphQL + route types

cd studio && npm run dev   # Sanity Studio at http://localhost:3333
```

GraphQL types are generated into `storefrontapi.generated.d.ts` and
`customer-accountapi.generated.d.ts` — do not edit by hand; run `npm run codegen`.

## Structure

- `app/routes/` — file-based routes (home, products, collections, cart, account,
  search, policies, blogs, sitemap, robots).
- `app/components/` — shared UI (Header, Footer, Cart*, Product*, Search*).
- `app/lib/` — context, session, fragments, search, variants helpers.
- `app/graphql/` — customer-account queries/mutations.
- `app/styles/` — Tailwind + base CSS.

## Design system

- Light, airy, editorial. Palette tokens in `app/styles/tailwind.css` (`shell`,
  `sand`, `linen`, `driftwood`, `ink`, `protea`, `seaglass`).
- Type: serif display + sans UI via `--font-serif` / `--font-sans`. Three
  pairings are loaded for review and switchable with the bottom-left
  `TypeSwitcher` (Riviera / Atelier / Journal). Once chosen, delete the switcher
  and the unused font imports.
- `reset.css` / `app.css` are wrapped in `@layer base` / `@layer components` so
  Tailwind utilities always win.
- Motion: GSAP + ScrollTrigger via `app/lib/gsap.ts` and `useGSAP`. Always wrap
  in `gsap.matchMedia()` with `MOTION.ok` / `MOTION.desktop` so reduced-motion
  users get static pages.

## Working notes

- `notes/`, `brief/`, `research/` are gitignored — internal context only.
- Do not commit `.env` or secrets.
