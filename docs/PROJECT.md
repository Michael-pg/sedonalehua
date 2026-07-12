# Sedona Fashion — Project State

Living log of where this project is and how it got here. Update this file as the
project moves between phases.

## What this is

A custom Shopify storefront for **Sedona Fashion**, a label selling unique dress
attire. Built as a Hydrogen (React) app so the design is fully ownable, running
against Mock.shop until a real Shopify store is purchased and connected.

## Current phase

**Foundation — scaffold complete.** The app runs, is verified against Mock.shop,
and is ready to (a) receive brand/design work and (b) connect to a real store
when one exists.

## Status snapshot

| Area | State |
|------|-------|
| Architecture | Hydrogen + Oxygen (decided) |
| Codebase | Scaffolded: TypeScript, Tailwind v4, full route set |
| Data source | Mock.shop (no real store yet) |
| Runs locally | Yes — `npm run dev`, homepage 200 from Mock.shop |
| Brand / design | Not started |
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

## Next steps

1. **Brand direction** — identity, typography, color, tone for a dress-attire
   label. Revisit the editorial-hero (A/B/C) homepage exploration.
2. **Design system** — tokens, type ramp, components; replace skeleton styling.
3. **Homepage + product/collection design** — real layouts on the Hydrogen routes.
4. **Connect Shopify** — when purchased: `npx shopify hydrogen link`, then deploy
   to Oxygen.

## Reference

- Scaffold design spec: `docs/superpowers/specs/2026-07-12-sedona-hydrogen-scaffold-design.md`
- Project instructions / stack details: `CLAUDE.md`
