import {Await, useLocation} from 'react-router';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, MobileNav} from '~/components/Header';
import {DemoCartContents, DemoCartProvider} from '~/components/DemoCart';
import {CartMain} from '~/components/CartMain';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  isShopLinked: boolean;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  isShopLinked,
}: PageLayoutProps) {
  const {pathname} = useLocation();
  // The home page runs full-bleed under the transparent header.
  const fullBleed = pathname === '/';
  return (
    <DemoCartProvider>
      <Aside.Provider>
        <CartAside cart={cart} isShopLinked={isShopLinked} />
        <Aside type="mobile" heading="Menu">
          <MobileNav />
        </Aside>
        <Header cart={cart} isShopLinked={isShopLinked} />
        <main className={fullBleed ? '' : 'pt-16 md:pt-20'}>{children}</main>
        <Footer />
      </Aside.Provider>
    </DemoCartProvider>
  );
}

function CartAside({
  cart,
  isShopLinked,
}: Pick<PageLayoutProps, 'cart' | 'isShopLinked'>) {
  if (!isShopLinked) {
    return (
      <Aside type="cart" heading="Your bag">
        <DemoCartContents />
      </Aside>
    );
  }
  return (
    <Aside type="cart" heading="Your bag">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}
