# Sedona Fashion — Hydrogen Scaffold Design

**Date:** 2026-07-12
**Status:** Implemented
**Phase:** Foundation (scaffold only — no branding or design yet)

## What we're building

A custom Shopify storefront for **Sedona Fashion**, a label selling unique dress
attire. The site is a fully custom React app (not a Liquid theme) so the look and
feel can be designed from scratch later.

## Decision: Hydrogen + Oxygen

We evaluated three ways to connect a custom site to Shopify:

1. **Hydrogen + Oxygen** (chosen) — Shopify's official React framework (built on
   React Router 7), hosted free on Shopify's Oxygen edge network. Native cart and
   checkout, full custom design surface, React stack.
2. **Liquid theme (OS 2.0)** — cheapest and lowest-maintenance, but not a React
   codebase and design is constrained by the theme system. Rejected because the
   point of the project is a distinctly designed, owned codebase.
3. **Headless + Next.js on Vercel** — max flexibility but adds a second hosting
   bill and requires hand-building commerce plumbing. Rejected as over-engineered
   for a boutique storefront.

Hydrogen and Liquid cost the same in dollars (Oxygen hosting is free); the
trade-off was maintenance vs. design ownership. We chose design ownership.

## Key constraint: build now, connect later

Shopify has **not** been purchased yet. The scaffold runs against **Mock.shop** —
a Storefront-API-compatible mock — so the site renders realistic products with no
credentials. Connecting a real store later is a single command
(`npx shopify hydrogen link`), which populates `PUBLIC_STORE_DOMAIN` and
`PUBLIC_STOREFRONT_API_TOKEN` in `.env`. No structural change is required.

## Stack

- **Hydrogen** (React Router 7, `server.ts` entry, Oxygen runtime)
- **TypeScript**
- **Tailwind CSS v4**
- **Mock.shop** data source (default when no store domain is set)
- **git** initialized at project root

## What the scaffold includes

Full standard route set, all wired to Mock.shop and verified rendering:
home, products (`/products/:handle`), collections, cart, account, search,
policies, blogs, pages, plus `robots.txt` and `sitemap.xml`.

## Explicitly out of scope for this phase

- Brand identity, typography, color, and visual design
- Homepage layout (the A/B/C editorial-hero exploration is a separate step)
- Any real product data or Shopify account setup

## Verification

- `npm run build` → server bundle built successfully.
- `npm run dev` → homepage returns HTTP 200 and renders the "Recommended
  Products" section from Mock.shop; `/collections` returns 200.

## Next steps

1. Brand direction + homepage layout (revisit the editorial-hero exploration).
2. Design system: tokens, typography, components — replacing the default skeleton
   styling.
3. When Shopify is purchased: `npx shopify hydrogen link` to connect the real
   store, then deploy to Oxygen.
