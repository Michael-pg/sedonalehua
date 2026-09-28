import {useRef, useState} from 'react';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {useDemoCart} from '~/components/DemoCart';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {formatPrice, type DemoProduct} from '~/lib/demo-catalog';
import {imageProps} from '~/lib/sanity';

export function ProductDetail({
  product,
  related,
}: {
  product: DemoProduct;
  related: DemoProduct[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const {add} = useDemoCart();
  const {open} = useAside();
  const single = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(
    single ? product.sizes[0] : null,
  );
  const [nudge, setNudge] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.from('[data-pdp-info] > *', {
          y: 24,
          opacity: 0,
          stagger: 0.07,
          duration: 1,
          delay: 0.1,
        });
        gsap.utils.toArray<HTMLElement>('[data-pdp-img]').forEach((img, i) => {
          gsap.from(img, {
            clipPath: 'inset(8% 8% 8% 8%)',
            scale: 1.08,
            duration: 1.6,
            ease: 'expo.out',
            delay: i === 0 ? 0.05 : 0,
            scrollTrigger:
              i === 0 ? undefined : {trigger: img, start: 'top 85%'},
          });
        });
      });
      return () => mm.revert();
    },
    {scope: root, dependencies: [product.handle], revertOnUpdate: true},
  );

  const addToBag = () => {
    if (!size) {
      setNudge(true);
      return;
    }
    add({handle: product.handle, size});
    open('cart');
  };

  return (
    <div ref={root}>
      <div className="grid md:grid-cols-12">
        {/* Gallery — swipe on mobile, stacked on desktop */}
        <div className="-mx-0 flex snap-x snap-mandatory overflow-x-auto md:col-span-7 md:flex-col md:gap-2 md:overflow-visible">
          {product.images.map((image, i) => (
            <div
              key={i}
              className="aspect-[3/4] w-full shrink-0 snap-start overflow-hidden bg-sand"
            >
              <img
                data-pdp-img
                alt={image.alt ?? ''}
                {...imageProps(image, {
                  aspect: 3 / 4,
                  widths: [600, 1000, 1400, 1800],
                })}
                sizes="(min-width: 768px) 58vw, 100vw"
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Info — sticky alongside the gallery on desktop */}
        <div className="px-5 py-10 md:col-span-5 md:px-12 lg:px-16">
          <div
            data-pdp-info
            className="flex flex-col gap-6 md:sticky md:top-28"
          >
            <nav
              className="text-eyebrow text-driftwood"
              aria-label="Breadcrumb"
            >
              <Link to="/collections/all" className="hover:text-ink">
                Shop
              </Link>{' '}
              / {product.category}
            </nav>
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.02]">
                {product.title}
              </h1>
              <p className="mt-3 text-driftwood">{product.tagline}</p>
            </div>
            <p className="text-lg tabular-nums">{formatPrice(product.price)}</p>

            {!single && (
              <fieldset className="m-0 border-0 p-0">
                <legend className="text-eyebrow mb-3 flex w-full justify-between font-medium">
                  <span>Size</span>
                  {nudge && !size && (
                    <span className="text-protea normal-case tracking-normal">
                      Choose a size
                    </span>
                  )}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const soldOut = product.soldOut?.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={soldOut}
                        aria-pressed={size === s}
                        onClick={() => setSize(s)}
                        className={`min-w-12 border px-3 py-2.5 text-sm transition-colors ${
                          size === s
                            ? 'border-ink bg-ink text-shell'
                            : 'border-linen hover:border-ink'
                        } ${soldOut ? 'cursor-not-allowed text-driftwood/60 line-through' : ''}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {product.madeToOrder ? (
              <Link
                to="/about"
                className="text-eyebrow block w-full bg-ink py-4 text-center text-shell transition-colors hover:bg-protea"
              >
                Enquire about this piece
              </Link>
            ) : (
              <button
                type="button"
                onClick={addToBag}
                className="text-eyebrow w-full bg-ink py-4 text-shell transition-colors hover:bg-protea"
              >
                Add to bag
              </button>
            )}

            <p className="text-[15px] leading-relaxed text-ink/80">
              {product.description}
            </p>

            <div className="border-t border-linen">
              <Accordion title="Details" defaultOpen>
                <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
                  {product.details.map((d) => (
                    <div key={d.label} className="contents">
                      <dt className="text-driftwood">{d.label}</dt>
                      <dd className="m-0">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
              <Accordion title="Shipping & returns">
                <p className="text-sm text-ink/80">
                  Placeholder — free shipping over $250. Returns within 14 days,
                  unworn with tags.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-linen px-5 py-20 md:px-10">
          <h2 className="font-display mb-8 text-3xl italic">
            You may also like
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {related.map((p) => (
              <li key={p.handle}>
                <Link
                  to={`/products/${p.handle}`}
                  prefetch="intent"
                  viewTransition
                  className="group block"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-sand">
                    <img
                      alt={p.images[0].alt ?? ''}
                      {...imageProps(p.images[0], {
                        aspect: 3 / 4,
                        widths: [400, 700],
                      })}
                      sizes="(min-width: 768px) 25vw, 50vw"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.6s] ease-tide group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 flex justify-between gap-2 text-sm">
                    <span className="font-display text-lg leading-tight">
                      {p.title}
                    </span>
                    <span className="text-driftwood">
                      {formatPrice(p.price)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-linen py-4">
      <summary className="text-eyebrow flex cursor-pointer list-none items-center justify-between">
        {title}
        <span className="text-base transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}
