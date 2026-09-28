/**
 * Vercel Edge adapter for the Hydrogen (Oxygen) worker bundle.
 *
 * Hydrogen builds a standard `export default {fetch(request, env, ctx)}`
 * worker. This wraps it in Vercel's Edge Function signature. Used for
 * review/preview deploys only — production is meant for Oxygen.
 */
import worker from '../dist/server/index.js';

// Hydrogen opens a Cache API instance for sub-request caching. Vercel Edge
// doesn't provide one, so fall back to a no-op cache.
if (!globalThis.caches) {
  const noop = {
    match: async () => undefined,
    put: async () => {},
    delete: async () => false,
  };
  globalThis.caches = {open: async () => noop};
}

// Sanity's HTTP client builds `new DOMException(...)` for request timeouts, but
// DOMException isn't constructible on Vercel Edge. Provide a minimal stand-in.
try {
  new DOMException('probe', 'AbortError');
} catch {
  globalThis.DOMException = class DOMException extends Error {
    constructor(message = '', name = 'Error') {
      super(message);
      this.name = name;
    }
  };
}

const ENV_KEYS = [
  'SESSION_SECRET',
  'PUBLIC_STORE_DOMAIN',
  'PUBLIC_STOREFRONT_API_TOKEN',
  'PRIVATE_STOREFRONT_API_TOKEN',
  'PUBLIC_STOREFRONT_ID',
  'PUBLIC_CHECKOUT_DOMAIN',
  'PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID',
  'SHOP_ID',
];

export default async function handler(request, context) {
  const env = {};
  for (const key of ENV_KEYS) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }
  return worker.fetch(request, env, {
    waitUntil: (promise) => context?.waitUntil?.(promise),
    passThroughOnException() {},
  });
}
