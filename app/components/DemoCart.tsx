import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {formatPrice, getDemoProduct} from '~/lib/demo-catalog';
import {imageProps} from '~/lib/sanity';

/**
 * Client-side cart for the demo catalog. Replaced by Hydrogen's cart
 * (CartMain / CartForm) once Shopify is connected.
 */
export interface DemoLine {
  handle: string;
  size: string;
  quantity: number;
}

interface DemoCartValue {
  lines: DemoLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<DemoLine, 'quantity'>) => void;
  update: (handle: string, size: string, quantity: number) => void;
}

const DemoCartContext = createContext<DemoCartValue | null>(null);
const STORAGE_KEY = 'sl-demo-cart';

export function DemoCartProvider({children}: {children: ReactNode}) {
  const [lines, setLines] = useState<DemoLine[]>([]);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLines(JSON.parse(saved) as DemoLine[]);
    } catch {
      // storage unavailable — start empty
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    // Don't overwrite the saved bag with the empty initial state.
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines, restored]);

  const value = useMemo<DemoCartValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce(
      (sum, l) => sum + (getDemoProduct(l.handle)?.price ?? 0) * l.quantity,
      0,
    );
    return {
      lines,
      count,
      subtotal,
      add: ({handle, size}) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.handle === handle && l.size === size);
          return hit
            ? prev.map((l) =>
                l === hit ? {...l, quantity: l.quantity + 1} : l,
              )
            : [...prev, {handle, size, quantity: 1}];
        }),
      update: (handle, size, quantity) =>
        setLines((prev) =>
          prev
            .map((l) =>
              l.handle === handle && l.size === size ? {...l, quantity} : l,
            )
            .filter((l) => l.quantity > 0),
        ),
    };
  }, [lines]);

  return (
    <DemoCartContext.Provider value={value}>
      {children}
    </DemoCartContext.Provider>
  );
}

export function useDemoCart() {
  const ctx = useContext(DemoCartContext);
  if (!ctx) throw new Error('useDemoCart must be used inside DemoCartProvider');
  return ctx;
}

export function DemoCartContents() {
  const {lines, subtotal, update} = useDemoCart();
  const {close} = useAside();

  if (!lines.length) {
    return (
      <div className="flex h-full flex-col items-start gap-6 px-6 py-10">
        <p className="font-display text-3xl">Your bag is empty.</p>
        <Link
          to="/collections/all"
          onClick={close}
          className="text-eyebrow border-b border-current pb-1"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 divide-y divide-linen overflow-y-auto px-6">
        {lines.map((line) => {
          const product = getDemoProduct(line.handle);
          if (!product) return null;
          return (
            <li key={`${line.handle}-${line.size}`} className="flex gap-4 py-5">
              <Link
                to={`/products/${product.handle}`}
                onClick={close}
                className="w-20 shrink-0"
              >
                <img
                  alt={product.images[0].alt ?? ''}
                  {...imageProps(product.images[0], {
                    aspect: 2 / 3,
                    widths: [160, 320],
                  })}
                  sizes="80px"
                  className="aspect-[2/3] w-full bg-sand object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col text-sm">
                <p className="font-display text-lg leading-tight">
                  {product.title}
                </p>
                <p className="text-driftwood">{line.size}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      className="size-6 border border-linen"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        update(line.handle, line.size, line.quantity - 1)
                      }
                    >
                      –
                    </button>
                    <span aria-label="Quantity">{line.quantity}</span>
                    <button
                      className="size-6 border border-linen"
                      aria-label="Increase quantity"
                      onClick={() =>
                        update(line.handle, line.size, line.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <span>{formatPrice(product.price * line.quantity)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-linen px-6 py-6">
        <div className="mb-4 flex justify-between text-sm">
          <span className="text-eyebrow">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          disabled
          className="text-eyebrow w-full bg-ink py-4 text-shell opacity-60"
          title="Checkout is enabled once Shopify is connected"
        >
          Checkout
        </button>
        <p className="mt-3 text-center text-xs text-driftwood">
          Preview store — checkout connects when Shopify goes live.
        </p>
      </div>
    </div>
  );
}
