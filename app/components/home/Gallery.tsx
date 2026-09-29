import {useRef} from 'react';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {imageProps, type SanityImage} from '~/lib/sanity';

/** Quiet row of editorial photos — no copy, just the shoot. */
export function Gallery({images}: {images: (SanityImage & {_key: string})[]}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.from('[data-gallery-img]', {
          opacity: 0,
          y: 40,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: {trigger: root.current, start: 'top 80%'},
        });
      });
      return () => mm.revert();
    },
    {scope: root},
  );

  if (!images.length) return null;

  return (
    <section ref={root} className="px-5 pb-24 md:px-10 md:pb-36">
      <ul className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
        {images.slice(0, 4).map((image, i) => (
          <li
            key={image._key}
            data-gallery-img
            className={`aspect-[4/5] overflow-hidden bg-sand ${
              i % 2 ? 'md:mt-16' : ''
            }`}
          >
            <img
              alt={image.alt ?? ''}
              {...imageProps(image, {aspect: 4 / 5, widths: [500, 900, 1300]})}
              sizes="(min-width: 768px) 25vw, 50vw"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
