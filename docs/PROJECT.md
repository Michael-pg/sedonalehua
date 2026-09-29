# Sedona Lehua — Project State

Living log of where this project is and how it got here. Update this file as the
project moves between phases.

## What this is

A custom Shopify storefront for **Sedona Lehua**, a label selling unique dress
attire. Built as a Hydrogen (React) app so the design is fully ownable, running
against Mock.shop until a real Shopify store is purchased and connected.

## Current phase

**Design — first full pass in review.** Home, Shop, PDP, About and cart are
built on real shoot imagery (Sanity) with a demo catalog, for review with
Sedona before Shopify is connected.

## Status snapshot

| Area | State |
|------|-------|
| Architecture | Hydrogen + Oxygen (decided) |
| Codebase | Scaffolded: TypeScript, Tailwind v4, full route set |
| Data source | Sanity (editorial) + demo catalog (products) |
| Runs locally | Yes — `npm run dev`; production build verified |
| Brand / design | First pass; type pairing undecided (3 options live) |
| Shopify account | Not purchased |
| Hosting / deploy | Not deployed (target: Oxygen) |
| Git | Initialized, first commit |

## Decision log

- **2026-07-12 — Architecture: Hydrogen + Oxygen.** Chose a custom React app over
  a Liquid theme (design ownership) and over headless Next.js/Vercel (avoids a
  second host and hand-built commerce plumbing). Oxygen hosting is free.
- **2026-07-12 — Mock-first.** Build against Mock.shop now; connect the real store
  later via `npx shopify hydrogen link`. No structural change required.
- **2026-07-12 — Reset from prior brainstorm.** An earlier homepage-layout
  brainstorm (editorial-hero A/B/C options) was set aside to start from a proper
  foundation. Revisit that exploration during the design phase.

- **2026-09-28 — Brand name: Sedona Lehua.**
- **2026-09-28 — Sanity for editorial, Shopify for products.** Sanity holds the
  hero video, lookbook imagery and copy; products stay in Shopify. Mux skipped
  for now — one short hero loop served as an MP4 from Sanity's CDN is enough.
- **2026-09-28 — Demo catalog.** Pages show the real pieces with placeholder
  names/prices until Shopify is linked, rather than Mock.shop's generic stock.
- **2026-09-28 — Homepage direction B-ish:** video hero with layered hibiscus +
  cliffs, Ready-to-Wear row, editorial statement, horizontal journal strip,
  split about section.

## Next steps

1. **Review with Sedona** — pick a type pairing; real product names, prices,
   copy (placeholders are marked in `demo-catalog.ts` and Sanity).
2. **Share a preview** — decide hosting for review links (see Hosting below).
3. **Remaining pages** — search, account, policies, 404 still use skeleton markup.
4. **More product photos** — Sedona is shooting more pieces. Add them to
   `demo-catalog.ts` and the home `featured` list; the home "Shop all" tile
   hides itself once the row count is a multiple of 3.
5. **Connect Shopify** — `npx shopify hydrogen link`, restyle the Shopify code
   paths to match the demo components, deploy to Oxygen.

## Hosting

Production target is **Oxygen** (Shopify's host, free with a plan). Demo mode
now runs in production builds too, so a preview can be deployed before launch.

## Reference

- Scaffold design spec: `docs/superpowers/specs/2026-07-12-sedona-hydrogen-scaffold-design.md`
- Project instructions / stack details: `CLAUDE.md`
