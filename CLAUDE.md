# Sedona Fashion — Project Instructions

Custom Shopify storefront for **Sedona Fashion**, a label selling unique dress
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

## Data source: Mock.shop now, real store later

Shopify is **not purchased yet**. The app runs against Mock.shop automatically
because `PUBLIC_STORE_DOMAIN` is unset in `.env`. The `MockShopNotice` component
renders a banner while mocked.

To connect the real store later (no code changes needed):

```bash
npx shopify hydrogen link      # auth + select store, populates .env
npx shopify hydrogen env pull  # pull remaining env vars
```

This sets `PUBLIC_STORE_DOMAIN` and `PUBLIC_STOREFRONT_API_TOKEN`; the app then
serves live products instead of mocks.

## Commands

```bash
npm run dev        # local dev server at http://localhost:3000 (with codegen)
npm run build      # production build
npm run preview    # build + preview on Oxygen runtime
npm run typecheck  # react-router typegen && tsc --noEmit
npm run lint       # eslint
npm run codegen    # regenerate GraphQL + route types
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

## Design principles (this project)

Global design principles in `~/Development/CLAUDE.md` apply: intentional
minimalism, strong typographic hierarchy, systematic spacing, avoid generic
card-grid defaults. Brand direction is **not yet defined** — do not invent a
visual identity. When design work starts, read `docs/PROJECT.md` and any
`brief/` material first.

## Working notes

- The scaffold is deliberately unstyled beyond the Hydrogen skeleton. Visual
  design is a later, separate phase.
- `notes/`, `brief/`, `research/` are gitignored — internal context only.
- Do not commit `.env` or secrets.
