import {useRef} from 'react';
import {Link} from 'react-router';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {formatPrice, type DemoProduct} from '~/lib/demo-catalog';
import {imageProps} from '~/lib/sanity';

export function ReadyToWear({
  heading,
  products,
}: {
  heading: string;
  products: DemoProduct[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.from('[data-rtw-card]', {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.6,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: {trigger: root.current, start: 'top 75%'},
        });
        gsap.from('[data-rtw-img]', {
          scale: 1.25,
          duration: 2.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: {trigger: root.current, start: 'top 75%'},
        });
      });
      return () => mm.revert();
    },
    {scope: root},
  );

  return (
    <section ref={root} className="px-5 pt-10 pb-24 md:px-10 md:pt-14 md:pb-36">
      <div className="mx-auto mb-5 flex max-w-[1600px] items-baseline justify-between md:mb-7">
        <h2 className="font-display text-2xl italic md:text-3xl">{heading}</h2>
        <Link
          to="/collections/all"
          prefetch="intent"
          className="text-eyebrow border-b border-current pb-0.5"
        >
          Shop all
        </Link>
      </div>

      <ul className="mx-auto -mx-5 flex max-w-[1600px] snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 md:mx-auto md:grid md:grid-cols-3 md:gap-x-0 md:gap-y-12 md:overflow-visible md:px-0">
        {products.map((product, i) => (
          <li
            key={product.handle}
            className="w-[78vw] shrink-0 snap-start md:w-auto"
          >
            <Link
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="group block"
            >
              <div
                data-rtw-card
                className="relative aspect-[3/4] overflow-hidden bg-sand"
              >
                <img
                  data-rtw-img
                  alt={product.images[0].alt ?? ''}
                  {...imageProps(product.images[0], {
                    aspect: 3 / 4,
                    widths: [500, 800, 1200],
                  })}
                  sizes="(min-width: 768px) 33vw, 78vw"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-[1.6s] ease-tide group-hover:scale-[1.04]"
                />
                {product.images[1] && (
                  <img
                    {...imageProps(product.images[1], {
                      aspect: 3 / 4,
                      widths: [500, 800, 1200],
                    })}
                    sizes="(min-width: 768px) 33vw, 78vw"
                    loading="lazy"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-tide group-hover:opacity-100"
                  />
                )}
              </div>
              <div className="flex items-baseline justify-between gap-4 pt-3 md:px-3">
                <span className="font-display text-lg">{product.title}</span>
                <span className="text-sm text-driftwood tabular-nums">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>
          </li>
        ))}
        {/* Fills the last slot while the catalog is short of a full row;
            disappears once there are enough products. */}
        {products.length % 3 !== 0 && (
          <li className="w-[78vw] shrink-0 snap-start md:w-auto">
            <Link
              to="/collections/all"
              prefetch="intent"
              className="group flex aspect-[3/4] flex-col items-center justify-center gap-4 bg-sand text-center transition-colors duration-700 ease-tide hover:bg-linen"
            >
              <span className="font-display text-3xl italic md:text-4xl">
                The full collection
              </span>
              <span className="text-eyebrow border-b border-current pb-0.5">
                Shop all
              </span>
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}
