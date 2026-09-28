import {useRef} from 'react';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {imageProps, type SanityImage} from '~/lib/sanity';

interface JournalProps {
  eyebrow?: string;
  title?: string;
  issue?: string;
  images: (SanityImage & {_key: string})[];
}

/** Film-strip of portraits. Pinned horizontal scroll on desktop, swipe on mobile. */
export function Journal({eyebrow, title, issue, images}: JournalProps) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.desktop, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // Slight counter-parallax inside each frame.
        gsap.utils.toArray<HTMLElement>('[data-journal-img]').forEach((img) => {
          gsap.fromTo(
            img,
            {xPercent: -6},
            {
              xPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: () => `+=${distance()}`,
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    {scope: root},
  );

  return (
    <section
      ref={root}
      className="overflow-hidden bg-shell md:flex md:h-[100svh] md:flex-col md:justify-center"
    >
      <ul
        ref={track}
        className="flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 py-16 md:gap-[4vw] md:overflow-visible md:px-[8vw] md:py-0"
      >
        <li className="flex w-[70vw] shrink-0 snap-start flex-col justify-end md:w-[26vw] lg:w-[22vw]">
          <p className="text-eyebrow text-driftwood">{eyebrow}</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] lg:text-6xl">
            {title}
          </h2>
          <p className="text-eyebrow mt-6">[{issue}]</p>
        </li>
        {images.map((image, i) => (
          <li
            key={image._key}
            className="w-[70vw] shrink-0 snap-start md:w-[30vw]"
          >
            <figure>
              <div className="aspect-[4/5] overflow-hidden bg-sand">
                <img
                  data-journal-img
                  alt={image.alt ?? ''}
                  {...imageProps(image, {
                    aspect: 4 / 5,
                    widths: [500, 900, 1300],
                  })}
                  sizes="(min-width: 768px) 30vw, 70vw"
                  loading="lazy"
                  className="h-full w-[112%] max-w-none -translate-x-[6%] object-cover"
                />
              </div>
              <figcaption className="text-eyebrow mt-4 flex justify-between text-driftwood">
                <span>{image.caption}</span>
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
