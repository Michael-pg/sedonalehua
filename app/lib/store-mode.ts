/**
 * Demo mode = no real Shopify store linked yet. Pages render the demo catalog
 * (app/lib/demo-catalog.ts) and a client-side cart instead of Shopify data.
 * Linking a store (`npx shopify hydrogen link`) switches everything to live.
 */
export const MOCK_SHOP_DOMAIN = 'mock.shop';

export function isDemoStore(env: {PUBLIC_STORE_DOMAIN?: string}) {
  return (
    !env.PUBLIC_STORE_DOMAIN ||
    env.PUBLIC_STORE_DOMAIN.includes(MOCK_SHOP_DOMAIN)
  );
}
