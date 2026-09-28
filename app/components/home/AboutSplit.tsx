import {useRef} from 'react';
import {Link} from 'react-router';
import {gsap, MOTION, useGSAP} from '~/lib/gsap';
import {imageProps, type SanityImage} from '~/lib/sanity';

export function AboutSplit({
  heading,
  body,
  image,
}: {
  heading?: string;
  body?: string;
  image?: SanityImage;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.ok, () => {
        gsap.fromTo(
          '[data-about-img]',
          {yPercent: -8},
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
        gsap.from('[data-about-copy] > *', {
          y: 30,
          opacity: 0,
          stagger: 0.12,
          scrollTrigger: {trigger: '[data-about-copy]', start: 'top 80%'},
        });
      });
      return () => mm.revert();
    },
    {scope: root},
  );

  return (
    <section ref={root} className="grid border-t border-linen md:grid-cols-2">
      <div className="border-linen p-5 md:border-r md:p-16">
        {image && (
          <div className="aspect-[4/5] overflow-hidden bg-sand">
            <img
              data-about-img
              alt={image.alt ?? ''}
              {...imageProps(image, {
                aspect: 4 / 5.6,
                widths: [600, 1000, 1400],
              })}
              sizes="(min-width: 768px) 45vw, 100vw"
              loading="lazy"
              className="h-[116%] w-full -translate-y-[8%] object-cover"
            />
          </div>
        )}
      </div>
      <div
        data-about-copy
        className="flex flex-col justify-center gap-6 px-5 pb-20 md:px-16 md:py-16"
      >
        <p className="text-eyebrow text-driftwood">The studio</p>
        <h2 className="font-display text-4xl md:text-6xl">{heading}</h2>
        <p className="max-w-md text-[15px] leading-relaxed text-ink/80">
          {body}
        </p>
        <Link
          to="/about"
          prefetch="intent"
          className="text-eyebrow self-start border-b border-current pb-0.5"
        >
          Our story
        </Link>
      </div>
    </section>
  );
}
