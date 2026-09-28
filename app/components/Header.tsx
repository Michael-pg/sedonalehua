import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {useDemoCart} from '~/components/DemoCart';

interface HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
  isShopLinked: boolean;
}

/** Site navigation. Kept local (not the Shopify menu) while in demo mode. */
export const NAV = [
  {to: '/', label: 'Home'},
  {to: '/collections/all', label: 'Shop'},
  {to: '/about', label: 'About'},
];

export function Header({cart, isShopLinked}: HeaderProps) {
  const {pathname} = useLocation();
  const overHero = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const transparent = overHero && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,color,border-color] duration-500 ease-tide ${
        transparent
          ? 'border-b border-transparent text-shell'
          : 'border-b border-linen bg-shell/90 text-ink backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
        <NavLink
          to="/"
          prefetch="intent"
          aria-label="Sedona Lehua — home"
          className={`font-display text-lg tracking-[0.32em] uppercase transition-opacity duration-500 md:text-xl ${
            transparent ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          Sedona Lehua
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              prefetch="intent"
              className={({isActive}) =>
                `text-eyebrow relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-tide hover:after:scale-x-100 ${
                  isActive ? 'after:scale-x-100' : 'after:scale-x-0'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <CartToggle cart={cart} isShopLinked={isShopLinked} />
        </nav>

        <div className="flex items-center gap-5 md:hidden">
          <CartToggle cart={cart} isShopLinked={isShopLinked} />
          <MenuToggle />
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  const {close} = useAside();
  return (
    <nav className="flex flex-col gap-6 px-6 py-10" aria-label="Mobile">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          prefetch="intent"
          onClick={close}
          className="font-display text-4xl"
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function MenuToggle() {
  const {open} = useAside();
  return (
    <button
      onClick={() => open('mobile')}
      aria-label="Open menu"
      className="flex flex-col gap-1.5 py-2"
    >
      <span className="block h-px w-6 bg-current" />
      <span className="block h-px w-6 bg-current" />
    </button>
  );
}

function BagIcon() {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 6.5h16l-1.2 14H3.2L2 6.5Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M6.5 8.5V5a3.5 3.5 0 0 1 7 0v3.5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function CartBadge({count, onOpen}: {count: number; onOpen?: () => void}) {
  const {open} = useAside();
  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        onOpen?.();
      }}
      className="relative flex items-center"
      aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <BagIcon />
      <span className="absolute -right-2 -top-1 min-w-4 text-center text-[10px] leading-4 tabular-nums">
        {count > 0 ? count : ''}
      </span>
    </a>
  );
}

function CartToggle({cart, isShopLinked}: HeaderProps) {
  if (!isShopLinked) return <DemoCartBadge />;
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <ShopifyCartBadge />
      </Await>
    </Suspense>
  );
}

function DemoCartBadge() {
  const {count} = useDemoCart();
  return <CartBadge count={count} />;
}

function ShopifyCartBadge() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  const {publish, shop, prevCart} = useAnalytics();
  return (
    <CartBadge
      count={cart?.totalQuantity ?? 0}
      onOpen={() =>
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload)
      }
    />
  );
}
