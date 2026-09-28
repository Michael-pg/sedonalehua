import {useRef, useState} from 'react';
import {Link} from 'react-router';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {
  DEMO_CATEGORIES,
  formatPrice,
  type DemoProduct,
} from '~/lib/demo-catalog';
import {imageProps} from '~/lib/sanity';

/**
 * Editorial product grid. Every fourth item runs wide and shows two frames
 * side by side, so the page reads like a lookbook rather than a card grid.
 */
export function ShopGrid({products}: {products: DemoProduct[]}) {
  const [filter, setFilter] = useState<string>('All');
  const root = useRef<HTMLDivElement>(null);
  const visible =
    filter === 'All' ? products : products.filter((p) => p.category === filter);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.utils.toArray<HTMLElement>('[data-tile]').forEach((tile) => {
          gsap.from(tile, {
            y: 60,
            opacity: 0,
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: {trigger: tile, start: 'top 90%'},
          });
        });
      });
      return () => mm.revert();
    },
    {scope: root, dependencies: [filter], revertOnUpdate: true},
  );

  return (
    <div ref={root}>
      <div
        className="mb-10 flex flex-wrap gap-x-8 gap-y-3 md:mb-14"
        role="tablist"
        aria-label="Filter"
      >
        {['All', ...DEMO_CATEGORIES].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            onClick={() => setFilter(c)}
            className={`text-eyebrow border-b pb-1 transition-colors ${
              filter === c
                ? 'border-ink text-ink'
                : 'border-transparent text-driftwood hover:text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-5 md:gap-y-20">
        {visible.map((product, i) => {
          const wide = i % 4 === 3 && product.images.length > 1;
          return (
            <li
              key={product.handle}
              data-tile
              className={wide ? 'col-span-2' : ''}
            >
              <Link
                to={`/products/${product.handle}`}
                prefetch="intent"
                viewTransition
                className="group block"
              >
                <div
                  className={`relative overflow-hidden bg-sand ${wide ? 'grid grid-cols-2 gap-3 bg-transparent md:gap-5' : 'aspect-[3/4]'}`}
                >
                  {wide ? (
                    product.images.slice(0, 2).map((image, j) => (
                      <div
                        key={j}
                        className="aspect-[3/4] overflow-hidden bg-sand"
                      >
                        <img
                          alt={image.alt ?? ''}
                          {...imageProps(image, {
                            aspect: 3 / 4,
                            widths: [400, 700, 1000],
                          })}
                          sizes="(min-width: 768px) 33vw, 50vw"
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1.6s] ease-tide group-hover:scale-[1.03]"
                        />
                      </div>
                    ))
                  ) : (
                    <>
                      <img
                        alt={product.images[0].alt ?? ''}
                        {...imageProps(product.images[0], {
                          aspect: 3 / 4,
                          widths: [400, 700, 1000],
                        })}
                        sizes="(min-width: 768px) 33vw, 50vw"
                        loading={i < 3 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition-transform duration-[1.6s] ease-tide group-hover:scale-[1.03]"
                      />
                      {product.images[1] && (
                        <img
                          {...imageProps(product.images[1], {
                            aspect: 3 / 4,
                            widths: [400, 700, 1000],
                          })}
                          sizes="(min-width: 768px) 33vw, 50vw"
                          loading="lazy"
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-tide group-hover:opacity-100"
                        />
                      )}
                    </>
                  )}
                  {product.madeToOrder && (
                    <span className="text-eyebrow absolute left-3 top-3 bg-shell/90 px-2 py-1 text-[10px]">
                      Made to order
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between">
                  <span className="font-display text-lg leading-tight md:text-xl">
                    {product.title}
                  </span>
                  <span className="text-sm text-driftwood tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="mt-1 hidden text-sm text-driftwood md:block">
                  {product.tagline}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
